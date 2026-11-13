#!/usr/bin/env python3
"""Actualiza data/videos.json y data/channel.json desde fuentes públicas.

YouTube: RSS del canal y la página /about (videos, suscriptores, vistas).
X: recuento de seguidores de @Frankzm vía la API pública de FxTwitter.

Si una descarga o el parseo falla, se conservan los datos anteriores.
Nunca se escriben listas de videos vacías ni un recuento de seguidores en 0.
Un fallo al leer X no impide actualizar YouTube, y viceversa.
"""
from __future__ import annotations

import json
import re
import sys
import xml.etree.ElementTree as ET
from datetime import datetime, timedelta, timezone
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

CHANNEL_ID = "UCy3N1TamDtigaMVb2373SoA"
RSS_URL = f"https://www.youtube.com/feeds/videos.xml?channel_id={CHANNEL_ID}"
ABOUT_URL = "https://www.youtube.com/@DeckoWorld/about"
CHANNEL_URL = "https://www.youtube.com/@DeckoWorld"
X_HANDLE = "Frankzm"
X_PROFILE_URL = "https://x.com/Frankzm"
# minúsculas primero: la ruta mixta a veces responde 404
FXTWITTER_URLS = (
    "https://api.fxtwitter.com/frankzm",
    "https://api.fxtwitter.com/2/profile/frankzm",
    "https://api.fxtwitter.com/Frankzm",
)
USER_AGENT = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
    "AppleWebKit/537.36 (KHTML, like Gecko) "
    "Chrome/120.0.0.0 Safari/537.36"
)
TIMEOUT = 25
MAX_VIDEOS = 15
BOGOTA = timezone(timedelta(hours=-5))

NS = {
    "atom": "http://www.w3.org/2005/Atom",
    "yt": "http://www.youtube.com/xml/schemas/2015",
    "media": "http://search.yahoo.com/mrss/",
}

ROOT = Path(__file__).resolve().parents[1]
VIDEOS_PATH = ROOT / "data" / "videos.json"
CHANNEL_PATH = ROOT / "data" / "channel.json"


def now_bogota() -> datetime:
    return datetime.now(tz=BOGOTA)


def now_iso() -> str:
    return now_bogota().isoformat(timespec="seconds")


def log(msg: str) -> None:
    print(msg, flush=True)


def load_json(path: Path) -> dict:
    if not path.exists():
        return {}
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
        return data if isinstance(data, dict) else {}
    except (OSError, json.JSONDecodeError) as exc:
        log(f"No se pudo leer {path}: {exc}")
        return {}


def dump_json(path: Path, data: dict) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    text = json.dumps(data, ensure_ascii=False, indent=2) + "\n"
    path.write_text(text, encoding="utf-8")


def fetch(url: str, accept: str | None = None) -> bytes | None:
    headers = {"User-Agent": USER_AGENT, "Accept-Language": "es-CO,es;q=0.9"}
    if accept:
        headers["Accept"] = accept
    req = Request(url, headers=headers)
    try:
        with urlopen(req, timeout=TIMEOUT) as resp:
            return resp.read()
    except (HTTPError, URLError, TimeoutError, OSError) as exc:
        log(f"Error al descargar {url}: {exc}")
        return None


def first_paragraph(text: str, limit: int = 200) -> str:
    text = (text or "").strip()
    if not text:
        return ""
    # take up to first blank line, collapse whitespace
    para = re.split(r"\n\s*\n", text, maxsplit=1)[0]
    para = re.sub(r"\s+", " ", para).strip()
    if len(para) > limit:
        trimmed = para[: limit - 1].rsplit(" ", 1)[0]
        para = (trimmed or para[: limit - 1]) + "…"
    return para


def parse_rss(xml_bytes: bytes) -> list[dict]:
    root = ET.fromstring(xml_bytes)
    videos: list[dict] = []
    for entry in root.findall("atom:entry", NS):
        vid_el = entry.find("yt:videoId", NS)
        title_el = entry.find("atom:title", NS)
        if vid_el is None or not (vid_el.text or "").strip():
            continue
        if title_el is None or not (title_el.text or "").strip():
            continue
        vid = vid_el.text.strip()
        title = title_el.text.strip()
        link_el = entry.find("atom:link", NS)
        href = (link_el.get("href") if link_el is not None else "") or ""
        is_short = "/shorts/" in href
        if not href:
            href = (
                f"https://www.youtube.com/shorts/{vid}"
                if is_short
                else f"https://www.youtube.com/watch?v={vid}"
            )
        pub_el = entry.find("atom:published", NS)
        published = (pub_el.text or "").strip() if pub_el is not None else ""
        thumb_el = entry.find("media:group/media:thumbnail", NS)
        thumb = (thumb_el.get("url") if thumb_el is not None else "") or (
            f"https://i.ytimg.com/vi/{vid}/hqdefault.jpg"
        )
        desc_el = entry.find("media:group/media:description", NS)
        desc = first_paragraph(desc_el.text or "") if desc_el is not None else ""
        stats_el = entry.find("media:group/media:community/media:statistics", NS)
        views = 0
        if stats_el is not None and stats_el.get("views") not in (None, ""):
            try:
                views = int(str(stats_el.get("views")).replace(",", "").replace(".", ""))
            except ValueError:
                views = 0
        item = {
            "id": vid,
            "title": title,
            "url": href,
            "published": published,
            "thumb": thumb,
            "views": views,
            "isShort": is_short,
            "description": desc,
        }
        if not is_short:
            item["thumb"] = f"https://i.ytimg.com/vi/{vid}/maxresdefault.jpg"
            item["thumbFallback"] = f"https://i.ytimg.com/vi/{vid}/hqdefault.jpg"
        videos.append(item)
        if len(videos) >= MAX_VIDEOS:
            break
    # mark the most recent long-form as featured, if any
    for item in videos:
        if not item["isShort"]:
            item["featured"] = True
            break
    return videos


def format_es_int(n: int) -> str:
    return f"{n:,}".replace(",", ".")


def parse_count(text: str) -> int | None:
    if not text:
        return None
    cleaned = text.replace("\xa0", " ").strip()
    # "77,436 vistas" or "77.436 vistas" or "238 suscriptores"
    m = re.search(r"([\d.\s,]+)", cleaned)
    if not m:
        return None
    digits = re.sub(r"[.\s,]", "", m.group(1))
    if not digits.isdigit():
        return None
    return int(digits)


def parse_channel_page(html: str, previous: dict) -> dict:
    """Extrae cifras públicas de la página /about cuando están disponibles."""
    out = dict(previous) if previous else {}

    def grab(*patterns: str) -> str | None:
        for pat in patterns:
            m = re.search(pat, html)
            if m:
                return m.group(1).replace("\xa0", " ").strip()
        return None

    subs_text = grab(
        r'"subscriberCountText":"([^"]+)"',
        r'"subscriberCountText":\{"simpleText":"([^"]+)"',
    )
    views_text = grab(
        r'"viewCountText":"([^"]+)"',
        r'"viewCountText":\{"simpleText":"([^"]+)"',
    )
    videos_text = grab(
        r'"videoCountText":"([^"]+)"',
        r'"videoCountText":\{"simpleText":"([^"]+)"',
        r'"videoCountText":\{"runs":\[\{"text":"([^"]+)"',
    )
    joined = grab(
        r'"joinedDateText":\{"content":"([^"]+)"',
        r'"joinedDateText":\{"simpleText":"([^"]+)"',
    )
    country = grab(r'"country":"([^"]+)"')
    title = grab(
        r"<meta property=\"og:title\" content=\"([^\"]+)\"",
        r"<title>([^<]+)</title>",
    )
    description = grab(
        r"<meta property=\"og:description\" content=\"([^\"]+)\"",
    )

    parsed_any = False
    if subs_text:
        out["subscribers"] = subs_text
        n = parse_count(subs_text)
        if n is not None:
            out["subscriberCount"] = n
        parsed_any = True
    if views_text:
        n = parse_count(views_text)
        if n is not None:
            out["viewCount"] = n
            out["views"] = f"{format_es_int(n)} vistas"
        else:
            out["views"] = views_text
        parsed_any = True
    if videos_text:
        n = parse_count(videos_text)
        if n is not None:
            out["videoCountNum"] = n
            out["videoCount"] = f"{format_es_int(n)} videos" if n != 1 else "1 video"
        else:
            out["videoCount"] = videos_text.replace("\xa0", " ")
        parsed_any = True
    if joined:
        out["joined"] = joined
        parsed_any = True
    if country:
        out["country"] = country
        parsed_any = True
    if title and "YouTube" in title:
        title = re.sub(r"\s*-\s*YouTube\s*$", "", title).strip()
    if title:
        out["title"] = title
    if description:
        # unescape a few common entities if present
        description = (
            description.replace("&amp;", "&")
            .replace("&quot;", '"')
            .replace("&#39;", "'")
            .replace("&lt;", "<")
            .replace("&gt;", ">")
        )
        out["description"] = description

    out["_parsed"] = parsed_any
    return out


MONTHS_ES = {
    "January": "enero",
    "February": "febrero",
    "March": "marzo",
    "April": "abril",
    "May": "mayo",
    "June": "junio",
    "July": "julio",
    "August": "agosto",
    "September": "septiembre",
    "October": "octubre",
    "November": "noviembre",
    "December": "diciembre",
}


def consulted_on() -> str:
    stamp = now_bogota().strftime("%d de %B de %Y, %H:%M")
    for en, es in MONTHS_ES.items():
        stamp = stamp.replace(en, es)
    return stamp


def extract_x_followers(payload: object) -> int | None:
    if not isinstance(payload, dict):
        return None
    user = payload.get("user")
    if not isinstance(user, dict):
        data = payload.get("data")
        user = data if isinstance(data, dict) else payload
    candidates: list[object] = []
    if isinstance(user, dict):
        candidates.extend([user.get("followers"), user.get("followers_count")])
        metrics = user.get("public_metrics")
        if isinstance(metrics, dict):
            candidates.append(metrics.get("followers_count"))
    for raw in candidates:
        if raw is None or raw == "":
            continue
        try:
            n = int(str(raw).replace(",", "").replace(".", "").replace(" ", ""))
        except (TypeError, ValueError):
            continue
        if n > 0:
            return n
    return None


def fetch_x_followers() -> tuple[int | None, str | None]:
    """Devuelve (seguidores, url_usada) o (None, None) si no hay un recuento válido."""
    for url in FXTWITTER_URLS:
        raw = fetch(url, accept="application/json")
        if not raw:
            continue
        try:
            payload = json.loads(raw.decode("utf-8"))
        except (UnicodeDecodeError, json.JSONDecodeError) as exc:
            log(f"No se pudo parsear {url}: {exc}")
            continue
        count = extract_x_followers(payload)
        if count is not None:
            return count, url
        log(f"La respuesta de {url} no trae un recuento válido de seguidores.")
    return None, None


def apply_x_followers(channel: dict, count: int, url: str) -> None:
    channel["xFollowerCount"] = count
    channel["xFollowers"] = f"{format_es_int(count)} seguidores en X"
    channel.setdefault("xUrl", X_PROFILE_URL)
    channel.setdefault("xHandle", f"@{X_HANDLE}")
    channel["xSource"] = (
        f"API pública de FxTwitter {url}, consultada el {consulted_on()} (hora de Bogotá)."
    )


def same_payload(old: dict, new: dict, ignore: set[str]) -> bool:
    def scrub(obj: dict) -> dict:
        return {k: v for k, v in obj.items() if k not in ignore}

    return json.dumps(scrub(old), sort_keys=True, ensure_ascii=False) == json.dumps(
        scrub(new), sort_keys=True, ensure_ascii=False
    )


def main() -> int:
    previous_videos = load_json(VIDEOS_PATH)
    previous_channel = load_json(CHANNEL_PATH)
    previous_list = previous_videos.get("videos") if isinstance(previous_videos.get("videos"), list) else []

    updated_iso = now_iso()
    wrote = False
    warnings = 0

    # --- Videos (RSS) ---
    rss = fetch(RSS_URL)
    new_list = None
    if rss:
        try:
            new_list = parse_rss(rss)
        except ET.ParseError as exc:
            log(f"No se pudo parsear el RSS: {exc}")
            warnings += 1
    else:
        warnings += 1

    if new_list:
        videos_payload = {
            "source": f"RSS oficial de YouTube: {RSS_URL}",
            "fetchedAt": updated_iso,
            "updated": updated_iso,
            "note": (
                "Títulos, fechas, miniaturas y vistas tomados del RSS público. "
                "No inventar datos. Este archivo lo actualiza el flujo de GitHub Actions."
            ),
            "videos": new_list,
        }
        if same_payload(previous_videos, videos_payload, {"fetchedAt", "updated"}):
            log(f"Videos sin cambios ({len(new_list)}). Se conserva el archivo.")
        else:
            dump_json(VIDEOS_PATH, videos_payload)
            wrote = True
            log(f"Actualizados {len(new_list)} videos en {VIDEOS_PATH}.")
    else:
        log("No hay videos nuevos válidos; se conservan los datos anteriores.")
        if not previous_list:
            log("Aviso: no había lista anterior que conservar.")
            warnings += 1

    # --- Channel stats (public about page) ---
    html = fetch(ABOUT_URL) or fetch(CHANNEL_URL)
    channel_update = None
    if html:
        try:
            text = html.decode("utf-8", errors="replace")
            channel_update = parse_channel_page(text, previous_channel)
        except Exception as exc:  # noqa: BLE001 — keep old data on any parse error
            log(f"No se pudo parsear la página del canal: {exc}")
            warnings += 1
    else:
        warnings += 1

    youtube_ok = bool(channel_update and channel_update.pop("_parsed", False))
    if youtube_ok:
        # restore required identity fields if missing
        channel_update.setdefault("brand", previous_channel.get("brand", "Decko World"))
        channel_update.setdefault("handle", "@DeckoWorld")
        channel_update.setdefault("channelId", CHANNEL_ID)
        channel_update.setdefault("url", CHANNEL_URL)
        channel_update.setdefault("xUrl", previous_channel.get("xUrl", X_PROFILE_URL))
        channel_update.setdefault("xHandle", previous_channel.get("xHandle", f"@{X_HANDLE}"))
        channel_update.setdefault(
            "tagline",
            previous_channel.get("tagline", "Porque vivir también es dejar huellas."),
        )
        channel_update["statsAsOf"] = now_bogota().date().isoformat()
        channel_update["updated"] = updated_iso
        channel_update["source"] = (
            f"Página pública de YouTube {ABOUT_URL}, consultada el "
            f"{consulted_on()} (hora de Bogotá)."
        )
    else:
        log("No se pudieron leer las cifras del canal de YouTube; se conservan los datos anteriores.")
        warnings += 1
        channel_update = dict(previous_channel) if previous_channel else {}

    # --- Seguidores en X (no debe abortar la actualización de YouTube) ---
    x_count, x_url = fetch_x_followers()
    if x_count is not None and x_url:
        apply_x_followers(channel_update, x_count, x_url)
        if not youtube_ok:
            channel_update["updated"] = updated_iso
        log(f"Seguidores en X: {format_es_int(x_count)} (fuente: {x_url}).")
    else:
        log("No se pudieron leer los seguidores de X; se conserva el valor anterior.")
        # Nunca escribir 0 ni borrar un recuento previo.
        warnings += 1

    if channel_update and (youtube_ok or x_count is not None):
        ignored = {"updated", "statsAsOf", "source", "xSource"}
        if same_payload(previous_channel, channel_update, ignored):
            log("Cifras del canal sin cambios. Se conserva el archivo.")
        else:
            dump_json(CHANNEL_PATH, channel_update)
            wrote = True
            log(f"Actualizadas las cifras del canal en {CHANNEL_PATH}.")

    if wrote:
        log("Hay cambios en los datos.")
    else:
        log("No se escribió ningún archivo.")
    return 0


if __name__ == "__main__":
    sys.exit(main())

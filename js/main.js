/* Decko World — lógica mínima: menú, filtros, lightbox y datos */
(function () {
  "use strict";

  const FALLBACK_VIDEOS = {"source": "RSS oficial de YouTube: https://www.youtube.com/feeds/videos.xml?channel_id=UCy3N1TamDtigaMVb2373SoA", "fetchedAt": "2026-11-11T11:47:00-05:00", "note": "Títulos, fechas, miniaturas y vistas tomados del RSS público. No inventar datos. Actualizar este archivo cuando se quiera refrescar el listado.", "videos": [{"id": "pF8SS874vmA", "title": "Fiesta de los mantenidos 🎉🐶 Hoy nadie trabaja (como siempre) #Shorts", "url": "https://www.youtube.com/shorts/pF8SS874vmA", "published": "2026-11-11T15:00:05+00:00", "thumb": "https://i.ytimg.com/vi/pF8SS874vmA/hqdefault.jpg", "views": 402, "isShort": true, "description": "Peluches, música y cero responsabilidades: así se vive en la fiesta de los mantenidos."}, {"id": "l6Sw91LFiys", "title": "De 10 a 1K suscriptores… y seguimos todos locos 🐶🎉 #Shorts", "url": "https://www.youtube.com/shorts/l6Sw91LFiys", "published": "2026-11-11T00:15:10+00:00", "thumb": "https://i.ytimg.com/vi/l6Sw91LFiys/hqdefault.jpg", "views": 773, "isShort": true, "description": "No somos muchos, no somos pocos… pero estamos todos locos. Gracias a cada loco que llegó a este planeta."}, {"id": "nmZVNZfnejY", "title": "Ya es suficiente celular… ¡a la camita todos! 😴🐶 #shorts", "url": "https://www.youtube.com/shorts/nmZVNZfnejY", "published": "2026-11-10T22:45:20+00:00", "thumb": "https://i.ytimg.com/vi/nmZVNZfnejY/hqdefault.jpg", "views": 910, "isShort": true, "description": "Los mantenidos estaban pegados al celular como si pagaran el plan de datos."}, {"id": "ztSa5IJKR1U", "title": "¡Llegó el pavo! 🦃 Y trajo a toda la familia para Acción de Gracias #shorts", "url": "https://www.youtube.com/shorts/ztSa5IJKR1U", "published": "2026-11-10T19:00:29+00:00", "thumb": "https://i.ytimg.com/vi/ztSa5IJKR1U/hqdefault.jpg", "views": 1169, "isShort": true, "description": "En Estados Unidos ya se siente Acción de Gracias… y los pavos llegaron solitos, en manada y sin invitación."}, {"id": "G4S9rnXYHWQ", "title": "Pasos grandes de gigante 🐾💥 Tiembla la casa #shorts", "url": "https://www.youtube.com/shorts/G4S9rnXYHWQ", "published": "2026-11-10T04:14:24+00:00", "thumb": "https://i.ytimg.com/vi/G4S9rnXYHWQ/hqdefault.jpg", "views": 1106, "isShort": true, "description": "Mide lo que mide una chancla, pero camina como si fuera el dueño de la casa."}, {"id": "zlam1XF9FT8", "title": "Con esta carita que tengo… me merezco un like 🐶🥹 #Shorts", "url": "https://www.youtube.com/shorts/zlam1XF9FT8", "published": "2026-11-09T20:57:20+00:00", "thumb": "https://i.ytimg.com/vi/zlam1XF9FT8/hqdefault.jpg", "views": 1025, "isShort": true, "description": "Los mantenidos no trabajan, no pagan arriendo… pero con esa carita, ¿quién les dice que no?"}, {"id": "YR4hI8W8bDA", "title": "Pelea de mantenidos 🥊🐶 Nadie paga arriendo pero todos pelean #Shorts", "url": "https://www.youtube.com/shorts/YR4hI8W8bDA", "published": "2026-11-09T13:27:41+00:00", "thumb": "https://i.ytimg.com/vi/YR4hI8W8bDA/hqdefault.jpg", "views": 4763, "isShort": true, "description": "Los mantenidos no trabajan, no pagan arriendo… pero eso sí, pelean como si fueran los dueños de la casa."}, {"id": "yNcAn36I85Y", "title": "No trabaja, pero esa carita paga el arriendo 🐶🥹 #Shorts", "url": "https://www.youtube.com/shorts/yNcAn36I85Y", "published": "2026-11-08T23:00:06+00:00", "thumb": "https://i.ytimg.com/vi/yNcAn36I85Y/hqdefault.jpg", "views": 1011, "isShort": true, "description": "Otro mantenido que piensa pagar el arriendo con ternura."}, {"id": "_IRBH4o1Egs", "title": "El mar al atardecer 🌅 Olas para relajarte y desconectarte", "url": "https://www.youtube.com/watch?v=_IRBH4o1Egs", "published": "2026-11-08T18:22:31+00:00", "thumb": "https://i.ytimg.com/vi/_IRBH4o1Egs/maxresdefault.jpg", "thumbFallback": "https://i.ytimg.com/vi/_IRBH4o1Egs/hqdefault.jpg", "views": 29, "isShort": false, "featured": true, "description": "Olas rompiendo en la orilla, el sol bajando y nada más. Grabado por Decko en uno de sus viajes."}, {"id": "PlXciCTn1X4", "title": "Los mantenidos cumplen 1  mes.🐶🎂 ¿Cuál es tu favorito? #Shorts #dog", "url": "https://www.youtube.com/shorts/PlXciCTn1X4", "published": "2026-11-08T17:54:53+00:00", "thumb": "https://i.ytimg.com/vi/PlXciCTn1X4/hqdefault.jpg", "views": 1060, "isShort": true, "description": "Cuatro bebés, cuatro personalidades y cero ganas de trabajar."}, {"id": "WIDwEYpA3as", "title": "El cielo se prendió en plena carretera 🔥🌅 #shorts #viralvideo", "url": "https://www.youtube.com/shorts/WIDwEYpA3as", "published": "2026-11-08T13:23:19+00:00", "thumb": "https://i.ytimg.com/vi/WIDwEYpA3as/hqdefault.jpg", "views": 10, "isShort": true, "description": "Íbamos por la carretera y el cielo decidió dar show: rojo, naranja y rosado de lado a lado."}, {"id": "ZuWAcs9MZ7M", "title": "La noche se puso en modo ALOHA 🌺✨ #Shorts", "url": "https://www.youtube.com/shorts/ZuWAcs9MZ7M", "published": "2026-11-07T20:08:34+00:00", "thumb": "https://i.ytimg.com/vi/ZuWAcs9MZ7M/hqdefault.jpg", "views": 213, "isShort": true, "description": "Un paseo entre luces rojas y verdes, árboles iluminados y música de estilo hawaiano."}, {"id": "Dfxgithvi9c", "title": "La mantenida descubrió por qué está gorda 😂🧴 #shorts", "url": "https://www.youtube.com/shorts/Dfxgithvi9c", "published": "2026-11-07T19:04:19+00:00", "thumb": "https://i.ytimg.com/vi/Dfxgithvi9c/hqdefault.jpg", "views": 1117, "isShort": true, "description": "Misterio resuelto: la culpa no es de la comida fina, es del champú para dar cuerpo y volumen."}, {"id": "F0lxpk1hA6M", "title": "Estoy llegando. #viajes", "url": "https://www.youtube.com/shorts/F0lxpk1hA6M", "published": "2026-11-07T04:30:41+00:00", "thumb": "https://i.ytimg.com/vi/F0lxpk1hA6M/hqdefault.jpg", "views": 59, "isShort": true, "description": "¡Gente, estoy llegando! Se vienen nuevos caminos, grandes momentos y cosas maravillosas."}, {"id": "4RRwm4k03jU", "title": "Solo son 1000 seguidores… ¿Me ayudas a llegar? 🚗 #shorts", "url": "https://www.youtube.com/shorts/4RRwm4k03jU", "published": "2026-11-06T22:39:22+00:00", "thumb": "https://i.ytimg.com/vi/4RRwm4k03jU/hqdefault.jpg", "views": 1000, "isShort": true, "description": "Un clásico pequeño, pero con toda la actitud. Estamos a nada de los 1000 seguidores y cada uno cuenta."}]};
  const FALLBACK_DESTINATIONS = {"note":"Edita este archivo para añadir destinos reales con foto, ciudad y fecha confirmadas. Esta sección es solo para fotos de viajes, no para videos del canal.","destinations":[{"id":"rd-diciembre-2024","name":"Capítulo República Dominicana","place":"Diciembre 2024","placeholder":false,"source":"foto","badge":"Viaje","blurb":"Atardeceres y un cielo cargado sobre el Caribe, fotografiados en diciembre de 2024.","videoId":null,"url":null,"image":"assets/viajes/rd-diciembre-2024.jpg","images":["assets/viajes/rd-diciembre-2024.jpg","assets/viajes/rd-diciembre-2024-b.jpg","assets/viajes/rd-diciembre-2024-c.jpg"]}]};
  const FALLBACK_POSTS = {"note":"Posts publicados en la cuenta de X @Frankzm. Añade entradas aquí con el texto y la foto del post, más el enlace al original. No inventar textos.","posts":[{"id":"2118119852661735683","title":"Antes de que se me olvide","published":"2026-11-04T23:15:00.000Z","url":"https://x.com/Frankzm/status/2118119852661735683","image":"assets/posts/antes-de-que-se-me-olvide.jpg","imageWebp":"assets/posts/antes-de-que-se-me-olvide.webp","width":878,"height":1200,"alt":"Pocillo rojo de Café Sello Rojo con un ramo de hojas rojas y naranjas sobre una mesa de vidrio, el regalo del papá de Decko.","text":"Hoy mi papá, de 85 años y con alzhéimer, volvió de su paseo, metió la mano al bolsillo y me dijo:\n\nMijo, tome, le tengo un regalo… antes de que se me olvide.\n\nY sacó un puñado de hojas.\n\nHojas rojas, naranjas, amarillas, un poco arrugadas, cansadas del árbol. Como él.\n\nLas fue recogiendo una por una en su caminata, pensando en mí. Y eso fue lo que más me partió el alma: que en medio de una mente que se le va apagando, todavía hubo un momento en que pensó: \"Esto es para mi hijo\".\n\nCasi lloro ahí mismo. No por las hojas, sino por lo que significaban.\n\nEl alzhéimer es un ladrón silencioso. Se lleva los nombres, las fechas, los caminos de regreso a casa. Se lleva las historias que uno creía que iban a durar para siempre. Y uno, como hijo, aprende a despedirse de su padre poquito a poquito, aunque lo tenga ahí, al frente.\n\nPero hoy entendí algo. De todos sus hijos, al que más recuerda todavía soy yo. Y no sé cuánto tiempo me quedé siendo ese hijo que él reconoce. Por eso este regalo vale más que cualquier cosa que se pueda comprar.\n\nLas puse en mi pocillo rojo de café, ese de todas las mañanas. Ahí van a quedarse. Y cada tinto que me tome de ahora en adelante me va a saber a él, a sus manos, a sus pasos lentos, a ese \"mijo\" que todavía sale de su boca.\n\nPorque hay cosas que la enfermedad no puede borrar. Se le olvidará el día, el año, hasta mi nombre algún día. Pero el amor de un padre que, aun olvidándolo todo, sigue queriendo regalarle algo a su hijo, ese no se borra. Ese queda guardado en un lugar más profundo que la memoria.\n\nGracias, Dios, por dejarme tenerlo un día más.\nGracias, papá, por este regalo. Es el más bonito que me han dado.\n\nSi todavía tienen a sus viejos, abrázalos hoy. Escúchenles la misma historia diez veces. Recíbanles las hojas, las piedritas, lo que les quieran dar.\n\nPorque un día lo que más vamos a extrañar no será lo que nos dieron… sino que todavía se acordaban de nosotros para dárnoslo. 🍂❤️\n\nDecko. 🐦‍⬛\n4 de noviembre del año 2026."}]};

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  async function loadJSON(path, fallback) {
    try {
      const res = await fetch(path, { cache: "no-store" });
      if (!res.ok) throw new Error(String(res.status));
      return await res.json();
    } catch (err) {
      return fallback;
    }
  }

  function formatDate(iso) {
    try {
      return new Intl.DateTimeFormat("es-CO", {
        day: "numeric",
        month: "short",
        year: "numeric",
        timeZone: "America/Bogota",
      }).format(new Date(iso));
    } catch {
      return iso;
    }
  }

  function formatViews(n) {
    try {
      return new Intl.NumberFormat("es-CO").format(n) + " vistas";
    } catch {
      return n + " vistas";
    }
  }

  function escapeHTML(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function playIcon() {
    return '<span class="play"><span class="play-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg></span></span>';
  }

  /* Menú móvil */
  const menuBtn = $("[data-menu-btn]");
  const menu = $("[data-menu]");
  if (menuBtn && menu) {
    menuBtn.addEventListener("click", () => {
      const open = menu.classList.toggle("is-open");
      menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
    });
    menu.addEventListener("click", (e) => {
      if (e.target.closest("a")) {
        menu.classList.remove("is-open");
        menuBtn.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* Lightbox */
  const lightbox = $("[data-lightbox]");
  const lightboxTitle = $("[data-lightbox-title]");
  const lightboxFrame = $("[data-lightbox-frame]");
  const closeBtn = $("[data-lightbox-close]");

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("hidden", "");
    lightboxFrame.innerHTML = "";
    document.body.classList.remove("no-scroll");
  }

  function openLightbox(video) {
    if (!lightbox) {
      window.open(video.url, "_blank", "noopener");
      return;
    }
    lightboxTitle.textContent = video.title;
    const src =
      "https://www.youtube-nocookie.com/embed/" +
      encodeURIComponent(video.id) +
      "?autoplay=1&rel=0";
    lightboxFrame.innerHTML =
      '<iframe src="' +
      src +
      '" title="' +
      escapeHTML(video.title) +
      '" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>';
    lightbox.removeAttribute("hidden");
    lightbox.classList.add("is-open");
    document.body.classList.add("no-scroll");
    closeBtn && closeBtn.focus();
  }

  if (closeBtn) closeBtn.addEventListener("click", closeLightbox);
  if (lightbox) {
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeLightbox();
  });

  let allVideos = [];

  function videoById(id) {
    return allVideos.find((v) => v.id === id);
  }

  function bindOpen(el, video) {
    el.addEventListener("click", () => openLightbox(video));
  }

  function renderFeatured(videos) {
    const box = $("[data-featured]");
    if (!box) return;
    const featured = videos.find((v) => v.featured) || videos.find((v) => !v.isShort);
    if (!featured) return;
    box.hidden = false;
    const img = $("[data-featured-thumb]", box);
    img.src = featured.thumb;
    img.alt = "Miniatura: " + featured.title;
    if (featured.thumbFallback) {
      img.addEventListener("error", function onErr() {
        img.removeEventListener("error", onErr);
        img.src = featured.thumbFallback;
      });
    }
    $("[data-featured-title]", box).textContent = featured.title;
    $("[data-featured-desc]", box).textContent = featured.description || "";
    $("[data-featured-meta]", box).innerHTML =
      "<span>" +
      formatDate(featured.published) +
      "</span><span>" +
      formatViews(featured.views) +
      '</span><a href="' +
      escapeHTML(featured.url) +
      '" target="_blank" rel="noopener noreferrer">Ver en YouTube</a>';
    bindOpen($("[data-open-video]", box), featured);
  }

  function renderGrid(videos, filter) {
    const grid = $("[data-video-grid]");
    if (!grid) return;
    const list = videos.filter((v) => {
      if (filter === "short") return v.isShort;
      if (filter === "video") return !v.isShort;
      return true;
    });
    if (!list.length) {
      grid.innerHTML = '<p class="empty-msg">No hay videos en este filtro.</p>';
      return;
    }
    grid.innerHTML = list
      .map((v) => {
        const badge = v.isShort
          ? '<span class="badge badge-short">Short</span>'
          : '<span class="badge">Video</span>';
        return (
          '<article class="video-card" data-type="' +
          (v.isShort ? "short" : "video") +
          '">' +
          '<button class="card-media" type="button" data-open="' +
          escapeHTML(v.id) +
          '" aria-label="Reproducir: ' +
          escapeHTML(v.title) +
          '">' +
          '<img src="' +
          escapeHTML(v.thumb) +
          '" alt="" width="480" height="360">' +
          badge +
          playIcon() +
          "</button>" +
          '<div class="body"><h3><a href="' +
          escapeHTML(v.url) +
          '" target="_blank" rel="noopener noreferrer">' +
          escapeHTML(v.title) +
          "</a></h3>" +
          '<div class="meta"><span>' +
          formatDate(v.published) +
          "</span><span>" +
          formatViews(v.views) +
          "</span></div></div></article>"
        );
      })
      .join("");
    $$("[data-open]", grid).forEach((btn) => {
      const v = videoById(btn.getAttribute("data-open"));
      if (v) bindOpen(btn, v);
    });
  }

  function pinIcon() {
    return '<svg viewBox="0 0 24 24" aria-hidden="true"><path stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" d="M12 21s7-5.4 7-11a7 7 0 1 0-14 0c0 5.6 7 11 7 11z"/><circle cx="12" cy="10" r="2.2" stroke-width="1.6"/></svg>';
  }

  function imageList(d) {
    if (Array.isArray(d.images) && d.images.length) {
      return d.images.filter(Boolean);
    }
    return d.image ? [d.image] : [];
  }

  function renderTravel(data) {
    const grid = $("[data-travel-grid]");
    if (!grid) return;
    const items = data.destinations || data;
    grid.innerHTML = items
      .map((d) => {
        const cls = "travel-card" + (d.placeholder ? " is-placeholder" : "");
        const photos = imageList(d);
        let visual;
        if (photos.length) {
          const gallery = photos.length > 1;
          const slides =
            '<div class="travel-slides">' +
            photos
              .map(function (src, i) {
                return (
                  '<img src="' +
                  escapeHTML(src) +
                  '" alt="" width="1920" height="1080"' +
                  (i === 0 ? ' class="is-active"' : "") +
                  ">"
                );
              })
              .join("") +
            "</div>";
          const dots = gallery
            ? '<div class="travel-dots" aria-hidden="true">' +
              photos
                .map(function (_, i) {
                  return (
                    '<span data-dot="' +
                    i +
                    '" class="' +
                    (i === 0 ? "is-active" : "") +
                    '"></span>'
                  );
                })
                .join("") +
              "</div>"
            : "";
          visual =
            '<div class="travel-visual' +
            (gallery ? " is-gallery" : "") +
            '"' +
            (gallery
              ? ' data-gallery tabindex="0" aria-label="' +
                escapeHTML(d.name + ", " + photos.length + " fotos") +
                '"'
              : "") +
            ">" +
            slides +
            dots +
            "</div>";
        } else {
          visual =
            '<div class="travel-visual"><div class="travel-ph">' +
            pinIcon() +
            "<div>Foto por añadir</div></div></div>";
        }
        return (
          '<article class="' +
          cls +
          '">' +
          visual +
          '<div class="body"><span class="tag">' +
          escapeHTML(d.badge || (d.placeholder ? "Ejemplo — por completar" : "Viaje")) +
          "</span><h3>" +
          escapeHTML(d.name) +
          '</h3><p class="place">' +
          escapeHTML(d.place || "") +
          '</p><p class="blurb">' +
          escapeHTML(d.blurb || "") +
          "</p></div></article>"
        );
      })
      .join("");

    $$("[data-gallery]", grid).forEach((el) => {
      const slides = $$(".travel-slides img", el);
      if (slides.length < 2) return;
      const dots = $$("[data-dot]", el);
      let i = 0;
      let timer = null;
      let kick = null;
      const show = (n) => {
        i = ((n % slides.length) + slides.length) % slides.length;
        slides.forEach((img, k) => img.classList.toggle("is-active", k === i));
        dots.forEach((dot, k) => dot.classList.toggle("is-active", k === i));
      };
      const stop = () => {
        if (timer) {
          clearInterval(timer);
          timer = null;
        }
        if (kick) {
          clearTimeout(kick);
          kick = null;
        }
      };
      const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
      if (canHover) {
        el.addEventListener("mouseenter", () => {
          stop();
          kick = setTimeout(() => {
            show(i + 1);
            timer = setInterval(() => show(i + 1), 1600);
          }, 350);
        });
        el.addEventListener("mouseleave", () => {
          stop();
          show(0);
        });
      } else {
        el.addEventListener("click", () => show(i + 1));
      }
      el.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " " || e.key === "ArrowRight") {
          e.preventDefault();
          show(i + 1);
        } else if (e.key === "ArrowLeft") {
          e.preventDefault();
          show(i - 1);
        }
      });
    });
  }


  function renderPosts(data) {
    const box = $("[data-x-posts]");
    if (!box) return;
    const items = (data && data.posts) || data || [];
    if (!items.length) {
      box.innerHTML = '<p class="empty-msg">Aún no hay posts en esta sección.</p>';
      return;
    }
    box.innerHTML = items
      .map((p) => {
        const img =
          '<picture>' +
          (p.imageWebp
            ? '<source srcset="' + escapeHTML(p.imageWebp) + '" type="image/webp">'
            : "") +
          '<img src="' +
          escapeHTML(p.image) +
          '" alt="' +
          escapeHTML(p.alt || p.title || "") +
          '"' +
          (p.width ? ' width="' + p.width + '"' : "") +
          (p.height ? ' height="' + p.height + '"' : "") +
          "></picture>";
        return (
          '<article class="x-post">' +
          '<figure class="x-post-photo">' +
          '<div class="x-post-frame">' +
          img +
          "</div>" +
          '<img class="x-post-crow" src="assets/posts/marco-cuervo.png" alt="" width="113" height="109">' +
          "</figure>" +
          '<div class="x-post-body">' +
          "<h3>" +
          escapeHTML(p.title || "") +
          "</h3>" +
          '<div class="meta"><span>' +
          formatDate(p.published) +
          "</span><span>@Frankzm</span></div>" +
          '<p class="x-post-text">' +
          escapeHTML(p.text || "") +
          "</p>" +
          '<a class="btn btn-ghost" href="' +
          escapeHTML(p.url) +
          '" target="_blank" rel="noopener noreferrer">Ver en X</a>' +
          "</div></article>"
        );
      })
      .join("");
  }

  /* Filtros */
  let currentFilter = "all";
  $$("[data-filter]").forEach((btn) => {
    btn.addEventListener("click", () => {
      currentFilter = btn.getAttribute("data-filter");
      $$("[data-filter]").forEach((b) => b.classList.toggle("is-active", b === btn));
      renderGrid(allVideos, currentFilter);
    });
  });

  const yearEl = $("[data-year]");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  function formatInt(n) {
    try {
      return new Intl.NumberFormat("es-CO").format(n);
    } catch {
      return String(n);
    }
  }

  function formatUpdated(iso) {
    if (!iso) return "";
    try {
      const d = new Date(iso);
      if (Number.isNaN(d.getTime())) return "Actualizado: " + iso;
      const date = new Intl.DateTimeFormat("es-CO", {
        day: "numeric",
        month: "short",
        year: "numeric",
        timeZone: "America/Bogota",
      }).format(d);
      const time = new Intl.DateTimeFormat("es-CO", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZone: "America/Bogota",
      }).format(d);
      return "Actualizado: " + date + ", " + time;
    } catch {
      return "Actualizado: " + iso;
    }
  }

  function applyChannel(ch) {
    if (!ch) return;
    const map = {};
    if (ch.subscriberCount != null) map.subscribers = formatInt(ch.subscriberCount);
    if (ch.videoCountNum != null) map.videos = formatInt(ch.videoCountNum);
    if (ch.viewCount != null) map.views = formatInt(ch.viewCount);
    Object.keys(map).forEach(function (key) {
      $$('[data-stat="' + key + '"]').forEach(function (el) {
        el.textContent = map[key];
      });
    });
    const stamp = formatUpdated(ch.updated || ch.fetchedAt || ch.statsAsOf);
    if (stamp) {
      $$("[data-updated]").forEach(function (el) {
        el.textContent = stamp;
      });
    }
  }

  Promise.all([
    loadJSON("data/videos.json", FALLBACK_VIDEOS),
    loadJSON("data/destinations.json", FALLBACK_DESTINATIONS),
    loadJSON("data/posts.json", FALLBACK_POSTS),
    loadJSON("data/channel.json", null),
  ]).then(([videoData, travelData, postsData, channelData]) => {
    allVideos = videoData.videos || videoData;
    renderFeatured(allVideos);
    renderGrid(allVideos, currentFilter);
    renderTravel(travelData);
    renderPosts(postsData);
    applyChannel(channelData);
  });
})();

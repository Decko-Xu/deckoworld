# Decko World

Primera versión de la web de **Decko World** (canal de YouTube [El planeta de Decko](https://www.youtube.com/@DeckoWorld) y viajes). Sitio estático: HTML, CSS y un poco de JavaScript. No hace falta compilar nada.

## Verlo en local

Desde esta carpeta:

```bash
python3 -m http.server 8080
```

Luego abre `http://localhost:8080`.

## Qué se puede editar

- `data/videos.json` — listado de videos (se tomó del RSS público del canal).
- `data/destinations.json` — destinos de la sección Viajes. Para un viaje real: pon `placeholder` en `false`, añade ciudad, fecha, foto y, si quieres, un `videoId`.
- `data/channel.json` — nombre, descripción oficial y cifras del canal (para mantenerlas al día).
- `index.html` y `css/styles.css` — textos y diseño.
- `assets/decko_watermark.png` — marca oficial.

Los títulos, fechas y vistas de los videos no deben inventarse. Si se actualiza el listado, hay que volver a leer el RSS:

`https://www.youtube.com/feeds/videos.xml?channel_id=UCy3N1TamDtigaMVb2373SoA`

## Publicar (cuando lo decidas)

Opciones gratuitas, sin comprar dominio:

1. **GitHub Pages** — sube esta carpeta a un repositorio y activa Pages (rama `main`, carpeta `/` o `/docs`). La URL queda tipo `usuario.github.io/deckoworld`.
2. **Netlify** o **Cloudflare Pages** — arrastra el ZIP o conecta el repositorio. Ambos dan un subdominio gratis (`algo.netlify.app` o `algo.pages.dev`) y un certificado HTTPS.

Si más adelante quieres un dominio propio (por ejemplo `deckoworld.com`), se compra en un registrador y se apunta con un registro CNAME o DNS al hosting que elijas. Esta versión no publica ni compra nada.

## Créditos de datos

- Canal: [youtube.com/@DeckoWorld](https://www.youtube.com/@DeckoWorld) (ID `UCy3N1TamDtigaMVb2373SoA`).
- Cifras del about público consultadas el 11 de noviembre de 2026 (hora de Bogotá): 238 suscriptores, 63 videos, 77.436 vistas, unido el 7 oct 2011, país Colombia.
- La descripción de “Acerca” es la del propio canal.

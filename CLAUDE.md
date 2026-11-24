# Portfolio site — notes for Claude Code

Static site, no build step. Netlify deploys the repo root on push to `main`.

- All project content is in `data/projects.js` (array `PROJECTS`). Everything else about Itai is in `data/profile.js` (object `PROFILE`). Edit those first; `js/render.js` only turns data into HTML.
- To add a project: append one object to `PROJECTS` following the existing shape, add images to `assets/img/<id>/`, keep images under ~400 KB (`sips -Z 1600 -s formatOptions 82`).
- Text in `[[ double brackets ]]` renders as a highlighted fill-in marker; `draft: true` adds an "In progress" badge. Remove markers and set `draft: false` when the write-up is done.
- Never invent measurements. If Itai hasn't given a number, leave a `[[ marker ]]`.
- Preview with `python3 -m http.server 8080`. Check 375 px and 1280 px widths before pushing.
- Design tokens live in `css/tokens.css`; keep text contrast ≥ 4.5:1 on the dark background.

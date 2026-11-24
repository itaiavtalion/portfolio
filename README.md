# Itai Avtalion — Engineering Portfolio

Live site: _(add the Netlify URL here)_

A static portfolio site. No build step, no dependencies. Netlify publishes this folder as-is on every push to `main`.

## How to add or edit a project

1. Open `data/projects.js`.
2. Copy an existing project object and change the fields (`id`, `title`, `summary`, `skills`, `software`, `hardware`, `specs`, `sections`, `iterations`, `links`).
3. Put the photos in `assets/img/<id>/` and reference them from the project (`cover` and each section's `images`). Keep each image under ~400 KB.
4. While the write-up is unfinished, set `draft: true` and wrap unfinished text in `[[ double brackets ]]`; the site highlights those and shows an "In progress" badge. Flip `draft` to `false` when done.
5. Commit and push. Netlify deploys in under a minute.

Everything that is not a project (bio, education, experience, skills, contact, resume file) lives in `data/profile.js`.
To update the resume, replace `assets/pdf/itai-avtalion-resume.pdf` with the new file under the same name.

## Preview locally

```
python3 -m http.server 8080
```
Then open http://localhost:8080

## Files

- `index.html` home: hero, project grid, about, contact
- `project.html?id=<slug>` one project's full case study
- `resume.html` embedded resume
- `data/projects.js` all project content (the only file you usually touch)
- `data/profile.js` everything about Itai
- `js/render.js` turns the data into HTML
- `css/tokens.css` colors, type, spacing
- `css/site.css` layout and components
- `assets/` images, videos, PDFs

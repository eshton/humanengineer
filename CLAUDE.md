# CLAUDE.md

Personal site for **Agoston Fung**, tagline *Where Engineering Meets The
Individual*, hosted at `agostonfung.com`. Hugo static site, deployed on
Cloudflare Pages.

## Stack

- **Generator:** Hugo **extended**, pinned via `HUGO_VERSION=0.152.2` env var
  in the Cloudflare Pages dashboard. Image processing in
  `index_profile.html` requires extended.
- **Theme:** PaperMod, vendored as a git submodule at `themes/PaperMod`.
  After a fresh clone: `git submodule update --init --recursive`.
- **Config:** `hugo.yaml`.
- **Hosting:** Cloudflare Pages. Build command/output dir/env vars live in
  the Pages dashboard (Settings > Builds), **not** a repo config file:
  - Build command: `sh scripts/cf-pages-build.sh`
  - Build output directory: `public`
  - Env vars: `HUGO_VERSION=0.152.2`, `TZ=Europe/Budapest`
  `baseURL` is **`/`** in `hugo.yaml`; `scripts/cf-pages-build.sh` rewrites
  it at build time — `https://agostonfung.com` on the `main` branch,
  `$CF_PAGES_URL` (the deployment's pages.dev URL) on previews/branches.
  Don't hardcode a domain in `hugo.yaml`.
- **Headers:** `static/_headers` (Cloudflare Pages `_headers` file, copied
  to the site root by Hugo) sets long-lived cache-control on hashed asset
  paths.

## Common commands

```bash
hugo server -D                          # local dev, drafts visible
hugo new content posts/<slug>.md        # new draft post (archetype sets draft: true)
hugo --gc --minify                      # production build into ./public
```

## Layout

- `content/`
  - `about.md`, `archives.md`, `search.md` — top-level pages
  - `posts/` — blog posts. Mix of single `<slug>.md` files and **page
    bundles** (`<slug>/index.md` + `cover.jpeg`). Use a bundle when the
    post has a cover image or other co-located assets.
- `archetypes/default.md` — front-matter template for `hugo new`. Posts
  ship as `draft: true` until flipped manually.
- `layouts/partials/` — **theme overrides only**. Anything here shadows the
  matching path under `themes/PaperMod/layouts/`.
  - `index_profile.html` — overrides PaperMod's homepage profile to append a
    "Recent posts" list (last 5 from `posts`).
  - `templates/schema_json.html` — replaces PaperMod's BreadcrumbList logic.
    PaperMod's original assumes `baseURL` has a host and emits stray `""`
    via `$scratch.Add | safeJS` on newer Hugo, which the strict-JSON minifier
    fails. The override uses `.CurrentSection` directly and is host-agnostic.
    **Only handles the simple `[section, current]` case.** If the site grows
    deeper hierarchies, extend it. If PaperMod is updated, diff their
    `schema_json.html` against this file.
- `assets/`
  - `images/profile.jpg` — 3148×3148 source, Hugo resizes to 220×220 (×2 for
    retina) via the profile partial. Image resizing **only runs when
    `params.env: production`** (already set in `hugo.yaml`); locally the
    raw image is served.
  - `css/extended/profile-posts.css` — styles the homepage recent-posts
    list. PaperMod auto-includes anything under `assets/css/extended/`.
- `static/` — favicons (`favicon.ico`, `favicon.svg`, PNGs, apple-touch,
  safari-pinned-tab), `_headers` (Cloudflare Pages cache-control rules).
  Copied to site root verbatim.
- `scripts/cf-pages-build.sh` — the actual Cloudflare Pages build command
  (see Hosting above). Edit this, not the dashboard, when the baseURL logic
  needs to change.
- `public/`, `resources/_gen/`, `.hugo_build.lock` — build artefacts,
  gitignored.

## Conventions

- Site title/brand: plain ASCII **"Agoston Fung"** in titles, OG, headings.
  Repo slug stays `humanengineer` (historical, not worth renaming).
- Author name in content: plain ASCII **"Agoston Fung"** (not "Ágoston") —
  the site committed to ASCII for portability across feeds/social embeds.
- Home uses PaperMod **profileMode** (portrait + headline + buttons).
  `homeInfoParams` is kept in `hugo.yaml` as a fallback but is ignored
  while `profileMode.enabled: true`.
- Social: LinkedIn `agostonfung`, GitHub `eshton`, email
  `agoston.fung@gmail.com`.

## Gotchas

- `themes/PaperMod` is a submodule — don't edit files inside it; add an
  override under `layouts/` instead. Submodule changes won't survive a
  theme update.
- `baseURL: /` means anything that needs an absolute URL (RSS, sitemap, OG
  tags, JSON-LD) only resolves correctly on a Cloudflare Pages build, where
  `scripts/cf-pages-build.sh` injects it. Local builds will have relative
  URLs in those outputs — that's expected, not a bug.
- Profile image resizing is gated on production. If the avatar looks
  unprocessed locally, that's why; check the deployed build instead.
- Cache headers in `static/_headers` assume hashed filenames under
  `/assets/*`, `/posts/*/cover_*`, `/images/profile_*`. If you add a new
  long-lived asset path, add a matching rule.
- Cloudflare Pages build settings (build command, output dir, env vars) live
  in the dashboard, not in a repo file — if you rename/move
  `scripts/cf-pages-build.sh`, update the dashboard's build command too.

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
hugo new content articles/<slug>/index.md  # new draft article (page bundle)
hugo new content projects/<slug>/index.md  # new draft project (page bundle)
hugo --gc --minify                      # production build into ./public
```

## Content types

- **`posts`** — short-form posts (mostly ported LinkedIn updates). The
  `/posts/` list page renders a small square thumbnail plus the **full**
  rendered content per entry, not a truncated summary — see
  `layouts/posts/list.html` and `assets/css/extended/posts-list.css`. Only
  this section gets that treatment; keep posts genuinely short or the list
  page gets long.
- **`articles`** — long-form posts. No list override — uses PaperMod's
  default section list (cover image + summary teaser card, like `posts`
  used to look). Single-article pages use the default PaperMod
  `single.html`, same as posts.
- **`projects`** — portfolio entries. No list override (same default teaser
  card as `articles`). Single-project pages use `layouts/projects/single.html`,
  which adds a type badge + "Visit project" external link between the title
  and the post meta row, reading the `projectType` and `link` front-matter
  fields. The page body (regular markdown) is the project description,
  rendered exactly like a post/article. **`type` and `url` are reserved Hugo
  front-matter keys** (they override the page's template-lookup Type and its
  permalink, respectively) — that's why the fields are named `projectType`
  and `link` instead of the more obvious `type`/`url`. Don't rename them back
  without checking Hugo's reserved front-matter list first.
- All three sections are in `params.mainSections` in `hugo.yaml` (drives
  archives, prev/next nav, and what counts as "main content"). Search
  (`index.json`) indexes all `RegularPages` regardless of section, so no
  change needed there when adding a section.

## Layout

- `content/`
  - `about.md`, `archives.md`, `search.md` — top-level pages
  - `posts/` — short posts, see Content types above. Mix of single
    `<slug>.md` files and **page bundles** (`<slug>/index.md` +
    `cover.jpeg`). Use a bundle when the post has a cover image or other
    co-located assets.
  - `articles/` — long-form posts, see Content types above. Same
    single-file-vs-bundle convention as `posts`.
  - `projects/` — portfolio entries, see Content types above. Same
    single-file-vs-bundle convention as `posts`.
- `archetypes/default.md` — front-matter template for `hugo new content
  posts/...`. `archetypes/articles.md` and `archetypes/projects.md` —
  templates for `hugo new content articles/...` / `projects/...` (both add a
  `cover` block; `projects.md` also adds `projectType`/`link`). All ship as
  `draft: true` until flipped manually.
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
- `layouts/posts/list.html` — overrides the `/posts/` list page only (Hugo's
  section-template lookup). See Content types above.
- `layouts/projects/single.html` — overrides project detail pages only. See
  Content types above.
- `assets/`
  - `images/profile.jpg` — 3148×3148 source, Hugo resizes to 220×220 (×2 for
    retina) via the profile partial. Image resizing **only runs when
    `params.env: production`** (already set in `hugo.yaml`); locally the
    raw image is served.
  - `css/extended/profile-posts.css` — styles the homepage recent-posts
    list. PaperMod auto-includes anything under `assets/css/extended/`.
  - `css/extended/posts-list.css` — styles the `/posts/` thumbnail+full-content
    list layout (see Content types above), scoped to `.short-post` so it
    doesn't affect `articles` or the homepage.
  - `css/extended/projects.css` — styles the type badge + external link row
    on project detail pages (`.project-meta`).
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

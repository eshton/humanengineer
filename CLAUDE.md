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
  page gets long. Per-entry meta is just the date (`.entry-date`, placed
  right under the title) — no author/reading-time/word-count footer.
- **`articles`** — long-form posts. `/articles/` uses `layouts/articles/list.html`
  — bigger cover image (220px) + excerpt + a "Read more" button, instead of
  the full-content treatment `posts` gets or PaperMod's default teaser card.
  Styled by `assets/css/extended/articles-list.css`. `layouts/articles/single.html`
  overrides just the prev/next nav (same cross-section-bleed fix as
  `projects/single.html`, see below) — everything else matches PaperMod's
  default single page.
- **`projects`** — portfolio entries, always page bundles (need a `cover`
  image). `/projects/` is a picture-only grid — cover image, title, date,
  nothing else — via `layouts/projects/list.html`. Single-project pages use
  `layouts/projects/single.html`, which renders a spec table (Type,
  Platform, Status, Link — whichever front-matter fields are present) right
  under the title, like a product document, before the meta row and cover
  image. The page body (regular markdown) is the project description,
  rendered exactly like a post/article. Front matter fields: `projectType`,
  `platform`, `status`, `link`. **`type` and `url` are reserved Hugo
  front-matter keys** (they override the page's template-lookup Type and its
  permalink, respectively) — that's why the fields are named `projectType`
  and `link` instead of the more obvious `type`/`url`. Don't rename them back
  without checking Hugo's reserved front-matter list first. Prev/next nav on
  project pages is scoped to `.CurrentSection.RegularPages` inline in
  `layouts/projects/single.html` rather than calling PaperMod's shared
  `post_nav_links.html` partial — that partial pools every `mainSections`
  entry together, so a project's prev/next would otherwise jump into
  `posts`/`articles`. `layouts/articles/single.html` has the identical fix.
- Comments (giscus, GitHub Discussions-backed) are enabled on `posts` and
  `articles` only, via `cascade: comments: true` in
  `content/posts/_index.md` and `content/articles/_index.md` — not a
  site-wide `params.comments`, since that would also turn them on for
  `projects`/`about`/`cv`. `layouts/partials/comments.html` overrides
  PaperMod's empty stub partial; it injects the giscus `<script>` client-side
  so it can read the current theme (`html[data-theme]`) and set giscus's
  initial theme to match, then posts a `setConfig` message to the giscus
  iframe when the dark-mode toggle is clicked (deferred via `setTimeout` so
  it reads the theme *after* PaperMod's own toggle handler flips it, since
  both listeners fire on the same click).
- All three sections are in `params.mainSections` in `hugo.yaml` (drives
  prev/next nav and what counts as "main content"). Search (`index.json`)
  indexes all `RegularPages` regardless of section, so no change needed
  there when adding a section.

## Layout

- `content/`
  - `about.md` — top-level page
  - `posts/` — short posts, see Content types above. Mix of single
    `<slug>.md` files and **page bundles** (`<slug>/index.md` +
    `cover.jpeg`). Use a bundle when the post has a cover image or other
    co-located assets.
  - `articles/` — long-form posts, see Content types above. Same
    single-file-vs-bundle convention as `posts`.
  - `projects/` — portfolio entries, see Content types above. Always page
    bundles (`<slug>/index.md` + `cover.jpeg`), unlike `posts`/`articles`.
- `archetypes/default.md` — front-matter template for `hugo new content
  posts/...`. `archetypes/articles.md` and `archetypes/projects.md` —
  templates for `hugo new content articles/...` / `projects/...` (both add a
  `cover` block; `projects.md` also adds `projectType`/`platform`/`status`/
  `link`). All ship as `draft: true` until flipped manually.
- `layouts/partials/` — **theme overrides only**. Anything here shadows the
  matching path under `themes/PaperMod/layouts/`.
  - `index_profile.html` — overrides PaperMod's homepage profile to append
    "Recent posts" and "Recent articles" lists (last 5 each, from `posts`
    and `articles` respectively).
  - `templates/schema_json.html` — replaces PaperMod's BreadcrumbList logic.
    PaperMod's original assumes `baseURL` has a host and emits stray `""`
    via `$scratch.Add | safeJS` on newer Hugo, which the strict-JSON minifier
    fails. The override uses `.CurrentSection` directly and is host-agnostic.
    **Only handles the simple `[section, current]` case.** If the site grows
    deeper hierarchies, extend it. If PaperMod is updated, diff their
    `schema_json.html` against this file.
  - `header.html` — replaces PaperMod's search-as-a-page nav link with a
    magnifier icon that expands into an input + results dropdown
    (`.nav-search`, wired up by `assets/js/nav-search.js`). There is no
    `/search/` content page; the search index (`/index.json`, from
    PaperMod's `layouts/_default/index.json`) is a home output format and
    exists regardless. **Don't reuse PaperMod's own
    `themes/PaperMod/assets/js/fastsearch.js`** for this — it fetches
    `../index.json`, a path relative to the *current page URL*, which only
    resolves correctly from a page actually located at `/search/`. Loading
    it from every page (as this header does) would fetch the wrong URL on
    every page except the site root's siblings. `nav-search.js` is a
    from-scratch equivalent that fetches the absolute `/index.json` instead.
    Also adds a hamburger button (`#nav-menu-toggle`) beside the search
    icon — under 700px it replaces PaperMod's inline `#menu` list (which
    otherwise just scrolled horizontally on narrow screens, per its own
    `overflow-x: auto`) with a dropdown panel, toggled by a small inline
    `<script>` at the bottom of this partial. Styled in
    `css/extended/nav-search.css` alongside the search panel.
- `layouts/posts/list.html` — overrides the `/posts/` list page only (Hugo's
  section-template lookup). See Content types above.
- `layouts/projects/list.html` and `layouts/projects/single.html` — override
  the `/projects/` list and project detail pages. See Content types above.
- `layouts/shortcodes/photo.html` and `photo-lightbox.html` — power
  `/photography/`. `{{% photo file="x.jpg" location="..." alt="..." %}}
  optional story markdown {{% /photo %}}` renders one grid item and pulls
  camera/exposure data from `data/photo-exif.yaml` (keyed by filename) so
  it isn't repeated by hand; markdown between the tags becomes that
  photo's "story," shown in the lightbox sidebar. `{{% photo-lightbox %}}`
  (call once, after the grid) emits the single shared lightbox overlay —
  image + prev/next + a right-hand sidebar with location, EXIF details,
  and the story. Don't reuse PaperMod's per-photo lightbox pattern here;
  this is a from-scratch single-instance overlay like the one in
  `layouts/posts/list.html`'s thumbnail lightbox.
- `assets/`
  - `images/profile.jpg` — 3148×3148 source, Hugo resizes to 220×220 (×2 for
    retina) via the profile partial. Image resizing **only runs when
    `params.env: production`** (already set in `hugo.yaml`); locally the
    raw image is served.
  - `css/extended/layout.css` — site-wide layout overrides:
    `--main-width` (PaperMod theme var, default 720px) bumped to 900px;
    every content column, the footer, and the homepage recent-posts list
    size off this one variable via `calc()`. `--nav-width` (header bar,
    default 1024px) is matched to the same 900px, so the header row lines
    up with the content column instead of being wider. Also sets
    `body { background: var(--code-bg) }`
    site-wide — PaperMod only washes list-kind pages (home, section
    lists, taxonomies) with `--code-bg` via its own `.list` rule
    (theme-vars.css), leaving single pages on plain `--theme`; applying
    the wash everywhere instead makes `.post-entry`/`.content-card` boxes
    (`background: var(--entry)`) stand out consistently on every page,
    not just list pages. Also defines `.content-card`
    (background/border/radius/padding matching PaperMod's `.post-entry`
    card look) — applied to the `<article class="post-single">` wrapper
    in `layouts/articles/single.html` and `layouts/projects/single.html`
    so detail pages are boxed like their list-page cards instead of
    sitting bare on the page background. `posts` intentionally doesn't
    get this — its list page already has no boxed-card look either (see
    Content types above).
  - `css/extended/profile-posts.css` — styles the homepage recent-posts
    list. PaperMod auto-includes anything under `assets/css/extended/`.
  - `css/extended/posts-list.css` — styles the `/posts/` thumbnail+full-content
    list layout (see Content types above), scoped to `.short-post` so it
    doesn't affect `articles` or the homepage.
  - `css/extended/projects.css` — styles the spec table on project detail
    pages (`.project-specs`) and the picture-only `/projects/` grid
    (`.project-grid`).
  - `css/extended/nav-search.css` — styles the header search icon/panel
    (`.nav-search`) and the mobile hamburger menu (`.nav-menu-toggle`,
    `.menu` dropdown under 700px). See `header.html` above.
  - `js/nav-search.js` — the header search's Fuse.js query logic. See the
    `header.html` note above for why this isn't PaperMod's own search JS.
  - `css/extended/photography.css` — styles the photo grid and the
    lightbox (image pane + details sidebar, see the shortcodes above).
- `data/photo-exif.yaml` — camera/lens/exposure details per photo, keyed
  by filename, pasted from Pexels' owner-only "Fotó adatai" (photo
  details) panel — richer than what's in the downloaded file's actual
  EXIF (Pexels strips real camera data and re-stamps only
  Artist/Copyright on download). Consumed by the `photo` shortcode above.
  Not every photo has an entry yet; fields simply don't render when
  absent.
- `static/` — favicons, `_headers` (Cloudflare Pages cache-control rules).
  Copied to site root verbatim. `favicon.ico`/`favicon-16x16.png`/
  `favicon-32x32.png`/`apple-touch-icon.png` are raster bakes of the 🤖
  emoji (rendered locally via Pillow + `/System/Library/Fonts/Apple Color
  Emoji.ttc`, since that font only has fixed bitmap strike sizes — 20, 32,
  40, 48, 64, 96, 160pt — arbitrary sizes throw "invalid pixel size").
  `favicon.svg` is a scalable `<text>🤖</text>` SVG instead of vector art,
  so real browsers render the OS's native emoji glyph (Apple Color Emoji
  on Apple platforms, Noto elsewhere) rather than a baked-in bitmap.
  `safari-pinned-tab.svg` is unrelated — Safari's pinned-tab mask icon
  must stay a monochrome silhouette, so it wasn't changed.
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

- `content/photography/` images must be **the site owner's own photos** —
  sourced from their Pexels profile
  (`https://www.pexels.com/hu-hu/@agoston-fung-1165130/`), not generic
  stock photos from other Pexels contributors, even though the page text
  says "up on Pexels." Verify the photographer/profile before adding one.
- `themes/PaperMod` is a submodule — don't edit files inside it; add an
  override under `layouts/` instead. Submodule changes won't survive a
  theme update.
- PaperMod styles **every** `dl`/`dt`/`dd` inside `.md-content` as a flexed
  25%/75% two-column row (`md-content.css`). Since whole-page content
  (e.g. `content/photography/index.md`) renders inside `.post-content
  md-content`, any `<dl>` you hand-author or emit from a shortcode
  inherits this — including the photography lightbox's details list,
  which needed higher-specificity overrides (`.lightbox-sidebar
  dl.lightbox-details`) to get plain stacked rows back. Watch for this
  whenever adding a `dl` anywhere content renders through `.md-content`.
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

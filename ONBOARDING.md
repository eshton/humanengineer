# Agent onboarding — agostonfung.com (Hugo/PaperMod site)

Practical, hard-won notes for agents working on this repo, especially in the
**Claude Code on the web** remote environment. This complements `CLAUDE.md`
(read that first for the site's architecture and conventions) — everything
here is environment/workflow knowledge that isn't obvious from the code.

## Fresh-clone setup

- **The PaperMod theme is a git submodule and is NOT initialized on clone.**
  Nothing builds until you run:
  ```bash
  git submodule update --init --recursive
  ```

## Building & verifying locally (Hugo is NOT preinstalled)

There is no `hugo` binary in the web environment. You can still build and
verify — build Hugo from source via the Go module proxy (Go 1.24 is present):

```bash
GOBIN=$PWD/.bin go install github.com/gohugoio/hugo@v0.152.2   # ~1 min
.bin/hugo --gc --minify --baseURL "https://agostonfung.com"    # ~12s, exit 0
```

- **Non-extended Hugo is sufficient.** `CLAUDE.md` says the site needs the
  *extended* build, but that only matters for WebP: the one extended-gated
  path (`layouts/partials/index_profile.html` appends `webp` to processable
  formats only `if hugo.IsExtended`) is never hit, because `profile.jpg` is a
  JPEG and ordinary image processing (`.Resize`/`.Fill`) works in non-extended
  Hugo too. A full production-style build completes cleanly.
- Building extended from source is not worth it here (needs CGO + native libs).

## Egress proxy gotchas (web environment)

- **Downloading release binaries from `github.com` is blocked.** A
  `curl` of a Hugo release tarball returns JSON:
  `{"message":"GitHub access to this repository is not enabled..."}` — not a
  gzip file. Don't fight it.
- **Language package registries ARE allow-listed** (in the proxy `noProxy`):
  `pypi.org`, `files.pythonhosted.org`, `registry.npmjs.org`,
  `proxy.golang.org`, `index.crates.io`. So: install via `go install`,
  `pip install`, `npm i` — not via GitHub release downloads.
- No ImageMagick / Pillow preinstalled, but `pip install Pillow` works
  (PyPI is allowed) if you need to resize/convert images locally.

## Authoring content with images

- **Body images:** plain markdown `![alt](file.jpg)` or raw `<img src="file.jpg">`
  pointing at files co-located in the page bundle. Leaf-bundle resources are
  published and the relative `src` resolves to `/<section>/<slug>/<file>`.
  (See `content/articles/ramblings-.../index.md` for the markdown form.)
- **Body images are NOT run through Hugo image processing** (only covers and
  the profile image are). So **downscale before committing** — ~1600px on the
  long edge, quality ~82. Committing 3–4 MB phone originals as inline body
  images bloats the page.
- **Covers ARE processed** — Hugo generates a responsive `srcset` from the
  original, so a multi-MB `cover.jpeg`/`cover.png` in the repo is fine
  (several existing projects already ship 3–4 MB covers). The browser is
  served resized variants, not the original.
- **Raw HTML in markdown works** (`goldmark` has `unsafe: true`). But keep
  **no blank lines inside a block-level HTML element** (`<div>…</div>`):
  goldmark ends an HTML block at the first blank line and would start parsing
  the middle as markdown. Put each child on its own line with no blank gaps.
  Example: the inline gallery in `content/projects/eznekemkinai/index.md`
  (styled by `assets/css/extended/post-gallery.css`).

## Verifying rendered output

- Build, then grep under `public/`. **The minifier strips attribute quotes**
  (`href=https://...`, `src=foo.jpg`, `loading=lazy`), so write grep patterns
  without expecting quotes — a `href="..."` regex will silently match nothing.
- Useful checks: does the page HTML contain your markup
  (`public/projects/<slug>/index.html`), are bundle images published alongside
  it, did your CSS compile into the hashed `public/assets/css/stylesheet.*.css`,
  and does the item appear on its section list page and in `public/index.json`.

## Deploy

- `main` is production: `scripts/cf-pages-build.sh` injects the real
  `https://agostonfung.com` baseURL and Cloudflare Pages deploys on push.
  Branch/preview builds get the `pages.dev` URL instead. **Pushing to `main`
  ships to the live site** — treat it accordingly.
- Build artifacts (`public/`, `resources/_gen/`, `.hugo_build.lock`) are
  gitignored; don't commit them. The submodule pin under `themes/PaperMod`
  shouldn't change from an `--init`.

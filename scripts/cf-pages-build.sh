#!/usr/bin/env bash
# Cloudflare Pages build command (set in dashboard: Settings > Builds > Build command).
# Mirrors the old Netlify per-context baseURL injection: production gets the
# custom domain, previews/branch deploys get their pages.dev deployment URL.
set -euo pipefail

if [ "${CF_PAGES_BRANCH:-}" = "main" ]; then
  hugo --gc --minify --baseURL "https://agostonfung.com"
else
  hugo --gc --minify --baseURL "${CF_PAGES_URL:-http://localhost}" --buildFuture
fi

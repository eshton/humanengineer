import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import mdx from "@astrojs/mdx";
import pagefind from "astro-pagefind";
import tailwindcss from "@tailwindcss/vite";

// baseURL: production domain on `main`, the deployment's pages.dev URL on
// previews/branches (mirrors the old Hugo cf-pages-build.sh logic).
const site =
  process.env.CF_PAGES_BRANCH === "main"
    ? "https://agostonfung.com"
    : (process.env.CF_PAGES_URL ?? "https://agostonfung.com");

// https://astro.build/config
export default defineConfig({
  site,
  integrations: [sitemap(), mdx(), pagefind()],
  vite: {
    plugins: [tailwindcss()],
  },
  markdown: {
    shikiConfig: {
      theme: "css-variables",
    },
  },
});

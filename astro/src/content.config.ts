import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";

// Shared fields across posts / articles / projects (Hugo front matter).
// z.object() strips unknown keys, so leftover Hugo keys (ShowToc, cover.caption,
// cover.relative, cover.hidden, etc.) are tolerated without listing them.
const base = (image: () => any) =>
  z.object({
    title: z.string(),
    date: z.coerce.date(),
    draft: z.boolean().optional().default(false),
    tags: z.array(z.string()).optional().default([]),
    categories: z.array(z.string()).optional().default([]),
    summary: z.string().optional(),
    description: z.string().optional(),
    cover: z
      .object({
        image: image(),
        alt: z.string().optional(),
      })
      .optional(),
  });

const posts = defineCollection({
  loader: glob({ pattern: "**/index.md", base: "./src/content/posts" }),
  schema: ({ image }) => base(image),
});

const articles = defineCollection({
  loader: glob({ pattern: "**/index.{md,mdx}", base: "./src/content/articles" }),
  schema: ({ image }) => base(image),
});

const projects = defineCollection({
  loader: glob({ pattern: "**/index.md", base: "./src/content/projects" }),
  schema: ({ image }) =>
    base(image).extend({
      projectType: z.string().optional(),
      platform: z.string().optional(),
      status: z.string().optional(),
      link: z.string().optional(),
      fullTitle: z.string().optional(),
    }),
});

export const collections = { posts, articles, projects };

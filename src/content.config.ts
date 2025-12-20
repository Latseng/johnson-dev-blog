import { glob } from "astro/loaders";
import { z, defineCollection } from "astro:content";

const posts = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: "./src/posts" }),
  schema: z.object({
    title: z.string(),
    pubDate: z.date(),
    updated: z.date().optional(),
    description: z.string(),
    author: z.string(),
    draft: z.boolean().optional().default(true),
    image: z.object({
      url: z.string(),
      alt: z.string(),
    }).optional(),
    tags: z.array(z.string()),
  }),
});

export const collections = { posts };

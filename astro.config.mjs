// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import { remarkReadingTime } from "./remark-reading-time.mjs";

// https://astro.build/config
export default defineConfig({
  site: "https://johnson-dev.netlify.app",
  integrations: [tailwind(), mdx()],
  markdown: {
    remarkPlugins: [remarkReadingTime],
  },
});
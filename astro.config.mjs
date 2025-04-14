// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import { remarkReadingTime } from "./remark-reading-time.mjs";

import icon from 'astro-icon';

// https://astro.build/config
export default defineConfig({
  site: "https://johnson-dev.netlify.app",
  integrations: [tailwind(), mdx(), icon()],
  markdown: {
    remarkPlugins: [remarkReadingTime],
  },
  vite: {
    assetsInclude: ["**/*.yaml"],
  },
});
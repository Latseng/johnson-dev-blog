import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import { remarkReadingTime } from "./remark-reading-time.mjs";

import icon from 'astro-icon';

import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

export default defineConfig({
  site: "https://johnsontac.com",
  integrations: [tailwind(), mdx(), icon()],
  markdown: {
    remarkPlugins: [remarkReadingTime, remarkMath],
    // 數學符號設定
    rehypePlugins: [rehypeKatex],
  },
  vite: {
    assetsInclude: ["**/*.yaml"],
    optimizeDeps: {
      exclude: ["deno.lock"],
    },
    build: {
      rollupOptions: {
        external: ["fsevents"],
      },
    },
  },
});
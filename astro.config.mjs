import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import { remarkReadingTime } from "./remark-reading-time.mjs";

import icon from 'astro-icon';

import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeExternalLinks from "rehype-external-links";

export default defineConfig({
  site: "https://johnsontac.com",
  integrations: [tailwind(), mdx(), icon()],
  markdown: {
    remarkPlugins: [remarkReadingTime, remarkMath],
    // 數學符號設定
    rehypePlugins: [
      rehypeKatex,
      [
        rehypeExternalLinks,
        {
          target: "_blank", // 設定為在新分頁開啟
          rel: ["noopener", "noreferrer"], // 重要的安全屬性
          // 預設情況下，rehype-external-links 只會對外部連結應用這些屬性
          // 如果要對所有連結都應用，需要額外配置，但對於外部連結，預設行為就是您想要的。
        },
      ],
    ],
  },
  vite: {
    assetsInclude: ["**/*.yaml"],
    build: {
      rollupOptions: {
        external: ["fsevents"],
      },
    },
  },
});
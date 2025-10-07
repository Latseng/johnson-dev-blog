import type { Site, Page, Links, Socials } from "@types";

// Global
export const SITE: Site = {
  TITLE: "Tactical Coder",
  DESCRIPTION: "Tactical X Coding",
  AUTHOR: "江森",
};

// Posts Page
export const POSTS: Page = {
  TITLE: "文章",
  DESCRIPTION: "技術文以及心得雜感分享",
};

// Search Page
// export const SEARCH: Page = {
//   TITLE: "搜尋",
//   DESCRIPTION: "找不到文章嗎？利用關鍵字查詢吧！",
// };

// Links
export const LINKS: Links = [
  {
    TEXT: "首頁",
    HREF: "/",
  },
  {
    TEXT: "文章",
    HREF: "/posts",
  },
  {
    TEXT: "關於我",
    HREF: "/about",
  },
];

export const HERO_WORDS = [
  { text: "Code", imgPath: "/code.svg" },
  { text: "Idea", imgPath: "/ideas.svg" },
  { text: "", imgPath: "/concepts.svg" },
  { text: "設計", imgPath: "/designs.svg" },
  { text: "開發", imgPath: "/code.svg" },
  { text: "想法", imgPath: "/ideas.svg" },
  { text: "概念", imgPath: "/concepts.svg" },
  { text: "設計", imgPath: "/designs.svg" },
];

// Socials
export const SOCIALS: Socials = [
  // {
  //   NAME: "Email",
  //   ICON: "email",
  //   TEXT: "markhorn.dev@gmail.com",
  //   HREF: "mailto:markhorn.dev@gmail.com",
  // },
  {
    NAME: "Github",
    ICON: "github",
    TEXT: "johnson-dev",
    HREF: "https://github.com/Latseng",
  },
  // {
  //   NAME: "LinkedIn",
  //   ICON: "linkedin",
  //   TEXT: "markhorn-dev",
  //   HREF: "https://www.linkedin.com/in/markhorn-dev/",
  // },
  // {
  //   NAME: "Twitter",
  //   ICON: "twitter-x",
  //   TEXT: "markhorn_dev",
  //   HREF: "https://twitter.com/markhorn_dev",
  // },
];

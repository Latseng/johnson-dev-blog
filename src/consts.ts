import type { Site, Page, Links, Socials } from "@types";

// Global
export const SITE: Site = {
  TITLE: "江森的前端研究室",
  DESCRIPTION: "前端、網頁開發，還有一些技術鑽研雜感的分享",
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

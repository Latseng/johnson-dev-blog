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
  DESCRIPTION: "工作、閱讀、雜感以及半路出家寫 Code 後的所見所聞",
};

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

// Pagination
export const POSTS_PER_PAGE = 5;

// Socials
export const SOCIALS: Socials = [
  {
    NAME: "Github",
    ICON: "github",
    TEXT: "johnson-dev",
    HREF: "https://github.com/Latseng",
  },
];

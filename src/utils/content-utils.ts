import { getCollection } from "astro:content";

export type BlogPostData = {
  body: string;
  title: string;
  pubDate: Date;
  description: string;
  tags: string[];
  image?: string;
};

export async function getSortedPosts(): Promise<
  { body: string; data: BlogPostData; id: string }[]
> {
  const allBlogPosts = (await getCollection("posts", ({ data }) => {
    return import.meta.env.PROD ? data.draft !== true : true;
  })) as unknown as { body: string; data: BlogPostData; id: string }[];

  const sorted = allBlogPosts.sort(
    (a: { data: BlogPostData }, b: { data: BlogPostData }) => {
      const dateA = new Date(a.data.pubDate);
      const dateB = new Date(b.data.pubDate);
      return dateA > dateB ? -1 : 1;
    }
  );

  return sorted;
}

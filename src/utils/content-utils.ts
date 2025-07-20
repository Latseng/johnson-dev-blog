import { getCollection, type CollectionEntry } from "astro:content";

export async function getSortedPosts(): Promise<CollectionEntry<"posts">[]> {
  type PostEntry = CollectionEntry<'posts'>;
  const allBlogPosts = await getCollection("posts", ({ data }: PostEntry) => {
    return import.meta.env.PROD ? data.draft !== true : true;
  });

 return allBlogPosts.sort(
   (a: PostEntry, b: PostEntry) =>
     new Date(b.data.pubDate).getTime() - new Date(a.data.pubDate).getTime()
 );
}
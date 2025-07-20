export function joinUrl(...parts: string[]): string {
  const joined = parts.join("/");
  return joined.replace(/\/+/g, "/");
}

export function url(path: string) {
  return joinUrl("", import.meta.env.BASE_URL, path);
}

export function getPostUrlBySlug(slug: string): string {
  return url(`/posts/${slug}/`);
}

export function getDir(path: string): string {
  const lastSlashIndex = path.lastIndexOf("/");
  if (lastSlashIndex < 0) {
    return "/";
  }
  return path.substring(0, lastSlashIndex + 1);
}
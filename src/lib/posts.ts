/**
 * Blog content pipeline. Each .mdx file in content/posts exports a
 * `meta` object + its compiled component. import.meta.glob(eager)
 * pulls them all in at build time — fully static, no runtime fetching,
 * and adding a post is just adding a file.
 */
import type { ComponentType } from "react";

export interface PostMeta {
  slug: string;
  title: string;
  date: string; // ISO
  excerpt: string;
  /** Photo id used as cover + OG image. */
  cover: string;
  tags: string[];
}

interface PostModule {
  meta: PostMeta;
  default: ComponentType<{ components?: Record<string, unknown> }>;
}

const modules = import.meta.glob("../content/posts/*.mdx", {
  eager: true,
}) as Record<string, PostModule>;

export const posts = Object.values(modules)
  .map((m) => ({ meta: m.meta, Component: m.default }))
  .sort((a, b) => b.meta.date.localeCompare(a.meta.date));

export function getPost(slug: string) {
  return posts.find((p) => p.meta.slug === slug);
}

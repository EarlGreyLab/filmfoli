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

/**
 * `src/mdx.d.ts` declares `meta: PostMeta` for every *.mdx, but that is an
 * assertion, not a check — tsc never parses the MDX source, so a post with a
 * missing `cover` or a malformed `date` typechecks clean and breaks at
 * runtime. This is the only place that guarantee can actually be enforced.
 * Dev-only: the cost is zero in the production bundle.
 */
function assertValidMeta(path: string, meta: PostMeta | undefined) {
  const problems: string[] = [];
  if (!meta) {
    problems.push("no `meta` export");
  } else {
    for (const key of ["slug", "title", "date", "excerpt", "cover"] as const) {
      if (typeof meta[key] !== "string" || meta[key].length === 0) {
        problems.push(`\`${key}\` must be a non-empty string`);
      }
    }
    if (!Array.isArray(meta.tags)) problems.push("`tags` must be an array");
    if (meta.date && !/^\d{4}-\d{2}-\d{2}$/.test(meta.date)) {
      problems.push(`\`date\` must be ISO yyyy-mm-dd (got "${meta.date}")`);
    }
  }
  if (problems.length > 0) {
    console.error(`[posts] ${path}: ${problems.join("; ")}`);
  }
}

const entries = Object.entries(modules);

if (import.meta.env.DEV) {
  for (const [path, m] of entries) assertValidMeta(path, m.meta);
  const slugs = entries.map(([, m]) => m.meta?.slug);
  const dupes = slugs.filter((s, i) => s && slugs.indexOf(s) !== i);
  if (dupes.length > 0) {
    console.error(`[posts] duplicate slug(s): ${[...new Set(dupes)].join(", ")}`);
  }
}

export const posts = entries
  .map(([, m]) => ({ meta: m.meta, Component: m.default }))
  .sort((a, b) => b.meta.date.localeCompare(a.meta.date));

export function getPost(slug: string) {
  return posts.find((p) => p.meta.slug === slug);
}

import { Link } from "react-router-dom";
import { formatDate, photos } from "../lib/photos";
import type { PostMeta } from "../lib/posts";
import { cn } from "../lib/utils";

interface BlogPostCardProps {
  post: PostMeta;
  /** Featured cards get a bigger cover + display title on the index. */
  featured?: boolean;
  className?: string;
}

/**
 * Journal entry card. Cover image reuses the photo library (a post's
 * cover is a photo id), so covers automatically get the same frame/
 * vignette treatment as gallery shots.
 */
export function BlogPostCard({ post, featured, className }: BlogPostCardProps) {
  const cover = photos.find((p) => p.id === post.cover);
  return (
    <Link
      to={`/blog/${post.slug}`}
      className={cn("group block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-mask", className)}
    >
      {cover && (
        <div className={cn("frame", featured ? "aspect-[16/9]" : "aspect-[3/2]")}>
          <img src={cover.src} alt={cover.alt} loading="lazy" decoding="async" />
        </div>
      )}
      <div className="mt-4 flex items-baseline gap-3 font-mono text-[0.62rem] uppercase tracking-[0.18em] text-faded">
        <span className="text-mask">{formatDate(post.date)}</span>
        <span>{post.tags.join(" · ")}</span>
      </div>
      <h3 className={cn("mt-1.5 font-display leading-tight transition-colors group-hover:text-mask", featured ? "text-4xl" : "text-2xl")}>
        {post.title}
      </h3>
      <p className="mt-2 max-w-prose text-sm leading-relaxed text-faded">{post.excerpt}</p>
    </Link>
  );
}

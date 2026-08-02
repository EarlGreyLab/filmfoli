import { posts } from "../lib/posts";
import { BlogPostCard } from "../components/BlogPostCard";
import { Reveal } from "../components/Reveal";
import { Seo } from "../components/Seo";

/**
 * Journal index: newest post gets a featured full-width card, the rest
 * flow in a two-column editorial grid beneath.
 */
export function Blog() {
  const [latest, ...rest] = posts;

  return (
    <div className="page-enter mx-auto max-w-6xl px-5 pb-8 pt-14 sm:px-8">
      <Seo title="Journal" description="Trip reports, gear thoughts, and film stock reviews." />

      <header className="max-w-2xl">
        <h1 className="font-display text-5xl sm:text-6xl">The journal</h1>
        <p className="mt-4 leading-relaxed text-faded">
          Trip reports, gear long-terms, and film stock reviews — written the
          slow way, like the photos.
        </p>
      </header>

      {latest && (
        <Reveal className="mt-14">
          <BlogPostCard post={latest.meta} featured />
        </Reveal>
      )}

      <div className="mt-16 grid grid-cols-1 gap-x-8 gap-y-14 border-t border-line pt-14 md:grid-cols-2">
        {rest.map((p, i) => (
          <Reveal key={p.meta.slug} delay={i * 100}>
            <BlogPostCard post={p.meta} />
          </Reveal>
        ))}
      </div>
    </div>
  );
}

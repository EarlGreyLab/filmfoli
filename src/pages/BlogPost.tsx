import { Link, useParams } from "react-router-dom";
import { MDXProvider } from "@mdx-js/react";
import { ArrowLeft } from "lucide-react";
import { getPost } from "../lib/posts";
import { formatDate, photos } from "../lib/photos";
import { mdxComponents } from "../mdx-components";
import { RebateStrip } from "../components/RebateStrip";
import { Seo } from "../components/Seo";

/**
 * Single post. The MDX component renders inside an MDXProvider so posts
 * can use <PhotoGrid/>, <RebateStrip/>, <FilmMetadataTag/> without
 * imports. Prose styling comes from .prose-film in index.css.
 */
export function BlogPost() {
  const { slug } = useParams();
  const post = slug ? getPost(slug) : undefined;

  if (!post) {
    return (
      <div className="page-enter mx-auto max-w-2xl px-5 pt-24 text-center sm:px-8">
        <p className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-mask">Frame not found</p>
        <h1 className="mt-3 font-display text-5xl">Blank negative.</h1>
        <Link to="/blog" className="mt-6 inline-block text-mask underline underline-offset-4">
          Back to the journal
        </Link>
      </div>
    );
  }

  const { meta, Component } = post;
  const cover = photos.find((p) => p.id === meta.cover);

  return (
    <article className="page-enter mx-auto max-w-6xl px-5 pb-8 pt-14 sm:px-8">
      <Seo title={meta.title} description={meta.excerpt} image={cover?.src} />

      <Link
        to="/blog"
        className="inline-flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-[0.16em] text-faded transition-colors hover:text-mask"
      >
        <ArrowLeft className="size-3.5" /> Journal
      </Link>

      <header className="mt-8 max-w-3xl">
        <div className="flex flex-wrap items-baseline gap-3 font-mono text-[0.66rem] uppercase tracking-[0.18em] text-faded">
          <span className="text-mask">{formatDate(meta.date)}</span>
          <span>{meta.tags.join(" · ")}</span>
        </div>
        <h1 className="mt-3 font-display text-4xl leading-tight sm:text-6xl">{meta.title}</h1>
      </header>

      {cover && (
        <div className="frame mt-10 aspect-[21/9]">
          <img src={cover.src} alt={cover.alt} decoding="async" />
        </div>
      )}

      <div className="prose-film mx-auto mt-14 max-w-2xl">
        <MDXProvider components={mdxComponents}>
          <Component />
        </MDXProvider>
      </div>

      <RebateStrip className="mx-auto mt-16 max-w-2xl" label="End of post" frame="FIN" />
    </article>
  );
}

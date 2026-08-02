import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronDown } from "lucide-react";
import { KineticText } from "../components/ui/kinetic-text";
import { RippleButton } from "../components/ui/ripple-button";
import { LayoutGrid, type LayoutGridCard } from "../components/ui/layout-grid";
import { featuredPhotos, formatDate, type Photo } from "../lib/photos";
import { posts } from "../lib/posts";
import { BlogPostCard } from "../components/BlogPostCard";
import { Reveal } from "../components/Reveal";
import { buttonVariants } from "../components/ui/button";
import { Seo } from "../components/Seo";
import { cn } from "../lib/utils";

/**
 * Hero: full-viewport photograph with a uniform dark overlay and the site
 * name — kinetic type — centered on it, hero-with-overlay-image style.
 * The featured frames rotate underneath every 5s (paused for
 * prefers-reduced-motion); a small rebate-style caption in the corner
 * credits whichever frame is showing.
 */
export function Home() {
  const [heroIndex, setHeroIndex] = useState(0);

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setHeroIndex((i) => (i + 1) % featuredPhotos.length), 5000);
    return () => clearInterval(t);
  }, []);

  const hero = featuredPhotos[heroIndex];

  return (
    <div className="page-enter">
      <Seo
        title="Home"
        description="Analog point-and-shoot photography by Yun — rolls, trips, and notes from the field."
        image={hero.src}
      />

      {/* ---- Fullscreen hero ---- */}
      <section className="relative h-[calc(100svh-4rem)] min-h-[480px] w-full overflow-hidden">
        {featuredPhotos.map((p, i) => (
          <img
            key={p.id}
            src={p.src}
            alt={i === heroIndex ? p.alt : ""}
            loading={i === 0 ? "eager" : "lazy"}
            decoding="async"
            className={cn(
              "absolute inset-0 h-full w-full object-cover transition-opacity duration-1000",
              i === heroIndex ? "opacity-100" : "opacity-0"
            )}
          />
        ))}

        {/* Uniform overlay keeps the type legible over any frame */}
        <div aria-hidden="true" className="absolute inset-0 bg-black/50" />

        {/* Centered name + single call to action */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-5 text-center">
          <KineticText
            text="Yun shoots film"
            as="h1"
            className="justify-center font-sans uppercase leading-none tracking-tight text-white [font-optical-sizing:auto] text-[12vw] sm:text-6xl md:text-7xl lg:text-8xl"
          />
          <RippleButton
            to="/gallery"
            className={cn(buttonVariants({ variant: "accent", size: "lg" }), "mt-10")}
          >
            Enter the gallery <ArrowRight className="size-4" />
          </RippleButton>
        </div>

        {/* Frame credit, bottom corner — the rebate doing its usual job */}
        <p className="absolute bottom-5 left-5 font-mono text-[0.65rem] uppercase tracking-[0.2em] text-white/70 sm:left-8">
          {hero.film} · {hero.location} · {hero.frame}
        </p>

        {/* Scroll cue */}
        <ChevronDown
          aria-hidden="true"
          className="hero-cue absolute bottom-5 left-1/2 size-5 -translate-x-1/2 text-white/70"
        />
      </section>

      {/* ---- Intro line ---- */}
      <section className="mx-auto max-w-6xl px-5 pt-20 sm:px-8">
        <Reveal>
          <p className="max-w-xl text-lg leading-relaxed text-faded">
            I'm Yun. I carry small cameras to big places — the Portuguese coast,
            back streets, campsites — and let the film decide what it remembers.
          </p>
        </Reveal>
      </section>

      {/* ---- Selected frames: interactive layout grid ---- */}
      <section className="mx-auto mt-20 max-w-6xl px-5 sm:px-8">
        <Reveal>
          <div className="flex items-end justify-between border-t border-line pt-6">
            <h2 className="font-display text-3xl">Selected frames</h2>
            <Link
              to="/gallery"
              className="font-mono text-[0.7rem] uppercase tracking-[0.16em] text-faded transition-colors hover:text-mask"
            >
              All frames →
            </Link>
          </div>
        </Reveal>
        <Reveal className="mt-10">
          <LayoutGrid cards={featuredPhotos.map(toCard)} />
          <p className="mt-4 text-center font-mono text-[0.62rem] uppercase tracking-[0.18em] text-faded">
            Click a frame to enlarge
          </p>
        </Reveal>
      </section>

      {/* ---- Latest journal ---- */}
      <section className="mx-auto mt-24 max-w-6xl px-5 sm:px-8">
        <Reveal>
          <div className="flex items-end justify-between border-t border-line pt-6">
            <h2 className="font-display text-3xl">From the journal</h2>
            <Link
              to="/blog"
              className="font-mono text-[0.7rem] uppercase tracking-[0.16em] text-faded transition-colors hover:text-mask"
            >
              All posts →
            </Link>
          </div>
        </Reveal>
        <div className="mt-10 grid grid-cols-1 gap-x-8 gap-y-14 md:grid-cols-3">
          {posts.slice(0, 3).map((p, i) => (
            <Reveal key={p.meta.slug} delay={i * 100}>
              <BlogPostCard post={p.meta} />
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}

/** Map a photo to a layout-grid card; the 1st and 4th span wide like a spread. */
function toCard(photo: Photo, i: number): LayoutGridCard {
  return {
    id: i,
    thumbnail: photo.src,
    alt: photo.alt,
    className: i === 0 || i === 3 ? "md:col-span-2" : "col-span-1",
    content: (
      <>
        <h3 className="font-display text-2xl sm:text-3xl">{photo.alt}</h3>
        <p className="mt-2 font-mono text-[0.68rem] uppercase tracking-[0.18em] text-white/75">
          {photo.camera} · {photo.film} · {photo.location} · {formatDate(photo.date)}
        </p>
      </>
    ),
  };
}

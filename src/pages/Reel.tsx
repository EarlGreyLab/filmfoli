import { useState } from "react";
import { photos } from "../lib/photos";
import { Lightbox } from "../components/Lightbox";
import { Seo } from "../components/Seo";
import {
  ScrollVelocityContainer,
  ScrollVelocityRow,
} from "../components/ui/scroll-based-velocity";

/**
 * "The Reel" — a second, motion-driven way to browse the archive that
 * lives alongside the filterable Gallery (it does not replace it).
 * Rows of frames drift horizontally like film advancing through a
 * projector; scrolling the page throws velocity into the rows (Magic UI
 * scroll-based-velocity). Click any frame to open it in the Lightbox.
 */

// Split the library into three alternating strips.
const rows = [
  photos.filter((_, i) => i % 3 === 0),
  photos.filter((_, i) => i % 3 === 1),
  photos.filter((_, i) => i % 3 === 2),
];

function Strip({
  strip,
  baseVelocity,
  onOpen,
}: {
  strip: typeof photos;
  baseVelocity: number;
  onOpen: (id: string) => void;
}) {
  return (
    <ScrollVelocityRow baseVelocity={baseVelocity} className="py-3">
      {strip.map((p) => (
        <button
          key={p.id}
          type="button"
          onClick={() => onOpen(p.id)}
          className="group relative mx-2 shrink-0 overflow-hidden rounded-sm border border-line bg-surface focus-visible:outline-2 focus-visible:outline-offset-2"
          aria-label={`Open ${p.alt}`}
        >
          <img
            src={p.src}
            alt={p.alt}
            loading="eager"
            decoding="async"
            draggable={false}
            className="h-40 w-auto object-cover transition-transform duration-500 group-hover:scale-[1.04] sm:h-52 md:h-60"
          />
          <span className="pointer-events-none absolute bottom-1.5 left-2 font-mono text-[10px] uppercase tracking-widest text-white/90 opacity-0 drop-shadow transition-opacity duration-300 group-hover:opacity-100">
            {p.frame} · {p.film}
          </span>
        </button>
      ))}
    </ScrollVelocityRow>
  );
}

export function Reel() {
  const [index, setIndex] = useState<number | null>(null);

  const open = (id: string) => {
    const i = photos.findIndex((p) => p.id === id);
    if (i >= 0) setIndex(i);
  };

  return (
    <div className="page-enter select-none pb-8 pt-14">
      <Seo
        title="The Reel"
        description="The whole archive in motion — velocity-scrolling strips of every frame."
      />

      <header className="mx-auto max-w-6xl px-5 sm:px-8">
        <h1 className="font-display text-5xl sm:text-6xl">The reel</h1>
        <p className="mt-4 max-w-2xl leading-relaxed text-faded">
          The archive as a running strip. The rows drift on their own — scroll
          the page and they pick up your speed (and reverse when you scroll
          back). Click any frame to inspect it.
        </p>
      </header>

      {/* Tall spacer content gives the scroll velocity something to react to */}
      <div className="mt-16 space-y-2 sm:space-y-4">
        <ScrollVelocityContainer>
          <Strip strip={rows[0]} baseVelocity={55} onOpen={open} />
          <Strip strip={rows[1]} baseVelocity={-40} onOpen={open} />
          <Strip strip={rows[2]} baseVelocity={70} onOpen={open} />
        </ScrollVelocityContainer>
      </div>

      <p className="mx-auto mt-16 max-w-6xl px-5 font-mono text-xs uppercase tracking-widest text-faded sm:px-8">
        {photos.length} frames · advance the page to advance the reel
      </p>

      {index !== null && (
        <Lightbox
          photos={photos}
          index={index}
          onClose={() => setIndex(null)}
          onNavigate={setIndex}
        />
      )}
    </div>
  );
}

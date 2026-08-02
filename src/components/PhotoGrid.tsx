import { useState } from "react";
import { photos as allPhotos, type Photo } from "../lib/photos";
import { Lightbox } from "./Lightbox";
import { Reveal } from "./Reveal";
import { cn } from "../lib/utils";

interface PhotoGridProps {
  /** Explicit photo objects (e.g. a filtered set from the Gallery). */
  photos?: Photo[];
  /** Or photo ids — the ergonomic form for MDX: <PhotoGrid ids={["p01","p06"]} /> */
  ids?: string[];
  /** Optional caption under the grid, set in mono like a contact-sheet note. */
  caption?: string;
  className?: string;
}

/**
 * The editorial layout engine. Instead of a uniform masonry, photos are
 * placed on a 12-column grid following a repeating 7-step "spread"
 * pattern — wide/narrow pairs with vertical offsets and a full-width
 * cinematic breaker every 5th slot — so a filtered set of any length
 * still paginates like a zine spread. Single column on mobile.
 *
 * Every slot pins an aspect-ratio box, so images can lazy-load without
 * layout shift. `sizes` tells the browser how wide each slot really is,
 * which is what makes srcset pay off once real scans (with 800/1600/2400px
 * variants) replace the placeholders.
 */
const pattern: { cls: string; aspect?: string; sizes: string }[] = [
  { cls: "md:col-span-7 md:col-start-1", sizes: "(min-width: 768px) 58vw, 100vw" },
  { cls: "md:col-span-4 md:col-start-9 md:mt-24", sizes: "(min-width: 768px) 33vw, 100vw" },
  { cls: "md:col-span-5 md:col-start-2 md:mt-10", sizes: "(min-width: 768px) 41vw, 100vw" },
  { cls: "md:col-span-6 md:col-start-7 md:mt-20", sizes: "(min-width: 768px) 50vw, 100vw" },
  { cls: "md:col-span-12 md:mt-12", aspect: "md:aspect-[21/9]", sizes: "100vw" },
  { cls: "md:col-span-4 md:col-start-2 md:mt-16", sizes: "(min-width: 768px) 33vw, 100vw" },
  { cls: "md:col-span-6 md:col-start-7 md:mt-6", sizes: "(min-width: 768px) 50vw, 100vw" },
];

const aspectClass: Record<Photo["aspect"], string> = {
  landscape: "aspect-[3/2]",
  portrait: "aspect-[2/3]",
  square: "aspect-square",
};

export function PhotoGrid({ photos, ids, caption, className }: PhotoGridProps) {
  const items =
    photos ??
    (ids ? (ids.map((id) => allPhotos.find((p) => p.id === id)).filter(Boolean) as Photo[]) : allPhotos);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className={className}>
      <div className="grid grid-cols-1 gap-y-10 md:grid-cols-12 md:gap-x-6">
        {items.map((photo, i) => {
          const slot = pattern[i % pattern.length];
          return (
            <Reveal key={photo.id} className={slot.cls} delay={(i % 3) * 90}>
              <button
                onClick={() => setOpenIndex(i)}
                className="group block w-full text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-mask"
              >
                <div className={cn("frame", aspectClass[photo.aspect], slot.aspect)}>
                  <img
                    src={photo.src}
                    alt={photo.alt}
                    loading={i < 2 ? "eager" : "lazy"}
                    decoding="async"
                    sizes={slot.sizes}
                  />
                </div>
                <div className="mt-2 flex items-baseline justify-between font-mono text-[0.62rem] uppercase tracking-[0.18em] text-faded">
                  <span className="truncate transition-colors group-hover:text-ink">{photo.location}</span>
                  <span className="shrink-0 text-mask/80">{photo.frame}</span>
                </div>
              </button>
            </Reveal>
          );
        })}
      </div>

      {caption && (
        <p className="mt-8 text-center font-mono text-[0.7rem] uppercase tracking-[0.18em] text-faded">
          {caption}
        </p>
      )}

      <Lightbox
        photos={items}
        index={openIndex}
        onClose={() => setOpenIndex(null)}
        onNavigate={setOpenIndex}
      />
    </div>
  );
}

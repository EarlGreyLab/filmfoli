import { useEffect, useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "../../lib/utils";

/**
 * Aceternity Layout Grid (https://ui.aceternity.com/components/layout-grid),
 * adapted for Filmfolio. Click a frame and it lifts off the contact sheet
 * into a centered enlargement — powered by Motion's shared `layoutId`
 * animation — with its caption fading in over the print. Click anywhere
 * outside (or press Escape) to file it back into the grid.
 *
 * Differences from the stock component, on purpose:
 * - Cards are <button>s with real alt text and visible focus rings.
 * - Escape closes; body scroll locks while a frame is open.
 * - Reduced motion: the lift becomes an instant swap.
 * - Colors/typography come from the design tokens, not hardcoded slate/white.
 */

export type LayoutGridCard = {
  id: number;
  content: ReactNode;
  className: string;
  thumbnail: string;
  alt: string;
};

export function LayoutGrid({ cards }: { cards: LayoutGridCard[] }) {
  const [selected, setSelected] = useState<LayoutGridCard | null>(null);
  const [lastSelected, setLastSelected] = useState<LayoutGridCard | null>(null);
  const reduceMotion = useReducedMotion();

  const handleClick = (card: LayoutGridCard) => {
    setLastSelected(selected);
    setSelected(card);
  };

  const handleOutsideClick = () => {
    setLastSelected(selected);
    setSelected(null);
  };

  // Escape closes; lock page scroll while a frame is enlarged.
  useEffect(() => {
    if (!selected) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleOutsideClick();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  const layoutTransition = reduceMotion
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 260, damping: 30 };

  return (
    <div className="relative grid w-full grid-cols-1 gap-4 md:grid-cols-3">
      {cards.map((card) => (
        <div key={card.id} className={cn(card.className, "relative h-64 sm:h-80 md:h-96")}>
          <motion.button
            type="button"
            layoutId={`card-${card.id}`}
            transition={layoutTransition}
            onClick={() =>
              selected?.id === card.id ? handleOutsideClick() : handleClick(card)
            }
            aria-expanded={selected?.id === card.id}
            aria-label={`View “${card.alt}”`}
            className={cn(
              "block overflow-hidden bg-surface text-left",
              "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-mask",
              selected?.id === card.id
                ? "fixed inset-0 z-50 m-auto h-2/3 w-[92vw] max-w-3xl cursor-zoom-out md:h-3/4"
                : "absolute inset-0 cursor-zoom-in",
              lastSelected?.id === card.id ? "z-40" : "z-0"
            )}
          >
            <motion.img
              layoutId={`image-${card.id}`}
              transition={layoutTransition}
              src={card.thumbnail}
              alt={card.alt}
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover"
            />
            {selected?.id === card.id && <SelectedCaption card={card} />}
          </motion.button>
        </div>
      ))}

      {/* Dimming backdrop — click to file the frame back in */}
      <motion.div
        onClick={handleOutsideClick}
        initial={false}
        animate={{ opacity: selected ? 1 : 0 }}
        transition={{ duration: reduceMotion ? 0 : 0.3 }}
        aria-hidden="true"
        className={cn(
          "fixed inset-0 z-40 bg-black/70",
          selected ? "pointer-events-auto" : "pointer-events-none"
        )}
      />
    </div>
  );
}

function SelectedCaption({ card }: { card: LayoutGridCard }) {
  return (
    <div className="pointer-events-none absolute inset-0 z-[60] flex items-end">
      {/* Legibility scrim over the lower half of the enlarged print */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"
      />
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.15 }}
        className="relative w-full p-5 text-white sm:p-8"
      >
        {card.content}
      </motion.div>
    </div>
  );
}

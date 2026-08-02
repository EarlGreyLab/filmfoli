import { cn } from "../lib/utils";

interface RebateStripProps {
  /** Text printed on the rebate, e.g. "KODAK PORTRA 400" */
  label?: string;
  /** Frame number, e.g. "24A" — rendered right-aligned in mask orange */
  frame?: string;
  className?: string;
}

/**
 * The site's signature device: the edge of a 35mm negative.
 * Sprocket holes (pure CSS, see .sprockets) with the stock name and
 * frame number set in mono caps — the way film labels itself.
 * Used as section dividers, hero caption, and the lightbox metadata bar.
 */
export function RebateStrip({ label, frame, className }: RebateStripProps) {
  return (
    <div className={cn("select-none", className)} aria-hidden={!label && !frame}>
      <div className="sprockets opacity-25" />
      {(label || frame) && (
        <div className="mt-1.5 flex items-baseline justify-between gap-4 font-mono text-[0.66rem] uppercase tracking-[0.22em]">
          <span className="text-faded">{label}</span>
          {frame && <span className="text-mask">▸ {frame}</span>}
        </div>
      )}
    </div>
  );
}

import { cn } from "../lib/utils";

interface FilmMetadataTagProps {
  /** e.g. "Camera" — rendered as a tiny eyebrow above the value */
  label: string;
  /** e.g. "Olympus mju-II" */
  value: string;
  className?: string;
}

/**
 * One EXIF-style fact, typeset like a contact-sheet annotation:
 * faded mono eyebrow + ink value. Compose several in a row/grid.
 */
export function FilmMetadataTag({ label, value, className }: FilmMetadataTagProps) {
  return (
    <div className={cn("min-w-0", className)}>
      <div className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-faded">
        {label}
      </div>
      <div className="mt-0.5 truncate text-sm">{value}</div>
    </div>
  );
}

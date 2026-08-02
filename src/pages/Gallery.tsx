import { useMemo, useState } from "react";
import { matches, photos, valuesFor, type FilterKey } from "../lib/photos";
import { PhotoGrid } from "../components/PhotoGrid";
import { RebateStrip } from "../components/RebateStrip";
import { Seo } from "../components/Seo";
import { Tabs, TabsList, TabsTrigger } from "../components/ui/tabs";
import { cn } from "../lib/utils";

const dimensions: { key: FilterKey; label: string }[] = [
  { key: "roll", label: "Roll" },
  { key: "trip", label: "Trip" },
  { key: "camera", label: "Camera" },
  { key: "film", label: "Film stock" },
  { key: "tag", label: "Tag" },
];

/**
 * Two-level filtering, modeled on flipping through a negative binder:
 * Tabs pick the *dimension* (which index you're using — roll, trip,
 * camera, film, tag), pills pick the *value*. Switching dimensions
 * resets the value to "All frames" — cross-dimension AND filters read
 * as power-user clutter for a portfolio this size.
 */
export function Gallery() {
  const [dimension, setDimension] = useState<FilterKey>("roll");
  const [value, setValue] = useState<string | null>(null);

  const values = useMemo(() => valuesFor(dimension), [dimension]);
  const filtered = value ? photos.filter((p) => matches(p, dimension, value)) : photos;

  return (
    <div className="page-enter mx-auto max-w-6xl px-5 pb-8 pt-14 sm:px-8">
      <Seo title="Gallery" description="Every frame, filterable by roll, trip, camera, film stock, and tag." />

      <header className="max-w-2xl">
        <h1 className="font-display text-5xl sm:text-6xl">The gallery</h1>
        <p className="mt-4 leading-relaxed text-faded">
          Every keeper since Roll 008, indexed the way the binder is: by roll,
          trip, camera, and stock. Click any frame to view it with its metadata.
        </p>
      </header>

      <div className="mt-12">
        <Tabs value={dimension} onValueChange={(v) => { setDimension(v as FilterKey); setValue(null); }}>
          <TabsList>
            {dimensions.map((d) => (
              <TabsTrigger key={d.key} value={d.key}>
                {d.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="mt-5 flex flex-wrap gap-2">
          <FilterPill active={value === null} onClick={() => setValue(null)}>
            All frames
          </FilterPill>
          {values.map((v) => (
            <FilterPill key={v} active={value === v} onClick={() => setValue(v)}>
              {v}
            </FilterPill>
          ))}
        </div>
      </div>

      <RebateStrip
        className="mt-10"
        label={value ? `${value}` : "Full archive"}
        frame={`${filtered.length} ${filtered.length === 1 ? "frame" : "frames"}`}
      />

      <PhotoGrid photos={filtered} className="mt-10" />
    </div>
  );
}

function FilterPill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "border px-3 py-1.5 font-mono text-[0.68rem] uppercase tracking-[0.12em] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mask",
        active
          ? "border-mask bg-mask text-paper"
          : "border-line text-faded hover:border-mask hover:text-mask"
      )}
    >
      {children}
    </button>
  );
}

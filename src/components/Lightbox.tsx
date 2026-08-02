import { useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "./ui/dialog";
import { FilmMetadataTag } from "./FilmMetadataTag";
import { formatDate, type Photo } from "../lib/photos";

interface LightboxProps {
  photos: Photo[];
  /** Index into `photos`, or null when closed. */
  index: number | null;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

/**
 * Full-screen photo viewer. The overlay is a 95%-opaque warm black so
 * opening a photo feels like the gallery lights going off. Metadata is
 * not a caption block — it's the negative's own rebate strip (sprockets,
 * stock name, frame number) with EXIF facts beneath. Arrow keys and
 * on-screen chevrons page through the current set; Esc closes (Radix).
 */
export function Lightbox({ photos, index, onClose, onNavigate }: LightboxProps) {
  const photo = index !== null ? photos[index] : null;

  useEffect(() => {
    if (index === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") onNavigate((index + 1) % photos.length);
      if (e.key === "ArrowLeft") onNavigate((index - 1 + photos.length) % photos.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, photos.length, onNavigate]);

  return (
    <Dialog open={photo !== null} onOpenChange={(open) => !open && onClose()}>
      {photo && (
        <DialogContent aria-describedby={undefined}>
          <DialogTitle className="sr-only">{photo.alt}</DialogTitle>
          <DialogDescription className="sr-only">
            {photo.camera} on {photo.film}, {photo.location}
          </DialogDescription>

          <div className="flex w-full max-w-5xl flex-col">
            <div className="relative flex items-center justify-center">
              <img
                key={photo.id}
                src={photo.src}
                alt={photo.alt}
                className="fade-in-anim max-h-[70vh] w-auto max-w-full object-contain"
              />
              <button
                onClick={() => onNavigate((index! - 1 + photos.length) % photos.length)}
                className="absolute -left-2 top-1/2 -translate-y-1/2 p-3 text-[#eae2d3]/60 transition-colors hover:text-[#e68a3b] sm:-left-14"
                aria-label="Previous photo"
              >
                <ChevronLeft className="size-6" />
              </button>
              <button
                onClick={() => onNavigate((index! + 1) % photos.length)}
                className="absolute -right-2 top-1/2 -translate-y-1/2 p-3 text-[#eae2d3]/60 transition-colors hover:text-[#e68a3b] sm:-right-14"
                aria-label="Next photo"
              >
                <ChevronRight className="size-6" />
              </button>
            </div>

            {/* Rebate bar: hardcoded darkroom colors on purpose — the
                lightbox is always "in the dark", whatever the site theme. */}
            <div className="mx-auto mt-6 w-full max-w-2xl text-[#9a8f7c]">
              <div className="sprockets opacity-40" />
              <div className="mt-2 flex items-baseline justify-between font-mono text-[0.66rem] uppercase tracking-[0.22em]">
                <span>{photo.film}</span>
                <span className="text-[#e68a3b]">▸ {photo.frame}</span>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3 text-[#eae2d3] sm:grid-cols-4">
                <FilmMetadataTag label="Camera" value={photo.camera} />
                <FilmMetadataTag label="Film / ISO" value={`${photo.film.split(" ").slice(-2).join(" ")} · ${photo.iso}`} />
                <FilmMetadataTag label="Location" value={photo.location} />
                <FilmMetadataTag label="Date" value={formatDate(photo.date)} />
              </div>
            </div>
          </div>
        </DialogContent>
      )}
    </Dialog>
  );
}

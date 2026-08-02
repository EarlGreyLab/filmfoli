import { useTheme } from "../lib/theme";
import { RebateStrip } from "./RebateStrip";
import { Marquee } from "./ui/marquee";
import { photos } from "../lib/photos";

/**
 * Footer doubles as the settings tray: the grain toggle lives here
 * (it's an aesthetic preference, not navigation — it shouldn't cost
 * space in the header).
 */
export function Footer() {
  const { grain, toggleGrain } = useTheme();
  return (
    <footer className="mt-24 border-t border-line">
      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
        <RebateStrip label={`Shot on 35mm · ${new Date().getFullYear()}`} frame="FIN" />
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 font-mono text-[0.66rem] uppercase tracking-[0.16em] text-faded">
          <span>Scanned, not filtered.</span>
          <button
            onClick={toggleGrain}
            className="border-b border-dotted border-faded transition-colors hover:text-mask"
            aria-pressed={grain}
          >
            grain {grain ? "on" : "off"}
          </button>
        </div>

        {/* Frame counter — a tiny marquee tucked in the corner, ticking
            past like film advancing. Pauses on hover; count is live from
            the photo library, so it updates itself when scans are added. */}
        <div className="mt-4 flex justify-end">
          <Marquee
            pauseOnHover
            className="w-44 p-0 font-mono text-[0.6rem] uppercase tracking-[0.2em] text-faded [--duration:18s] [--gap:1.5rem] [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]"
          >
            <span aria-hidden="true">{photos.length} frames on file</span>
          </Marquee>
          <span className="sr-only">{photos.length} photos on this site</span>
        </div>
      </div>
    </footer>
  );
}

import { useTheme } from "../lib/theme";

/**
 * Full-viewport film grain. An SVG feTurbulence tile, fixed and
 * pointer-events-none so it never intercepts input. Static (not
 * animated) on purpose — flickering grain is the kitsch version.
 * Slightly stronger in dark mode, where pushed film would show more.
 */
export function GrainOverlay() {
  const { grain, theme } = useTheme();
  if (!grain) return null;
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-40"
      style={{
        opacity: theme === "dark" ? 0.09 : 0.055,
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' seed='11' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0.5 0 0 0 0 0.5 0 0 0 0 0.5 0 0 0 1 0'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23g)'/%3E%3C/svg%3E\")",
        mixBlendMode: "overlay",
      }}
    />
  );
}

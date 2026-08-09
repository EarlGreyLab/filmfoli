/**
 * Deployment identity. Open Graph and Twitter cards are the one place a
 * root-relative URL is not good enough — crawlers resolve `og:image` and
 * `og:url` against nothing, so they must carry scheme + host.
 *
 * `BASE_URL` still owns the path segment (see photos.ts), so changing the
 * repo name means changing `base` in vite.config.ts and nothing here.
 */
export const SITE_ORIGIN = "https://earlgreylab.github.io";

/** Absolute URL for an asset path already prefixed with BASE_URL. */
export function absoluteUrl(pathWithBase: string): string {
  if (/^https?:\/\//.test(pathWithBase)) return pathWithBase;
  return SITE_ORIGIN + (pathWithBase.startsWith("/") ? "" : "/") + pathWithBase;
}

/** Absolute URL for the current in-app location. */
export function absolutePageUrl(pathname: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  return `${SITE_ORIGIN}${base}${pathname === "/" ? "/" : pathname}`;
}

import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { absolutePageUrl, absoluteUrl } from "../lib/site";

interface SeoProps {
  title: string;
  description?: string;
  /** Photo `src` (already BASE_URL-prefixed) — promoted to an absolute URL. */
  image?: string;
}

/** Tags this component owns, so a page that omits one clears the last page's value. */
const MANAGED: [attr: "name" | "property", key: string][] = [
  ["name", "description"],
  ["property", "og:title"],
  ["property", "og:description"],
  ["property", "og:image"],
  ["property", "og:url"],
  ["property", "og:type"],
  ["name", "twitter:card"],
  ["name", "twitter:title"],
  ["name", "twitter:description"],
  ["name", "twitter:image"],
];

function setMeta(attr: "name" | "property", key: string, value?: string) {
  const selector = `meta[${attr}="${key}"]`;
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!value) {
    el?.remove();
    return;
  }
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.content = value;
}

/**
 * Minimal SEO head manager — sets title, description, and OG/Twitter tags on
 * mount (no extra dependency needed for a static SPA of this size).
 * Crawlers that execute JS see these; for the pages that must never
 * miss (home), the static defaults in index.html are the fallback.
 *
 * Every managed tag is rewritten on each navigation, and cleared when the new
 * page doesn't supply it — otherwise a page without a cover would inherit the
 * previous page's og:image.
 */
export function Seo({ title, description, image }: SeoProps) {
  const { pathname } = useLocation();

  useEffect(() => {
    const fullTitle = `${title} — Yun shoots film`;
    const absImage = image ? absoluteUrl(image) : undefined;
    document.title = fullTitle;

    const values: Record<string, string | undefined> = {
      description,
      "og:title": fullTitle,
      "og:description": description,
      "og:image": absImage,
      "og:url": absolutePageUrl(pathname),
      "og:type": pathname.startsWith("/blog/") ? "article" : "website",
      "twitter:card": absImage ? "summary_large_image" : "summary",
      "twitter:title": fullTitle,
      "twitter:description": description,
      "twitter:image": absImage,
    };

    for (const [attr, key] of MANAGED) setMeta(attr, key, values[key]);
  }, [title, description, image, pathname]);

  return null;
}

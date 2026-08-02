import { useEffect } from "react";

interface SeoProps {
  title: string;
  description?: string;
  /** Absolute or root-relative image URL for og:image. */
  image?: string;
}

/**
 * Minimal SEO head manager — sets title, description, and OG tags on
 * mount (no extra dependency needed for a static SPA of this size).
 * Crawlers that execute JS see these; for the pages that must never
 * miss (home), the static defaults in index.html are the fallback.
 */
export function Seo({ title, description, image }: SeoProps) {
  useEffect(() => {
    document.title = `${title} — Yun shoots film`;
    const set = (attr: "name" | "property", key: string, value?: string) => {
      if (!value) return;
      let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.content = value;
    };
    set("name", "description", description);
    set("property", "og:title", title);
    set("property", "og:description", description);
    set("property", "og:image", image);
  }, [title, description, image]);
  return null;
}

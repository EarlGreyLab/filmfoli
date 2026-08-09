# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev           # Vite dev server on :5173
npm run build         # tsc -b (typecheck) + vite build + copy dist/index.html -> dist/404.html
npm run preview       # serve the production build
npm run lint          # oxlint (config in .oxlintrc.json)
npm run placeholders  # regenerate the sample SVG "photos" in public/photos/
```

There is no test runner or test suite in this project. `tsc -b` inside `npm run build` is the only
correctness gate — run it (or `npx tsc -b`) after non-trivial changes.

Deploy is automatic: `.github/workflows/deploy.yml` builds and publishes `dist/` to GitHub Pages on
every push to `main`.

## Architecture

Static SPA — Vite + React 19 + TypeScript + Tailwind v4 + MDX, no backend, no runtime data fetching.
Everything the site renders is bundled at build time.

### Content is data, not markup

- `src/lib/photos.ts` is the single source of truth for the gallery. One flat `Photo[]`; the Gallery's
  filter dimensions (`valuesFor`, `matches`), `featuredPhotos`, blog post covers, and lightbox metadata
  all derive from it. Adding a photo to that array is the whole workflow — no UI file needs editing.
- `src/lib/posts.ts` loads `src/content/posts/*.mdx` via `import.meta.glob(..., { eager: true })` and
  sorts by `meta.date` descending. Each post must export a `meta: PostMeta` (see the type there); the
  ambient declaration in `src/mdx.d.ts` is what makes that export typed. That declaration is an
  *assertion*, though — `tsc` never parses `.mdx`, so a bad `meta` typechecks clean. `posts.ts`
  validates shape and duplicate slugs at load under `import.meta.env.DEV`; that check is the only
  real enforcement, so keep it in step with `PostMeta`.
- `src/mdx-components.tsx` lists the components usable in MDX prose without imports (`PhotoGrid`,
  `RebateStrip`, `FilmMetadataTag`). They reach posts through the `<MDXProvider>` in
  `src/pages/BlogPost.tsx` — adding a component to MDX means adding it to that map.

### Base path (`/filmfoli/`)

`vite.config.ts` sets `base: "/filmfoli/"` because the site is a GitHub Pages *project* page. Three
places depend on it and must stay consistent:

- `App.tsx` passes `basename={import.meta.env.BASE_URL}` to `<BrowserRouter>`.
- `photos.ts` prefixes every `src` with `import.meta.env.BASE_URL`. **Any asset URL built in JS must
  do the same** — Vite rewrites `src`/`href`/`content` in `index.html` but cannot rewrite strings
  assembled at runtime.
- The build copies `index.html` to `404.html` so deep links (`/filmfoli/blog/slug`) boot the SPA.

Changing the repo name means changing `base` only; the other two follow automatically.

`BASE_URL` is not enough for Open Graph: crawlers can't resolve a root-relative `og:image`/`og:url`,
so those need scheme + host. `src/lib/site.ts` holds `SITE_ORIGIN` and the two helpers `Seo.tsx`
uses; the static fallback tags in `index.html` spell the same absolute URLs out by hand. Moving the
site to a custom domain means changing `SITE_ORIGIN` **and** those `index.html` tags.

### Design system

Tailwind v4, **no config file** — `src/index.css` is the design system. `@theme inline` maps semantic
tokens (`--color-paper`, `--ink`, `--faded`, `--line`, `--control`, `--mask`, `--safelight`) to
utilities; the raw values live on `:root` (light, "Gallery") and `.dark` (dark, "Darkroom") and flip
together. Never hardcode a color in a component.

Two token distinctions worth keeping straight:

- `--line` is *decorative* (dividers, photo borders) and is allowed to whisper. `--control` bounds
  real form fields, where WCAG 1.4.11 needs 3:1. Don't use `--line` on an input.
- The frozen `--dr-*` tokens (`dr-ink`, `dr-faded`, `dr-mask`, `dr-void`) are the Darkroom palette
  that does **not** flip with `.dark`. They exist for `Lightbox.tsx` and its `ui/dialog.tsx`
  primitive, which stay dark in both themes — the one sanctioned exception, and the reason it is
  tokens rather than hex literals. Scrims sitting over photographs (`Home.tsx` hero,
  `ui/layout-grid.tsx` captions) stay literal black/white for the same reason.

Token colors are contrast-checked against both themes; `--mask` in particular is tuned to clear
4.5:1 on `--paper`, so don't lighten it or dilute it with an opacity modifier on small text.

`index.css` also owns the shared visual behaviors as plain CSS classes rather than component styles:
`.frame` (photo hover zoom + vignette), `.sprockets` (the 35mm rebate edge), `.reveal`, `.page-enter`,
`.prose-film` (hand-rolled MDX prose styling — no typography plugin), and the staggered menu. Each
animation block has a matching `prefers-reduced-motion` override; keep that pairing when adding one.
That applies to JS-driven motion too, which CSS can't reach: `ui/scroll-based-velocity.tsx` skips its
rAF loop, `ui/layout-grid.tsx` zeroes its spring, `ui/animated-theme-toggler.tsx` skips
`startViewTransition`, and `Home.tsx` pauses the hero rotation. Anything that loops forever
(the footer marquee) must be stopped outright, not merely shortened.

### Theme

Dark mode is a `.dark` class on `<html>`, applied by an inline pre-paint script in `index.html`
(saved choice > OS preference) to avoid a flash. `src/lib/theme.tsx` *reads* that class for its
initial state rather than deciding it — don't move the decision into React. The provider also owns the
grain toggle; both persist to `localStorage` (`theme`, `grain`).

Persistence is **write-on-choice, not write-on-render**. Writing `theme` from a mount effect would
stamp the OS-derived value into `localStorage` on a visitor's first load, after which the pre-paint
script's `saved choice > OS preference` priority could never reach its second branch and the site
would stop following the OS for good. Only `setTheme` writes.

### Plugin order

In `vite.config.ts`, the MDX plugin is `enforce: "pre"` so `.mdx` compiles to JSX before
`@vitejs/plugin-react` runs, and the React plugin's `include` is widened to cover `.mdx`. Reordering
or dropping either breaks MDX with confusing errors.

### Routing

Flat routes in `App.tsx`; the catch-all `*` renders `BlogPost`, which shows its own "Blank negative"
not-found state when the slug misses. `ScrollToTop` handles scroll restoration — it must pass
`behavior: "instant"`, because `html { scroll-behavior: smooth }` otherwise animates a full-page
scroll on every navigation.

`src/components/Seo.tsx` sets title/description/OG/Twitter tags imperatively per page — the static
tags in `index.html` are the crawler fallback for the home page. It rewrites every tag it owns on
each navigation and removes the ones the new page doesn't supply, so a page without a cover can't
inherit the previous page's `og:image`; add new tags to its `MANAGED` list rather than setting them
ad hoc.

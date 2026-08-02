# Yun shoots film

Personal portfolio + journal for analog point-and-shoot photography.
Vite · React 19 · TypeScript · Tailwind v4 · MDX · Radix (shadcn-pattern components).

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # static output in dist/ (+ 404.html for GH Pages SPA routing)
npm run preview    # serve the production build locally
```

## Structure

```
src/
├── index.css              Design system: all tokens (colors, fonts) + the two theme moods
├── App.tsx                Router, layout shell, scroll restoration
├── lib/
│   ├── photos.ts          THE photo library — edit this to manage your gallery
│   ├── posts.ts           MDX post loader (glob, build-time)
│   ├── theme.tsx          ThemeProvider (light/dark + grain, both persisted)
│   └── utils.ts           cn() helper
├── content/posts/*.mdx    Blog posts (prose + inline components)
├── components/
│   ├── ui/                shadcn-pattern primitives + MagicUI (kinetic-text, ripple, marquee, theme toggler) + Aceternity layout-grid
│   ├── RebateStrip.tsx    Signature device: 35mm sprocket edge + stock/frame label
│   ├── PhotoGrid.tsx      Asymmetric editorial grid + built-in Lightbox
│   ├── Lightbox.tsx       Darkroom viewer, keyboard nav, EXIF rebate bar
│   ├── FilmMetadataTag.tsx  One EXIF-style fact (eyebrow + value)
│   ├── BlogPostCard.tsx   Journal card (covers come from the photo library)
│   ├── Nav.tsx / Footer.tsx / ThemeToggle.tsx / GrainOverlay.tsx
│   ├── Reveal.tsx         Scroll-reveal wrapper (IntersectionObserver, reduced-motion safe)
│   └── Seo.tsx            Per-page title/description/OG tags
├── pages/                 Home, Gallery, Blog, BlogPost, About, Contact
└── scripts/gen-placeholders.mjs   Regenerates the sample SVG "photos"
```

## Component props (quick reference)

| Component | Props |
|---|---|
| `PhotoGrid` | `photos?: Photo[]` · `ids?: string[]` · `caption?: string` · `className?` — pass nothing to render the full library |
| `Lightbox` | `photos: Photo[]` · `index: number \| null` · `onClose()` · `onNavigate(i)` — controlled; PhotoGrid manages one for you |
| `FilmMetadataTag` | `label: string` · `value: string` |
| `RebateStrip` | `label?: string` · `frame?: string` (e.g. `"24A"`) |
| `BlogPostCard` | `post: PostMeta` · `featured?: boolean` |
| `Reveal` | `delay?: number` (ms, for staggering) |
| `Seo` | `title` · `description?` · `image?` |

Inside `.mdx` posts, `PhotoGrid`, `RebateStrip`, and `FilmMetadataTag` are
available without imports:

```mdx
<PhotoGrid ids={["p01", "p06"]} caption="Roll 014 · May 2026" />
```

## Swapping in your real photos

1. Drop scans into `public/photos/` (JPEG, ~2000px long edge is plenty).
2. Edit `src/lib/photos.ts` — one entry per photo: src, camera, film, iso,
   location, date, roll, trip, tags. Filters, counts, and lightbox metadata
   all derive from this file automatically.
3. Optional but worth it: export 800 / 1600 / 2400px versions per photo and
   add `srcSet` to the `<img>` in `PhotoGrid.tsx` — the `sizes` attributes
   are already wired, so the browser will pick the right file per slot.

## Adding a blog post

Create `src/content/posts/my-post.mdx` with an exported `meta`
(`slug`, `title`, `date`, `excerpt`, `cover` photo id, `tags`) and write.
It appears on the index automatically, newest first.

## Deploying to GitHub Pages

- Project page (`user.github.io/repo`): set `base: "/repo/"` in
  `vite.config.ts` before building.
- `npm run build` already copies `index.html` → `404.html`, which is the
  standard GH Pages trick so deep links like `/blog/slug` load the SPA.

## Design notes

- **Two moods, one token set.** `index.css` defines semantic tokens
  (`paper`, `ink`, `mask`…) that flip values under `.dark`. Light =
  "Gallery" (fiber paper, C-41 orange-mask accent). Dark = "Darkroom"
  (warm film-base black, amber, safelight-red hover vignettes). No
  component ever hardcodes a color — except the Lightbox, which is
  deliberately always dark.
- **The rebate strip is the identity.** Sprocket holes + mono stock/frame
  labels recur as dividers, captions, and the lightbox metadata bar.
- **Grain is a preference.** Toggle lives in the footer, persisted in
  localStorage, static (never animated), stronger in dark mode.

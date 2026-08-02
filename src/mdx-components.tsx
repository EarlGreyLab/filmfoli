import { PhotoGrid } from "./components/PhotoGrid";
import { FilmMetadataTag } from "./components/FilmMetadataTag";
import { RebateStrip } from "./components/RebateStrip";

/**
 * Components available inside every .mdx post without importing —
 * so a post can drop <PhotoGrid ids={[...]} /> mid-prose.
 * Passed to <MDXProvider> in the BlogPost page.
 */
export const mdxComponents = {
  PhotoGrid,
  FilmMetadataTag,
  RebateStrip,
};

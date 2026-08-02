declare module "*.mdx" {
  import type { ComponentType } from "react";
  import type { PostMeta } from "./lib/posts";
  export const meta: PostMeta;
  const MDXComponent: ComponentType<{ components?: Record<string, unknown> }>;
  export default MDXComponent;
}

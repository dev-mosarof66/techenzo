import { MDXRemote } from "next-mdx-remote/rsc";
import type { MDXComponents } from "mdx/types";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeShiki from "@shikijs/rehype";
import { techenzoDark } from "@/lib/shiki-theme";
import { remarkCodeMeta } from "@/lib/remark-code-meta";
import { transformerCodeMeta } from "@/lib/shiki-code-meta";
import { mdxComponents } from "./components";

/**
 * Compiles and renders MDX in the server component tree. Every plugin here runs
 * at build time, so a page with highlighted code and anchored headings ships no
 * extra client JavaScript for either.
 *
 * `extra` lets a page bind components to its own data — the experiment page
 * passes a <Metrics /> already closed over that experiment's frontmatter.
 */
export function MdxContent({
  source,
  extra,
}: {
  source: string;
  extra?: MDXComponents;
}) {
  return (
    <MDXRemote
      source={source}
      components={{ ...mdxComponents, ...extra }}
      options={{
        // Frontmatter is parsed and validated in lib/content.ts long before
        // this point; the body handed here has already had it stripped.
        parseFrontmatter: false,
        mdxOptions: {
          remarkPlugins: [remarkGfm, remarkCodeMeta],
          rehypePlugins: [
            rehypeSlug,
            [
              rehypeAutolinkHeadings,
              {
                behavior: "append",
                properties: { className: ["heading-anchor"], ariaLabel: "Link to section" },
                content: { type: "text", value: "#" },
              },
            ],
            [rehypeShiki, { theme: techenzoDark, transformers: [transformerCodeMeta] }],
          ],
        },
      }}
    />
  );
}

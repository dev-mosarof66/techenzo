/**
 * Carries a fenced block's meta string into hast.
 *
 * ```ts title="lib/content.ts"
 *
 * mdast holds that trailing text on `node.meta`, but mdast-util-to-hast drops
 * it — only `lang` survives, as a `language-*` class. This copies it into
 * `hProperties.metastring`, which is exactly where @shikijs/rehype looks
 * (`head.data?.meta ?? head.properties.metastring`) before handing it to
 * transformers as `options.meta.__raw`.
 *
 * Hand-rolled rather than pulling in unist-util-visit: it is a six-line walk
 * and the dependency would be the larger half of the change.
 */
interface MdastNode {
  type: string;
  meta?: string | null;
  data?: { hProperties?: Record<string, unknown> };
  children?: MdastNode[];
}

export function remarkCodeMeta() {
  return (tree: MdastNode) => {
    const walk = (node: MdastNode) => {
      if (node.type === "code" && node.meta) {
        node.data ??= {};
        node.data.hProperties = { ...node.data.hProperties, metastring: node.meta };
      }
      node.children?.forEach(walk);
    };
    walk(tree);
  };
}

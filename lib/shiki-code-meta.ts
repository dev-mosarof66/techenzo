import type { ShikiTransformer } from "shiki";

/**
 * Lifts the filename and language out of the fence meta and onto the rendered
 * <pre>, where the MDX component map can read them as plain data attributes.
 *
 * Accepts `title="..."` or `file="..."` — the two spellings people actually
 * type — in single or double quotes.
 */
export const transformerCodeMeta: ShikiTransformer = {
  name: "techenzo:code-meta",
  pre(node) {
    const raw = String(this.options.meta?.__raw ?? "");
    const title = /(?:title|file)=(?:"([^"]+)"|'([^']+)')/.exec(raw);

    if (title) node.properties["data-title"] = title[1] ?? title[2];
    if (this.options.lang && this.options.lang !== "text") {
      node.properties["data-language"] = this.options.lang;
    }
  },
};

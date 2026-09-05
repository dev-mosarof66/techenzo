import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import matter from "gray-matter";
import { z } from "zod";
import { memoizeInProduction } from "./content-cache";

const PRODUCTS_DIR = join(process.cwd(), "content", "products");

const includeDrafts =
  process.env.NODE_ENV === "development" || process.env.TECHENZO_INCLUDE_DRAFTS === "1";

export const PRODUCT_STATUSES = [
  "idea",
  "building",
  "beta",
  "launched",
  "archived",
] as const;

const metricSchema = z.object({
  metric: z.string().min(1),
  value: z.string().min(1),
  baseline: z.string().optional(),
  direction: z.enum(["improvement", "regression", "neutral"]).default("neutral"),
  change: z.enum(["up", "down"]).optional(),
});

const productSchema = z.object({
  name: z.string().min(1),
  tagline: z.string().min(1),
  description: z.string().min(1),
  status: z.enum(PRODUCT_STATUSES),
  /**
   * One-line summaries for the homepage featured block. Authored deliberately
   * rather than scraped from the body's ## Problem / ## Solution sections —
   * a homepage summary is different writing from a full section, and scraping
   * would render raw markdown into a card.
   */
  problem: z.string().optional(),
  solution: z.string().optional(),
  featured: z.boolean().default(false),
  category: z.string().optional(),
  /** Shown on the card. The grouped `stack` below is for the detail page. */
  technologies: z.array(z.string()).default([]),
  stack: z
    .array(z.object({ layer: z.string().min(1), items: z.array(z.string()).min(1) }))
    .default([]),
  features: z
    .array(z.object({ title: z.string().min(1), body: z.string().min(1) }))
    .max(6, "Six real features beat twelve padded ones — spec §9.3")
    .default([]),
  metrics: z.array(metricSchema).default([]),
  changelog: z
    .array(
      z.object({
        date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "changelog date must be YYYY-MM-DD"),
        text: z.string().min(1),
      }),
    )
    .default([]),
  url: z.string().optional(),
  githubUrl: z.string().optional(),
  image: z.string().optional(),
  startedAt: z.string().regex(/^\d{4}-\d{2}$/, "startedAt must be YYYY-MM"),
  version: z.string().optional(),
  license: z.string().optional(),
  draft: z.boolean().default(false),
});

export type ProductFrontmatter = z.infer<typeof productSchema>;
export type ProductStatus = ProductFrontmatter["status"];

export interface LoadedProduct extends ProductFrontmatter {
  slug: string;
  body: string;
}

async function parseProduct(filename: string): Promise<LoadedProduct> {
  const slug = filename.replace(/\.mdx$/, "");
  const raw = await readFile(join(PRODUCTS_DIR, filename), "utf8");
  const { data, content } = matter(raw);

  const parsed = productSchema.safeParse(data);
  if (!parsed.success) {
    const issues = parsed.error.issues
      .map((issue) => `  ${issue.path.join(".") || "(root)"}: ${issue.message}`)
      .join("\n");
    throw new Error(`Invalid frontmatter in content/products/${filename}:\n${issues}`);
  }

  // You cannot call something live with nowhere for a reader to go.
  if (parsed.data.status === "launched" && !parsed.data.url && !parsed.data.githubUrl) {
    throw new Error(
      `content/products/${filename} is marked "launched" but has no url or githubUrl. ` +
        `A live product needs somewhere to send people.`,
    );
  }

  return { ...parsed.data, slug, body: content };
}

const STATUS_ORDER: Record<ProductStatus, number> = {
  launched: 0,
  beta: 1,
  building: 2,
  idea: 3,
  archived: 4,
};

async function loadProducts(): Promise<LoadedProduct[]> {
  let filenames: string[];
  try {
    filenames = (await readdir(PRODUCTS_DIR)).filter((f) => f.endsWith(".mdx"));
  } catch {
    return []; // No products yet — an empty shelf, not a crash.
  }

  const all = await Promise.all(filenames.map(parseProduct));
  const visible = all.filter((product) => includeDrafts || !product.draft);

  const featured = visible.filter((product) => product.featured);
  if (featured.length > 1) {
    throw new Error(
      `More than one product is marked featured (${featured
        .map((p) => p.slug)
        .join(", ")}). The homepage and the index have exactly one featured slot.`,
    );
  }

  // Shipped things first — the shelf should lead with what people can use.
  return visible.sort(
    (a, b) =>
      STATUS_ORDER[a.status] - STATUS_ORDER[b.status] || a.name.localeCompare(b.name),
  );
}

/** Memoised in production — see lib/content-cache.ts. */
export const getProducts = memoizeInProduction(loadProducts);

export async function getProduct(slug: string): Promise<LoadedProduct | null> {
  const all = await getProducts();
  return all.find((product) => product.slug === slug) ?? null;
}

export async function getFeaturedProduct(): Promise<LoadedProduct | null> {
  const all = await getProducts();
  // Falls back to the most advanced product rather than showing nothing —
  // and never fakes a launch: the card carries whatever status is true.
  return all.find((product) => product.featured) ?? all[0] ?? null;
}

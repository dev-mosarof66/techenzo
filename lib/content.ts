import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import matter from "gray-matter";
import readingTime from "reading-time";
import GithubSlugger from "github-slugger";
import { z } from "zod";
import { memoizeInProduction } from "./content-cache";

const EXPERIMENTS_DIR = join(process.cwd(), "content", "experiments");

/**
 * Drafts are visible while you write and invisible in production. Set
 * TECHENZO_INCLUDE_DRAFTS=1 to render them in a production build — useful for
 * a preview deploy, never for the live site.
 */
const includeDrafts =
  process.env.NODE_ENV === "development" || process.env.TECHENZO_INCLUDE_DRAFTS === "1";

const resultSchema = z.object({
  metric: z.string().min(1),
  value: z.string().min(1),
  baseline: z.string().optional(),
  /** Whether the change is good news. Colour + screen-reader label. */
  direction: z.enum(["improvement", "regression", "neutral"]).default("neutral"),
  /** Which way the number moved. Arrow glyph. Latency improving goes down;
      recall improving goes up — one field cannot express both. */
  change: z.enum(["up", "down"]).optional(),
});

/**
 * Frontmatter is validated, not cast. A typo in a date or a missing conditions
 * line fails the build with the filename attached, rather than shipping a
 * half-rendered experiment.
 */
/**
 * Chart data lives in frontmatter, not in JSX attributes.
 *
 * Two reasons. It gets validated here at load time alongside everything else —
 * so a series count mismatch fails the build with a filename rather than at
 * render. And next-mdx-remote silently drops JSX expression attributes, so
 * `series={[...]}` in MDX arrives as undefined with no error at all.
 */
const chartSchema = z
  .object({
    id: z.string().min(1),
    title: z.string().min(1),
    categories: z.array(z.string().min(1)).min(1),
    series: z
      .array(z.object({ name: z.string().min(1), values: z.array(z.number()) }))
      .min(1)
      .max(6, "A chart holds at most six series — the validated palette length"),
    unit: z.string().optional(),
    note: z.string().optional(),
  })
  .refine(
    (chart) => chart.series.every((s) => s.values.length === chart.categories.length),
    { message: "every series must have one value per category" },
  );

const experimentSchema = z.object({
  id: z
    .string()
    .regex(/^EXP-\d{3}$/, "id must look like EXP-004 — the Lab's sequential ID"),
  title: z.string().min(1),
  description: z.string().min(1),
  hypothesis: z.string().min(1),
  /** Printed under every figure. Spec §8.14: a chart without conditions does not ship. */
  conditions: z.string().min(1),
  publishedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "publishedAt must be YYYY-MM-DD"),
  tags: z.array(z.string()).default([]),
  githubUrl: z.string().optional(),
  results: z.array(resultSchema).default([]),
  charts: z.array(chartSchema).default([]),
  draft: z.boolean().default(false),
});

export type ExperimentFrontmatter = z.infer<typeof experimentSchema>;

export interface Heading {
  id: string;
  text: string;
}

export interface LoadedExperiment extends ExperimentFrontmatter {
  slug: string;
  body: string;
  readingMinutes: number;
  headings: Heading[];
}

/**
 * Section headings for the table of contents. Uses the same slugger as
 * rehype-slug so the anchors it generates and the links here cannot drift.
 * Fenced code is stripped first — a `# comment` inside a shell block is not a
 * heading.
 */
function extractHeadings(body: string): Heading[] {
  const slugger = new GithubSlugger();
  const withoutCode = body.replace(/```[\s\S]*?```/g, "");
  const headings: Heading[] = [];

  for (const line of withoutCode.split("\n")) {
    const match = /^##\s+(.+?)\s*$/.exec(line);
    if (match) headings.push({ text: match[1], id: slugger.slug(match[1]) });
  }
  return headings;
}

async function parseExperiment(filename: string): Promise<LoadedExperiment> {
  const slug = filename.replace(/\.mdx$/, "");
  const raw = await readFile(join(EXPERIMENTS_DIR, filename), "utf8");
  const { data, content } = matter(raw);

  const parsed = experimentSchema.safeParse(data);
  if (!parsed.success) {
    const issues = parsed.error.issues
      .map((issue) => `  ${issue.path.join(".") || "(root)"}: ${issue.message}`)
      .join("\n");
    throw new Error(`Invalid frontmatter in content/experiments/${filename}:\n${issues}`);
  }

  // Spec §9.6: "An experiment without stated limits is marketing."
  if (!/^##\s+Limitations\s*$/m.test(content)) {
    throw new Error(
      `content/experiments/${filename} has no "## Limitations" section. ` +
        `Every experiment states what it did not prove.`,
    );
  }

  return {
    ...parsed.data,
    slug,
    body: content,
    readingMinutes: Math.max(1, Math.round(readingTime(content).minutes)),
    headings: extractHeadings(content),
  };
}

async function loadExperiments(): Promise<LoadedExperiment[]> {
  let filenames: string[];
  try {
    filenames = (await readdir(EXPERIMENTS_DIR)).filter((f) => f.endsWith(".mdx"));
  } catch {
    return []; // No content directory yet — an empty Lab, not a crash.
  }

  const all = await Promise.all(filenames.map(parseExperiment));

  return all
    .filter((experiment) => includeDrafts || !experiment.draft)
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

/** Memoised in production — see lib/content-cache.ts. */
export const getExperiments = memoizeInProduction(loadExperiments);

export async function getExperiment(slug: string): Promise<LoadedExperiment | null> {
  const all = await getExperiments();
  return all.find((experiment) => experiment.slug === slug) ?? null;
}

/** Every tag in use, for the Lab filter row. */
export async function getExperimentTags(): Promise<string[]> {
  const all = await getExperiments();
  return [...new Set(all.flatMap((e) => e.tags))].sort();
}

export interface ExperimentNeighbours {
  newer: LoadedExperiment | null;
  older: LoadedExperiment | null;
}

/**
 * Adjacent experiments in publication order. The list is sorted newest-first,
 * so the entry before this one is the newer experiment and the entry after is
 * the older one.
 *
 * Drafts follow the same visibility rule as everywhere else — they are
 * neighbours on localhost and absent in production, so a published experiment
 * can never link to something a reader cannot open.
 */
export async function getExperimentNeighbours(
  slug: string,
): Promise<ExperimentNeighbours> {
  const all = await getExperiments();
  const index = all.findIndex((experiment) => experiment.slug === slug);
  if (index === -1) return { newer: null, older: null };

  return {
    newer: all[index - 1] ?? null,
    older: all[index + 1] ?? null,
  };
}

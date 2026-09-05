import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import matter from "gray-matter";
import readingTime from "reading-time";
import { z } from "zod";
import { memoizeInProduction } from "./content-cache";
import { site } from "@/config/site";

const WRITING_DIR = join(process.cwd(), "content", "writing");

const includeDrafts =
  process.env.NODE_ENV === "development" || process.env.TECHENZO_INCLUDE_DRAFTS === "1";

/**
 * Three content types, because they make different promises to a reader.
 * An article is argued, a build log is dated and provisional, a note is short.
 * Collapsing them into "blog" would let a half-formed thought inherit the
 * authority of a finished piece.
 */
export const CONTENT_TYPES = ["article", "build-log", "note"] as const;
export type ContentType = (typeof CONTENT_TYPES)[number];

export const TYPE_LABEL: Record<ContentType, string> = {
  article: "Article",
  "build-log": "Build log",
  note: "Note",
};

export const TYPE_PLURAL: Record<ContentType, string> = {
  article: "Articles",
  "build-log": "Build logs",
  note: "Notes",
};

const writingSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  type: z.enum(CONTENT_TYPES).default("article"),
  publishedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "publishedAt must be YYYY-MM-DD"),
  updatedAt: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "updatedAt must be YYYY-MM-DD")
    .optional(),
  tags: z.array(z.string()).default([]),
  featuredImage: z.string().optional(),
  /** Cross-link to the experiment a piece is written about, when there is one. */
  experiment: z.string().optional(),
  draft: z.boolean().default(false),
});

export type WritingFrontmatter = z.infer<typeof writingSchema>;

export interface LoadedPost extends WritingFrontmatter {
  slug: string;
  body: string;
  author: string;
  readingMinutes: number;
}

async function parsePost(filename: string): Promise<LoadedPost> {
  const slug = filename.replace(/\.mdx$/, "");
  const raw = await readFile(join(WRITING_DIR, filename), "utf8");
  const { data, content } = matter(raw);

  const parsed = writingSchema.safeParse(data);
  if (!parsed.success) {
    const issues = parsed.error.issues
      .map((issue) => `  ${issue.path.join(".") || "(root)"}: ${issue.message}`)
      .join("\n");
    throw new Error(`Invalid frontmatter in content/writing/${filename}:\n${issues}`);
  }

  // An "updated" date before the publish date is a typo, and it would show a
  // reader a revision that happened before the thing existed.
  if (parsed.data.updatedAt && parsed.data.updatedAt < parsed.data.publishedAt) {
    throw new Error(
      `content/writing/${filename}: updatedAt (${parsed.data.updatedAt}) is before ` +
        `publishedAt (${parsed.data.publishedAt}).`,
    );
  }

  return {
    ...parsed.data,
    slug,
    body: content,
    author: site.founder.name,
    readingMinutes: Math.max(1, Math.round(readingTime(content).minutes)),
  };
}

async function loadPosts(): Promise<LoadedPost[]> {
  let filenames: string[];
  try {
    filenames = (await readdir(WRITING_DIR)).filter((f) => f.endsWith(".mdx"));
  } catch {
    return [];
  }

  const all = await Promise.all(filenames.map(parsePost));

  return all
    .filter((post) => includeDrafts || !post.draft)
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

/** Memoised in production — see lib/content-cache.ts. */
export const getPosts = memoizeInProduction(loadPosts);

export async function getPost(slug: string): Promise<LoadedPost | null> {
  const all = await getPosts();
  return all.find((post) => post.slug === slug) ?? null;
}

export interface PostNeighbours {
  newer: LoadedPost | null;
  older: LoadedPost | null;
}

export async function getPostNeighbours(slug: string): Promise<PostNeighbours> {
  const all = await getPosts();
  const index = all.findIndex((post) => post.slug === slug);
  if (index === -1) return { newer: null, older: null };
  return { newer: all[index - 1] ?? null, older: all[index + 1] ?? null };
}

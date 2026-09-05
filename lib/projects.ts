import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import matter from "gray-matter";
import { z } from "zod";
import { memoizeInProduction } from "./content-cache";

const PROJECTS_DIR = join(process.cwd(), "content", "projects");

const includeDrafts =
  process.env.NODE_ENV === "development" || process.env.TECHENZO_INCLUDE_DRAFTS === "1";

export const PROJECT_CATEGORIES = [
  "ai",
  "saas",
  "developer-tool",
  "experiment",
] as const;
export type ProjectCategory = (typeof PROJECT_CATEGORIES)[number];

export const CATEGORY_LABEL: Record<ProjectCategory, string> = {
  ai: "AI",
  saas: "SaaS",
  "developer-tool": "Developer tool",
  experiment: "Experiment",
};

const projectSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  category: z.enum(PROJECT_CATEGORIES),
  technologies: z.array(z.string()).default([]),
  stack: z
    .array(z.object({ layer: z.string().min(1), items: z.array(z.string()).min(1) }))
    .default([]),
  githubUrl: z.string().optional(),
  demoUrl: z.string().optional(),
  image: z.string().optional(),
  featured: z.boolean().default(false),
  createdAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "createdAt must be YYYY-MM-DD"),
  draft: z.boolean().default(false),
});

export type ProjectFrontmatter = z.infer<typeof projectSchema>;

export interface LoadedProject extends ProjectFrontmatter {
  slug: string;
  body: string;
  year: string;
}

async function parseProject(filename: string): Promise<LoadedProject> {
  const slug = filename.replace(/\.mdx$/, "");
  const raw = await readFile(join(PROJECTS_DIR, filename), "utf8");
  const { data, content } = matter(raw);

  const parsed = projectSchema.safeParse(data);
  if (!parsed.success) {
    const issues = parsed.error.issues
      .map((issue) => `  ${issue.path.join(".") || "(root)"}: ${issue.message}`)
      .join("\n");
    throw new Error(`Invalid frontmatter in content/projects/${filename}:\n${issues}`);
  }

  // Projects are things we built — something a reader can look at. With neither
  // a repo nor a demo, the page is a claim rather than evidence, and it belongs
  // in /products as a work in progress instead.
  if (!parsed.data.githubUrl && !parsed.data.demoUrl) {
    throw new Error(
      `content/projects/${filename} has neither githubUrl nor demoUrl. ` +
        `A project needs something a reader can actually look at.`,
    );
  }

  return {
    ...parsed.data,
    slug,
    body: content,
    year: parsed.data.createdAt.slice(0, 4),
  };
}

async function loadProjects(): Promise<LoadedProject[]> {
  let filenames: string[];
  try {
    filenames = (await readdir(PROJECTS_DIR)).filter((f) => f.endsWith(".mdx"));
  } catch {
    return [];
  }

  const all = await Promise.all(filenames.map(parseProject));

  return all
    .filter((project) => includeDrafts || !project.draft)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

/** Memoised in production — see lib/content-cache.ts. */
export const getProjects = memoizeInProduction(loadProjects);

export async function getProject(slug: string): Promise<LoadedProject | null> {
  const all = await getProjects();
  return all.find((project) => project.slug === slug) ?? null;
}

export interface ProjectNeighbours {
  newer: LoadedProject | null;
  older: LoadedProject | null;
}

export async function getProjectNeighbours(slug: string): Promise<ProjectNeighbours> {
  const all = await getProjects();
  const index = all.findIndex((project) => project.slug === slug);
  if (index === -1) return { newer: null, older: null };
  return { newer: all[index - 1] ?? null, older: all[index + 1] ?? null };
}

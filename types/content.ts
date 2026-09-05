/**
 * Content models. V1 reads these from MDX frontmatter; the shapes are already
 * database-ready so introducing Postgres later is a loader swap, not a rewrite.
 */

export type ProductStatus = "idea" | "building" | "beta" | "launched" | "archived";

export interface Product {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  status: ProductStatus;
  featured: boolean;
  technologies: string[];
  url?: string;
  githubUrl?: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

export type ProjectCategory = "ai" | "saas" | "developer-tool" | "experiment";

export interface Project {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: ProjectCategory;
  technologies: string[];
  githubUrl?: string;
  demoUrl?: string;
  featured: boolean;
  createdAt: string;
}

export type ContentType = "article" | "build-log" | "experiment";

export interface Article {
  slug: string;
  title: string;
  description: string;
  type: ContentType;
  publishedAt: string;
  readingTime: number;
  tags: string[];
  author: string;
  featuredImage?: string;
}

export interface ExperimentResult {
  metric: string;
  value: string;
  /** Baseline comparison, when one exists. Omit rather than invent. */
  baseline?: string;
  direction?: "improvement" | "regression" | "neutral";
}

export interface Experiment {
  /** Sequential lab ID, e.g. EXP-004. Rendered in the accent colour. */
  id: string;
  slug: string;
  title: string;
  hypothesis: string;
  problem: string;
  methodology: string;
  /** The conditions line printed under every figure. Required — spec §8.14. */
  conditions: string;
  results: ExperimentResult[];
  conclusion: string;
  limitations: string;
  tags: string[];
  githubUrl?: string;
  publishedAt: string;
  readingTime: number;
}

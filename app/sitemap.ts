import type { MetadataRoute } from "next";
import { routes } from "@/config/routes";
import { site } from "@/config/site";
import { getExperiments } from "@/lib/content";
import { getProducts } from "@/lib/products";
import { getPosts } from "@/lib/writing";
import { getProjects } from "@/lib/projects";

/**
 * Static routes plus every published experiment.
 *
 * A sitemap that advertises thin or noindexed pages contradicts the robots
 * directive on those pages and wastes crawl budget, so nothing enters this list
 * until it has content: drafts are excluded by the loader, and /lab appears
 * only once at least one experiment is published — the same condition its own
 * robots tag uses, computed from the same source.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date();
  const experiments = (await getExperiments()).filter((e) => !e.draft);
  const products = (await getProducts()).filter((p) => !p.draft);
  const posts = (await getPosts()).filter((p) => !p.draft);
  const projects = (await getProjects()).filter((p) => !p.draft);
  const url = (path: string) => new URL(path, site.url).toString();

  const staticRoutes = routes
    .filter(
      (route) =>
        route.indexable ||
        (route.path === "/lab" && experiments.length > 0) ||
        (route.path === "/products" && products.length > 0) ||
        (route.path === "/writing" && posts.length > 0) ||
        (route.path === "/projects" && projects.length > 0),
    )
    .map((route) => ({
      url: url(route.path),
      lastModified,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    }));

  const experimentRoutes = experiments.map((experiment) => ({
    url: url(`/lab/${experiment.slug}`),
    lastModified: new Date(experiment.publishedAt),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const productRoutes = products.map((product) => ({
    url: url(`/products/${product.slug}`),
    lastModified,
    changeFrequency: "monthly" as const,
    priority: product.featured ? 0.9 : 0.7,
  }));

  const postRoutes = posts.map((post) => ({
    url: url(`/writing/${post.slug}`),
    lastModified: new Date(post.updatedAt ?? post.publishedAt),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const projectRoutes = projects.map((project) => ({
    url: url(`/projects/${project.slug}`),
    lastModified: new Date(project.createdAt),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [
    ...staticRoutes,
    ...experimentRoutes,
    ...productRoutes,
    ...postRoutes,
    ...projectRoutes,
  ];
}

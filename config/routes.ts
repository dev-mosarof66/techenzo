import { site } from "./site";

/**
 * Route registry — the single source for the sitemap, per-route metadata, and
 * the placeholder pages.
 *
 * `indexable` is the honest switch: a route stays out of the sitemap and
 * carries `noindex` until it has real content. Shipping thin placeholder pages
 * to the index costs crawl budget and buys nothing. Flip a route to `true` in
 * the same commit that gives it content.
 */
export interface RouteMeta {
  path: string;
  title: string;
  description: string;
  indexable: boolean;
  changeFrequency: "daily" | "weekly" | "monthly";
  priority: number;
}

export const routes: RouteMeta[] = [
  {
    path: "/",
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    indexable: true,
    changeFrequency: "weekly",
    priority: 1,
  },
  {
    path: "/products",
    title: "Products",
    description:
      "AI products built and shipped by Techenzo — what each one does, what it is built on, and where it stands.",
    indexable: false,
    changeFrequency: "weekly",
    priority: 0.9,
  },
  {
    path: "/projects",
    title: "Projects",
    description:
      "Things we built: AI systems, developer tools and experiments, with the repos behind them.",
    indexable: false,
    changeFrequency: "weekly",
    priority: 0.7,
  },
  {
    path: "/lab",
    title: "The Lab",
    description:
      "Experiments in AI engineering — hypothesis, method, results, and the repo that produced them.",
    indexable: false,
    changeFrequency: "weekly",
    priority: 0.9,
  },
  {
    path: "/writing",
    title: "Writing",
    description:
      "Articles, build logs and experiments on building with AI in production.",
    indexable: false,
    changeFrequency: "weekly",
    priority: 0.8,
  },
  {
    path: "/changelog",
    title: "Changelog",
    description:
      "Everything Techenzo has shipped, across every product, newest first.",
    // Flips on by itself once a published product has changelog entries.
    indexable: false,
    changeFrequency: "weekly",
    priority: 0.5,
  },
  {
    path: "/contact",
    title: "Contact",
    description:
      "Work with Techenzo, ask about a product, or point out something wrong on the site.",
    indexable: true,
    changeFrequency: "monthly",
    priority: 0.5,
  },
  {
    path: "/about",
    title: "About",
    description: `What Techenzo is, how we work, and the engineer behind it — ${site.founder.name}.`,
    // Real content, not a placeholder — it belongs in the index.
    indexable: true,
    changeFrequency: "monthly",
    priority: 0.6,
  },
];

export const routeByPath = (path: string): RouteMeta => {
  const match = routes.find((route) => route.path === path);
  if (!match) throw new Error(`No route registered for ${path}`);
  return match;
};

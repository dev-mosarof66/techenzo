/**
 * Content for /about. Kept out of the page component so it can be edited
 * without touching layout, and out of site.ts so that file stays about identity.
 *
 * The principles below are the ones in docs/ui-ux-spec.md §1.2, restated for a
 * reader rather than for a developer. If they change there, change them here —
 * a public claim about how we work that the codebase does not follow is worse
 * than not making the claim.
 */

export const positioning = [
  "Techenzo is an engineering studio building AI products in the open.",
  "We ship things people use, run the experiments that decide how they are built, and publish the measurements — including the ones that did not go our way.",
  "The work is the argument. Everything on this site is meant to be checkable.",
];

export const whatWeDo = [
  {
    title: "Products",
    body: "AI systems people use daily. Each one gets a page saying what problem it solves, what it is built on, and where it honestly stands.",
    href: "/products",
    linkLabel: "See products",
  },
  {
    title: "Research",
    body: "Benchmarks and experiments against real workloads. Hypothesis, method, numbers, limitations, and the repo that produced them.",
    href: "/lab",
    linkLabel: "Read the Lab",
  },
  {
    title: "Writing",
    body: "Articles, build logs and notes on building with AI in production — what worked, what cost more than expected, and what we would do differently.",
    href: "/writing",
    linkLabel: "Read the writing",
  },
];

export const principles = [
  {
    title: "Evidence over adjectives",
    body: "Every claim gets a number, a screenshot, or a repo link. If a sentence cannot be backed by one of those, it does not ship.",
  },
  {
    title: "Publish the method, not just the result",
    body: "A number without its conditions is decoration. Every figure states its hardware, versions, dataset and sample size.",
  },
  {
    title: "Report what did not work",
    body: "A result that contradicts the hypothesis is a finding. Experiments here state their limitations because an experiment without stated limits is marketing.",
  },
  {
    title: "Ship small, ship real",
    body: "A working product with three features beats a roadmap with twelve. Status is stated plainly — idea, building, beta, live — and never inflated.",
  },
  {
    title: "Build in the open",
    body: "Repos where it makes sense, and enough detail that someone can disagree with us using their own data.",
  },
  {
    title: "Fast is a feature",
    body: "Pages are measured against a budget, not a vibe. If a section costs more than it earns, it gets cut.",
  },
];

export const stack = [
  { layer: "Frontend", items: ["Next.js", "TypeScript", "React", "Tailwind CSS"] },
  { layer: "Content", items: ["MDX", "Zod", "Shiki"] },
  { layer: "Data", items: ["PostgreSQL", "pgvector", "Drizzle"] },
  { layer: "AI", items: ["Claude API", "Embeddings", "Vector search", "Evals"] },
  { layer: "Infra", items: ["Edge CDN", "CI on every push"] },
];

import { config, collection, fields } from "@keystatic/core";

/**
 * Keystatic — an editing UI over the same MDX files the site already reads.
 *
 * Nothing downstream changes: files land in `content/`, the zod loaders still
 * validate them at build time, drafts still stay on localhost, and git history
 * is still the record. This is a nicer way to write the files, not a new source
 * of truth.
 *
 * ⚠ These field definitions must stay in step with the zod schemas in
 * `lib/*.ts`. Keystatic shapes the frontmatter; zod is what actually enforces
 * it. Where the two disagree, zod wins and the build fails — which is the right
 * way round, but it means adding a required field here without adding it there
 * (or vice versa) produces a file the CMS accepted and the build rejects.
 */

const draft = fields.checkbox({
  label: "Draft",
  description: "Visible on localhost only. Excluded from the build, sitemap and feed.",
  defaultValue: true,
});

const tags = fields.array(fields.text({ label: "Tag" }), {
  label: "Tags",
  itemLabel: (props) => props.value,
});

export default config({
  // Local storage writes straight to the working tree — the right mode while
  // this runs on your machine. Switching to GitHub storage (so you can edit
  // from anywhere) is a change to this one object; see docs/authoring.md.
  storage: { kind: "local" },

  ui: {
    brand: { name: "Techenzo" },
    navigation: {
      Content: ["experiments", "writing", "products", "projects"],
    },
  },

  collections: {
    experiments: collection({
      label: "Experiments (Lab)",
      path: "content/experiments/*",
      slugField: "title",
      format: { contentField: "body" },
      entryLayout: "content",
      schema: {
        title: fields.slug({
          name: { label: "Title" },
          slug: { description: "Becomes the URL: /lab/<slug>" },
        }),
        id: fields.text({
          label: "Experiment ID",
          description: "EXP-004 — three digits, sequential.",
          validation: { pattern: { regex: /^EXP-\d{3}$/, message: "Must look like EXP-004" } },
        }),
        description: fields.text({
          label: "Description",
          description: "One line. Used in search results and the share card.",
          multiline: true,
        }),
        hypothesis: fields.text({
          label: "Hypothesis",
          description: "Written before the first run.",
          multiline: true,
        }),
        conditions: fields.text({
          label: "Conditions",
          description: "Hardware, versions, dataset, n. Printed under every figure.",
          multiline: true,
        }),
        publishedAt: fields.date({ label: "Published", validation: { isRequired: true } }),
        tags,
        githubUrl: fields.url({ label: "Repo URL" }),
        results: fields.array(
          fields.object({
            metric: fields.text({ label: "Metric" }),
            value: fields.text({ label: "Value" }),
            baseline: fields.text({ label: "Baseline" }),
            direction: fields.select({
              label: "Is this good news?",
              options: [
                { label: "Improvement", value: "improvement" },
                { label: "Regression", value: "regression" },
                { label: "No significant change", value: "neutral" },
              ],
              defaultValue: "neutral",
            }),
            change: fields.select({
              label: "Which way did the number move?",
              options: [
                { label: "Up", value: "up" },
                { label: "Down", value: "down" },
              ],
              defaultValue: "down",
            }),
          }),
          { label: "Headline results", itemLabel: (props) => props.fields.metric.value },
        ),
        draft,
        body: fields.mdx({
          label: "Body",
          description: 'Must contain a "## Limitations" section or the build fails.',
        }),
      },
    }),

    writing: collection({
      label: "Writing",
      path: "content/writing/*",
      slugField: "title",
      format: { contentField: "body" },
      entryLayout: "content",
      schema: {
        title: fields.slug({ name: { label: "Title" } }),
        description: fields.text({ label: "Description", multiline: true }),
        type: fields.select({
          label: "Type",
          description: "Article is argued and finished; a build log is dated and provisional.",
          options: [
            { label: "Article", value: "article" },
            { label: "Build log", value: "build-log" },
            { label: "Note", value: "note" },
          ],
          defaultValue: "article",
        }),
        publishedAt: fields.date({ label: "Published", validation: { isRequired: true } }),
        updatedAt: fields.date({ label: "Updated" }),
        tags,
        experiment: fields.text({
          label: "Related experiment slug",
          description: "Adds a cross-link to /lab/<slug> at the foot of the piece.",
        }),
        draft,
        body: fields.mdx({ label: "Body" }),
      },
    }),

    products: collection({
      label: "Products",
      path: "content/products/*",
      slugField: "name",
      format: { contentField: "body" },
      entryLayout: "content",
      schema: {
        name: fields.slug({ name: { label: "Name" } }),
        tagline: fields.text({ label: "Tagline", multiline: true }),
        description: fields.text({ label: "Description", multiline: true }),
        status: fields.select({
          label: "Status",
          description: 'Marking this "Live" requires a URL or repo — the build enforces it.',
          options: [
            { label: "Idea", value: "idea" },
            { label: "Building", value: "building" },
            { label: "Beta", value: "beta" },
            { label: "Live", value: "launched" },
            { label: "Archived", value: "archived" },
          ],
          defaultValue: "idea",
        }),
        featured: fields.checkbox({
          label: "Featured",
          description: "Exactly one product may be featured. Two will fail the build.",
          defaultValue: false,
        }),
        category: fields.text({ label: "Category" }),
        problem: fields.text({ label: "Problem (one line, homepage)", multiline: true }),
        solution: fields.text({ label: "Solution (one line, homepage)", multiline: true }),
        startedAt: fields.text({
          label: "Started",
          description: "YYYY-MM",
          validation: { pattern: { regex: /^\d{4}-\d{2}$/, message: "Use YYYY-MM" } },
        }),
        technologies: fields.array(fields.text({ label: "Technology" }), {
          label: "Technologies",
          itemLabel: (props) => props.value,
        }),
        url: fields.url({ label: "Live URL" }),
        githubUrl: fields.url({ label: "Repo URL" }),
        version: fields.text({ label: "Version" }),
        license: fields.text({ label: "Licence" }),
        draft,
        body: fields.mdx({ label: "Body" }),
      },
    }),

    projects: collection({
      label: "Projects",
      path: "content/projects/*",
      slugField: "title",
      format: { contentField: "body" },
      entryLayout: "content",
      schema: {
        title: fields.slug({ name: { label: "Title" } }),
        description: fields.text({ label: "Description", multiline: true }),
        category: fields.select({
          label: "Category",
          options: [
            { label: "AI", value: "ai" },
            { label: "SaaS", value: "saas" },
            { label: "Developer tool", value: "developer-tool" },
            { label: "Experiment", value: "experiment" },
          ],
          defaultValue: "ai",
        }),
        createdAt: fields.date({ label: "Created", validation: { isRequired: true } }),
        technologies: fields.array(fields.text({ label: "Technology" }), {
          label: "Technologies",
          itemLabel: (props) => props.value,
        }),
        githubUrl: fields.url({
          label: "Repo URL",
          description: "A project needs a repo or a demo — the build enforces it.",
        }),
        demoUrl: fields.url({ label: "Demo URL" }),
        draft,
        body: fields.mdx({ label: "Body" }),
      },
    }),
  },
});

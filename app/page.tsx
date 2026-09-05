import { Boxes, FlaskConical, Wrench } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { SectionHeader } from "@/components/layout/section-header";
import { ButtonLink } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { site } from "@/config/site";
import { getExperiments } from "@/lib/content";
import { getFeaturedProduct } from "@/lib/products";
import { FeaturedProduct } from "@/components/products/featured-product";
import { FounderBlock } from "@/components/founder/founder-block";
import { NewsletterForm } from "@/components/forms/newsletter-form";
import { getPosts } from "@/lib/writing";
import { ArticleCard } from "@/components/writing/article-card";
import { getProjects } from "@/lib/projects";
import { ProjectCard } from "@/components/projects/project-card";
import { ExperimentRow } from "@/components/lab/experiment-row";
import { JsonLd } from "@/components/seo/json-ld";
import { organizationJsonLd, pageMetadata, websiteJsonLd } from "@/lib/seo";
import type { Metadata } from "next";

const WHAT_WE_BUILD = [
  {
    icon: Boxes,
    title: "AI Products",
    body: "Systems people use daily — retrieval, agents, and the unglamorous plumbing that keeps them answering correctly.",
  },
  {
    icon: Wrench,
    title: "Developer Tools",
    body: "Small, sharp tools that remove a specific friction from building with models, and do nothing else.",
  },
  {
    icon: FlaskConical,
    title: "Applied Research",
    body: "Benchmarks and experiments run against real workloads, published with the method and the repo.",
  },
];

export const metadata: Metadata = pageMetadata("/");

export default async function HomePage() {
  // Counts are derived from published content, never hand-written — and a zero
  // clause is omitted rather than printed as "0" (spec §9.1).
  const experiments = await getExperiments();
  const published = experiments.filter((e) => !e.draft);
  const latest = experiments.slice(0, 3);
  const featured = await getFeaturedProduct();
  const posts = (await getPosts()).slice(0, 4);
  const projects = (await getProjects()).slice(0, 3);

  const stats = [
    published.length > 0 ? `${published.length} experiments` : null,
    "open source",
  ].filter(Boolean) as string[];

  return (
    <>
      <JsonLd data={organizationJsonLd()} />
      <JsonLd data={websiteJsonLd()} />

      {/* 00 · Hero — one of three permitted grid-field placements (§5.2c) */}
      <div className="grid-field flex items-center py-24 lg:min-h-[82vh] lg:py-32">
        <Container>
          <p className="t-kicker mb-6 text-accent">Building · Shipping · Measuring</p>

          <h1 className="t-display-1 max-w-[14ch]">
            Building real
            <br />
            products with AI.
          </h1>

          <p className="t-body-lg mt-6 max-w-[56ch] text-ink-2">{site.description}</p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/products" variant="primary" size="lg">
              Explore products
            </ButtonLink>
            <ButtonLink href="/lab" variant="secondary" size="lg">
              Read the Lab →
            </ButtonLink>
          </div>

          {stats.length > 0 ? (
            <p className="t-mono-sm mt-14 flex flex-wrap items-center gap-x-3 gap-y-1 text-ink-3">
              {stats.map((stat, index) => (
                <span key={stat} className="flex items-center gap-3">
                  {index > 0 ? <span aria-hidden="true">·</span> : null}
                  {stat}
                </span>
              ))}
            </p>
          ) : null}
        </Container>
      </div>

      {/* 01 · What we build — hairline columns, no cards */}
      <Section id="what-we-build">
        <SectionHeader
          index="01"
          label="What we build"
          title="Three kinds of work, one standard of evidence."
        />
        <div className="grid grid-cols-1 gap-px overflow-hidden border-y border-line bg-line md:grid-cols-3">
          {WHAT_WE_BUILD.map(({ icon: Icon, title, body }) => (
            <div key={title} className="bg-canvas px-0 py-8 md:px-8 md:first:pl-0">
              <Icon
                size={20}
                strokeWidth={1.5}
                aria-hidden="true"
                className="text-accent"
              />
              <h3 className="t-h4 mt-4">{title}</h3>
              <p className="t-body-sm mt-2 max-w-[40ch] text-ink-2">{body}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* 02 · Featured product — omitted entirely when there is nothing to show,
          rather than rendering a section with a placeholder in it. */}
      {featured ? (
        <Section id="featured-product">
          <SectionHeader
            index="02"
            label="Featured product"
            action={{ label: "All products", href: "/products" }}
          />
          <FeaturedProduct product={featured} />
        </Section>
      ) : null}

      {/* 03 · Engineering Lab — the differentiator. Honest until it has content. */}
      <Section id="lab">
        <SectionHeader
          index="03"
          label="Engineering Lab"
          title="Experiments, benchmarks, and what they actually proved."
          intro="Each experiment ships with a hypothesis, a method, the numbers, and the repo that produced them."
          action={{ label: "All experiments", href: "/lab" }}
        />
        {latest.length > 0 ? (
          <div className="border-t border-line">
            {latest.map((experiment) => (
              <ExperimentRow key={experiment.slug} experiment={experiment} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No experiments published yet."
            body="The first benchmark lands with the RAG pipeline writeup."
            action={
              <ButtonLink href="/lab" variant="secondary" size="sm">
                Get notified
              </ButtonLink>
            }
          />
        )}
      </Section>

      {/* 04 · Selected projects */}
      {projects.length > 0 ? (
        <Section id="projects">
          <SectionHeader
            index="04"
            label="Selected projects"
            title="Smaller than products, sharper in scope."
            action={{ label: "All projects", href: "/projects" }}
          />
          <div className="grid grid-cols-1 border-l border-t border-line md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
        </Section>
      ) : null}

      {/* 05 · Latest from Techenzo */}
      {posts.length > 0 ? (
        <Section id="latest">
          <SectionHeader
            index="05"
            label="Latest from Techenzo"
            title="Articles, build logs and notes."
            action={{ label: "All writing", href: "/writing" }}
          />
          <div className="border-t border-line">
            {posts.map((post) => (
              <ArticleCard key={post.slug} post={post} />
            ))}
          </div>
        </Section>
      ) : null}

      {/* 05 · Behind Techenzo.
          Now 06, matching the spec: with projects and writing in front of it,
          the sequence on the page and the sequence in the spec agree. The index
          counts what is actually here, so it moves on its own. */}
      <Section id="founder">
        <SectionHeader index="06" label="Behind Techenzo" />
        <FounderBlock />
      </Section>

      {/* 07 · Follow the build */}
      <Section id="follow" surface="sunken">
        <SectionHeader index="07" label="Follow the build" title="Build something real." />
        <NewsletterForm variant="block" />
      </Section>
    </>
  );
}

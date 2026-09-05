import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { Container } from "@/components/layout/container";
import { MdxContent } from "@/components/mdx/mdx-content";
import { MetricBlock } from "@/components/ui/metric-block";
import { BarChart, type BarChartProps } from "@/components/charts/bar-chart";
import { TableOfContents } from "@/components/lab/table-of-contents";
import { ReadingProgress } from "@/components/lab/reading-progress";
import { ExperimentNav } from "@/components/lab/experiment-nav";
import { ButtonLink } from "@/components/ui/button";
import { JsonLd } from "@/components/seo/json-ld";
import {
  getExperiment,
  getExperimentNeighbours,
  getExperiments,
} from "@/lib/content";
import { site } from "@/config/site";

type Params = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const experiments = await getExperiments();
  return experiments.map((experiment) => ({ slug: experiment.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const experiment = await getExperiment(slug);
  if (!experiment) return {};

  return {
    title: experiment.title,
    description: experiment.description,
    alternates: { canonical: `/lab/${slug}` },
    // A draft is reachable by URL in development but must never be indexed.
    robots: experiment.draft ? { index: false, follow: false } : undefined,
    openGraph: {
      type: "article",
      url: `/lab/${slug}`,
      siteName: site.name,
      title: experiment.title,
      description: experiment.description,
      publishedTime: experiment.publishedAt,
      authors: [site.founder.name],
      tags: [...experiment.tags],
    },
    twitter: {
      card: "summary_large_image",
      title: experiment.title,
      description: experiment.description,
    },
  };
}

export default async function ExperimentPage({ params }: Params) {
  const { slug } = await params;
  const experiment = await getExperiment(slug);
  if (!experiment) notFound();

  const neighbours = await getExperimentNeighbours(slug);

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: experiment.title,
    description: experiment.description,
    datePublished: experiment.publishedAt,
    author: { "@type": "Person", name: site.founder.name },
    publisher: { "@type": "Organization", name: site.name, url: site.url },
    mainEntityOfPage: `${site.url}/lab/${slug}`,
    keywords: experiment.tags.join(", "),
  };

  return (
    <>
      {!experiment.draft ? <JsonLd data={articleJsonLd} /> : null}
      <ReadingProgress targetId="experiment" />

      <article id="experiment">
        {/* Header */}
        <Container className="pt-14 lg:pt-20">
          <Link
            href="/lab"
            className="link-draw t-mono-sm inline-flex items-center gap-2 text-ink-3 hover:text-ink"
          >
            <ArrowLeft size={14} strokeWidth={1.5} aria-hidden="true" />
            The Lab
          </Link>

          <div className="t-mono-sm mt-8 flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <span className="text-accent">{experiment.id}</span>
            <time dateTime={experiment.publishedAt} className="text-ink-3">
              {experiment.publishedAt}
            </time>
            <span className="text-ink-3">{experiment.readingMinutes} min read</span>
            {experiment.draft ? (
              <span className="rounded-full border border-status-building/30 bg-status-building/10 px-2 text-status-building">
                Draft — not published
              </span>
            ) : null}
          </div>

          <h1 className="t-h1 measure-prose mt-4">{experiment.title}</h1>

          {/* Hypothesis leads, because that is what the experiment tested */}
          <aside className="measure-prose mt-8 border-l-2 border-accent py-1 pl-5">
            <p className="t-kicker mb-2 text-accent">Hypothesis</p>
            <p className="t-body-lg text-ink-2">{experiment.hypothesis}</p>
          </aside>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            {experiment.githubUrl ? (
              <ButtonLink href={experiment.githubUrl} size="sm" external>
                Repo
              </ButtonLink>
            ) : null}
            <p className="t-mono-sm text-ink-3">{experiment.tags.join(" · ")}</p>
          </div>
        </Container>

        {/* Body */}
        <Container className="pt-14">
          <div className="grid grid-cols-1 gap-12 xl:grid-cols-[210px_minmax(0,1fr)] xl:gap-16">
            <div className="hidden xl:block">
              <TableOfContents headings={experiment.headings} />
            </div>

            <div className="prose measure-prose">
              <MdxContent
                source={experiment.body}
                extra={{
                  // Bound to this experiment's frontmatter, so the numbers in
                  // the body and the numbers in the index can never disagree.
                  Metrics: () => <MetricBlock results={experiment.results} />,
                  // Conditions come from frontmatter, not from the author's
                  // memory — a figure cannot be published without its method.
                  Chart: ({ id }: { id: string }) => {
                    const chart = experiment.charts.find((c) => c.id === id);
                    if (!chart) {
                      throw new Error(
                        `<Chart id="${id}" /> has no matching entry in this experiment's charts[] frontmatter.`,
                      );
                    }
                    return <BarChart {...chart} conditions={experiment.conditions} />;
                  },
                }}
              />

              <p className="t-mono-sm mt-12 border-t border-line pt-5 text-ink-3">
                <span className="text-ink-3">Conditions — </span>
                {experiment.conditions}
              </p>

              {experiment.githubUrl ? (
                <p className="t-mono-sm mt-3 text-ink-3">
                  <a
                    href={experiment.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-draw inline-flex items-center gap-1 text-accent"
                  >
                    Reproduce this experiment
                    <ArrowUpRight size={13} strokeWidth={1.5} aria-hidden="true" />
                  </a>
                </p>
              ) : null}
            </div>
          </div>
        </Container>
      </article>

      {/* Outside the article on purpose: reading progress should reach 100% at
          the end of the experiment, not after the navigation below it. */}
      <Container className="pb-24">
        <ExperimentNav {...neighbours} />
      </Container>
    </>
  );
}

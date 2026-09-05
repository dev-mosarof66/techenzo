import type { Metadata } from "next";
import { PageHero } from "@/components/layout/page-hero";
import { Section } from "@/components/layout/section";
import { ButtonLink } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { FilterRow, type FilterOption } from "@/components/ui/filter-row";
import { Pagination, paginate, resolvePage } from "@/components/ui/pagination";
import { ExperimentRow } from "@/components/lab/experiment-row";
import { getExperiments } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

type Props = {
  searchParams: Promise<{ tag?: string | string[]; page?: string | string[] }>;
};

/** A tag arriving from the URL is untrusted input — match it, never trust it. */
function resolveTag(raw: string | string[] | undefined, tags: string[]) {
  const candidate = Array.isArray(raw) ? raw[0] : raw;
  if (!candidate) return null;
  return tags.find((tag) => tag.toLowerCase() === candidate.toLowerCase()) ?? null;
}

/**
 * The Lab enters the index the moment it has something in it, and not before.
 * No flag to remember to flip: publish an experiment and this page plus its
 * detail route become indexable and join the sitemap automatically.
 *
 * Filtered views are a different matter — they are the same experiments in a
 * different order, so they stay out of the index and point their canonical at
 * the unfiltered page rather than competing with it.
 */
export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const experiments = await getExperiments();
  const published = experiments.filter((e) => !e.draft);
  const tag = resolveTag(
    (await searchParams).tag,
    [...new Set(experiments.flatMap((e) => e.tags))],
  );

  if (tag) {
    return pageMetadata("/lab", {
      title: `${tag} experiments`,
      description: `Techenzo experiments tagged ${tag} — hypothesis, method, results and repo.`,
      alternates: { canonical: "/lab" },
      robots: { index: false, follow: true },
    });
  }

  return pageMetadata("/lab", {
    robots:
      published.length > 0 ? { index: true, follow: true } : { index: false, follow: true },
  });
}

const METHOD = [
  "Every experiment starts from a hypothesis written before the first run.",
  "Conditions are stated on every figure — hardware, versions, dataset, n.",
  "Results are p95 unless said otherwise. Means hide the requests users notice.",
  "Limitations are mandatory. An experiment without stated limits is marketing.",
];

export default async function LabPage({ searchParams }: Props) {
  const experiments = await getExperiments();
  const published = experiments.filter((e) => !e.draft);

  // Tags come from the content, in use order — never a hand-maintained list
  // that can drift from what has actually been published.
  const tags = [...new Set(experiments.flatMap((e) => e.tags))].sort();
  const activeTag = resolveTag((await searchParams).tag, tags);

  const visible = activeTag
    ? experiments.filter((e) => e.tags.includes(activeTag))
    : experiments;

  const params = await searchParams;
  const page = paginate(visible, resolvePage(params.page));

  const options: FilterOption[] = [
    {
      label: "All",
      href: "/lab",
      active: activeTag === null,
      count: experiments.length,
    },
    ...tags.map((tag) => ({
      label: tag,
      href: `/lab?tag=${encodeURIComponent(tag)}`,
      active: activeTag === tag,
      count: experiments.filter((e) => e.tags.includes(tag)).length,
    })),
  ];

  return (
    <>
      {/* One of three permitted grid-field placements — spec §5.2c */}
      <div className="grid-field">
        <PageHero
          title="The Lab"
          intro="Experiments in AI engineering. Every one ships with a hypothesis, a method, the numbers, and the repo that produced them."
          meta={
            published.length > 0
              ? `${published.length} published · ${tags.length} tags`
              : undefined
          }
        />
      </div>

      <Section>
        <h2 className="sr-only">Experiments</h2>
        <div className="grid grid-cols-1 gap-12 xl:grid-cols-[1fr_240px] xl:gap-16">
          <div>
            <FilterRow options={options} label="Filter experiments by tag" />

            {visible.length > 0 ? (
              <>
                <div className="border-t border-line">
                  {page.items.map((experiment) => (
                    <ExperimentRow key={experiment.slug} experiment={experiment} />
                  ))}
                </div>
                {activeTag ? (
                  <p className="t-mono-sm mt-6 text-ink-3">
                    {visible.length} tagged {activeTag}.{" "}
                    <a href="/lab" className="link-draw text-accent">
                      Show all
                    </a>
                  </p>
                ) : null}
                <Pagination
                  {...page}
                  label="Pagination"
                  hrefFor={(n: number) =>
                    `/lab?${new URLSearchParams({
                      ...(activeTag ? { tag: activeTag } : {}),
                      ...(n > 1 ? { page: String(n) } : {}),
                    })}`.replace(/\?$/, "")
                  }
                />
              </>
            ) : activeTag ? (
              <EmptyState
                title={`Nothing tagged ${activeTag} yet.`}
                body="That tag exists on an experiment that is not published."
                action={
                  <ButtonLink href="/lab" variant="secondary" size="sm">
                    Show all experiments
                  </ButtonLink>
                }
              />
            ) : (
              <EmptyState
                title="No experiments published yet."
                body="The first benchmark lands with the RAG pipeline writeup."
                action={
                  <ButtonLink href="/about" variant="secondary" size="sm">
                    Get notified
                  </ButtonLink>
                }
              />
            )}
          </div>

          {/* Why the numbers are trustworthy — spec §9.5 */}
          <div className="hidden xl:block">
            <div className="sticky top-24">
              <p className="t-kicker mb-4 text-ink-3">Method</p>
              <ol className="flex flex-col gap-4">
                {METHOD.map((rule, index) => (
                  <li key={rule} className="t-mono-sm flex gap-3 text-ink-3">
                    <span className="text-accent tabular-nums">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span>{rule}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}

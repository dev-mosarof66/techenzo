import type { Metadata } from "next";
import { PageHero } from "@/components/layout/page-hero";
import { Section } from "@/components/layout/section";
import { ButtonLink } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { FilterRow, type FilterOption } from "@/components/ui/filter-row";
import { ArticleCard } from "@/components/writing/article-card";
import {
  CONTENT_TYPES,
  TYPE_PLURAL,
  getPosts,
  type ContentType,
} from "@/lib/writing";
import { pageMetadata } from "@/lib/seo";

type Props = { searchParams: Promise<{ type?: string | string[] }> };

function resolveType(raw: string | string[] | undefined): ContentType | null {
  const candidate = Array.isArray(raw) ? raw[0] : raw;
  if (!candidate) return null;
  return CONTENT_TYPES.find((type) => type === candidate.toLowerCase()) ?? null;
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const published = (await getPosts()).filter((p) => !p.draft);
  const type = resolveType((await searchParams).type);

  if (type) {
    return pageMetadata("/writing", {
      title: TYPE_PLURAL[type],
      description: `${TYPE_PLURAL[type]} from Techenzo on building with AI in production.`,
      alternates: { canonical: "/writing" },
      robots: { index: false, follow: true },
    });
  }

  return pageMetadata("/writing", {
    robots:
      published.length > 0 ? { index: true, follow: true } : { index: false, follow: true },
  });
}

export default async function WritingPage({ searchParams }: Props) {
  const posts = await getPosts();
  const published = posts.filter((p) => !p.draft);
  const activeType = resolveType((await searchParams).type);

  const visible = activeType ? posts.filter((post) => post.type === activeType) : posts;

  // Only offer types that exist — a filter with nothing behind it is a dead end.
  const present = CONTENT_TYPES.filter((type) => posts.some((post) => post.type === type));

  const options: FilterOption[] = [
    { label: "All", href: "/writing", active: activeType === null, count: posts.length },
    ...present.map((type) => ({
      label: TYPE_PLURAL[type],
      href: `/writing?type=${type}`,
      active: activeType === type,
      count: posts.filter((post) => post.type === type).length,
    })),
  ];

  const tags = [...new Set(posts.flatMap((p) => p.tags))].sort().slice(0, 12);

  return (
    <>
      <PageHero
        title="Writing"
        intro="Articles, build logs and notes — what we learned building with AI in production, including the parts that did not work."
        meta={
          published.length > 0
            ? `${published.length} ${published.length === 1 ? "piece" : "pieces"}`
            : undefined
        }
      />

      <Section>
        <h2 className="sr-only">Writing</h2>
        <div className="grid grid-cols-1 gap-12 xl:grid-cols-[1fr_240px] xl:gap-16">
          <div>
            <FilterRow options={options} label="Filter writing by type" />

            {visible.length > 0 ? (
              <div className="border-t border-line">
                {visible.map((post, index) => (
                  <ArticleCard
                    key={post.slug}
                    post={post}
                    featured={index === 0 && !activeType}
                  />
                ))}
              </div>
            ) : activeType ? (
              <EmptyState
                title={`No ${TYPE_PLURAL[activeType].toLowerCase()} yet.`}
                body="Everything else is listed under All."
                action={
                  <ButtonLink href="/writing" variant="secondary" size="sm">
                    Show everything
                  </ButtonLink>
                }
              />
            ) : (
              <EmptyState
                title="Nothing published yet."
                body="The first article covers what a production RAG pipeline actually costs to run."
                action={
                  <ButtonLink href="/lab" variant="secondary" size="sm">
                    Read the Lab
                  </ButtonLink>
                }
              />
            )}
          </div>

          <div className="hidden xl:block">
            <div className="sticky top-24 flex flex-col gap-10">
              <div>
                <p className="t-kicker mb-4 text-ink-3">The three types</p>
                <dl className="flex flex-col gap-4">
                  <div>
                    <dt className="t-mono-sm text-ink">Article</dt>
                    <dd className="t-body-sm mt-1 text-ink-3">
                      Argued and finished. Meant to still be true next year.
                    </dd>
                  </div>
                  <div>
                    <dt className="t-mono-sm text-ink">Build log</dt>
                    <dd className="t-body-sm mt-1 text-ink-3">
                      Dated and provisional. What happened, while it was happening.
                    </dd>
                  </div>
                  <div>
                    <dt className="t-mono-sm text-ink">Note</dt>
                    <dd className="t-body-sm mt-1 text-ink-3">
                      One idea, short, no preamble.
                    </dd>
                  </div>
                </dl>
              </div>

              {tags.length > 0 ? (
                <div>
                  <p className="t-kicker mb-4 text-ink-3">Tags</p>
                  <p className="t-mono-sm text-ink-3">{tags.join(" · ")}</p>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}

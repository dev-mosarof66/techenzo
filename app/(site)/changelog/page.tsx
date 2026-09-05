import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/layout/page-hero";
import { Section } from "@/components/layout/section";
import { ButtonLink } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { getProducts } from "@/lib/products";
import { pageMetadata } from "@/lib/seo";

/**
 * Everything that shipped, across every product, newest first.
 *
 * There is no separate changelog file: entries are read from each product's
 * `changelog` frontmatter, the same data its own page renders. A site-wide
 * changelog kept by hand drifts from the product pages within a month.
 */
async function getEntries() {
  const products = await getProducts();

  return products
    .flatMap((product) =>
      product.changelog.map((entry) => ({
        ...entry,
        product: product.name,
        slug: product.slug,
        draft: product.draft,
      })),
    )
    .sort((a, b) => b.date.localeCompare(a.date));
}

export async function generateMetadata(): Promise<Metadata> {
  const published = (await getEntries()).filter((entry) => !entry.draft);

  return pageMetadata("/changelog", {
    robots:
      published.length > 0 ? { index: true, follow: true } : { index: false, follow: true },
  });
}

export default async function ChangelogPage() {
  const entries = await getEntries();

  return (
    <>
      <PageHero
        title="Changelog"
        intro="Everything that shipped, across every product, newest first."
        meta={
          entries.length > 0
            ? `${entries.length} ${entries.length === 1 ? "entry" : "entries"}`
            : undefined
        }
      />

      <Section>
        <h2 className="sr-only">Entries</h2>

        {entries.length > 0 ? (
          <ol className="border-t border-line">
            {entries.map((entry) => (
              <li
                key={`${entry.slug}-${entry.date}-${entry.text}`}
                className="flex flex-col gap-2 border-b border-line py-5 sm:flex-row sm:gap-8"
              >
                <time
                  dateTime={entry.date}
                  className="t-mono-sm w-28 shrink-0 tabular-nums text-ink-3"
                >
                  {entry.date}
                </time>
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/products/${entry.slug}`}
                    className="link-draw t-mono-sm text-accent"
                  >
                    {entry.product}
                  </Link>
                  <p className="t-body-sm mt-1 text-ink-2">{entry.text}</p>
                </div>
              </li>
            ))}
          </ol>
        ) : (
          <EmptyState
            title="Nothing shipped yet."
            body="Entries appear here as products publish them — this page reads from each product's own changelog rather than keeping a second copy."
            action={
              <ButtonLink href="/products" variant="secondary" size="sm">
                See products
              </ButtonLink>
            }
          />
        )}
      </Section>
    </>
  );
}

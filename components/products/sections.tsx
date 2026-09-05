import type { LoadedProduct } from "@/lib/products";

/**
 * Product detail sections — spec §9.3 items 5, 7 and 9.
 * Each returns null when it has nothing to show, so a young product's page is
 * short and honest rather than padded with empty headings.
 */

function SectionLabel({ children }: { children: string }) {
  return (
    <h2 className="t-kicker mb-6 border-b border-line pb-3 text-ink-3">{children}</h2>
  );
}

/** Hairline grid, capped at six by the loader. */
export function FeatureGrid({ features }: { features: LoadedProduct["features"] }) {
  if (features.length === 0) return null;

  return (
    <section className="my-12">
      <SectionLabel>Features</SectionLabel>
      <div className="grid grid-cols-1 gap-px bg-line sm:grid-cols-2">
        {features.map((feature) => (
          <div key={feature.title} className="bg-canvas py-6 sm:px-6 sm:first:pl-0">
            <h3 className="t-h4">{feature.title}</h3>
            <p className="t-body-sm mt-2 text-ink-2">{feature.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/** Grouped by layer, so "what is this built on" is answerable at a glance. */
export function StackList({ stack }: { stack: LoadedProduct["stack"] }) {
  if (stack.length === 0) return null;

  return (
    <section className="my-12">
      <SectionLabel>Stack</SectionLabel>
      <dl className="border-t border-line">
        {stack.map((group) => (
          <div
            key={group.layer}
            className="flex flex-col gap-1 border-b border-line py-4 sm:flex-row sm:gap-8"
          >
            <dt className="t-mono-sm w-32 shrink-0 text-ink-3">{group.layer}</dt>
            <dd className="t-mono-sm m-0 text-ink">{group.items.join(" · ")}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export function ChangelogList({
  changelog,
  limit = 5,
}: {
  changelog: LoadedProduct["changelog"];
  limit?: number;
}) {
  if (changelog.length === 0) return null;

  const entries = [...changelog]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, limit);

  return (
    <section className="my-12">
      <SectionLabel>Changelog</SectionLabel>
      <ol className="border-t border-line">
        {entries.map((entry) => (
          <li
            key={`${entry.date}-${entry.text}`}
            className="flex flex-col gap-1 border-b border-line py-4 sm:flex-row sm:gap-8"
          >
            <time dateTime={entry.date} className="t-mono-sm w-32 shrink-0 text-ink-3">
              {entry.date}
            </time>
            <span className="t-body-sm text-ink-2">{entry.text}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}

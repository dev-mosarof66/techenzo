import type { Heading } from "@/lib/content";

/**
 * Margin contents for an experiment — spec §9.6. Sticky, ≥1280 only, and
 * numbered because an experiment's sections genuinely are a sequence:
 * problem → method → results → limitations is the order the argument is made,
 * not decoration.
 *
 * Server-rendered and CSS-sticky, so it costs no JavaScript. Active-section
 * tracking would need an IntersectionObserver; it is not worth a client
 * boundary here yet.
 */
export function TableOfContents({ headings }: { headings: Heading[] }) {
  if (headings.length < 3) return null;

  return (
    <nav aria-label="Sections" className="sticky top-24">
      <p className="t-kicker mb-4 text-ink-3">Contents</p>
      <ol className="flex flex-col gap-2.5">
        {headings.map((heading, index) => (
          <li key={heading.id}>
            <a
              href={`#${heading.id}`}
              className="t-mono-sm flex gap-3 text-ink-3 transition-colors duration-[var(--dur-fast)] hover:text-ink"
            >
              <span className="text-accent tabular-nums">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span>{heading.text}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

import { site } from "@/config/site";

/**
 * Year → milestone, hairline rows.
 *
 * Renders nothing while `site.founder.timeline` is empty. That is the same rule
 * the rest of the site follows: a section with no content is omitted, never
 * padded with placeholder entries. A fabricated timeline would be worse than
 * most placeholders — it is a public record about a real person.
 */
export function Timeline() {
  const entries = site.founder.timeline;
  if (entries.length === 0) return null;

  return (
    <div className="mt-10">
      <p className="t-kicker mb-4 text-ink-3">Timeline</p>
      <dl className="border-t border-line">
        {entries.map((entry) => (
          <div
            key={`${entry.year}-${entry.text}`}
            className="flex flex-col gap-1 border-b border-line py-3.5 sm:flex-row sm:gap-8"
          >
            <dt className="t-mono-sm w-16 shrink-0 text-accent">{entry.year}</dt>
            <dd className="t-body-sm m-0 text-ink-2">{entry.text}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

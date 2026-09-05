import Link from "next/link";
import { ArrowRight } from "lucide-react";

/**
 * Signature device (a) — spec §5.2. The index is content, not ornament: it
 * makes a page read as a document with a table of contents rather than a stack
 * of marketing panels. Only use it where the sections really are a sequence.
 */
export function SectionHeader({
  index,
  label,
  title,
  intro,
  action,
}: {
  index: string;
  label: string;
  title?: string;
  intro?: string;
  action?: { label: string; href: string };
}) {
  return (
    <header className="mb-8 md:mb-12">
      <div className="flex items-center gap-3">
        <span className="t-kicker text-accent">{index}</span>
        <span aria-hidden="true" className="h-px w-6 shrink-0 bg-line" />
        {title ? (
          <span className="t-kicker whitespace-nowrap text-ink-3">{label}</span>
        ) : (
          // No title means the label carries the section — it is the heading,
          // not decoration, so it must be one.
          <h2 className="t-kicker m-0 whitespace-nowrap text-ink-3">{label}</h2>
        )}
        <span aria-hidden="true" className="h-px min-w-4 flex-1 bg-line" />
      </div>

      <div className="mt-5 flex flex-col gap-4 md:flex-row md:items-baseline md:justify-between md:gap-10">
        {title ? <h2 className="t-h2 measure-copy">{title}</h2> : <span />}
        {action ? (
          <Link
            href={action.href}
            className="link-draw t-body-sm inline-flex shrink-0 items-center gap-2 self-start text-accent"
          >
            {action.label}
            <ArrowRight size={16} strokeWidth={1.5} aria-hidden="true" />
          </Link>
        ) : null}
      </div>

      {intro ? <p className="t-body-lg measure-copy mt-3 text-ink-2">{intro}</p> : null}
    </header>
  );
}

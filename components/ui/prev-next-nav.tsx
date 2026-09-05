import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

export interface PrevNextItem {
  href: string;
  title: string;
  /** Small mono line above the title — an experiment ID, a date, a type. */
  eyebrow?: string;
}

/**
 * Adjacent items in a chronological collection.
 *
 * Labelled "Newer" and "Older" rather than "Previous" and "Next": in a dated
 * log those two words point in opposite directions depending on whether you
 * are thinking about the list or the timeline. `rel="prev"/"next"` still
 * carries the document-order relationship for crawlers, where the convention
 * is fixed.
 */
function Cell({
  item,
  direction,
}: {
  item: PrevNextItem | null;
  direction: "newer" | "older";
}) {
  const isNewer = direction === "newer";

  // Hold the column open on wide screens so the surviving link keeps the side
  // that matches its direction — the position itself carries meaning.
  if (!item) return <div className="hidden sm:block" aria-hidden="true" />;

  const Icon = isNewer ? ArrowLeft : ArrowRight;

  return (
    <Link
      href={item.href}
      rel={isNewer ? "next" : "prev"}
      className={
        "group flex flex-col gap-2 border-line py-8 transition-colors duration-[var(--dur-fast)] hover:bg-raised " +
        (isNewer
          ? "sm:pr-8"
          : "border-t sm:items-end sm:border-l sm:border-t-0 sm:pl-8 sm:text-right")
      }
    >
      <span
        className={
          "t-kicker flex items-center gap-2 text-ink-3 " +
          (isNewer ? "" : "sm:flex-row-reverse")
        }
      >
        <Icon size={14} strokeWidth={1.5} aria-hidden="true" />
        {isNewer ? "Newer" : "Older"}
      </span>

      {item.eyebrow ? (
        <span className="t-mono-sm text-accent">{item.eyebrow}</span>
      ) : null}

      <span className="t-h4 text-ink transition-colors duration-[var(--dur-fast)] group-hover:text-accent">
        {item.title}
      </span>
    </Link>
  );
}

export function PrevNextNav({
  newer,
  older,
  label,
}: {
  newer: PrevNextItem | null;
  older: PrevNextItem | null;
  label: string;
}) {
  if (!newer && !older) return null;

  return (
    <nav aria-label={label} className="mt-4 border-t border-line">
      <div className="grid grid-cols-1 sm:grid-cols-2">
        <Cell item={newer} direction="newer" />
        <Cell item={older} direction="older" />
      </div>
    </nav>
  );
}

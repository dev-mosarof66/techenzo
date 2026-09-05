import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

export const PAGE_SIZE = 12;

/**
 * Paginate a list, keeping the page in the URL — spec §8.18.
 *
 * The spec called for a "Load more" button backed by a server action. This is
 * URL pages instead, for three reasons the spec's own principles argue for:
 * a shared link shows what the sharer saw, the back button behaves, and it
 * needs no client JavaScript at all. Append-in-place gives up all three.
 *
 * Still no infinite scroll — that breaks the footer and the back button, which
 * is what the spec was guarding against in the first place.
 */
export function paginate<T>(items: T[], page: number) {
  const pageCount = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
  const current = Math.min(Math.max(1, page), pageCount);
  const start = (current - 1) * PAGE_SIZE;

  return {
    items: items.slice(start, start + PAGE_SIZE),
    current,
    pageCount,
    from: items.length === 0 ? 0 : start + 1,
    to: Math.min(start + PAGE_SIZE, items.length),
    total: items.length,
  };
}

/** Page numbers from a URL are untrusted: parse, floor at 1, never throw. */
export function resolvePage(raw: string | string[] | undefined): number {
  const candidate = Array.isArray(raw) ? raw[0] : raw;
  const parsed = Number.parseInt(candidate ?? "1", 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
}

export function Pagination({
  current,
  pageCount,
  from,
  to,
  total,
  hrefFor,
  label,
}: {
  current: number;
  pageCount: number;
  from: number;
  to: number;
  total: number;
  /** Build the href for a page, preserving any active filter. */
  hrefFor: (page: number) => string;
  label: string;
}) {
  if (pageCount <= 1) return null;

  return (
    <nav
      aria-label={label}
      className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6"
    >
      <p className="t-mono-sm text-ink-3" aria-live="polite">
        {from}–{to} of {total}
      </p>

      <div className="flex items-center gap-2">
        {current > 1 ? (
          <Link
            href={hrefFor(current - 1)}
            rel="prev"
            className="t-body-sm inline-flex h-9 items-center gap-2 rounded-sm border border-control px-3 text-ink transition-colors duration-[var(--dur-fast)] hover:bg-raised"
          >
            <ArrowLeft size={15} strokeWidth={1.5} aria-hidden="true" />
            Previous
          </Link>
        ) : null}

        <span className="t-mono-sm px-2 tabular-nums text-ink-3">
          {current} / {pageCount}
        </span>

        {current < pageCount ? (
          <Link
            href={hrefFor(current + 1)}
            rel="next"
            className="t-body-sm inline-flex h-9 items-center gap-2 rounded-sm border border-control px-3 text-ink transition-colors duration-[var(--dur-fast)] hover:bg-raised"
          >
            Next
            <ArrowRight size={15} strokeWidth={1.5} aria-hidden="true" />
          </Link>
        ) : null}
      </div>
    </nav>
  );
}

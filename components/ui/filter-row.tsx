import Link from "next/link";

export interface FilterOption {
  label: string;
  href: string;
  active: boolean;
  count?: number;
}

/**
 * Filter state lives in the URL, so a filtered view is shareable, works with
 * the back button, and renders on the server — no client boundary, no
 * hydration, no flash of unfiltered content.
 *
 * Scrolls horizontally on narrow screens rather than wrapping into three ragged
 * lines (spec §10).
 */
export function FilterRow({
  options,
  label,
}: {
  options: FilterOption[];
  label: string;
}) {
  if (options.length <= 2) return null; // "All" plus one tag is not a filter.

  return (
    <nav aria-label={label} className="filter-scroll -mx-1 mb-10 px-1">
      <ul className="flex w-max items-center gap-2">
        {options.map((option) => (
          <li key={option.href}>
            <Link
              href={option.href}
              aria-current={option.active ? "true" : undefined}
              className={
                "t-mono-sm inline-flex h-8 items-center gap-2 whitespace-nowrap rounded-full border px-3.5 transition-colors duration-[var(--dur-fast)] " +
                (option.active
                  ? "border-accent bg-accent/10 text-accent"
                  : "border-line text-ink-2 hover:border-control hover:text-ink")
              }
            >
              {option.label}
              {typeof option.count === "number" ? (
                <span className={option.active ? "text-accent/70" : "text-ink-3"}>
                  {option.count}
                </span>
              ) : null}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

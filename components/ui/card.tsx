import type { ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Card base — spec §8.3.
 *
 * Defined by a 1px border and internal padding, never by a raised background:
 * no shadow, no hover lift, no background change. Hover moves the border and
 * extends the corner registration ticks, and nothing else.
 *
 * The whole card is one link, via an ::after overlay on the title link rather
 * than an <a> wrapping everything — so the accessible name is the title, not
 * the card's entire text content. Anything else clickable inside needs
 * `relative z-10` to sit above that overlay.
 */
export function Card({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <article
      className={cn(
        "ticks group relative flex flex-col rounded-sm border border-line p-5 sm:p-6",
        "transition-colors duration-[var(--dur-fast)] hover:border-control",
        className,
      )}
    >
      {children}
    </article>
  );
}

/** The title link that also makes the whole card clickable. */
export function CardLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "transition-colors duration-[var(--dur-fast)] group-hover:text-accent",
        "after:absolute after:inset-0 after:content-['']",
        className,
      )}
    >
      {children}
    </Link>
  );
}

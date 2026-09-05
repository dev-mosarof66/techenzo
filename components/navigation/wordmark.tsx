import Link from "next/link";
import { site } from "@/config/site";
import { BrandMark } from "@/components/brand/mark";

/**
 * Logo lockup: the favicon mark plus the wordmark. Used in the header, the
 * mobile sheet and the footer, so all three stay identical.
 *
 * The mark carries fixed colours (see BrandMark) while the wordmark text
 * inherits `currentColor` from the theme — the identity stays constant, the
 * typography stays legible on either ground.
 */
export function Wordmark({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`inline-flex items-center gap-2.5 text-[0.9375rem] font-medium tracking-[-0.02em] ${className ?? ""}`}
      aria-label={`${site.name} — home`}
    >
      <BrandMark size={20} className="shrink-0" />
      {site.name.toUpperCase()}
    </Link>
  );
}

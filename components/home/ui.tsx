import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";

/**
 * The homepage's shared parts, in the hero's visual language: tinted pill
 * labels, heavy headlines with one accent phrase, rounded raised cards and
 * pill buttons. Home-only on purpose — the inner pages keep the hairline
 * system, so restyling here never reaches /products or /lab.
 */

/** A raised, rounded surface. The base every homepage card builds on. */
export const PANEL = "rounded-3xl border border-line bg-raised";

/** A card that answers hover with its border, never with lift. */
export const CARD_HOVER =
  "transition-[border-color,background-color] duration-[var(--dur-fast)] hover:border-[color-mix(in_srgb,var(--accent)_55%,var(--border))]";

export function HomeSection({
  id,
  className = "",
  children,
}: {
  id?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className={`relative py-20 lg:py-28 ${className}`}>
      <div className="mx-auto w-full max-w-7xl px-[var(--page-pad)]">{children}</div>
    </section>
  );
}

/** The hero's badge, reused as every section's label: "02 · How we work". */
export function Badge({ children }: { children: ReactNode }) {
  return (
    <span className="t-kicker inline-flex items-center gap-2 rounded-full border border-[color-mix(in_srgb,var(--accent)_30%,transparent)] bg-[color-mix(in_srgb,var(--accent)_12%,transparent)] px-3.5 py-2 text-accent">
      {children}
    </span>
  );
}

export function SectionHead({
  index,
  label,
  title,
  accent,
  intro,
  action,
  center = false,
}: {
  index: string;
  label: string;
  /** The headline before the accent phrase. */
  title: string;
  /** Rendered in the accent colour after `title`, like the hero's word. */
  accent?: string;
  intro?: string;
  action?: { label: string; href: string };
  center?: boolean;
}) {
  return (
    <header
      className={`mb-10 flex flex-col gap-6 lg:mb-14 ${
        center ? "items-center text-center" : "lg:flex-row lg:items-end lg:justify-between"
      }`}
    >
      <div className={center ? "flex flex-col items-center" : ""}>
        <Badge>
          <span>{index}</span>
          <span aria-hidden="true">·</span>
          <span>{label}</span>
        </Badge>
        <h2 className="mt-5 max-w-[22ch] text-[clamp(2rem,1.3rem+2.4vw,3.25rem)] leading-[1.08] font-semibold tracking-[-0.035em] text-balance">
          {title}
          {accent ? <span className="text-accent"> {accent}</span> : null}
        </h2>
        {intro ? (
          <p className={`mt-4 max-w-[58ch] text-base leading-relaxed text-ink-2 ${center ? "mx-auto" : ""}`}>
            {intro}
          </p>
        ) : null}
      </div>
      {action && !center ? <PillButton href={action.href}>{action.label}</PillButton> : null}
    </header>
  );
}

/** The hero's buttons: a label and a round arrow, compact on phones. */
export function PillButton({
  href,
  primary,
  external,
  children,
}: {
  href: string;
  primary?: boolean;
  external?: boolean;
  children: ReactNode;
}) {
  const base =
    "group inline-flex h-11 shrink-0 items-center justify-between gap-2 self-start rounded-full pr-1.5 pl-3.5 text-sm font-semibold transition-colors duration-[var(--dur-fast)] sm:h-12 sm:gap-3 sm:pr-1.5 sm:pl-6 sm:text-[0.9375rem]";
  const outbound = external ? { target: "_blank", rel: "noopener noreferrer" } : {};

  return (
    <Link
      href={href}
      {...outbound}
      className={
        primary
          ? `${base} bg-accent text-on-accent shadow-[0_10px_40px_-8px_color-mix(in_srgb,var(--accent)_60%,transparent)] hover:bg-accent-hover`
          : `${base} border border-line-strong text-accent hover:border-accent`
      }
    >
      {children}
      <span
        aria-hidden="true"
        className={
          primary
            ? "grid size-8 place-items-center rounded-full bg-[var(--paper)] text-[var(--ink-950)] sm:size-9"
            : "grid size-8 place-items-center rounded-full border border-accent sm:size-9"
        }
      >
        <ArrowRight
          strokeWidth={2}
          className="size-4 transition-transform duration-[var(--dur-fast)] group-hover:translate-x-0.5 sm:size-[17px]"
        />
      </span>
    </Link>
  );
}

/** Small rounded tag — tech names, categories, content types. */
export function Tag({ children, tone = "neutral" }: { children: ReactNode; tone?: "neutral" | "accent" }) {
  return (
    <span
      className={
        tone === "accent"
          ? "inline-flex items-center rounded-full bg-[color-mix(in_srgb,var(--accent)_12%,transparent)] px-2.5 py-1 text-xs font-medium text-accent"
          : "inline-flex items-center rounded-full border border-line bg-canvas px-2.5 py-1 text-xs font-medium text-ink-2"
      }
    >
      {children}
    </span>
  );
}

/** A soft accent halo for behind a panel. Decoration only. */
export function Glow({ className }: { className: string }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--accent)_16%,transparent)_0%,transparent_65%)] ${className}`}
    />
  );
}

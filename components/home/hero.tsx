import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Code2,
  FlaskConical,
  MessageSquareText,
  Radio,
  Workflow,
} from "lucide-react";
import { site } from "@/config/site";
import type { LoadedExperiment } from "@/lib/content";
import type { LoadedProduct } from "@/lib/products";
import { HeroSpotlight } from "./hero-spotlight";
import { HeroWord } from "./hero-word";
import { ScaleToFit } from "./scale-to-fit";
import { PillButton } from "./ui";

export type PageIndexEntry = { index: string; label: string; id: string };

/** What "real ___ with AI" cycles through. The first is the one read aloud. */
const HEADLINE_WORDS = ["products", "agents", "tools", "pipelines"];

const CHIPS = [
  { icon: Workflow, label: "AI automation" },
  { icon: FlaskConical, label: "Benchmarks" },
  { icon: Code2, label: "Open source" },
  { icon: Radio, label: "Built in public" },
];

/**
 * Homepage block 00. Copy on the left; on the right a cluster of floating cards
 * around a soft accent glow, each one showing a real piece of the work — the
 * workflow being built, the Lab's newest results, and what a lead actually
 * receives.
 *
 * The lead cards are the one place with example data, and they say so on the
 * card: the numbers in them describe a test lead, not a customer.
 */
export function Hero({
  experiment,
  product,
  sections,
}: {
  experiment: LoadedExperiment | null;
  product: LoadedProduct | null;
  sections: PageIndexEntry[];
}) {
  return (
    <HeroSpotlight>
      {/* Own wrapper rather than Container: the hero is capped at max-w-7xl,
          which none of the shared container widths match. */}
      <div className="mx-auto w-full max-w-7xl px-[var(--page-pad)]">
        {/* Side by side only from xl: below that the headline can't hold its
            three lines in half the width, so the card cluster moves underneath. */}
        <div className="grid grid-cols-1 items-center gap-10 xl:grid-cols-12 xl:gap-8">
          <div className="xl:col-span-6">
            {product ? (
              <Link
                href={`/products/${product.slug}`}
                className="hero-in group inline-flex max-w-full items-center gap-2.5 rounded-full border border-[color-mix(in_srgb,var(--accent)_30%,transparent)] bg-[color-mix(in_srgb,var(--accent)_12%,transparent)] px-4 py-2 transition-colors duration-[var(--dur-fast)] hover:border-accent"
                style={step(0)}
              >
                <span aria-hidden="true" className="pulse-dot size-1.5 shrink-0 rounded-full bg-accent text-accent" />
                <span className="t-kicker shrink-0 text-accent">Now building</span>
                <span className="t-body-sm truncate font-medium text-ink">{product.name}</span>
                <ArrowRight
                  size={14}
                  strokeWidth={2}
                  aria-hidden="true"
                  className="shrink-0 text-accent transition-transform duration-[var(--dur-fast)] group-hover:translate-x-0.5"
                />
              </Link>
            ) : (
              <p
                className="hero-in t-kicker inline-flex rounded-full bg-[color-mix(in_srgb,var(--accent)_12%,transparent)] px-4 py-2.5 text-accent"
                style={step(0)}
              >
                Building · Shipping · Measuring
              </p>
            )}

            <h1 className="mt-6 text-[clamp(2.5rem,1.6rem+3.6vw,4.25rem)] leading-[1.06] font-semibold tracking-[-0.045em]">
              <span className="hero-in block" style={step(1)}>
                Building real
              </span>
              {/* Three fixed lines: the rotating word gets a line to itself, so
                  no word is ever long enough to rewrap the headline. */}
              <span className="hero-in block" style={step(2)}>
                <span className="relative inline-block">
                  <HeroWord words={HEADLINE_WORDS} />
                  <Swoosh />
                </span>
              </span>
              <span className="hero-in block" style={step(2)}>
                with AI.
              </span>
            </h1>

            <p className="hero-in mt-5 max-w-[48ch] text-base leading-relaxed text-ink-2" style={step(3)}>
              {site.description}
            </p>

            <div className="hero-in mt-7 flex flex-wrap gap-2 sm:gap-3" style={step(4)}>
              <PillButton href="/products" primary>
                Explore products
              </PillButton>
              <PillButton href="/lab">Read the Lab</PillButton>
            </div>

            {/* A tidy 2×2 on phones, a single wrapping row from sm up. */}
            <ul className="hero-in mt-7 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap" style={step(5)}>
              {CHIPS.map(({ icon: Icon, label }) => (
                <li
                  key={label}
                  className="inline-flex min-w-0 items-center gap-2 rounded-full border border-line bg-raised px-3 py-1.5 text-[0.8125rem] leading-tight font-medium text-ink"
                >
                  <Icon size={15} strokeWidth={1.75} aria-hidden="true" className="shrink-0 text-accent" />
                  <span className="truncate">{label}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="hero-in xl:col-span-6" style={step(4)}>
            {/* Capped below its 640px design width so the hero fits one screen. */}
            <div className="mx-auto w-full max-w-[560px] xl:mr-0">
              <CardCluster experiment={experiment} product={product} />
            </div>
          </div>
        </div>

        {sections.length > 0 ? <PageIndex sections={sections} /> : null}
      </div>
    </HeroSpotlight>
  );
}

/** Hand-drawn underline under the rotating word; it draws itself once. */
function Swoosh() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 300 16"
      preserveAspectRatio="none"
      className="swoosh pointer-events-none absolute -bottom-[0.02em] left-0 h-[0.14em] w-full text-accent"
    >
      <path
        d="M3 12 C 70 3, 170 2, 297 7"
        pathLength={1}
        fill="none"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* --------------------------------------------------------------------------
   The card cluster
   ------------------------------------------------------------------------ */

const CARD =
  "rounded-2xl border border-line bg-[color-mix(in_srgb,var(--bg-raised)_88%,transparent)] p-5 shadow-[var(--shadow-layer)] backdrop-blur-[10px]";

/** The three corner cards — compact, so they frame the workflow, not cover it. */
const MINI =
  "rounded-xl border border-line bg-[color-mix(in_srgb,var(--bg-raised)_92%,transparent)] p-2.5 shadow-[var(--shadow-layer)] backdrop-blur-[10px]";

function CardCluster({
  experiment,
  product,
}: {
  experiment: LoadedExperiment | null;
  product: LoadedProduct | null;
}) {
  // One composition at every width: laid out at 640×560 and scaled down to
  // fit, so a phone shows the same floating collage as a desktop.
  return (
    <ScaleToFit width={640} height={560}>
      {/* Backdrop: a soft ring of accent and three dot patches. Decoration only. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        {/* A ring, not a disc: clear in the middle so it halos the cluster's
            outer edge instead of pooling in the gap between the cards. */}
        <div className="absolute top-1/2 left-1/2 size-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,transparent_0%,transparent_32%,color-mix(in_srgb,var(--accent)_14%,transparent)_52%,transparent_70%)]" />
        <Dots className="top-[2%] left-[8%]" />
        <Dots className="right-[2%] bottom-[34%]" />
        <Dots className="bottom-[2%] left-[34%]" />
      </div>

      {/* The workflow is the centrepiece; the three small cards each sit on one
          of its corners — Lab top-right, score bottom-left, reply bottom-right. */}
      <div>
        {product?.image ? (
          <div className={`${CARD} float-y absolute top-[17%] left-[5%] w-[86%]`} style={float(0)}>
            <div className="flex items-center justify-between gap-3">
              <p className="t-body-sm text-ink-2">{product.name} · workflow</p>
              <span className="t-mono-sm rounded-full bg-[color-mix(in_srgb,var(--status-building)_14%,transparent)] px-2 py-0.5 text-status-building">
                building
              </span>
            </div>
            <div className="mt-3 overflow-hidden rounded-lg border border-line bg-[#141414]">
              <Image
                src={product.image}
                alt={`The ${product.name} workflow in n8n: webhook, clean, AI score and reply, then reply, log and hot-lead alert`}
                width={1110}
                height={515}
                sizes="560px"
                priority
                className="h-auto w-full"
              />
            </div>
          </div>
        ) : null}

        <LeadScoreCard />

        {experiment ? <LabCard experiment={experiment} /> : null}

        <ReplyCard />
      </div>
    </ScaleToFit>
  );
}

function LeadScoreCard() {
  const score = 86;
  return (
    <div className={`${MINI} float-y absolute bottom-[6%] left-0 w-[16%]`} style={float(1)}>
      <div className="flex flex-wrap items-center justify-between gap-1">
        <p className="text-[10px] font-medium text-ink">Lead score</p>
        <ExampleTag />
      </div>
      <div className="relative mx-auto mt-2 size-[52px]">
        <svg viewBox="0 0 100 100" className="size-full -rotate-90" aria-hidden="true">
          <circle cx="50" cy="50" r="40" fill="none" strokeWidth="11" className="stroke-line" />
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            strokeWidth="11"
            strokeLinecap="round"
            pathLength={100}
            strokeDasharray="100"
            strokeDashoffset={100 - score}
            className="ring-in stroke-accent"
          />
        </svg>
        <span className="absolute inset-0 grid place-items-center text-sm font-semibold tracking-tight">
          {score}
        </span>
      </div>
      <p className="mt-1.5 text-center text-[9px] leading-tight text-ink-2">
        Hot · <span className="text-ink">owner alerted</span>
      </p>
    </div>
  );
}

function ReplyCard() {
  return (
    <div className={`${MINI} float-y absolute right-0 bottom-[12%] w-[28%]`} style={float(2)}>
      <div className="flex flex-wrap items-center justify-between gap-1">
        <p className="flex items-center gap-1 text-[9px] text-ink-2">
          <MessageSquareText size={11} strokeWidth={1.75} aria-hidden="true" className="text-accent" />
          Reply sent · 11:47 PM
        </p>
        <ExampleTag />
      </div>
      <p className="mt-1 text-[10px] leading-snug font-medium text-ink">
        Hi Sara — thanks for reaching out about the after-hours WhatsApp bot. Here is how
        we would set it up…
      </p>
    </div>
  );
}

/** The Lab's newest results as paired bars — real frontmatter, scaled per pair. */
function LabCard({ experiment }: { experiment: LoadedExperiment }) {
  const headline = experiment.results[0];
  const pairs = experiment.results
    .map((r) => ({ before: toNumber(r.baseline), after: toNumber(r.value), metric: r.metric }))
    .filter((p): p is { before: number; after: number; metric: string } =>
      p.before !== null && p.after !== null && Math.max(p.before, p.after) > 0,
    )
    .slice(0, 4);

  return (
    <Link
      href={`/lab/${experiment.slug}`}
      className={`${MINI} float-y group block transition-colors duration-[var(--dur-fast)] hover:border-accent absolute top-[8%] right-0 w-[18%]`}
      style={float(3)}
    >
      <p className="text-[9px] text-ink-2">
        Lab · <span className="text-accent">{experiment.id}</span>
      </p>
      {headline ? (
        <>
          <p className="mt-0.5 text-base font-semibold tracking-tight">{headline.value}</p>
          <p className="font-mono text-[8px] leading-tight text-ink-3">
            {headline.metric}
            {headline.baseline ? ` · was ${headline.baseline}` : ""}
          </p>
        </>
      ) : (
        <p className="mt-1 text-sm font-medium">{experiment.title}</p>
      )}

      {pairs.length > 0 ? (
        <div aria-hidden="true" className="mt-2 flex h-7 items-end gap-1.5">
          {pairs.map((pair, i) => {
            const max = Math.max(pair.before, pair.after);
            return (
              <div key={pair.metric} className="flex h-full flex-1 items-end gap-0.5">
                <span
                  className="bar-up block flex-1 rounded-t-sm bg-line-strong"
                  style={{ height: `${(pair.before / max) * 100}%`, "--bar-step": i * 2 } as React.CSSProperties}
                />
                <span
                  className="bar-up block flex-1 rounded-t-sm bg-accent"
                  style={{ height: `${(pair.after / max) * 100}%`, "--bar-step": i * 2 + 1 } as React.CSSProperties}
                />
              </div>
            );
          })}
        </div>
      ) : null}
      <p className="mt-1 text-[8px] text-ink-3 group-hover:text-ink-2">Before → after</p>
    </Link>
  );
}

function ExampleTag() {
  return (
    <span className="shrink-0 rounded-full border border-line px-1 font-mono text-[7px] leading-[1.6] text-ink-3">
      example
    </span>
  );
}

function Dots({ className }: { className: string }) {
  return (
    <div
      className={`absolute size-24 bg-[radial-gradient(var(--accent)_1.5px,transparent_1.5px)] [background-size:14px_14px] opacity-40 ${className}`}
    />
  );
}

/** "42 ms" → 42, "0.94" → 0.94, "3m 02s" → 182. Anything else → null. */
function toNumber(raw?: string): number | null {
  if (!raw) return null;
  const text = raw.trim();
  const duration = /^(?:(\d+)m)?\s*(?:(\d+(?:\.\d+)?)s)?$/.exec(text);
  if (duration && (duration[1] || duration[2])) {
    return Number(duration[1] ?? 0) * 60 + Number(duration[2] ?? 0);
  }
  const n = Number.parseFloat(text);
  return Number.isFinite(n) ? n : null;
}

/**
 * The homepage's table of contents, as one rounded strip under the hero. The
 * section indices are real anchors, so the numbering that makes the page read
 * as a document is also how you move around it.
 */
function PageIndex({ sections }: { sections: PageIndexEntry[] }) {
  return (
    <nav
      aria-label="On this page"
      className="hero-in mt-10 rounded-3xl border border-line bg-raised px-6 py-4 lg:mt-12 lg:px-10"
      style={step(6)}
    >
      <p className="t-kicker text-center text-ink-3">On this page</p>
      <ol className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-4 lg:flex lg:flex-wrap lg:justify-between lg:gap-x-2">
        {sections.map((section) => (
          <li key={section.id}>
            <a
              href={`#${section.id}`}
              className="group flex items-center gap-2 rounded-full px-2 py-1.5 transition-colors duration-[var(--dur-fast)] hover:bg-canvas"
            >
              <span className="t-mono-sm text-accent">{section.index}</span>
              <span className="text-[0.8125rem] whitespace-nowrap text-ink-2 transition-colors duration-[var(--dur-fast)] group-hover:text-ink">
                {section.label}
              </span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

function step(n: number) {
  return { "--hero-step": n } as React.CSSProperties;
}

function float(n: number) {
  return { "--float-step": n } as React.CSSProperties;
}

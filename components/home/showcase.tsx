import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { GitHubIcon } from "@/components/ui/icons";
import { StatusChip } from "@/components/ui/status-chip";
import type { LoadedExperiment } from "@/lib/content";
import type { LoadedProduct } from "@/lib/products";
import { reveal } from "@/lib/reveal";
import { CARD_HOVER, Glow, PANEL, PillButton, Tag } from "./ui";

/**
 * Block 03 — the featured product as one large panel: the real screenshot on
 * the left, the case on the right. Never fakes a launch: a product with
 * nowhere to send people gets "Follow the build", not "Try it".
 */
export function FeaturedShowcase({ product }: { product: LoadedProduct }) {
  const isUsable = Boolean(product.url);

  return (
    <div className={`relative overflow-hidden p-5 sm:p-8 lg:p-10 ${PANEL}`} {...reveal()}>
      <Glow className="-top-40 -left-40 size-[520px]" />

      <div className="relative grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-7">
          <div className="overflow-hidden rounded-2xl border border-line bg-[#141414] shadow-[var(--shadow-layer)]">
            {product.image ? (
              <Image
                src={product.image}
                alt={`${product.name} in use`}
                width={1110}
                height={515}
                sizes="(min-width: 1024px) 680px, 100vw"
                className="h-auto w-full"
              />
            ) : (
              <div className="grid aspect-16/10 place-items-center">
                <span aria-hidden="true" className="text-8xl font-semibold text-ink opacity-10">
                  {product.name.charAt(0)}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="flex flex-wrap items-center gap-2.5">
            <StatusChip status={product.status} />
            {product.category ? <Tag>{product.category}</Tag> : null}
          </div>

          <h3 className="mt-5 text-[clamp(1.75rem,1.3rem+1.6vw,2.5rem)] leading-tight font-semibold tracking-[-0.03em]">
            <Link href={`/products/${product.slug}`} className="transition-colors hover:text-accent">
              {product.name}
            </Link>
          </h3>
          <p className="mt-3 text-base leading-relaxed text-ink-2">{product.tagline}</p>

          {product.problem || product.solution ? (
            <dl className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              {product.problem ? (
                <div className="rounded-2xl border border-line bg-canvas p-4">
                  <dt className="t-kicker text-ink-3">Problem</dt>
                  <dd className="mt-2 text-sm leading-relaxed text-ink-2">{product.problem}</dd>
                </div>
              ) : null}
              {product.solution ? (
                <div className="rounded-2xl border border-[color-mix(in_srgb,var(--accent)_30%,var(--border))] bg-[color-mix(in_srgb,var(--accent)_6%,var(--bg))] p-4">
                  <dt className="t-kicker text-accent">Solution</dt>
                  <dd className="mt-2 text-sm leading-relaxed text-ink-2">{product.solution}</dd>
                </div>
              ) : null}
            </dl>
          ) : null}

          {product.technologies.length > 0 ? (
            <ul className="mt-6 flex flex-wrap gap-2">
              {product.technologies.map((tech) => (
                <li key={tech}>
                  <Tag>{tech}</Tag>
                </li>
              ))}
            </ul>
          ) : null}

          <div className="mt-8 flex flex-wrap gap-3">
            {isUsable ? (
              <>
                <PillButton href={product.url!} primary external>
                  Try it
                </PillButton>
                <PillButton href={`/products/${product.slug}`}>Case study</PillButton>
              </>
            ) : (
              <>
                <PillButton href={`/products/${product.slug}`} primary>
                  Follow the build
                </PillButton>
                {product.githubUrl ? (
                  <PillButton href={product.githubUrl} external>
                    GitHub
                  </PillButton>
                ) : null}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Block 04 — the Lab. A pinned statement on the left, the newest experiments
 * as cards on the right, each carrying its real results as small tiles.
 */
export function LabShowcase({ experiments }: { experiments: LoadedExperiment[] }) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
      <div className="lg:col-span-4">
        <div
          className={`relative overflow-hidden p-7 lg:sticky lg:top-[calc(var(--nav-height)+40px)] ${PANEL}`}
          {...reveal()}
        >
          <Glow className="-right-32 -bottom-32 size-80" />
          <p className="relative text-2xl leading-snug font-semibold tracking-tight">
            Every experiment ships with a hypothesis, a method, the numbers and the repo.
          </p>
          <p className="relative mt-4 text-[0.9375rem] leading-relaxed text-ink-2">
            Including the ones where the idea lost. A result you cannot check is marketing.
          </p>
          <div className="relative mt-8">
            <PillButton href="/lab" primary>
              All experiments
            </PillButton>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 lg:col-span-8">
        {experiments.length > 0 ? (
          experiments.map((experiment, index) => (
            <ExperimentCard key={experiment.slug} experiment={experiment} index={index} />
          ))
        ) : (
          <div className={`p-8 text-center ${PANEL}`}>
            <p className="text-lg font-semibold">No experiments published yet.</p>
            <p className="mt-2 text-ink-2">The first benchmark lands with the RAG pipeline writeup.</p>
          </div>
        )}
      </div>
    </div>
  );
}

const DIRECTION = {
  improvement: { label: "better", className: "text-status-launched" },
  regression: { label: "worse", className: "text-status-regression" },
  neutral: { label: "flat", className: "text-ink-3" },
} as const;

function ExperimentCard({ experiment, index }: { experiment: LoadedExperiment; index: number }) {
  return (
    <article className={`group relative p-6 sm:p-7 ${PANEL} ${CARD_HOVER}`} {...reveal(index)}>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-ink-3">
        <Tag tone="accent">{experiment.id}</Tag>
        <time dateTime={experiment.publishedAt}>{experiment.publishedAt}</time>
        <span aria-hidden="true">·</span>
        <span>{experiment.readingMinutes} min read</span>
        {experiment.githubUrl ? (
          <a
            href={experiment.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="relative z-10 ml-auto inline-flex items-center gap-1 hover:text-ink"
          >
            <GitHubIcon size={14} />
            repo
            <ArrowUpRight size={13} strokeWidth={1.75} aria-hidden="true" />
          </a>
        ) : null}
      </div>

      <h3 className="mt-4 text-xl font-semibold tracking-tight">
        <Link
          href={`/lab/${experiment.slug}`}
          className="transition-colors group-hover:text-accent after:absolute after:inset-0 after:rounded-3xl after:content-['']"
        >
          {experiment.title}
        </Link>
      </h3>
      <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-2">
        <span className="text-ink-3">Hypothesis — </span>
        {experiment.hypothesis}
      </p>

      {experiment.results.length > 0 ? (
        <ul className="mt-5 grid grid-cols-1 gap-2.5 sm:grid-cols-3">
          {experiment.results.slice(0, 3).map((result) => {
            const direction = DIRECTION[result.direction];
            return (
              <li key={result.metric} className="rounded-2xl border border-line bg-canvas px-4 py-3">
                <p className="font-mono text-xs text-ink-3">{result.metric}</p>
                <p className="mt-1.5 font-mono text-sm">
                  {result.baseline ? <span className="text-ink-3">{result.baseline} → </span> : null}
                  <span className="font-semibold text-ink">{result.value}</span>
                </p>
                <p className={`mt-1 text-xs font-medium ${direction.className}`}>{direction.label}</p>
              </li>
            );
          })}
        </ul>
      ) : null}
    </article>
  );
}

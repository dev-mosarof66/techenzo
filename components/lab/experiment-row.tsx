import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { LoadedExperiment } from "@/lib/content";

/**
 * The Lab index is a list, not a grid — spec §8.6. It should read like a table
 * of results, which is what makes this section prove the brand rather than
 * describe it.
 */
export function ExperimentRow({ experiment }: { experiment: LoadedExperiment }) {
  return (
    <article className="group relative border-b border-line py-7 pl-5 transition-colors duration-[var(--dur-base)] hover:bg-raised">
      {/* Accent bar wipes up the left edge on hover */}
      <span
        aria-hidden="true"
        className="absolute inset-y-0 left-0 w-0.5 origin-bottom scale-y-0 bg-accent transition-transform duration-[var(--dur-base)] ease-[var(--ease-standard)] group-hover:scale-y-100"
      />

      <div className="t-mono-sm mb-2.5 flex flex-wrap items-baseline gap-x-4 gap-y-1">
        <span className="text-accent">{experiment.id}</span>
        <time dateTime={experiment.publishedAt} className="text-ink-3">
          {experiment.publishedAt}
        </time>
        <span className="text-ink-3">{experiment.readingMinutes} min read</span>
        {experiment.draft ? (
          <span className="rounded-full border border-status-building/30 bg-status-building/10 px-2 text-status-building">
            Draft
          </span>
        ) : null}
        {experiment.githubUrl ? (
          <a
            href={experiment.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="link-draw relative z-10 ml-auto inline-flex items-center gap-1 text-ink-3 hover:text-ink"
          >
            repo
            <ArrowUpRight size={13} strokeWidth={1.5} aria-hidden="true" />
          </a>
        ) : null}
      </div>

      <h3 className="t-h3">
        {/* Overlay link: the whole row is clickable, the title carries the name */}
        <Link
          href={`/lab/${experiment.slug}`}
          className="transition-colors duration-[var(--dur-fast)] group-hover:text-accent after:absolute after:inset-0 after:content-['']"
        >
          {experiment.title}
        </Link>
      </h3>

      <p className="t-body-sm measure-copy mt-1.5 text-ink-2">
        <span className="text-ink-3">Hypothesis — </span>
        {experiment.hypothesis}
      </p>

      {experiment.results.length > 0 ? (
        <div className="t-mono-sm mt-4 flex flex-wrap gap-x-7 gap-y-2 text-ink-3">
          {experiment.results.slice(0, 3).map((result) => (
            <span key={result.metric}>
              {result.metric}{" "}
              {result.baseline ? (
                <>
                  <span className="text-ink-3">{result.baseline} → </span>
                  <span className="text-ink">{result.value}</span>
                </>
              ) : (
                <span className="text-ink">{result.value}</span>
              )}
            </span>
          ))}
          {experiment.tags.length > 0 ? (
            <span className="text-ink-3">{experiment.tags.join(" · ")}</span>
          ) : null}
        </div>
      ) : null}
    </article>
  );
}

import { ArrowDown, ArrowUp, Minus } from "lucide-react";
import type { ExperimentFrontmatter } from "@/lib/content";

type Result = ExperimentFrontmatter["results"][number];

/**
 * Headline numbers from an experiment's frontmatter — spec §8.10.
 *
 * Two rules this component enforces rather than trusts:
 *  - Direction is carried by an arrow glyph as well as colour, so it survives
 *    colourblindness, greyscale print and forced-colors mode.
 *  - A metric with no measurement is not rendered. There is no placeholder
 *    state, because a placeholder number is indistinguishable from a real one.
 */
const JUDGEMENT = {
  improvement: { className: "text-status-launched", label: "improvement" },
  regression: { className: "text-status-regression", label: "regression" },
  neutral: { className: "text-ink-3", label: "no significant change" },
} as const;

const CHANGE = { up: ArrowUp, down: ArrowDown } as const;

export function MetricBlock({ results }: { results: Result[] }) {
  if (results.length === 0) return null;

  return (
    <div className="my-10 grid grid-cols-1 rounded-sm border border-line sm:grid-cols-2 lg:grid-cols-3">
      {results.map((result, index) => {
        const { className, label } = JUDGEMENT[result.direction];
        const Icon = result.change ? CHANGE[result.change] : Minus;
        const isLast = index === results.length - 1;

        return (
          <div
            key={result.metric}
            className={`px-6 py-6 ${isLast ? "" : "border-b border-line lg:border-b-0 lg:border-r"}`}
          >
            <p className="t-kicker text-ink-3">{result.metric}</p>
            <p className="t-metric mt-3">{result.value}</p>
            {result.baseline ? (
              <p className={`t-mono-sm mt-2.5 flex items-center gap-1.5 ${className}`}>
                <Icon size={14} strokeWidth={2} aria-hidden="true" />
                <span>from {result.baseline}</span>
                {/* Colour carries the judgement visually; this carries it for
                    screen readers, so it is never colour alone. */}
                <span className="sr-only">({label})</span>
              </p>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

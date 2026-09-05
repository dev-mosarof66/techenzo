export interface Series {
  name: string;
  values: number[];
}

export interface BarChartProps {
  title: string;
  /** One label per category, e.g. index sizes or model names. */
  categories: string[];
  series: Series[];
  /** Printed after every value: "ms", "%", "req/s". */
  unit?: string;
  /** One line under the title, e.g. "Lower is better". */
  note?: string;
  /**
   * Method line printed beneath the figure. Supplied automatically from the
   * experiment's frontmatter — see the binding in app/lab/[slug]/page.tsx.
   */
  conditions?: string;
}

/**
 * Grouped bar chart for benchmark results.
 *
 * Rendered entirely on the server as HTML and CSS — no charting library, no
 * client JavaScript, and the hover tooltip is CSS-only. A benchmark chart that
 * costs 40KB of JS to display would contradict the numbers it is reporting.
 *
 * The rules below are enforced rather than documented, because a chart is the
 * most persuasive thing on a page and the easiest to mislead with:
 *
 *  - **One scale.** Every series shares one y-axis. There is no second-axis
 *    option, because two scales in one frame let any two lines be made to tell
 *    whichever story the author wanted.
 *  - **Zero baseline.** Bars encode magnitude by length; starting the axis
 *    anywhere but zero makes a 3% difference look like a 300% one.
 *  - **Six series maximum**, in fixed palette order, never cycled. Slots 1–6
 *    are the validated adjacent-pair set for bars.
 *  - **Colour is never the only channel.** Every value is directly labelled,
 *    the legend is always present, and the same numbers appear in a table.
 *  - **Conditions are mandatory.** A figure without its method is decoration.
 */

/** Round the axis top to a readable number so ticks land on clean values. */
function niceCeiling(max: number): number {
  if (max <= 0) return 1;
  const magnitude = 10 ** Math.floor(Math.log10(max));
  const normalised = max / magnitude;
  const step = normalised <= 1 ? 1 : normalised <= 2 ? 2 : normalised <= 2.5 ? 2.5 : normalised <= 5 ? 5 : 10;
  return step * magnitude;
}

const format = (value: number) =>
  Number.isInteger(value) ? String(value) : value.toFixed(2).replace(/\.?0+$/, "");

export function BarChart({
  title,
  categories,
  series,
  unit,
  note,
  conditions,
}: BarChartProps) {
  // Shape is guaranteed by the zod schema in lib/content.ts; this only catches
  // a chart id that does not exist in frontmatter.
  if (!series || series.length === 0) {
    throw new Error(`<Chart> found no data. Check the id matches a charts[] entry.`);
  }
  if (!conditions) {
    throw new Error(`<Chart title="${title}"> has no conditions.`);
  }

  const max = Math.max(...series.flatMap((s) => s.values));
  const top = niceCeiling(max);
  const ticks = [1, 0.8, 0.6, 0.4, 0.2, 0].map((fraction) => top * fraction);
  const suffix = unit ? ` ${unit}` : "";

  return (
    <figure className="my-10 rounded-sm border border-line p-5 sm:p-6">
      <div className="mb-6 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
        <div>
          <figcaption className="t-h4">{title}</figcaption>
          {note ? <p className="t-mono-sm mt-1 text-ink-3">{note}</p> : null}
        </div>

        {/* Legend is always present for 2+ series; the swatch carries colour so
            the label itself can stay in the text token. */}
        {series.length > 1 ? (
          <ul className="flex flex-wrap gap-x-5 gap-y-1.5">
            {series.map((item, index) => (
              <li key={item.name} className="t-mono-sm flex items-center gap-2 text-ink-2">
                <span
                  aria-hidden="true"
                  className="size-2.5 shrink-0 rounded-[2px]"
                  style={{ background: `var(--series-${index + 1})` }}
                />
                {item.name}
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      {/* The bars are a visual restatement of the table below, so they are
          hidden from assistive tech rather than read out as a wall of numbers. */}
      <div aria-hidden="true" className="grid grid-cols-[2.75rem_1fr]">
        <div className="flex h-48 flex-col justify-between pr-2.5 text-right">
          {ticks.map((tick) => (
            <span
              key={tick}
              className="t-mono-sm -translate-y-1/2 text-[0.6875rem] tabular-nums text-ink-3"
            >
              {format(tick)}
            </span>
          ))}
        </div>

        <div className="relative h-48 border-b border-l border-line-strong">
          {ticks.slice(0, -1).map((tick, index) => (
            <span
              key={tick}
              className="absolute inset-x-0 h-px bg-line"
              style={{ top: `${index * 20}%` }}
            />
          ))}

          <div className="absolute inset-0 flex items-end justify-around px-2.5">
            {categories.map((category, categoryIndex) => (
              <div key={category} className="flex h-full items-end gap-0.5">
                {series.map((item, seriesIndex) => {
                  const value = item.values[categoryIndex];
                  return (
                    <div
                      key={item.name}
                      className="group/bar relative w-6 rounded-t sm:w-8"
                      style={{
                        height: `${(value / top) * 100}%`,
                        background: `var(--series-${seriesIndex + 1})`,
                      }}
                    >
                      {/* Direct label — identity and value never depend on
                          matching a colour back to a legend. */}
                      <span className="t-mono-sm absolute -top-5 left-1/2 -translate-x-1/2 text-[0.6875rem] tabular-nums text-ink-2">
                        {format(value)}
                      </span>
                      {/* CSS-only tooltip: no JS, no hydration. */}
                      <span className="pointer-events-none absolute bottom-[calc(100%+1.5rem)] left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-sm border border-control bg-raised px-2 py-1 font-mono text-[0.6875rem] text-ink opacity-0 transition-opacity duration-[var(--dur-fast)] group-hover/bar:opacity-100">
                        {item.name} · {category} · {format(value)}
                        {suffix}
                      </span>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        <div />
        <div className="flex justify-around px-2.5 pt-2">
          {categories.map((category) => (
            <span key={category} className="t-mono-sm text-[0.6875rem] text-ink-3">
              {category}
            </span>
          ))}
        </div>
      </div>

      <details className="mt-5">
        <summary className="t-mono-sm cursor-pointer text-ink-3 hover:text-ink">
          Table view
        </summary>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th scope="col" className="t-kicker pb-2.5 pr-4 text-left text-ink-3">
                  {unit ? `Category (${unit})` : "Category"}
                </th>
                {series.map((item) => (
                  <th
                    key={item.name}
                    scope="col"
                    className="t-kicker pb-2.5 pr-4 text-left text-ink-3"
                  >
                    {item.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {categories.map((category, categoryIndex) => (
                <tr key={category}>
                  <th
                    scope="row"
                    className="t-body-sm border-t border-line py-2.5 pr-4 text-left font-normal text-ink-2"
                  >
                    {category}
                  </th>
                  {series.map((item) => (
                    <td
                      key={item.name}
                      className="t-mono-sm border-t border-line py-2.5 pr-4 tabular-nums text-ink"
                    >
                      {format(item.values[categoryIndex])}
                      {suffix}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>

      <p className="t-mono-sm mt-4 border-t border-line pt-3 text-[0.6875rem] leading-relaxed text-ink-3">
        <span className="text-ink-3">Conditions — </span>
        {conditions}
      </p>
    </figure>
  );
}

export interface ResultTableProps {
  title: string;
  columns: string[];
  rows: { label: string; values: string[] }[];
  unit?: string;
  betterIs?: "lower" | "higher";
  conditions?: string;
}

/**
 * Benchmark results as a table — spec §8.13.
 *
 * Numeric cells are right-aligned with tabular figures so digits line up in a
 * column and can be compared by eye. The best value per row is emphasised in
 * weight, not colour, so the emphasis survives greyscale, colourblindness and
 * forced-colors mode — and it is only applied when the frontmatter says which
 * direction is better. Guessing would be worse than not marking one.
 *
 * Scrolls inside its own container: the prose column is 68ch and a results
 * table is routinely wider, but the page body must never scroll sideways.
 */
function bestIndex(values: string[], betterIs?: "lower" | "higher"): number | null {
  if (!betterIs) return null;

  // Compare the leading number in each cell, so "31 ms" and "4m 12s" both parse
  // to something orderable without inventing a unit system.
  const numbers = values.map((value) => {
    const match = /-?\d+(\.\d+)?/.exec(value);
    return match ? Number(match[0]) : Number.NaN;
  });
  if (numbers.some(Number.isNaN)) return null;

  let best = 0;
  for (let i = 1; i < numbers.length; i += 1) {
    const better = betterIs === "lower" ? numbers[i] < numbers[best] : numbers[i] > numbers[best];
    if (better) best = i;
  }
  // A tie has no winner worth marking.
  return numbers.filter((n) => n === numbers[best]).length > 1 ? null : best;
}

export function ResultTable({
  title,
  columns,
  rows,
  unit,
  betterIs,
  conditions,
}: ResultTableProps) {
  const suffix = unit ? ` ${unit}` : "";

  return (
    <figure className="my-10">
      <figcaption className="t-h4 mb-1">{title}</figcaption>
      {betterIs ? (
        <p className="t-mono-sm mb-4 text-ink-3">
          {betterIs === "lower" ? "Lower is better" : "Higher is better"} · best value
          per row in bold
        </p>
      ) : null}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr>
              {columns.map((column, index) => (
                <th
                  key={column}
                  scope="col"
                  className={`t-kicker whitespace-nowrap border-b border-line-strong pb-2.5 pr-5 text-ink-3 ${index === 0 ? "text-left" : "text-right"}`}
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const best = bestIndex(row.values, betterIs);
              return (
                <tr key={row.label}>
                  <th
                    scope="row"
                    className="t-body-sm whitespace-nowrap border-b border-line py-3 pr-5 text-left font-normal text-ink-2"
                  >
                    {row.label}
                  </th>
                  {row.values.map((value, index) => (
                    <td
                      key={`${row.label}-${columns[index + 1]}`}
                      className={`t-mono-sm border-b border-line py-3 pr-5 text-right tabular-nums ${
                        index === best ? "font-medium text-ink" : "text-ink-2"
                      }`}
                    >
                      {value}
                      {suffix}
                      {index === best ? <span className="sr-only"> (best)</span> : null}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {conditions ? (
        <p className="t-mono-sm mt-4 border-t border-line pt-3 text-[0.6875rem] leading-relaxed text-ink-3">
          <span className="text-ink-3">Conditions — </span>
          {conditions}
        </p>
      ) : null}
    </figure>
  );
}

export interface ArchitectureProps {
  /** Boxes in the flow, left to right. 2–6 reads well; past that use steps alone. */
  flow?: string[];
  /** Numbered explanation beneath the diagram. */
  steps?: string[];
}

/**
 * "How it works" — spec §9.3 item 6.
 *
 * The diagram is inline SVG drawn with `currentColor` and CSS variables, never
 * a PNG: it inherits the theme, stays sharp at any zoom, costs no request, and
 * is readable in a diff. A screenshot of a diagram is a diagram you cannot fix.
 *
 * It is a labelled flow rather than a freeform canvas on purpose. A generic
 * diagram builder would let every product invent its own visual language; this
 * gives them all the same one, and anything genuinely bespoke belongs in the
 * MDX body as its own SVG.
 *
 * The SVG is `aria-hidden` — the numbered steps below it say the same thing in
 * words, so a screen reader gets the explanation rather than a list of box
 * labels with no relationships between them.
 */
export function Architecture({ flow = [], steps = [] }: ArchitectureProps) {
  if (flow.length === 0 && steps.length === 0) return null;

  const BOX_W = 132;
  const BOX_H = 52;
  const GAP = 40;
  const width = flow.length * BOX_W + Math.max(0, flow.length - 1) * GAP;

  return (
    <section className="my-12">
      <h2 className="t-kicker mb-6 border-b border-line pb-3 text-ink-3">How it works</h2>

      {flow.length > 0 ? (
        <div className="mb-8 overflow-x-auto">
          <svg
            role="img"
            aria-label={`Flow: ${flow.join(", then ")}`}
            viewBox={`0 0 ${width} ${BOX_H + 2}`}
            width={width}
            height={BOX_H + 2}
            className="max-w-full text-ink-3"
          >
            {flow.map((label, index) => {
              const x = index * (BOX_W + GAP);
              return (
                <g key={label}>
                  <rect
                    x={x + 0.5}
                    y={0.5}
                    width={BOX_W - 1}
                    height={BOX_H}
                    rx={2}
                    fill="none"
                    stroke="var(--border-control)"
                    strokeWidth={1}
                  />
                  <text
                    x={x + BOX_W / 2}
                    y={BOX_H / 2 + 1}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="var(--text)"
                    style={{ font: "500 12px var(--font-mono)" }}
                  >
                    {label}
                  </text>

                  {index < flow.length - 1 ? (
                    <g stroke="var(--accent)" strokeWidth={1}>
                      <line
                        x1={x + BOX_W}
                        y1={BOX_H / 2}
                        x2={x + BOX_W + GAP - 6}
                        y2={BOX_H / 2}
                      />
                      <polyline
                        points={`${x + BOX_W + GAP - 11},${BOX_H / 2 - 4} ${x + BOX_W + GAP - 6},${BOX_H / 2} ${x + BOX_W + GAP - 11},${BOX_H / 2 + 4}`}
                        fill="none"
                      />
                    </g>
                  ) : null}
                </g>
              );
            })}
          </svg>
        </div>
      ) : null}

      {steps.length > 0 ? (
        <ol className="border-t border-line">
          {steps.map((step, index) => (
            <li key={step} className="flex gap-5 border-b border-line py-4">
              <span className="t-mono-sm shrink-0 tabular-nums text-accent">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="t-body-sm text-ink-2">{step}</span>
            </li>
          ))}
        </ol>
      ) : null}
    </section>
  );
}

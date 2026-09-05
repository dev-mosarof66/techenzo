import { cn } from "@/lib/utils";

/**
 * Technologies as one quiet mono line — spec §8.9. Not links, not chips, not
 * logos: a wall of framework badges says "we used things", which is not a claim
 * worth making.
 *
 * Caps at five and counts the rest; the full list lives on the detail page.
 */
export function TechList({
  items,
  max = 5,
  className,
}: {
  items: readonly string[];
  max?: number;
  className?: string;
}) {
  if (items.length === 0) return null;

  const visible = items.slice(0, max);
  const hidden = items.length - visible.length;

  return (
    <p
      className={cn("t-mono-sm text-ink-3", className)}
      title={hidden > 0 ? items.join(" · ") : undefined}
    >
      {visible.join(" · ")}
      {hidden > 0 ? ` +${hidden}` : ""}
    </p>
  );
}

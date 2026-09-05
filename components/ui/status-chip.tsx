import type { ProductStatus } from "@/types/content";

/**
 * Status is never colour alone — the dot always travels with its label
 * (spec §8.8). Every value below clears 5:1 against both surfaces.
 */
const STATUS: Record<ProductStatus, { label: string; color: string }> = {
  idea: { label: "Idea", color: "var(--status-idea)" },
  building: { label: "Building", color: "var(--status-building)" },
  beta: { label: "Beta", color: "var(--status-beta)" },
  launched: { label: "Live", color: "var(--status-launched)" },
  archived: { label: "Archived", color: "var(--status-archived)" },
};

export function StatusChip({ status }: { status: ProductStatus }) {
  const { label, color } = STATUS[status];

  return (
    <span
      className="inline-flex h-[22px] items-center gap-1.5 rounded-full border px-2.5 font-mono text-xs leading-none"
      style={{
        color,
        borderColor: `color-mix(in srgb, ${color} 24%, transparent)`,
        backgroundColor: `color-mix(in srgb, ${color} 10%, transparent)`,
      }}
    >
      <span
        aria-hidden="true"
        className="size-1.5 shrink-0 rounded-full bg-current"
      />
      {label}
    </span>
  );
}

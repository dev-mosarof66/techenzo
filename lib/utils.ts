type ClassValue = string | number | false | null | undefined;

/**
 * Minimal class joiner. Deliberately not clsx + tailwind-merge — the component
 * layer composes classes from fixed variant maps rather than merging arbitrary
 * overrides, so there is nothing for a merger to resolve. Revisit if that
 * stops being true.
 */
export function cn(...values: ClassValue[]): string {
  return values.filter(Boolean).join(" ");
}

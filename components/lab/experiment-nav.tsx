import { PrevNextNav } from "@/components/ui/prev-next-nav";
import type { ExperimentNeighbours } from "@/lib/content";

/**
 * Thin adapter over the shared prev/next component — the Lab and the writing
 * index need identical behaviour, and two copies of "which side does the
 * surviving link keep" would drift.
 */
export function ExperimentNav({ newer, older }: ExperimentNeighbours) {
  return (
    <PrevNextNav
      label="More experiments"
      newer={
        newer
          ? { href: `/lab/${newer.slug}`, title: newer.title, eyebrow: newer.id }
          : null
      }
      older={
        older
          ? { href: `/lab/${older.slug}`, title: older.title, eyebrow: older.id }
          : null
      }
    />
  );
}

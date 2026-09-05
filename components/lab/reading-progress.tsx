"use client";

import { useEffect, useRef } from "react";

/**
 * Reading progress through an article — spec §9.6.
 *
 * Three things this deliberately does not do:
 *  - No React state. Storing progress in state would re-render the tree on
 *    every scroll frame; the bar's transform is mutated directly instead, so
 *    scrolling costs one style write per frame and no reconciliation.
 *  - No transition on the bar. Progress must track the scroll 1:1 — easing it
 *    would make the indicator lag the thing it indicates.
 *  - Transform only, never width. `scaleX` runs on the compositor; animating
 *    width would force layout on every frame.
 *
 * Measured against the article rather than the document, because the header and
 * footer would otherwise report the reader as further along than they are.
 *
 * `aria-hidden`: this duplicates no information a screen reader needs, and a
 * live region updating on every scroll frame would be unusable.
 */
export function ReadingProgress({ targetId }: { targetId: string }) {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bar = barRef.current;
    const target = document.getElementById(targetId);
    if (!bar || !target) return;

    let frame = 0;

    const update = () => {
      frame = 0;
      const rect = target.getBoundingClientRect();
      const start = window.scrollY + rect.top;
      const distance = rect.height - window.innerHeight;
      // A short article that fits on screen is fully read on arrival.
      const progress = distance <= 0 ? 1 : (window.scrollY - start) / distance;
      bar.style.transform = `scaleX(${Math.min(1, Math.max(0, progress))})`;
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [targetId]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-[var(--z-progress)] h-0.5"
    >
      <div
        ref={barRef}
        className="h-full origin-left scale-x-0 bg-accent will-change-transform"
      />
    </div>
  );
}

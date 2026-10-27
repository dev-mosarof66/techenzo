import type { CSSProperties } from "react";

/**
 * Spread onto an element to scroll-reveal it (see RevealObserver). `index`
 * staggers siblings at 60ms, capped at the 6th — spec §6.2.1.
 *
 * Lives outside the observer's "use client" module so server components can
 * call it: a function exported from a client module is a reference, not code.
 */
export function reveal(index = 0) {
  return {
    "data-reveal": "idle",
    style: { "--reveal-index": Math.min(index, 5) } as CSSProperties,
  };
}

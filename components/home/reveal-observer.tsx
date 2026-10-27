"use client";

import { useEffect } from "react";

/**
 * Scroll reveal — spec §6.2.1. Flips every `data-reveal="idle"` on the page to
 * "in" the first time 20% of it is on screen, then stops watching it.
 *
 * Content is never stranded at opacity 0: reduced motion forces the final
 * state in tokens.css, a `<noscript>` rule covers no-JS, and a browser without
 * IntersectionObserver gets everything revealed at once.
 */
export function RevealObserver() {
  useEffect(() => {
    const targets = Array.from(
      document.querySelectorAll<HTMLElement>('[data-reveal="idle"]'),
    );
    if (targets.length === 0) return;

    if (!("IntersectionObserver" in window)) {
      targets.forEach((el) => (el.dataset.reveal = "in"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          (entry.target as HTMLElement).dataset.reveal = "in";
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.2 },
    );

    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <noscript>
      <style>{`[data-reveal]{opacity:1!important;transform:none!important}`}</style>
    </noscript>
  );
}

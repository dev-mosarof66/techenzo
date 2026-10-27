"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

/**
 * The headline's one moving part: the noun cycles while the sentence around it
 * holds still. The slot's width eases to each word's measured width, so the
 * rest of the line slides instead of jumping.
 *
 * Screen readers get the first word as plain text and never hear the cycle.
 * Under reduced motion the word simply does not change.
 */
export function HeroWord({ words, interval = 2400 }: { words: string[]; interval?: number }) {
  const [index, setIndex] = useState(0);
  const [width, setWidth] = useState<number | undefined>(undefined);
  const measures = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % words.length), interval);
    return () => window.clearInterval(id);
  }, [words.length, interval]);

  useLayoutEffect(() => {
    const measure = () => setWidth(measures.current[index]?.offsetWidth);
    measure();
    // Fonts swap in after first paint and change every width.
    document.fonts?.ready.then(measure);
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [index]);

  return (
    <>
      <span className="sr-only">{words[0]}</span>
      <span
        aria-hidden="true"
        className="relative inline-block overflow-hidden pb-[0.12em] -mb-[0.12em] align-bottom transition-[width] duration-[var(--dur-deliberate)] ease-[var(--ease-entrance)]"
        style={{ width }}
      >
        <span key={words[index]} className="hero-word inline-block whitespace-nowrap text-accent">
          {words[index]}
        </span>

        {/* Off-screen measurers — one per word, same type styles. */}
        <span className="pointer-events-none invisible absolute top-0 left-0">
          {words.map((word, i) => (
            <span
              key={word}
              ref={(el) => {
                measures.current[i] = el;
              }}
              className="absolute top-0 left-0 whitespace-nowrap"
            >
              {word}
            </span>
          ))}
        </span>
      </span>
    </>
  );
}

"use client";

import { useRef, type ReactNode } from "react";

/**
 * The hero's grid field, with an accent copy of the grid revealed in a soft
 * circle under the pointer. Writes two CSS variables per frame and nothing
 * else — the drawing is all in `.hero-spot` in globals.css. Touch and
 * keyboard users get the plain grid field.
 */
export function HeroSpotlight({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const frame = useRef(0);

  function onPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "mouse") return;
    const el = ref.current;
    if (!el) return;
    const { clientX, clientY } = event;
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      const rect = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${clientX - rect.left}px`);
      el.style.setProperty("--my", `${clientY - rect.top}px`);
    });
  }

  return (
    <div ref={ref} onPointerMove={onPointerMove} className="grid-field hero-spot overflow-x-clip pt-8 pb-10 lg:pt-12">
      {children}
    </div>
  );
}

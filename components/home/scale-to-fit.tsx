"use client";

import { useLayoutEffect, useRef, useState, type ReactNode } from "react";

/**
 * Lays its children out at one fixed design size and scales the whole thing
 * down to the available width — never up. Used for the hero's card collage, so
 * a phone shows the same composition as a desktop instead of a reflowed stack.
 *
 * The outer box reserves the scaled height, so nothing below it jumps.
 */
export function ScaleToFit({
  width,
  height,
  children,
}: {
  width: number;
  height: number;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fit = () => setScale(Math.min(1, el.clientWidth / width));
    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(el);
    return () => observer.disconnect();
  }, [width]);

  return (
    <div
      ref={ref}
      className="relative mx-auto w-full"
      style={{ maxWidth: width, height: height * scale }}
    >
      <div
        className="absolute top-0 left-0 origin-top-left"
        style={{ width, height, transform: `scale(${scale})` }}
      >
        {children}
      </div>
    </div>
  );
}

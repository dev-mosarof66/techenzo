"use client";

import { useCallback, useEffect, useState } from "react";
import { Monitor, Moon, Sun } from "lucide-react";
import { THEME_STORAGE_KEY } from "./theme-script";

type Theme = "system" | "light" | "dark";

const CYCLE: Theme[] = ["system", "light", "dark"];

const ICON = {
  system: Monitor,
  light: Sun,
  dark: Moon,
} as const;

/** aria-label names the ACTION, not the current state — spec §8.17. */
const NEXT_LABEL = {
  system: "Switch to light theme",
  light: "Switch to dark theme",
  dark: "Use system theme",
} as const;

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("system");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    let stored: string | null = null;
    try {
      stored = localStorage.getItem(THEME_STORAGE_KEY);
    } catch {
      // Private mode or blocked storage — system is the correct fallback.
    }
    if (stored === "light" || stored === "dark") setTheme(stored);
    setMounted(true);
  }, []);

  const cycle = useCallback(() => {
    setTheme((current) => {
      const next = CYCLE[(CYCLE.indexOf(current) + 1) % CYCLE.length];
      const root = document.documentElement;
      if (next === "system") {
        root.removeAttribute("data-theme");
        try {
          localStorage.removeItem(THEME_STORAGE_KEY);
        } catch {}
      } else {
        root.setAttribute("data-theme", next);
        try {
          localStorage.setItem(THEME_STORAGE_KEY, next);
        } catch {}
      }
      return next;
    });
  }, []);

  // Until mounted we cannot know the stored value, so render the neutral icon.
  // Same box, same size — nothing shifts when the real state arrives.
  const Icon = mounted ? ICON[theme] : Monitor;

  return (
    <button
      type="button"
      onClick={cycle}
      aria-label={mounted ? NEXT_LABEL[theme] : "Change theme"}
      title={mounted ? `Theme: ${theme}` : undefined}
      className="grid size-8 place-items-center rounded-sm text-ink-3 transition-colors duration-[var(--dur-fast)] hover:bg-raised hover:text-ink"
    >
      <Icon size={16} strokeWidth={1.5} aria-hidden="true" />
    </button>
  );
}

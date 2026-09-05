"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { nav, socialProfiles } from "@/config/site";
import { Wordmark } from "./wordmark";

/**
 * Full-screen sheet, not a drawer — spec §7.2. Body scroll locked, focus
 * trapped, Esc closes, and the caller closes it on route change.
 */
export function MobileNav({ open, onClose }: { open: boolean; onClose: () => void }) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key !== "Tab" || !sheetRef.current) return;

      const focusable = sheetRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = overflow;
      previouslyFocused?.focus();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      ref={sheetRef}
      role="dialog"
      aria-modal="true"
      aria-label="Site navigation"
      className="fixed inset-0 z-[60] flex flex-col bg-canvas lg:hidden"
      style={{
        animation:
          "sheet-in var(--dur-slow) var(--ease-entrance) both",
      }}
    >
      <div className="flex h-16 shrink-0 items-center justify-between px-[var(--page-pad)]">
        <Wordmark />
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close navigation"
          className="-mr-2.5 grid size-11 place-items-center rounded-sm text-ink-2 hover:text-ink"
        >
          <X size={24} strokeWidth={1.5} aria-hidden="true" />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-[var(--page-pad)] pt-6">
        <ul className="flex flex-col">
          {nav.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={onClose}
                className="flex items-baseline gap-4 border-b border-line py-5"
              >
                <span className="t-kicker text-accent">{item.index}</span>
                <span className="t-h3">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="shrink-0 border-t border-line px-[var(--page-pad)] py-6">
        <div className="t-mono-sm flex gap-5 text-ink-3">
          {socialProfiles.map(({ label, href }) => (
            <a key={label} href={href} target="_blank" rel="noopener noreferrer">
              {label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

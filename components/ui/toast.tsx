"use client";

import { useEffect, useRef, useState } from "react";
import { AlertCircle, X } from "lucide-react";

/**
 * Transient message — spec §8.20.
 *
 * Deliberately NOT a global provider. A context in the root layout would put
 * this component's JavaScript on every page, including the many that never
 * raise a toast. It is rendered locally by whatever needs it, so pages that do
 * not use it pay nothing.
 *
 * Behaviour the spec asks for and this implements: auto-dismiss at 5s, paused
 * while hovered or focused (so a message cannot vanish mid-read, and cannot be
 * yanked away while someone is tabbing to its close button), always manually
 * dismissible, and `role="alert"` for errors so it is announced.
 */
export function Toast({
  message,
  tone = "error",
  onDismiss,
  duration = 5000,
}: {
  message: string;
  tone?: "error" | "info";
  onDismiss: () => void;
  duration?: number;
}) {
  const [paused, setPaused] = useState(false);
  const remaining = useRef(duration);
  const startedAt = useRef(Date.now());

  useEffect(() => {
    if (paused) return;
    startedAt.current = Date.now();
    const timer = setTimeout(onDismiss, remaining.current);
    return () => {
      // Bank the time already elapsed so resuming does not restart the clock.
      remaining.current -= Date.now() - startedAt.current;
      clearTimeout(timer);
    };
  }, [paused, onDismiss]);

  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      className="fixed inset-x-4 bottom-4 z-[var(--z-toast)] flex items-start gap-3 rounded-sm border border-control bg-raised p-4 shadow-[var(--shadow-layer)] sm:inset-x-auto sm:right-6 sm:max-w-sm"
    >
      <AlertCircle
        size={18}
        strokeWidth={1.5}
        aria-hidden="true"
        className={`mt-px shrink-0 ${tone === "error" ? "text-status-regression" : "text-accent"}`}
      />
      <p className="t-body-sm flex-1 text-ink">{message}</p>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss"
        className="-m-1 shrink-0 rounded-sm p-1 text-ink-3 transition-colors duration-[var(--dur-fast)] hover:text-ink"
      >
        <X size={16} strokeWidth={1.5} aria-hidden="true" />
      </button>
    </div>
  );
}

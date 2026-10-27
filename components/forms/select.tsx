"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { Check, ChevronDown } from "lucide-react";

/**
 * A styled dropdown in the site's rounded language, replacing the browser's
 * native <select>. Built on the ARIA select-only combobox pattern: a button
 * that owns a listbox, so screen readers announce it as a dropdown and the
 * keyboard works the way people expect —
 *
 *   Enter / Space / ↓ / ↑  open, and move the highlight while open
 *   Home / End              first / last option
 *   Enter / Space           pick the highlighted option
 *   Esc / Tab / click away  close without changing anything
 *   a letter                jump to the next option starting with it
 */
export function Select({
  label,
  options,
  value,
  onChange,
  disabled,
}: {
  label: string;
  options: readonly string[];
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(() => Math.max(0, options.indexOf(value)));
  const root = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);

  // Close on any pointer down outside the control.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  function openMenu() {
    setActive(Math.max(0, options.indexOf(value)));
    setOpen(true);
  }

  function choose(index: number) {
    onChange(options[index]);
    setOpen(false);
    button.current?.focus();
  }

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    const last = options.length - 1;

    if (!open) {
      if (["Enter", " ", "ArrowDown", "ArrowUp"].includes(event.key)) {
        event.preventDefault();
        openMenu();
      }
      return;
    }

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        setActive((i) => Math.min(last, i + 1));
        break;
      case "ArrowUp":
        event.preventDefault();
        setActive((i) => Math.max(0, i - 1));
        break;
      case "Home":
        event.preventDefault();
        setActive(0);
        break;
      case "End":
        event.preventDefault();
        setActive(last);
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        choose(active);
        break;
      case "Escape":
        event.preventDefault();
        setOpen(false);
        break;
      case "Tab":
        setOpen(false);
        break;
      default:
        if (event.key.length === 1) {
          const key = event.key.toLowerCase();
          const next = options.findIndex(
            (option, i) => i > active && option.toLowerCase().startsWith(key),
          );
          const wrapped = next === -1 ? options.findIndex((o) => o.toLowerCase().startsWith(key)) : next;
          if (wrapped !== -1) setActive(wrapped);
        }
    }
  }

  return (
    <div ref={root} className="relative">
      <span id={`${id}-label`} className="mb-2 block text-sm font-medium text-ink">
        {label}
      </span>

      <button
        ref={button}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={`${id}-list`}
        aria-labelledby={`${id}-label ${id}-value`}
        aria-activedescendant={open ? `${id}-opt-${active}` : undefined}
        disabled={disabled}
        onClick={() => (open ? setOpen(false) : openMenu())}
        onKeyDown={onKeyDown}
        className={`flex w-full items-center justify-between gap-3 rounded-xl border bg-raised px-4 py-3 text-left text-sm text-ink transition-[border-color,box-shadow] duration-[var(--dur-fast)] hover:border-line-strong focus-visible:border-accent focus-visible:shadow-[0_0_0_3px_color-mix(in_srgb,var(--accent)_22%,transparent)] disabled:cursor-not-allowed disabled:opacity-60 ${
          open ? "border-accent" : "border-control"
        }`}
      >
        <span id={`${id}-value`} className="truncate">
          {value}
        </span>
        <ChevronDown
          size={16}
          strokeWidth={2}
          aria-hidden="true"
          className={`shrink-0 text-ink-3 transition-transform duration-[var(--dur-base)] ${open ? "rotate-180 text-accent" : ""}`}
        />
      </button>

      {open ? (
        <ul
          id={`${id}-list`}
          role="listbox"
          aria-labelledby={`${id}-label`}
          className="select-menu absolute top-full right-0 left-0 z-30 mt-2 max-h-64 overflow-auto rounded-xl border border-line-strong bg-raised p-1.5 shadow-[var(--shadow-layer)]"
        >
          {options.map((option, index) => {
            const selected = option === value;
            const highlighted = index === active;
            return (
              <li
                key={option}
                id={`${id}-opt-${index}`}
                role="option"
                aria-selected={selected}
                // Keep focus on the button: picking happens on pointer down's
                // matching click, without the button ever blurring first.
                onMouseDown={(event) => event.preventDefault()}
                onMouseEnter={() => setActive(index)}
                onClick={() => choose(index)}
                className={`flex cursor-pointer items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors duration-[var(--dur-fast)] ${
                  highlighted ? "bg-canvas text-ink" : "text-ink-2"
                } ${selected ? "font-medium text-accent" : ""}`}
              >
                {option}
                {selected ? <Check size={15} strokeWidth={2.25} aria-hidden="true" className="text-accent" /> : null}
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}

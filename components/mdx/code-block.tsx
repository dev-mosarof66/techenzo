"use client";

import { useRef, useState, type ReactNode } from "react";
import { Check, Copy } from "lucide-react";
import { Toast } from "@/components/ui/toast";

/**
 * Wraps Shiki's rendered <pre>. Highlighting happens at build time — this
 * client boundary exists only for the copy button, so a page with code on it
 * ships a few hundred bytes of JS rather than a syntax highlighter.
 *
 * Colours here are hardcoded dark values on purpose: `--bg-code` is dark in
 * both site themes (spec §2.2), so the strip's contents are always light-on-dark
 * and must not follow the theme tokens.
 */

function CopyButton({
  onCopy,
  copied,
  floating,
}: {
  onCopy: () => void;
  copied: boolean;
  floating?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onCopy}
      aria-label={copied ? "Copied to clipboard" : "Copy code"}
      className={
        "inline-flex shrink-0 items-center gap-1.5 rounded-sm font-mono text-xs text-[#AEB4BC] transition-[color,opacity] duration-[var(--dur-fast)] hover:text-[#F4F5F7] " +
        (floating
          ? "absolute right-3 top-3 border border-[#2A2E35] bg-[#0A0B0D] px-2.5 py-1.5 opacity-0 focus-visible:opacity-100 group-hover:opacity-100"
          : "")
      }
    >
      {copied ? (
        <Check size={13} strokeWidth={1.5} aria-hidden="true" />
      ) : (
        <Copy size={13} strokeWidth={1.5} aria-hidden="true" />
      )}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

export function CodeBlock({
  title,
  language,
  children,
}: {
  title?: string;
  language?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const [failed, setFailed] = useState(false);

  // A fence with neither a filename nor a language gets no strip — a header
  // bar with nothing in it is chrome for its own sake.
  const framed = Boolean(title || language);

  async function copy() {
    const text = ref.current?.querySelector("code")?.textContent ?? "";
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Previously this returned silently, so a blocked clipboard looked
      // identical to a button that simply did not work.
      setFailed(true);
      return;
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div ref={ref} className={`group relative my-8 ${framed ? "code-frame" : ""}`}>
      {framed ? (
        <div className="flex items-center justify-between gap-4 border-b border-[#2A2E35] bg-[#0A0B0D] px-3.5 py-2 font-mono text-xs">
          <span className="truncate text-[#838A94]" title={title}>
            {title}
          </span>
          <span className="flex shrink-0 items-center gap-3.5">
            {language ? <span className="text-[#838A94]">{language}</span> : null}
            <CopyButton onCopy={copy} copied={copied} />
          </span>
        </div>
      ) : null}

      {children}

      {framed ? null : <CopyButton onCopy={copy} copied={copied} floating />}

      <span aria-live="polite" className="sr-only">
        {copied ? "Copied to clipboard" : ""}
      </span>

      {failed ? (
        <Toast
          message="Your browser blocked the clipboard. Select the code and copy it manually."
          onDismiss={() => setFailed(false)}
        />
      ) : null}
    </div>
  );
}

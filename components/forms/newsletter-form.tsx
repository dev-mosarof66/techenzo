"use client";

import { useRef, useState, type FormEvent } from "react";
import { AlertCircle, Check } from "lucide-react";
import { Honeypot } from "./honeypot";

type Status = "idle" | "submitting" | "success" | "error";

/**
 * Newsletter signup — spec §8.15.
 *
 * Validation happens on submit, never on keystroke: a red border while someone
 * is still halfway through typing their address is the form telling them they
 * are wrong before they have finished being right.
 */
export function NewsletterForm({
  variant = "inline",
}: {
  variant?: "inline" | "block";
}) {
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [startedAt] = useState(() => Date.now());
  const successRef = useRef<HTMLParagraphElement>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "submitting") return;

    setStatus("submitting");
    setError(null);

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, company, startedAt }),
      });
      const data = (await response.json()) as { ok: boolean; error?: string };

      if (data.ok) {
        setStatus("success");
        // Move focus to the confirmation: the form that had focus is gone.
        requestAnimationFrame(() => successRef.current?.focus());
        return;
      }

      setStatus("error");
      setError(data.error ?? "Couldn't sign you up. Try again in a minute.");
    } catch {
      setStatus("error");
      setError("Couldn't reach the server. Check your connection and try again.");
    }
  }

  if (status === "success") {
    return (
      <p
        ref={successRef}
        tabIndex={-1}
        className="t-body-sm flex items-center gap-2.5 text-ink-2 outline-none"
      >
        <span className="grid size-5 shrink-0 place-items-center rounded-full bg-status-launched text-canvas">
          <Check size={12} strokeWidth={3} aria-hidden="true" />
        </span>
        You&rsquo;re in. First issue when the next experiment lands.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="relative">
      {variant === "block" ? (
        <p className="t-body-lg measure-copy mb-5 text-ink-2">
          One email when something ships — a new experiment, a product, or a
          result worth arguing with.
        </p>
      ) : null}

      <div className="flex max-w-md flex-wrap gap-2.5">
        <label htmlFor="newsletter-email" className="sr-only">
          Email address
        </label>
        <input
          id="newsletter-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@company.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          disabled={status === "submitting"}
          aria-invalid={status === "error" || undefined}
          aria-describedby={error ? "newsletter-error" : undefined}
          className={`h-10 min-w-0 flex-1 rounded-sm border bg-raised px-3 text-sm text-ink transition-colors duration-[var(--dur-fast)] placeholder:text-ink-3 focus:border-accent disabled:opacity-60 ${
            status === "error" ? "border-status-regression" : "border-control"
          }`}
        />
        <button
          type="submit"
          disabled={status === "submitting"}
          className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-sm bg-accent px-4 text-sm font-medium text-on-accent transition-colors duration-[var(--dur-fast)] hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-40"
        >
          {status === "submitting" ? (
            <span
              aria-hidden="true"
              className="size-3.5 animate-spin rounded-full border-[1.5px] border-current border-r-transparent"
            />
          ) : null}
          {status === "submitting" ? "Signing up" : "Subscribe"}
        </button>
      </div>

      <Honeypot value={company} onChange={setCompany} />

      {error ? (
        <p
          id="newsletter-error"
          role="alert"
          className="t-body-sm mt-2.5 flex items-start gap-2 text-status-regression"
        >
          <AlertCircle size={16} strokeWidth={1.5} aria-hidden="true" className="mt-0.5 shrink-0" />
          {error}
        </p>
      ) : null}

      <p className="t-caption mt-3 text-ink-3">
        One email when something ships. No spam, unsubscribe in one click.
      </p>
    </form>
  );
}

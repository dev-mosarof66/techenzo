"use client";

import { useRef, useState, type FormEvent } from "react";
import { AlertCircle, Check } from "lucide-react";
import { Honeypot } from "./honeypot";

type Status = "idle" | "submitting" | "success" | "error";

const SUBJECTS = ["Work together", "Product question", "Something else"] as const;

const FIELD =
  "w-full rounded-sm border bg-raised px-3 py-2 text-sm text-ink transition-colors duration-[var(--dur-fast)] placeholder:text-ink-3 focus:border-accent disabled:opacity-60";

/**
 * Contact form — spec §8.16.
 *
 * Labels are always visible above the field. A placeholder used as a label
 * disappears the moment someone starts typing, which is exactly when they need
 * it, and it leaves a screen reader with nothing to announce.
 */
export function ContactForm() {
  const [values, setValues] = useState({
    name: "",
    email: "",
    subject: SUBJECTS[0] as string,
    message: "",
  });
  const [company, setCompany] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [badFields, setBadFields] = useState<string[]>([]);
  const [startedAt] = useState(() => Date.now());
  const successRef = useRef<HTMLDivElement>(null);

  const set = (key: keyof typeof values) => (value: string) =>
    setValues((current) => ({ ...current, [key]: value }));

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "submitting") return;

    setStatus("submitting");
    setError(null);
    setBadFields([]);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, company, startedAt }),
      });
      const data = (await response.json()) as {
        ok: boolean;
        error?: string;
        fields?: string[];
      };

      if (data.ok) {
        setStatus("success");
        requestAnimationFrame(() => successRef.current?.focus());
        return;
      }

      setStatus("error");
      setBadFields(data.fields ?? []);
      setError(data.error ?? "Couldn't send that message.");
    } catch {
      setStatus("error");
      setError("Couldn't reach the server. Check your connection and try again.");
    }
  }

  if (status === "success") {
    return (
      <div
        ref={successRef}
        tabIndex={-1}
        className="rounded-sm border border-line p-6 outline-none"
      >
        <p className="t-h3 flex items-center gap-3">
          <span className="grid size-6 shrink-0 place-items-center rounded-full bg-status-launched text-canvas">
            <Check size={14} strokeWidth={3} aria-hidden="true" />
          </span>
          Message sent.
        </p>
        <p className="t-body-sm mt-3 text-ink-2">
          Usually a reply within two days. If it&rsquo;s urgent, email{" "}
          <a href="mailto:hello@techenzo.com" className="link-draw text-accent">
            hello@techenzo.com
          </a>{" "}
          directly.
        </p>
      </div>
    );
  }

  const invalid = (field: string) => badFields.includes(field);
  const border = (field: string) =>
    invalid(field) ? "border-status-regression" : "border-control";

  return (
    <form onSubmit={onSubmit} noValidate className="relative flex flex-col gap-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-name" className="t-body-sm mb-2 block text-ink">
            Name
          </label>
          <input
            id="contact-name"
            type="text"
            required
            autoComplete="name"
            value={values.name}
            onChange={(event) => set("name")(event.target.value)}
            disabled={status === "submitting"}
            aria-invalid={invalid("name") || undefined}
            className={`${FIELD} ${border("name")}`}
          />
        </div>

        <div>
          <label htmlFor="contact-email" className="t-body-sm mb-2 block text-ink">
            Email
          </label>
          <input
            id="contact-email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@company.com"
            value={values.email}
            onChange={(event) => set("email")(event.target.value)}
            disabled={status === "submitting"}
            aria-invalid={invalid("email") || undefined}
            className={`${FIELD} ${border("email")}`}
          />
        </div>
      </div>

      <div>
        <label htmlFor="contact-subject" className="t-body-sm mb-2 block text-ink">
          Subject
        </label>
        <select
          id="contact-subject"
          value={values.subject}
          onChange={(event) => set("subject")(event.target.value)}
          disabled={status === "submitting"}
          className={`${FIELD} ${border("subject")}`}
        >
          {SUBJECTS.map((subject) => (
            <option key={subject} value={subject}>
              {subject}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="contact-message" className="t-body-sm mb-2 block text-ink">
          Message
        </label>
        <textarea
          id="contact-message"
          rows={6}
          required
          minLength={20}
          value={values.message}
          onChange={(event) => set("message")(event.target.value)}
          disabled={status === "submitting"}
          aria-invalid={invalid("message") || undefined}
          aria-describedby="contact-message-hint"
          className={`${FIELD} ${border("message")} resize-y`}
        />
        <p id="contact-message-hint" className="t-caption mt-2 text-ink-3">
          What you&rsquo;re building, what you need, and any deadline. At least 20 characters.
        </p>
      </div>

      <Honeypot value={company} onChange={setCompany} />

      {error ? (
        <p
          role="alert"
          className="t-body-sm flex items-start gap-2 text-status-regression"
        >
          <AlertCircle size={16} strokeWidth={1.5} aria-hidden="true" className="mt-0.5 shrink-0" />
          {error}
        </p>
      ) : null}

      <div>
        <button
          type="submit"
          disabled={status === "submitting"}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-sm bg-accent px-4 text-sm font-medium text-on-accent transition-colors duration-[var(--dur-fast)] hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-40"
        >
          {status === "submitting" ? (
            <span
              aria-hidden="true"
              className="size-3.5 animate-spin rounded-full border-[1.5px] border-current border-r-transparent"
            />
          ) : null}
          {status === "submitting" ? "Sending" : "Send message"}
        </button>
      </div>
    </form>
  );
}

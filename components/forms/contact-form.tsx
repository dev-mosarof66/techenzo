"use client";

import { useRef, useState, type FormEvent } from "react";
import { AlertCircle, ArrowRight, Check } from "lucide-react";
import { Honeypot } from "./honeypot";
import { Select } from "./select";
import { LEAD_BUDGETS, LEAD_SERVICES } from "@/lib/contact-options";

type Status = "idle" | "submitting" | "success" | "error";

const SUBJECTS = ["Work together", "Product question", "Something else"] as const;
/** The subject that turns a message into a lead and asks for the details to score it. */
const LEAD_SUBJECT = SUBJECTS[0];

const FIELD =
  "w-full rounded-xl border bg-raised px-4 py-3 text-sm text-ink transition-colors duration-[var(--dur-fast)] placeholder:text-ink-3 focus:border-accent focus:shadow-[0_0_0_3px_color-mix(in_srgb,var(--accent)_22%,transparent)] disabled:opacity-60";

const LABEL = "mb-2 block text-sm font-medium text-ink";

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
    organisation: "",
    service: LEAD_SERVICES[0] as string,
    budget: LEAD_BUDGETS[0] as string,
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

    // Lead details only travel with a lead; switching subject away leaves them behind.
    const { organisation, service, budget, ...base } = values;
    const lead = values.subject === LEAD_SUBJECT ? { organisation, service, budget } : {};

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...base, ...lead, company, startedAt }),
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
        className="rounded-2xl border border-line bg-raised p-6 outline-none"
      >
        <p className="t-h3 flex items-center gap-3">
          <span className="grid size-6 shrink-0 place-items-center rounded-full bg-status-launched text-canvas">
            <Check size={14} strokeWidth={3} aria-hidden="true" />
          </span>
          Message sent.
        </p>
        <p className="t-body-sm mt-3 text-ink-2">
          Usually a reply within two days. If it&rsquo;s urgent, email{" "}
          <a href="mailto:techenzo.official@gmail.com" className="link-draw text-accent">
            techenzo.official@gmail.com
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
          <label htmlFor="contact-name" className={LABEL}>
            Name
          </label>
          <input
            id="contact-name"
            type="text"
            required
            autoComplete="name"
            placeholder="Your name"
            value={values.name}
            onChange={(event) => set("name")(event.target.value)}
            disabled={status === "submitting"}
            aria-invalid={invalid("name") || undefined}
            className={`${FIELD} ${border("name")}`}
          />
        </div>

        <div>
          <label htmlFor="contact-email" className={LABEL}>
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

      <Select
        label="Subject"
        options={SUBJECTS}
        value={values.subject}
        onChange={set("subject")}
        disabled={status === "submitting"}
      />

      {values.subject === LEAD_SUBJECT ? (
        <>
          <div>
            <label htmlFor="contact-organisation" className={LABEL}>
              Company <span className="text-ink-3">(optional)</span>
            </label>
            <input
              id="contact-organisation"
              type="text"
              autoComplete="organization"
              placeholder="Company or project name"
              value={values.organisation}
              onChange={(event) => set("organisation")(event.target.value)}
              disabled={status === "submitting"}
              aria-invalid={invalid("organisation") || undefined}
              className={`${FIELD} ${border("organisation")}`}
            />
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Select
              label="What do you need?"
              options={LEAD_SERVICES}
              value={values.service}
              onChange={set("service")}
              disabled={status === "submitting"}
            />
            <Select
              label="Monthly budget"
              options={LEAD_BUDGETS}
              value={values.budget}
              onChange={set("budget")}
              disabled={status === "submitting"}
            />
          </div>
        </>
      ) : null}

      <div>
        <label htmlFor="contact-message" className={LABEL}>
          Message
        </label>
        <textarea
          id="contact-message"
          rows={6}
          required
          minLength={20}
          placeholder="What do you want to automate, how does it work today, and when do you need it?"
          value={values.message}
          onChange={(event) => set("message")(event.target.value)}
          disabled={status === "submitting"}
          aria-invalid={invalid("message") || undefined}
          aria-describedby="contact-message-hint"
          className={`${FIELD} ${border("message")} resize-y rounded-2xl`}
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
          className="group inline-flex h-12 items-center gap-3 rounded-full bg-accent pr-1.5 pl-6 text-[0.9375rem] font-semibold text-on-accent shadow-[0_10px_40px_-8px_color-mix(in_srgb,var(--accent)_60%,transparent)] transition-colors duration-[var(--dur-fast)] hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === "submitting" ? "Sending" : "Send message"}
          <span
            aria-hidden="true"
            className="grid size-9 place-items-center rounded-full bg-[var(--paper)] text-[var(--ink-950)]"
          >
            {status === "submitting" ? (
              <span className="size-3.5 animate-spin rounded-full border-[1.5px] border-current border-r-transparent" />
            ) : (
              <ArrowRight
                size={17}
                strokeWidth={2}
                className="transition-transform duration-[var(--dur-fast)] group-hover:translate-x-0.5"
              />
            )}
          </span>
        </button>
      </div>
    </form>
  );
}

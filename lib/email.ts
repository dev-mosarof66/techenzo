import { site } from "@/config/site";

/**
 * Outbound email, via Resend's HTTP API directly — no SDK, because two fetch
 * calls do not justify a dependency in the server bundle.
 *
 * Every value here is read from the environment at call time and never at
 * module scope, so nothing can be inlined into a build artefact. None of these
 * names are `NEXT_PUBLIC_*`, so none of them can reach the client bundle.
 */

const RESEND_ENDPOINT = "https://api.resend.com";

export type SendResult =
  | { ok: true }
  | { ok: false; reason: "unconfigured" | "provider" | "duplicate" };

export function newsletterConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY && process.env.RESEND_AUDIENCE_ID);
}

export function contactConfigured(): boolean {
  return Boolean(
    process.env.RESEND_API_KEY &&
      process.env.CONTACT_TO_EMAIL &&
      process.env.CONTACT_FROM_EMAIL,
  );
}

async function resend(path: string, body: unknown): Promise<Response> {
  return fetch(`${RESEND_ENDPOINT}${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    // A hung provider must not hold a request open indefinitely.
    signal: AbortSignal.timeout(8000),
  });
}

/**
 * Adds a subscriber to the audience.
 *
 * Returns `unconfigured` rather than pretending to succeed when the provider
 * is not set up. A form that says "You're in" while storing nothing is lying to
 * the person who filled it in, and they will not find out until the newsletter
 * they expected never arrives.
 */
export async function subscribe(email: string): Promise<SendResult> {
  if (!newsletterConfigured()) return { ok: false, reason: "unconfigured" };

  try {
    const response = await resend(
      `/audiences/${process.env.RESEND_AUDIENCE_ID}/contacts`,
      { email, unsubscribed: false },
    );

    if (response.ok) return { ok: true };

    // Already subscribed is a success from the reader's point of view — they
    // wanted to be on the list, and they are.
    if (response.status === 409) return { ok: false, reason: "duplicate" };

    console.error("newsletter provider error", response.status);
    return { ok: false, reason: "provider" };
  } catch (error) {
    console.error("newsletter request failed", error);
    return { ok: false, reason: "provider" };
  }
}

export async function sendContactMessage(input: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): Promise<SendResult> {
  if (!contactConfigured()) return { ok: false, reason: "unconfigured" };

  // Plain text only. The message is untrusted input, and there is no HTML body
  // for it to escape into.
  const text = [
    `From: ${input.name} <${input.email}>`,
    `Subject: ${input.subject}`,
    "",
    input.message,
  ].join("\n");

  try {
    const response = await resend("/emails", {
      from: process.env.CONTACT_FROM_EMAIL,
      to: [process.env.CONTACT_TO_EMAIL],
      // reply_to, not from — spoofing the sender address would fail SPF and
      // land the whole domain in spam.
      reply_to: input.email,
      subject: `[${site.name}] ${input.subject} — ${input.name}`,
      text,
    });

    if (response.ok) return { ok: true };

    console.error("contact provider error", response.status);
    return { ok: false, reason: "provider" };
  } catch (error) {
    console.error("contact request failed", error);
    return { ok: false, reason: "provider" };
  }
}

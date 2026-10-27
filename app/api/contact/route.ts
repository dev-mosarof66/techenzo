import { z } from "zod";
import { contactConfigured, sendContactMessage } from "@/lib/email";
import { forwardLead, leadsConfigured } from "@/lib/leads";
import { LEAD_BUDGETS, LEAD_SERVICES } from "@/lib/contact-options";
import { clientKey, rateLimit } from "@/lib/rate-limit";
import { site } from "@/config/site";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MIN_FILL_MS = 2000;
const MAX_FORM_AGE_MS = 60 * 60 * 1000;

export const CONTACT_SUBJECTS = [
  "Work together",
  "Product question",
  "Something else",
] as const;

const schema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().toLowerCase().pipe(z.email()).pipe(z.string().max(254)),
  subject: z.enum(CONTACT_SUBJECTS),
  message: z.string().trim().min(20).max(5000),
  /** Lead details, only asked for under "Work together". Not `company` — that name is the honeypot. */
  organisation: z.string().trim().max(200).optional(),
  service: z.enum(LEAD_SERVICES).optional(),
  budget: z.enum(LEAD_BUDGETS).optional(),
  /** Honeypot — accepted by the schema so the handler can answer 200 silently. */
  company: z.string().max(200).optional(),
  startedAt: z.number().int().positive().optional(),
});

const json = (body: unknown, status: number, headers?: HeadersInit) =>
  Response.json(body, { status, headers });

export async function POST(request: Request) {
  // Tighter than the newsletter: a contact form sends mail to a human inbox.
  // Loose in development, where every local test shares one client key.
  const perHour = process.env.NODE_ENV === "production" ? 3 : 50;
  const limit = rateLimit(`contact:${clientKey(request.headers)}`, perHour, 60 * 60 * 1000);
  if (!limit.ok) {
    return json({ ok: false, error: "Too many messages. Try again later." }, 429, {
      "Retry-After": String(limit.retryAfterSeconds),
    });
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return json({ ok: false, error: "Malformed request." }, 400);
  }

  const parsed = schema.safeParse(payload);
  if (!parsed.success) {
    // Field names are safe to return (the client already knows them); the
    // submitted values are not.
    const fields = [...new Set(parsed.error.issues.map((i) => String(i.path[0])))].filter(
      (field) => field !== "company" && field !== "startedAt",
    );
    return json(
      { ok: false, error: "Some fields need another look.", fields },
      400,
    );
  }

  const { company, startedAt, ...message } = parsed.data;

  if (company) return json({ ok: true }, 200);

  if (startedAt !== undefined) {
    const age = Date.now() - startedAt;
    if (age < MIN_FILL_MS || age > MAX_FORM_AGE_MS) return json({ ok: true }, 200);
  }

  const { organisation, service, budget, ...email } = message;

  // Two independent deliveries: the lead workflow (n8n) and the inbox (Resend).
  // Either one landing means a human will see it, so either one is a success.
  const results = await Promise.all([
    leadsConfigured() ? forwardLead(message) : null,
    contactConfigured() ? sendContactMessage(email) : null,
  ]);
  const attempted = results.filter((r) => r !== null);
  if (attempted.some((r) => r.ok)) return json({ ok: true }, 200);

  // Both failure paths name the same fallback, so a message is never simply
  // lost — the person always leaves with a way to reach a human.
  return json(
    {
      ok: false,
      error: `Couldn't send that. Email ${site.social.email} and it'll get through.`,
    },
    attempted.length === 0 ? 503 : 502,
  );
}

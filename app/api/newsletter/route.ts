import { z } from "zod";
import { subscribe } from "@/lib/email";
import { clientKey, rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MIN_FILL_MS = 2000;
const MAX_FORM_AGE_MS = 60 * 60 * 1000;

const schema = z.object({
  email: z.string().trim().toLowerCase().pipe(z.email()).pipe(z.string().max(254)),
  /**
   * Honeypot. Named plausibly so a bot fills it; hidden from real users.
   * Accepted by the schema on purpose — rejecting it here would answer 400 and
   * tell the bot it was caught. The handler answers 200 instead.
   */
  company: z.string().max(200).optional(),
  /** Milliseconds since epoch, stamped when the form mounted. */
  startedAt: z.number().int().positive().optional(),
});

/** One shape for every outcome, so timing and body never leak whether an address is known. */
const json = (body: unknown, status: number, headers?: HeadersInit) =>
  Response.json(body, { status, headers });

export async function POST(request: Request) {
  const limit = rateLimit(`newsletter:${clientKey(request.headers)}`, 5, 60 * 60 * 1000);
  if (!limit.ok) {
    return json({ ok: false, error: "Too many attempts. Try again later." }, 429, {
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
    // Never echo the submitted value back — that turns the endpoint into a
    // reflector and tells a prober exactly which rule it tripped.
    return json({ ok: false, error: "That email address doesn't look right." }, 400);
  }

  const { email, company, startedAt } = parsed.data;

  // Honeypot and speed checks answer 200 so a bot cannot distinguish a
  // rejection from a success and tune around it.
  if (company) return json({ ok: true }, 200);

  if (startedAt !== undefined) {
    const age = Date.now() - startedAt;
    if (age < MIN_FILL_MS || age > MAX_FORM_AGE_MS) return json({ ok: true }, 200);
  }

  const result = await subscribe(email);

  if (result.ok || result.reason === "duplicate") {
    // Already subscribed is a success from the reader's side: they wanted to be
    // on the list, and they are. Reporting it would also confirm to a prober
    // that an address is already registered.
    return json({ ok: true }, 200);
  }

  if (result.reason === "unconfigured") {
    return json(
      {
        ok: false,
        error: "The newsletter isn't connected yet. Email hello@techenzo.com and I'll add you.",
      },
      503,
    );
  }

  return json({ ok: false, error: "Couldn't sign you up. Try again in a minute." }, 502);
}

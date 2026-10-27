import type { SendResult } from "@/lib/email";

/**
 * Hands a contact submission to the n8n lead workflow (score, reply, log,
 * alert). Server to server, so the webhook URL never reaches the client bundle
 * or the CSP's connect-src.
 *
 * The shared secret travels in a header that the n8n Webhook node checks with
 * Header Auth. Without it anyone who found the URL could feed the workflow —
 * and every call spends AI credits and sends a real email.
 *
 * Both values are read at call time, never at module scope, and neither is
 * `NEXT_PUBLIC_*`.
 */

export const LEAD_SECRET_HEADER = "X-Techenzo-Secret";

export function leadsConfigured(): boolean {
  return Boolean(process.env.N8N_LEAD_WEBHOOK_URL && process.env.N8N_WEBHOOK_SECRET);
}

export async function forwardLead(input: {
  name: string;
  email: string;
  subject: string;
  message: string;
  organisation?: string;
  service?: string;
  budget?: string;
}): Promise<SendResult> {
  if (!leadsConfigured()) return { ok: false, reason: "unconfigured" };

  try {
    const response = await fetch(process.env.N8N_LEAD_WEBHOOK_URL!, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        [LEAD_SECRET_HEADER]: process.env.N8N_WEBHOOK_SECRET!,
      },
      body: JSON.stringify({
        ...input,
        source: "techenzo.com/contact",
        submittedAt: new Date().toISOString(),
      }),
      // n8n answers as soon as it receives the lead; the AI work runs after.
      signal: AbortSignal.timeout(8000),
    });

    if (response.ok) return { ok: true };

    console.error("lead webhook error", response.status);
    return { ok: false, reason: "provider" };
  } catch (error) {
    console.error("lead webhook request failed", error);
    return { ok: false, reason: "provider" };
  }
}

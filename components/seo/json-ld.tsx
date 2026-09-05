import { headers } from "next/headers";

/**
 * Structured data.
 *
 * The `<` replacement below must remain a FOUR-character source sequence
 * (backslash, backslash, u, 003c) so the runtime string is the six characters
 * a JSON unicode escape needs. Written with a single backslash it compiles to
 * a literal `<`, the replacement becomes a no-op, and a string in the payload
 * can close the script tag — the standard JSON-LD injection hole, silently
 * reopened. There is a test for exactly this in scripts/check-jsonld-escape.mjs.
 *
 * Carries the CSP nonce even though `application/ld+json` is a data block
 * rather than an executable script: browsers differ on whether script-src
 * enforcement reaches non-executable types, and a silently dropped structured
 * data block is invisible until search results are already wrong.
 */
export const escapeJsonLd = (data: Record<string, unknown>): string =>
  JSON.stringify(data).replace(/</g, "\\u003c");

export async function JsonLd({ data }: { data: Record<string, unknown> }) {
  const nonce = (await headers()).get("x-nonce") ?? undefined;

  return (
    <script
      type="application/ld+json"
      nonce={nonce}
      dangerouslySetInnerHTML={{ __html: escapeJsonLd(data) }}
    />
  );
}

"use client";

import { usePathname } from "next/navigation";

/**
 * Shows the URL that missed. Client-side because `not-found.tsx` renders
 * without knowing which path triggered it — and telling someone what they
 * actually typed is most of the help a 404 can offer.
 */
export function AttemptedPath() {
  const pathname = usePathname();

  return (
    <p className="t-mono-sm mt-6 text-ink-3">
      <span className="text-ink-3">Requested — </span>
      <span className="text-ink-2 break-all">{pathname}</span>
    </p>
  );
}

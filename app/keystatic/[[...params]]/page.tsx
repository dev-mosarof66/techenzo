"use client";

import { makePage } from "@keystatic/next/ui/app";
import config from "@/keystatic.config";

/**
 * Explicitly a client component: @keystatic/core/ui ships without a
 * "use client" directive of its own, so rendered from a server component it
 * mounts nothing at all — no error, just an empty Suspense boundary.
 */
export default makePage(config);

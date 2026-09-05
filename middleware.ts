import { NextResponse, type NextRequest } from "next/server";

/**
 * Content Security Policy with a per-request nonce — spec §13.
 *
 * `script-src` carries no `'unsafe-inline'`. The only inline script we author is
 * the theme stamp in the document head, and it runs because it carries this
 * nonce; Next attaches the same nonce to its own bootstrap and RSC payload
 * scripts by reading it back out of this header.
 *
 * `'strict-dynamic'` lets those nonced scripts load the chunk graph without
 * every chunk URL needing to be allow-listed, and it makes host allow-lists
 * inert in supporting browsers — the nonce becomes the whole gate.
 *
 * ⚠ COST: a nonce must be unique per response, so every route that renders HTML
 * becomes dynamic. See docs/ui-ux-spec.md §13 for the measured trade-off.
 */
function buildCsp(nonce: string, isDev: boolean): string {
  const directives = [
    `default-src 'self'`,
    // Dev needs eval for React Refresh; production does not get it.
    isDev
      ? `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' 'unsafe-eval'`
      : `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'`,
    // Inline STYLE attributes cannot carry a nonce, and components set colours
    // via style props (status chips). This is the one relaxation, and it is a
    // far smaller surface than an inline-script allowance.
    `style-src 'self' 'unsafe-inline'`,
    `img-src 'self' data: blob:`,
    `font-src 'self'`,
    // The two API routes talk to Resend server-side, so the browser needs
    // nothing beyond our own origin.
    `connect-src 'self'`,
    `object-src 'none'`,
    `base-uri 'self'`,
    `form-action 'self'`,
    `frame-ancestors 'none'`,
    `manifest-src 'self'`,
  ];

  if (!isDev) directives.push("upgrade-insecure-requests");

  return directives.join("; ");
}

/**
 * The Keystatic admin loads a webfont from Google. Rather than open that origin
 * to the whole public site, the allowance is scoped to the admin path only —
 * it is authenticated, private, and serves no untrusted content.
 */
function isAdmin(pathname: string) {
  return pathname.startsWith("/keystatic") || pathname.startsWith("/api/keystatic");
}

export function middleware(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const isDev = process.env.NODE_ENV === "development";
  const admin = isAdmin(request.nextUrl.pathname);
  const csp = admin
    ? buildCsp(nonce, isDev)
        // The admin loads a webfont, talks to the GitHub API, shows avatars,
        // and redirects through GitHub to authorise. None of that is opened to
        // the public site.
        .replace(
          "style-src 'self' 'unsafe-inline'",
          "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
        )
        .replace("font-src 'self'", "font-src 'self' https://fonts.gstatic.com")
        .replace("connect-src 'self'", "connect-src 'self' https://api.github.com")
        .replace(
          "img-src 'self' data: blob:",
          "img-src 'self' data: blob: https://avatars.githubusercontent.com",
        )
        .replace("form-action 'self'", "form-action 'self' https://github.com")
    : buildCsp(nonce, isDev);

  // Pass the nonce forward so the layout can read it via headers().
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("content-security-policy", csp);

  const response = NextResponse.next({ request: { headers: requestHeaders } });

  response.headers.set("content-security-policy", csp);
  response.headers.set("x-content-type-options", "nosniff");
  response.headers.set("referrer-policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "permissions-policy",
    "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  );
  if (!isDev) {
    response.headers.set(
      "strict-transport-security",
      "max-age=63072000; includeSubDomains; preload",
    );
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * HTML documents only. Static assets, generated images and the icon routes
     * are served with their own content types and gain nothing from a policy
     * that governs document script execution.
     */
    {
      source:
        "/((?!_next/static|_next/image|favicon.ico|icon.svg|apple-icon|.*\\.(?:png|jpg|jpeg|gif|webp|avif|svg|woff2?|ttf)$).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};

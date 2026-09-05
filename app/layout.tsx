import type { Metadata } from "next";
import { headers } from "next/headers";
import { Geist, Geist_Mono, Newsreader } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { site } from "@/config/site";
import { ThemeScript } from "@/components/theme/theme-script";
import "./globals.css";

/**
 * next/font/google downloads and self-hosts at build time, so these ship from
 * our own origin with zero requests to Google — the intent of spec §3.1.
 */
const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
  display: "swap",
  style: ["normal", "italic"],
});

/**
 * Google Search Console ownership token for techenzo.vercel.app, issued
 * 2026-09-05. Public by design — see the note on `verification` below.
 * Replace this when the property moves to a custom domain.
 */
const GOOGLE_SITE_VERIFICATION = "ddPdbIbBkeQgGWoWvhjulP7ZUdwIjvS5gHxQsMLM8sI";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: site.name,
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    url: site.url,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
  },
  authors: [{ name: site.founder.name, url: site.social.github }],
  creator: site.founder.name,
  publisher: site.name,
  category: "technology",
  // Declares the feed in <head> so readers and crawlers discover it without
  // relying on someone finding the footer link.
  alternates: {
    types: { "application/rss+xml": [{ url: "/rss.xml", title: `${site.name} — all posts` }] },
  },
  formatDetection: { telephone: false, address: false, email: false },
  /**
   * Search Console / Bing Webmaster ownership tokens.
   *
   * The Google token is checked in rather than kept in the environment, which
   * is safe: it is a public value by construction — it ships in the <head> of
   * every page, so anyone can already read it. It proves nothing on its own
   * either. Verification says "whoever controls this site also controls this
   * Search Console account"; a copy of the token on someone else's deployment
   * lets them verify THEIR site, never ours, and grants no access to our
   * property or its data.
   *
   * The trade for checking it in is that verification survives a redeploy, a
   * new Vercel project, or an environment that was never configured — an
   * ownership proof that silently disappears when a variable goes missing is
   * the failure mode worth designing out, because Search Console stops
   * reporting the moment it can no longer confirm the site.
   *
   * The env var still wins when set, so a fork or a second property can
   * override without touching this file.
   */
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION ?? GOOGLE_SITE_VERIFICATION,
    other: process.env.BING_SITE_VERIFICATION
      ? { "msvalidate.01": process.env.BING_SITE_VERIFICATION }
      : {},
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  // NOTE: no `alternates.canonical` here on purpose. A canonical declared in the
  // root layout is inherited by every route, so all of them would claim to be
  // the homepage. Each page sets its own via pageMetadata().
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Set by middleware.ts, per request. Next reads the same nonce out of the CSP
  // header and applies it to its own bootstrap scripts.
  const nonce = (await headers()).get("x-nonce") ?? undefined;

  return (
    // suppressHydrationWarning: ThemeScript stamps data-theme before React runs.
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${newsreader.variable}`}
    >
      <head>
        <ThemeScript nonce={nonce} />
      </head>
      <body>
        {children}
        {/*
          Web Analytics. Renders null and injects /_vercel/insights/script.js
          from the client at runtime, which is why it needs no nonce prop even
          under our CSP: `strict-dynamic` propagates trust from an already
          nonce-allowed script to the scripts it creates, so the injected tag
          inherits permission from the React bundle that appended it. Note that
          `'self'` in script-src does NOT do this work — supporting browsers
          ignore host-source expressions entirely once `strict-dynamic` is
          present. The view beacon is same-origin, so `connect-src 'self'` covers
          it too.

          No-op off Vercel: the script path 404s locally, so `next dev` reports
          nothing and no data leaves a developer machine.
        */}
        <Analytics />
      </body>
    </html>
  );
}

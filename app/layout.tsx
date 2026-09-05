import type { Metadata } from "next";
import { headers } from "next/headers";
import { Geist, Geist_Mono, Newsreader } from "next/font/google";
import { site } from "@/config/site";
import { Navbar } from "@/components/navigation/navbar";
import { Footer } from "@/components/navigation/footer";
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
        <a href="#content" className="skip-link">
          Skip to content
        </a>
        <Navbar />
        <main id="content">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

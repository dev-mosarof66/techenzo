import type { Metadata } from "next";

/**
 * The Keystatic admin renders its own full-page UI. Metadata lives here rather
 * than on the page because the page itself must be a client component.
 */
export const metadata: Metadata = {
  title: "Content",
  robots: { index: false, follow: false },
};

export default function KeystaticLayout({ children }: { children: React.ReactNode }) {
  return children;
}

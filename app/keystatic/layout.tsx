/**
 * The Keystatic admin renders its own full-page UI, so it opts out of the site
 * chrome — no navbar, no footer, no skip link pointing at a #content that is
 * not there.
 */
export default function KeystaticLayout({ children }: { children: React.ReactNode }) {
  return children;
}

import { SiteChrome } from "@/components/layout/site-chrome";

/**
 * Wraps every public page. A route group, so it adds no path segment — /about
 * is still /about. Its only job is keeping the site chrome off /keystatic.
 */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return <SiteChrome>{children}</SiteChrome>;
}

import { Navbar } from "@/components/navigation/navbar";
import { Footer } from "@/components/navigation/footer";

/**
 * The public site's frame: skip link, header, main landmark, footer.
 *
 * Extracted out of the root layout so the Keystatic admin — which renders its
 * own full-page UI — does not inherit a navbar and footer it has no use for.
 * Shared by the (site) route group and the 404, which is reachable from outside
 * that group.
 */
export function SiteChrome({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a href="#content" className="skip-link">
        Skip to content
      </a>
      <Navbar />
      <main id="content">{children}</main>
      <Footer />
    </>
  );
}

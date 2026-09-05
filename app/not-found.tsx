import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/layout/container";
import { SiteChrome } from "@/components/layout/site-chrome";
import { AttemptedPath } from "@/components/navigation/attempted-path";

/**
 * Spec §9.10. The third and last permitted grid-field placement.
 *
 * No jokes: a 404 is read by someone who did not get what they came for, and a
 * gag they have to read past before finding the way out is a second small
 * failure on top of the first.
 */
// Next already emits `noindex` for not-found; declaring it again produced a
// duplicate robots tag. Only the title is ours to set.
export const metadata = { title: "Not found" };

const DESTINATIONS = [
  { label: "The Lab", href: "/lab", body: "Experiments, benchmarks, and what they proved." },
  { label: "Products", href: "/products", body: "What we have built and shipped." },
  { label: "Home", href: "/", body: "Start from the top." },
];

export default function NotFound() {
  return (
    <SiteChrome>
      <div className="grid-field py-20 lg:py-28">
      <Container>
        <p className="t-kicker text-accent">404</p>
        <h1 className="t-display-2 mt-5 max-w-[18ch]">No route here.</h1>
        <AttemptedPath />

        <ul className="mt-12 max-w-2xl border-t border-line">
          {DESTINATIONS.map((destination) => (
            <li key={destination.href}>
              <Link
                href={destination.href}
                className="group flex items-center justify-between gap-6 border-b border-line py-5 transition-colors duration-[var(--dur-fast)] hover:bg-raised"
              >
                <span>
                  <span className="t-h4 block transition-colors duration-[var(--dur-fast)] group-hover:text-accent">
                    {destination.label}
                  </span>
                  <span className="t-body-sm mt-1 block text-ink-2">{destination.body}</span>
                </span>
                <ArrowRight
                  size={18}
                  strokeWidth={1.5}
                  aria-hidden="true"
                  className="shrink-0 text-ink-3 transition-colors duration-[var(--dur-fast)] group-hover:text-accent"
                />
              </Link>
            </li>
          ))}
        </ul>
        </Container>
      </div>
    </SiteChrome>
  );
}

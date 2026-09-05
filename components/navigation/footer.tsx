import Link from "next/link";
import { footerColumns, site } from "@/config/site";
import { Container } from "@/components/layout/container";
import { Wordmark } from "./wordmark";
import { NewsletterForm } from "@/components/forms/newsletter-form";

export function Footer() {
  return (
    <footer className="border-t border-line bg-sunken py-16">
      <Container>
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Wordmark className="mb-4" />
            <p className="t-body-sm measure-copy text-ink-2">{site.tagline}</p>
          </div>

          {footerColumns.map((column) => (
            <nav key={column.heading} aria-label={column.heading}>
              <h2 className="t-kicker mb-5 text-ink-3">{column.heading}</h2>
              <ul className="flex flex-col gap-3">
                {column.links.map((link) => (
                  <li key={link.href}>
                    {"external" in link && link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link-draw t-body-sm text-ink-3 transition-colors duration-[var(--dur-fast)] hover:text-ink"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="link-draw t-body-sm text-ink-3 transition-colors duration-[var(--dur-fast)] hover:text-ink"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="t-mono-sm mt-14 flex flex-col gap-3 border-t border-line pt-6 text-ink-3 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {site.name} · Built by {site.founder.name}
          </p>
          <p className="flex gap-4">
            <Link href="/rss.xml">RSS</Link>
            <span aria-hidden="true">·</span>
            <Link href="/sitemap.xml">Sitemap</Link>
          </p>
        </div>
      </Container>
    </footer>
  );
}

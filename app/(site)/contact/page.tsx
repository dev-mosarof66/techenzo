import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { PageHero } from "@/components/layout/page-hero";
import { ContactForm } from "@/components/forms/contact-form";
import { pageMetadata } from "@/lib/seo";
import { site, socialProfiles } from "@/config/site";

export const metadata: Metadata = pageMetadata("/contact");

const INCLUDE = [
  "What you're building, in a sentence.",
  "Where it is now — idea, prototype, or in production.",
  "What you need from Techenzo, and by when.",
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        title="Contact"
        intro="Work, questions, or something you think is wrong on this site — all welcome."
      />

      <Container className="pb-24">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <ContactForm />
          </div>

          <aside className="lg:col-span-5">
            <div className="border-t border-line pt-6">
              <p className="t-kicker mb-3 text-ink-3">Direct</p>
              <a
                href={`mailto:${site.social.email}`}
                className="link-draw t-body text-accent"
              >
                {site.social.email}
              </a>
              {/* An honest expectation beats "we'll get back to you shortly". */}
              <p className="t-body-sm mt-3 text-ink-2">Usually a reply within two days.</p>
            </div>

            <div className="mt-10 border-t border-line pt-6">
              <p className="t-kicker mb-3 text-ink-3">What to include</p>
              <ul className="flex flex-col gap-2.5">
                {INCLUDE.map((item) => (
                  <li key={item} className="t-body-sm text-ink-2">
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-10 border-t border-line pt-6">
              <p className="t-kicker mb-3 text-ink-3">Elsewhere</p>
              <ul className="t-mono-sm flex flex-col gap-2.5 text-ink-3">
                {socialProfiles.map(({ label, href }) => (
                  <li key={label}>
                    <a href={href} target="_blank" rel="noopener noreferrer" className="link-draw hover:text-ink">{label}</a>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </Container>
    </>
  );
}

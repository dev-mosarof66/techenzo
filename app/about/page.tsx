import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { SectionHeader } from "@/components/layout/section-header";
import { ButtonLink } from "@/components/ui/button";
import { NewsletterForm } from "@/components/forms/newsletter-form";
import { Portrait } from "@/components/founder/portrait";
import { Timeline } from "@/components/founder/timeline";
import { SOCIAL_ICONS } from "@/components/ui/icons";
import { JsonLd } from "@/components/seo/json-ld";
import { pageMetadata, personJsonLd } from "@/lib/seo";
import { positioning, principles, stack, whatWeDo } from "@/config/about";
import { site, socialProfiles } from "@/config/site";

export const metadata: Metadata = pageMetadata("/about");

/**
 * Spec §9.8. The hierarchy is the whole point of this page: Techenzo is the
 * subject and the h1, the founder is section 03 inside it. That ordering is
 * what leaves room for the studio to grow past one person.
 */
export default function AboutPage() {
  return (
    <>
      <JsonLd data={personJsonLd()} />

      <Container width="prose" className="py-16 lg:py-24">
        <h1 className="t-display-2">{site.name}</h1>
        <div className="mt-8 flex flex-col gap-4">
          {positioning.map((line) => (
            <p key={line} className="t-body-lg text-ink-2">
              {line}
            </p>
          ))}
        </div>
      </Container>

      {/* 01 · What we do */}
      <Section id="what-we-do">
        <SectionHeader index="01" label="What we do" />
        <div className="border-t border-line">
          {whatWeDo.map((item) => (
            <div
              key={item.title}
              className="flex flex-col gap-3 border-b border-line py-7 md:flex-row md:gap-12"
            >
              <h3 className="t-h3 md:w-56 md:shrink-0">{item.title}</h3>
              <div className="min-w-0 flex-1">
                <p className="t-body-sm measure-copy text-ink-2">{item.body}</p>
                <Link
                  href={item.href}
                  className="link-draw t-mono-sm mt-3 inline-flex items-center gap-2 text-accent"
                >
                  {item.linkLabel}
                  <ArrowRight size={14} strokeWidth={1.5} aria-hidden="true" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* 02 · How we work — the trust section. Stated plainly, no hedging. */}
      <Section id="how-we-work">
        <SectionHeader
          index="02"
          label="How we work"
          title="Six rules, and the site is built to keep them."
          intro="Most of these are enforced in code rather than in a style guide — an experiment without stated limitations will not build."
        />
        <div className="grid grid-cols-1 gap-px bg-line md:grid-cols-2">
          {principles.map((principle) => (
            <div key={principle.title} className="bg-canvas py-7 md:px-7 md:first:pl-0">
              <h3 className="t-h4">{principle.title}</h3>
              <p className="t-body-sm mt-2 max-w-[46ch] text-ink-2">{principle.body}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* 03 · Founder */}
      <Section id="founder">
        <SectionHeader index="03" label="Founder" />
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-4">
            <Portrait sizes="(min-width: 1024px) 33vw, 100vw" />
          </div>

          <div className="lg:col-span-8">
            <h3 className="t-h2">{site.founder.name}</h3>
            <p className="t-mono-sm mt-3 text-ink-3">{site.founder.roles.join(" · ")}</p>

            <div className="mt-6 flex flex-col gap-4">
              {site.founder.bioLong.map((paragraph) => (
                <p key={paragraph} className="t-body measure-copy text-ink-2">
                  {paragraph}
                </p>
              ))}
            </div>

            <Timeline />

            <ul className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-3">
              {socialProfiles.map(({ label, href }) => {
                const Icon = SOCIAL_ICONS[label];
                return (
                  <li key={label}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link-draw t-body-sm inline-flex items-center gap-2 text-accent hover:text-accent-hover"
                    >
                      {Icon ? <Icon size={16} /> : null}
                      {label}
                      <ArrowUpRight size={14} strokeWidth={1.5} aria-hidden="true" />
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </Section>

      {/* 04 · Stack */}
      <Section id="stack">
        <SectionHeader
          index="04"
          label="Stack we build on"
          intro="Boring by choice. The interesting decisions should be in the product, not the toolchain."
        />
        <dl className="border-t border-line">
          {stack.map((group) => (
            <div
              key={group.layer}
              className="flex flex-col gap-1 border-b border-line py-4 sm:flex-row sm:gap-12"
            >
              <dt className="t-mono-sm w-32 shrink-0 text-ink-3">{group.layer}</dt>
              <dd className="t-mono-sm m-0 text-ink">{group.items.join(" · ")}</dd>
            </div>
          ))}
        </dl>
      </Section>

      {/* 05 · CTA */}
      <Section id="contact" surface="sunken">
        <SectionHeader index="05" label="Get in touch" title="Work together, or just follow along." />
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="t-body-lg measure-copy text-ink-2">
              If you are building something with AI and want a second engineer on
              it, say what you are working on and what you need.
            </p>
            <div className="mt-6">
              <ButtonLink href="/contact" variant="primary">
                Get in touch
              </ButtonLink>
            </div>
          </div>
          <div>
            <NewsletterForm />
          </div>
        </div>
      </Section>
    </>
  );
}

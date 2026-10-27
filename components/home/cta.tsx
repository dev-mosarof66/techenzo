import { Clock, Mail } from "lucide-react";
import { ContactForm } from "@/components/forms/contact-form";
import { NewsletterForm } from "@/components/forms/newsletter-form";
import { site } from "@/config/site";
import { reveal } from "@/lib/reveal";
import { Badge, Glow, PANEL } from "./ui";

/**
 * Block 08 — the closing panel. The form itself, not a link to it: a visitor
 * ready to talk should not have to find a page first. The newsletter sits
 * underneath as the lighter commitment.
 */
export function WorkWithUs({ index }: { index: string }) {
  return (
    <div className="flex flex-col gap-4 lg:gap-5">
      <div className={`relative overflow-hidden p-5 sm:p-8 lg:p-12 ${PANEL}`} {...reveal()}>
        <Glow className="-top-48 -left-48 size-[620px]" />
        <Glow className="-right-48 -bottom-48 size-[520px]" />

        <div className="relative grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <Badge>
              <span>{index}</span>
              <span aria-hidden="true">·</span>
              <span>Work with us</span>
            </Badge>
            <h2 className="mt-5 text-[clamp(2.25rem,1.5rem+2.8vw,3.75rem)] leading-[1.05] font-semibold tracking-[-0.04em] text-balance">
              Have a process that should <span className="text-accent">run itself?</span>
            </h2>
            <p className="mt-5 max-w-[44ch] text-base leading-relaxed text-ink-2">
              Tell us what you want to automate and where it stands today. Usually a reply within
              two days.
            </p>

            <ul className="mt-8 flex flex-col gap-3">
              <li>
                <a
                  href={`mailto:${site.social.email}`}
                  className="flex items-center gap-4 rounded-2xl border border-line bg-canvas p-4 transition-colors hover:border-accent"
                >
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[color-mix(in_srgb,var(--accent)_12%,transparent)] text-accent">
                    <Mail size={18} strokeWidth={1.75} aria-hidden="true" />
                  </span>
                  <span className="min-w-0">
                    <span className="t-kicker block text-ink-3">Email</span>
                    <span className="mt-1 block truncate text-sm font-medium">{site.social.email}</span>
                  </span>
                </a>
              </li>
              <li className="flex items-center gap-4 rounded-2xl border border-line bg-canvas p-4">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[color-mix(in_srgb,var(--accent)_12%,transparent)] text-accent">
                  <Clock size={18} strokeWidth={1.75} aria-hidden="true" />
                </span>
                <span>
                  <span className="t-kicker block text-ink-3">Reply</span>
                  <span className="mt-1 block text-sm font-medium">Usually within two days</span>
                </span>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-line bg-canvas p-5 shadow-[var(--shadow-layer)] sm:p-8">
              <ContactForm />
            </div>
          </div>
        </div>
      </div>

      <div
        id="follow"
        className={`grid grid-cols-1 items-center gap-6 p-6 sm:p-8 lg:grid-cols-12 lg:gap-12 lg:px-12 ${PANEL}`}
        {...reveal()}
      >
        <div className="lg:col-span-5">
          <p className="t-kicker text-accent">Follow the build</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">Build something real.</h2>
          <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-2">
            One email when something ships — a new experiment, a product, or a result worth
            arguing with.
          </p>
        </div>
        <div className="lg:col-span-7 lg:flex lg:justify-end">
          <div className="w-full max-w-md">
            <NewsletterForm variant="inline" />
          </div>
        </div>
      </div>
    </div>
  );
}

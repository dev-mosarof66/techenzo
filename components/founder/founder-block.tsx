import { ArrowUpRight } from "lucide-react";
import { site } from "@/config/site";
import { GitHubIcon, XIcon } from "@/components/ui/icons";
import { Portrait } from "./portrait";

/**
 * Homepage block — the person behind the brand (spec §9.1 block 06).
 *
 * The hierarchy is deliberate and non-negotiable (§9.8): Techenzo is the
 * subject, Mosarof is a section inside it. That is why this is an h2 within the
 * page rather than a second hero, and why the kicker reads "Founder" rather
 * than leading with the name — it leaves room for Techenzo to grow past one
 * person without the site needing a rebuild.
 */
const LINKS = [
  { label: "GitHub", href: site.social.github, Icon: GitHubIcon },
  { label: "X", href: site.social.x, Icon: XIcon },
  { label: "LinkedIn", href: site.social.linkedin, Icon: null },
] as const;

export function FounderBlock() {
  return (
    <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-12">
      <div className="lg:col-span-5">
        <Portrait sizes="(min-width: 1024px) 40vw, 100vw" />
      </div>

      <div className="lg:col-span-7">
        <p className="t-kicker text-ink-3">Founder</p>
        <h2 className="t-h2 mt-4">{site.founder.name}</h2>

        <p className="t-mono-sm mt-3 text-ink-3">{site.founder.roles.join(" · ")}</p>

        <p className="t-body-lg measure-copy mt-6 text-ink-2">{site.founder.bio}</p>

        <ul className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-3">
          {LINKS.map(({ label, href, Icon }) => (
            <li key={label}>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="link-draw t-body-sm inline-flex items-center gap-2 text-accent transition-colors duration-[var(--dur-fast)] hover:text-accent-hover"
              >
                {Icon ? <Icon size={16} /> : null}
                {label}
                <ArrowUpRight size={14} strokeWidth={1.5} aria-hidden="true" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

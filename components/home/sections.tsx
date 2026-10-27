import Link from "next/link";
import { ArrowRight, Boxes, FlaskConical, Wrench } from "lucide-react";
import { reveal } from "@/lib/reveal";
import { CARD_HOVER, PANEL } from "./ui";

const CAPABILITIES = [
  {
    icon: Boxes,
    title: "AI Products",
    body: "Systems people use daily — retrieval, agents, and the unglamorous plumbing that keeps them answering correctly.",
    link: { label: "See products", href: "/products" },
  },
  {
    icon: Wrench,
    title: "Developer Tools",
    body: "Small, sharp tools that remove a specific friction from building with models, and do nothing else.",
    link: { label: "See projects", href: "/projects" },
  },
  {
    icon: FlaskConical,
    title: "Applied Research",
    body: "Benchmarks and experiments run against real workloads, published with the method and the repo.",
    link: { label: "Open the Lab", href: "/lab" },
  },
];

/** Block 01 — three rounded cards, each one a way into the site. */
export function Capabilities() {
  return (
    <ol className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:gap-5">
      {CAPABILITIES.map(({ icon: Icon, title, body, link }, index) => (
        <li key={title} {...reveal(index)}>
          <Link
            href={link.href}
            className={`group relative flex h-full flex-col overflow-hidden p-7 ${PANEL} ${CARD_HOVER}`}
          >
            {/* A faint accent wash rises from the corner on hover. */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -top-24 -right-24 size-56 rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--accent)_18%,transparent),transparent_70%)] opacity-0 transition-opacity duration-[var(--dur-slow)] group-hover:opacity-100"
            />
            <div className="flex items-start justify-between">
              <span className="grid size-12 place-items-center rounded-2xl bg-[color-mix(in_srgb,var(--accent)_12%,transparent)] text-accent">
                <Icon size={22} strokeWidth={1.75} aria-hidden="true" />
              </span>
              <span className="font-mono text-sm text-ink-3">{String(index + 1).padStart(2, "0")}</span>
            </div>
            <h3 className="mt-8 text-xl font-semibold tracking-tight">{title}</h3>
            <p className="mt-3 flex-1 text-[0.9375rem] leading-relaxed text-ink-2">{body}</p>
            <span className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-accent">
              {link.label}
              <ArrowRight
                size={16}
                strokeWidth={2}
                aria-hidden="true"
                className="transition-transform duration-[var(--dur-fast)] group-hover:translate-x-0.5"
              />
            </span>
          </Link>
        </li>
      ))}
    </ol>
  );
}

const METHOD = [
  {
    title: "Hypothesis",
    body: "Write down what should happen and how we will know, before any code exists.",
  },
  {
    title: "Build",
    body: "Ship the smallest version that can be measured against a real workload.",
  },
  {
    title: "Measure",
    body: "Percentiles, recall and cost per request — always against a named baseline.",
  },
  {
    title: "Publish",
    body: "The numbers, the method, the limitations and the repo. Including what lost.",
  },
];

/**
 * Block 02 — the loop every product and experiment goes through: four step
 * cards on one dashed rail, the last step filled because it is the public one.
 */
export function Method() {
  return (
    <ol className="relative grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
      <span
        aria-hidden="true"
        className="absolute top-[46px] right-[12%] left-[12%] hidden border-t border-dashed border-line-strong lg:block"
      />
      {METHOD.map((item, index) => {
        const last = index === METHOD.length - 1;
        return (
          <li key={item.title} className={`relative p-6 ${PANEL}`} {...reveal(index)}>
            <span
              className={
                last
                  ? "relative grid size-11 place-items-center rounded-full bg-accent font-mono text-sm font-semibold text-on-accent shadow-[0_8px_30px_-6px_color-mix(in_srgb,var(--accent)_60%,transparent)]"
                  : "relative grid size-11 place-items-center rounded-full border border-[color-mix(in_srgb,var(--accent)_40%,transparent)] bg-[color-mix(in_srgb,var(--accent)_12%,var(--bg-raised))] font-mono text-sm font-semibold text-accent"
              }
            >
              {String(index + 1).padStart(2, "0")}
            </span>
            <h3 className="mt-6 text-lg font-semibold tracking-tight">{item.title}</h3>
            <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-2">{item.body}</p>
          </li>
        );
      })}
    </ol>
  );
}

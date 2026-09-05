/**
 * The origin every canonical, sitemap entry, OG tag and JSON-LD `url` is built
 * from. Getting this wrong is not a cosmetic bug: a canonical pointing at a
 * host that does not resolve tells a crawler the real page lives somewhere
 * unreachable, and the page it was served is dropped rather than indexed.
 *
 * Resolution order, most specific first:
 *
 *  1. `NEXT_PUBLIC_SITE_URL` — set this the moment a custom domain is live.
 *  2. `VERCEL_PROJECT_PRODUCTION_URL` — the project's STABLE production host.
 *     Deliberately not `VERCEL_URL`, which is unique per deployment: canonicals
 *     built from it would point at a build-specific host that is superseded on
 *     the next push, so every page would name a different "real" URL each time.
 *  3. The canonical production domain — the correct answer for this site, and
 *     the reason a production build can never emit localhost.
 *  4. localhost, in development only.
 *
 * The localhost fallback used to be unconditional. That meant a production
 * build with no environment set would silently publish a sitemap and a full set
 * of canonicals pointing at http://localhost:3000 — every page telling crawlers
 * its real address was a host only the build machine can reach, with no error
 * to notice. Production now falls through to the real domain instead, and
 * localhost is unreachable outside `next dev`.
 *
 * All of these are read at build time on the server. No client component reads
 * `site.url`, so nothing here reaches the browser bundle.
 */
const CANONICAL_ORIGIN = "https://techenzo.com";

function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");

  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return `https://${vercel}`;

  if (process.env.NODE_ENV === "production") return CANONICAL_ORIGIN;

  return "http://localhost:3000";
}

export const site = {
  name: "Techenzo",
  tagline: "Building real products with AI.",
  description:
    "We design, build and ship AI systems — then publish how they actually perform.",
  url: resolveSiteUrl(),
  founder: {
    name: "Mosarof Hossain",
    roles: ["Full-stack engineer", "AI systems", "Product"],
    /**
     * First person, present tense, no credentials. The work on this site is the
     * evidence — a bio that lists years and job titles is making a claim the
     * rest of the page already makes better.
     */
    bio: "I build AI products and publish what they actually measure. Techenzo is where that work lives: the products, the experiments behind them, and the numbers that decided the design.",
    /** 1:1 image in /public. Falls back to initials until one exists. */
    portrait: undefined as string | undefined,

    /**
     * Longer bio for /about. Same rule as the short one: no credentials, no
     * invented history — the work on this site is the evidence. Written to be
     * replaced in Mosarof's own words.
     */
    bioLong: [
      "I build AI products and publish what they actually measure.",
      "Most of what gets written about building with models is either a launch announcement or a tutorial. The part I find useful — what a system cost to run, which approach lost, where the numbers stopped holding — is usually missing. Techenzo is an attempt to publish that part.",
      "Everything here is built in the open. If a result looks wrong, the method and the repo are both on the page so you can check it.",
    ],

    /**
     * Year → milestone, oldest last. Deliberately empty: a timeline is
     * biography, and inventing one would be fabricating a public record about a
     * real person. Add real entries and the section appears on /about by
     * itself; leave it empty and the section does not render at all.
     */
    timeline: [] as { year: string; text: string }[],
  },
  /**
   * A profile that does not exist yet stays `undefined` — never a bare
   * `https://x.com/`. Two reasons, and the second is the expensive one: to a
   * reader it is a dead link to a platform's front door, and in the `sameAs`
   * array of our Organization and Person schema it is a false identity claim.
   * `sameAs` is how a search engine ties this domain to a real entity; pointing
   * it at a homepage nobody controls spends that signal on nothing. Fill a
   * handle in and every link list and schema block picks it up automatically —
   * see `socialProfiles` below.
   */
  social: {
    github: "https://github.com/dev-mosarof66" as string | undefined,
    x: undefined as string | undefined,
    linkedin: undefined as string | undefined,
    email: "hello@techenzo.com",
  },
} as const;

export type SocialProfile = { label: "GitHub" | "X" | "LinkedIn"; href: string };

/**
 * The social profiles that actually exist, in display order.
 *
 * Every link list and every `sameAs` array reads from this one filtered list,
 * so adding a handle to `site.social` makes it appear everywhere at once and
 * leaving one undefined removes it everywhere at once. The alternative —
 * each surface deciding for itself — is how a placeholder survives in the
 * footer long after it was fixed in the header.
 */
export const socialProfiles: SocialProfile[] = (
  [
    { label: "GitHub", href: site.social.github },
    { label: "X", href: site.social.x },
    { label: "LinkedIn", href: site.social.linkedin },
  ] satisfies { label: SocialProfile["label"]; href: string | undefined }[]
).filter((profile): profile is SocialProfile => Boolean(profile.href));

/** Nav order is the site's information hierarchy — products first, about last. */
export const nav = [
  { index: "01", label: "Products", href: "/products" },
  { index: "02", label: "Projects", href: "/projects" },
  { index: "03", label: "Lab", href: "/lab" },
  { index: "04", label: "Writing", href: "/writing" },
  { index: "05", label: "About", href: "/about" },
] as const;

export const footerColumns = [
  {
    heading: "Navigate",
    links: [
      { label: "Products", href: "/products" },
      { label: "Projects", href: "/projects" },
      { label: "Writing", href: "/writing" },
      { label: "About", href: "/about" },
    ],
  },
  {
    heading: "Lab",
    links: [
      { label: "Experiments", href: "/lab" },
      { label: "Benchmarks", href: "/lab?tag=performance" },
      { label: "Changelog", href: "/changelog" },
    ],
  },
  {
    heading: "Connect",
    links: [
      ...socialProfiles.map((profile) => ({ ...profile, external: true })),
      { label: "Email", href: `mailto:${site.social.email}`, external: true },
    ],
  },
];

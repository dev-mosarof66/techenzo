import type { Metadata } from "next";
import { site, socialProfiles } from "@/config/site";
import { routeByPath } from "@/config/routes";

export const OG_LOCALE = "en_US";

/** Repeated on every route — see the note in pageMetadata. */
export const FEED_ALTERNATE = {
  "application/rss+xml": [{ url: "/rss.xml", title: `${site.name} — all posts` }],
};

/**
 * Per-route metadata. Every page sets its own canonical — a canonical declared
 * once in the root layout would make every page claim to be the homepage,
 * which is the classic way to get a whole site collapsed into one result.
 */
export function pageMetadata(path: string, overrides: Partial<Metadata> = {}): Metadata {
  const route = routeByPath(path);

  return {
    title: route.title,
    description: route.description,
    // Next REPLACES `alternates` and `openGraph` rather than deep-merging them
    // with the root layout, so anything set there has to be repeated here or it
    // silently disappears from every route that calls this.
    alternates: { canonical: path, types: FEED_ALTERNATE },
    robots: route.indexable
      ? undefined
      : // Thin until it has content: keep it out of the index, but let the
        // crawler follow its links so the rest of the site is discoverable.
        { index: false, follow: true },
    openGraph: {
      type: "website",
      locale: OG_LOCALE,
      url: path,
      siteName: site.name,
      title: route.title,
      description: route.description,
    },
    twitter: {
      card: "summary_large_image",
      title: route.title,
      description: route.description,
    },
    ...overrides,
  };
}

/**
 * Breadcrumbs for detail pages. Google renders these as the path shown under a
 * result in place of the raw URL, so it is one of the few structured-data types
 * with a visible payoff.
 */
export function breadcrumbJsonLd(trail: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: `${site.url}${crumb.path}`,
    })),
  };
}

/**
 * The `sameAs` set shared by Organization and Person.
 *
 * This is the link between this domain and a real, already-known entity, and
 * it is only worth anything if every URL in it resolves to a profile we
 * actually control — a placeholder like `https://x.com/` asserts ownership of
 * a platform's homepage and earns nothing. `socialProfiles` has already
 * dropped the unfilled ones; omitting the key entirely when none are set beats
 * emitting an empty array.
 */
const SAME_AS = socialProfiles.map((profile) => profile.href);

/** Organization — emitted once, on the homepage. */
export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.name,
    url: site.url,
    description: site.description,
    logo: `${site.url}/icon.svg`,
    founder: {
      "@type": "Person",
      name: site.founder.name,
    },
    ...(SAME_AS.length > 0 ? { sameAs: SAME_AS } : {}),
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.name,
    url: site.url,
    description: site.description,
    publisher: { "@type": "Organization", name: site.name, url: site.url },
  };
}

export function personJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.founder.name,
    url: `${site.url}/about`,
    jobTitle: site.founder.roles.join(", "),
    worksFor: { "@type": "Organization", name: site.name, url: site.url },
    ...(SAME_AS.length > 0 ? { sameAs: SAME_AS } : {}),
  };
}

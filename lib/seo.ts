import type { Metadata } from "next";
import { site } from "@/config/site";
import { routeByPath } from "@/config/routes";

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
    alternates: { canonical: path },
    robots: route.indexable
      ? undefined
      : // Thin until it has content: keep it out of the index, but let the
        // crawler follow its links so the rest of the site is discoverable.
        { index: false, follow: true },
    openGraph: {
      type: "website",
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
    sameAs: [site.social.github, site.social.x, site.social.linkedin],
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
    sameAs: [site.social.github, site.social.x, site.social.linkedin],
  };
}

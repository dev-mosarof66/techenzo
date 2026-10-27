import { getExperiments } from "@/lib/content";
import { getFeaturedProduct } from "@/lib/products";
import { getPosts } from "@/lib/writing";
import { getProjects } from "@/lib/projects";
import { Hero, type PageIndexEntry } from "@/components/home/hero";
import { Capabilities, Method } from "@/components/home/sections";
import { FeaturedShowcase, LabShowcase } from "@/components/home/showcase";
import { FounderPanel, ProjectsGrid, WritingGrid } from "@/components/home/more";
import { WorkWithUs } from "@/components/home/cta";
import { HomeSection, SectionHead } from "@/components/home/ui";
import { RevealObserver } from "@/components/home/reveal-observer";
import { JsonLd } from "@/components/seo/json-ld";
import { organizationJsonLd, pageMetadata, websiteJsonLd } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = pageMetadata("/");

export default async function HomePage() {
  const experiments = await getExperiments();
  const published = experiments.filter((e) => !e.draft);
  const latest = experiments.slice(0, 3);
  const featured = await getFeaturedProduct();
  const posts = (await getPosts()).slice(0, 4);
  const projects = (await getProjects()).slice(0, 3);

  // The section index counts what is actually on the page. A block with
  // nothing to show is omitted, and the numbers after it close the gap rather
  // than skipping one — the hero's table of contents reads from the same list.
  const blocks = [
    { id: "what-we-build", label: "What we build", show: true },
    { id: "method", label: "How we work", show: true },
    { id: "featured-product", label: "Featured product", show: Boolean(featured) },
    { id: "lab", label: "Engineering Lab", show: true },
    { id: "projects", label: "Selected projects", show: projects.length > 0 },
    { id: "latest", label: "Latest writing", show: posts.length > 0 },
    { id: "founder", label: "Behind Techenzo", show: true },
    { id: "work-with-us", label: "Work with us", show: true },
  ].filter((block) => block.show);

  const sections: PageIndexEntry[] = blocks.map((block, i) => ({
    id: block.id,
    label: block.label,
    index: String(i + 1).padStart(2, "0"),
  }));
  const idx = (id: string) => sections.find((s) => s.id === id)?.index ?? "";

  return (
    <>
      <JsonLd data={organizationJsonLd()} />
      <JsonLd data={websiteJsonLd()} />
      <RevealObserver />

      <Hero experiment={published[0] ?? null} product={featured} sections={sections} />

      <HomeSection id="what-we-build">
        <SectionHead
          index={idx("what-we-build")}
          label="What we build"
          title="Three kinds of work,"
          accent="one standard of evidence."
        />
        <Capabilities />
      </HomeSection>

      <HomeSection id="method" className="pt-0 lg:pt-0">
        <SectionHead
          index={idx("method")}
          label="How we work"
          title="Nothing ships without"
          accent="a number attached."
          intro="Every product and experiment on this site goes through the same four steps, and the last one is public."
          center
        />
        <Method />
      </HomeSection>

      {/* Omitted entirely when there is nothing to show, rather than rendering
          a section with a placeholder in it. */}
      {featured ? (
        <HomeSection id="featured-product" className="pt-0 lg:pt-0">
          <SectionHead
            index={idx("featured-product")}
            label="Featured product"
            title="What we are"
            accent="building now."
            action={{ label: "All products", href: "/products" }}
          />
          <FeaturedShowcase product={featured} />
        </HomeSection>
      ) : null}

      <HomeSection id="lab" className="pt-0 lg:pt-0">
        <SectionHead
          index={idx("lab")}
          label="Engineering Lab"
          title="Experiments, benchmarks, and"
          accent="what they actually proved."
        />
        <LabShowcase experiments={latest} />
      </HomeSection>

      {projects.length > 0 ? (
        <HomeSection id="projects" className="pt-0 lg:pt-0">
          <SectionHead
            index={idx("projects")}
            label="Selected projects"
            title="Smaller than products,"
            accent="sharper in scope."
            action={{ label: "All projects", href: "/projects" }}
          />
          <ProjectsGrid projects={projects} />
        </HomeSection>
      ) : null}

      {posts.length > 0 ? (
        <HomeSection id="latest" className="pt-0 lg:pt-0">
          <SectionHead
            index={idx("latest")}
            label="Latest from Techenzo"
            title="Articles, build logs"
            accent="and notes."
            action={{ label: "All writing", href: "/writing" }}
          />
          <WritingGrid posts={posts} />
        </HomeSection>
      ) : null}

      <HomeSection id="founder" className="pt-0 lg:pt-0">
        <SectionHead
          index={idx("founder")}
          label="Behind Techenzo"
          title="Built in the open,"
          accent="signed by a person."
        />
        <FounderPanel />
      </HomeSection>

      <HomeSection id="work-with-us" className="pt-0 lg:pt-0">
        <WorkWithUs index={idx("work-with-us")} />
      </HomeSection>
    </>
  );
}

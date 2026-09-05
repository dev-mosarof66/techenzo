import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Container } from "@/components/layout/container";
import { MdxContent } from "@/components/mdx/mdx-content";
import { ButtonLink } from "@/components/ui/button";
import { PrevNextNav } from "@/components/ui/prev-next-nav";
import { StackList } from "@/components/products/sections";
import {
  CATEGORY_LABEL,
  getProject,
  getProjectNeighbours,
  getProjects,
} from "@/lib/projects";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbJsonLd, FEED_ALTERNATE, OG_LOCALE } from "@/lib/seo";
import { site } from "@/config/site";

type Params = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) return {};

  return {
    title: project.title,
    description: project.description,
    alternates: { canonical: `/projects/${slug}`, types: FEED_ALTERNATE },
    robots: project.draft ? { index: false, follow: false } : undefined,
    openGraph: {
      type: "website",
      locale: OG_LOCALE,
      url: `/projects/${slug}`,
      siteName: site.name,
      title: project.title,
      description: project.description,
    },
    twitter: {
      card: "summary_large_image",
      title: project.title,
      description: project.description,
    },
  };
}

/**
 * Deliberately lighter than a product page — spec §9.4. No feature grid, no
 * metrics, no changelog: header, body, stack, links. A project that needs all
 * of that has become a product.
 */
export default async function ProjectPage({ params }: Params) {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) notFound();

  const { newer, older } = await getProjectNeighbours(slug);

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Projects", path: "/projects" },
          { name: project.title, path: `/projects/${slug}` },
        ])}
      />
      <Container width="prose" className="pt-14 lg:pt-20">
        <Link
          href="/projects"
          className="link-draw t-mono-sm inline-flex items-center gap-2 text-ink-3 hover:text-ink"
        >
          <ArrowLeft size={14} strokeWidth={1.5} aria-hidden="true" />
          Projects
        </Link>

        <div className="t-mono-sm mt-8 flex flex-wrap items-baseline gap-x-4 gap-y-1 text-ink-3">
          <span className="text-accent">{CATEGORY_LABEL[project.category]}</span>
          <time dateTime={project.createdAt}>{project.createdAt}</time>
          {project.draft ? (
            <span className="rounded-full border border-status-building/30 bg-status-building/10 px-2 text-status-building">
              Draft — not published
            </span>
          ) : null}
        </div>

        <h1 className="t-h1 mt-4">{project.title}</h1>
        <p className="t-body-lg mt-4 text-ink-2">{project.description}</p>

        <div className="mt-8 flex flex-wrap gap-3">
          {project.demoUrl ? (
            <ButtonLink href={project.demoUrl} variant="primary" external>
              Demo
            </ButtonLink>
          ) : null}
          {project.githubUrl ? (
            <ButtonLink href={project.githubUrl} variant="secondary" external>
              GitHub
            </ButtonLink>
          ) : null}
        </div>
      </Container>

      {project.image ? (
        <Container width="default" className="mt-12">
          <Image
            src={project.image}
            alt={`${project.title} in use`}
            width={2400}
            height={1500}
            sizes="(min-width: 1200px) 1200px, 100vw"
            priority
            className="w-full rounded-md border border-line"
          />
        </Container>
      ) : null}

      <Container width="prose" className="pb-24 pt-12">
        <div className="prose">
          <MdxContent source={project.body} />
          <StackList stack={project.stack} />
        </div>

        <PrevNextNav
          label="More projects"
          newer={
            newer
              ? {
                  href: `/projects/${newer.slug}`,
                  title: newer.title,
                  eyebrow: CATEGORY_LABEL[newer.category],
                }
              : null
          }
          older={
            older
              ? {
                  href: `/projects/${older.slug}`,
                  title: older.title,
                  eyebrow: CATEGORY_LABEL[older.category],
                }
              : null
          }
        />
      </Container>
    </>
  );
}

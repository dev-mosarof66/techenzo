import type { Metadata } from "next";
import { PageHero } from "@/components/layout/page-hero";
import { Section } from "@/components/layout/section";
import { ButtonLink } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { FilterRow, type FilterOption } from "@/components/ui/filter-row";
import { Pagination, paginate, resolvePage } from "@/components/ui/pagination";
import { ProjectCard } from "@/components/projects/project-card";
import {
  CATEGORY_LABEL,
  PROJECT_CATEGORIES,
  getProjects,
  type ProjectCategory,
} from "@/lib/projects";
import { pageMetadata } from "@/lib/seo";

type Props = {
  searchParams: Promise<{ category?: string | string[]; page?: string | string[] }>;
};

function resolveCategory(raw: string | string[] | undefined): ProjectCategory | null {
  const candidate = Array.isArray(raw) ? raw[0] : raw;
  if (!candidate) return null;
  return (
    PROJECT_CATEGORIES.find((category) => category === candidate.toLowerCase()) ?? null
  );
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const published = (await getProjects()).filter((p) => !p.draft);
  const category = resolveCategory((await searchParams).category);

  if (category) {
    return pageMetadata("/projects", {
      title: `${CATEGORY_LABEL[category]} projects`,
      description: `Techenzo projects in ${CATEGORY_LABEL[category]}, with the repos behind them.`,
      alternates: { canonical: "/projects" },
      robots: { index: false, follow: true },
    });
  }

  return pageMetadata("/projects", {
    robots:
      published.length > 0 ? { index: true, follow: true } : { index: false, follow: true },
  });
}

export default async function ProjectsPage({ searchParams }: Props) {
  const projects = await getProjects();
  const published = projects.filter((p) => !p.draft);
  const activeCategory = resolveCategory((await searchParams).category);

  const visible = activeCategory
    ? projects.filter((project) => project.category === activeCategory)
    : projects;

  const present = PROJECT_CATEGORIES.filter((category) =>
    projects.some((project) => project.category === category),
  );

  const params = await searchParams;
  const page = paginate(visible, resolvePage(params.page));

  const options: FilterOption[] = [
    {
      label: "All",
      href: "/projects",
      active: activeCategory === null,
      count: projects.length,
    },
    ...present.map((category) => ({
      label: CATEGORY_LABEL[category],
      href: `/projects?category=${category}`,
      active: activeCategory === category,
      count: projects.filter((project) => project.category === category).length,
    })),
  ];

  return (
    <>
      <PageHero
        title="Projects"
        intro="Things we built. Smaller than products, sharper in scope, and open where it makes sense."
        meta={
          published.length > 0
            ? `${published.length} ${published.length === 1 ? "project" : "projects"}`
            : undefined
        }
      />

      <Section>
        <h2 className="sr-only">Projects</h2>
        <FilterRow options={options} label="Filter projects by category" />

        {visible.length > 0 ? (
          // Container carries top and left; cards carry bottom and right.
          // One hairline between neighbours, no doubled borders.
        <>
            <div className="grid grid-cols-1 border-l border-t border-line md:grid-cols-2 lg:grid-cols-3">
              {page.items.map((project) => (
                <ProjectCard key={project.slug} project={project} />
              ))}
            </div>

            <Pagination
              {...page}
              label="Pagination"
              hrefFor={(n: number) =>
                  `/projects?${new URLSearchParams({
                    ...(activeCategory ? { category: activeCategory } : {}),
                    ...(n > 1 ? { page: String(n) } : {}),
                  })}`.replace(/\?$/, "")}
            />
        </>
        ) : activeCategory ? (
          <EmptyState
            title={`No ${CATEGORY_LABEL[activeCategory]} projects yet.`}
            body="Everything else is listed under All."
            action={
              <ButtonLink href="/projects" variant="secondary" size="sm">
                Show all projects
              </ButtonLink>
            }
          />
        ) : (
          <EmptyState
            title="No projects listed yet."
            body="Repos land here as they become worth reading rather than just running."
            action={
              <ButtonLink href="/lab" variant="secondary" size="sm">
                Read the Lab
              </ButtonLink>
            }
          />
        )}
      </Section>
    </>
  );
}

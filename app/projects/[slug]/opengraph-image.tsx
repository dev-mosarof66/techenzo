import { OG_SIZE, renderBrandCard } from "@/lib/og";
import { CATEGORY_LABEL, getProject, getProjects } from "@/lib/projects";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Techenzo project";

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((project) => ({ slug: project.slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProject(slug);

  return renderBrandCard({
    kicker: project
      ? `Techenzo · ${CATEGORY_LABEL[project.category]}`
      : "Techenzo · Projects",
    title: project?.title ?? "Projects",
    description: project?.description ?? "Things we built.",
  });
}

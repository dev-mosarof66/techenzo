import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { GitHubIcon } from "@/components/ui/icons";
import { TechList } from "@/components/ui/tech-list";
import { CATEGORY_LABEL, type LoadedProject } from "@/lib/projects";

/**
 * Denser than a ProductCard and imageless by default — spec §8.5.
 *
 * The weight difference is the point: products are things people use, projects
 * are things we built. If both rendered at the same visual weight the
 * distinction would exist only in the URL.
 *
 * Cards carry their bottom and right rules while the grid container carries top
 * and left, which collapses neighbours into a single hairline mesh with no
 * doubled borders — and, unlike a `gap-px` mesh, leaves no block of border
 * colour where a partly-filled last row would be.
 */
export function ProjectCard({ project }: { project: LoadedProject }) {
  return (
    <article className="ticks group relative flex flex-col border-b border-r border-line p-5 transition-colors duration-[var(--dur-fast)] hover:bg-raised sm:p-6">
      <div className="t-mono-sm flex items-baseline justify-between gap-3 text-ink-3">
        <span>{CATEGORY_LABEL[project.category]}</span>
        <span>{project.year}</span>
      </div>

      <h3 className="t-h3 mt-3">
        <Link
          href={`/projects/${project.slug}`}
          className="transition-colors duration-[var(--dur-fast)] group-hover:text-accent after:absolute after:inset-0 after:content-['']"
        >
          {project.title}
        </Link>
      </h3>

      <p className="t-body-sm mt-2 line-clamp-2 text-ink-2">{project.description}</p>

      <div className="mt-auto flex items-end justify-between gap-4 pt-5">
        <TechList items={project.technologies} max={3} />

        {/* relative z-10 to sit above the title's card-wide overlay link */}
        <div className="relative z-10 flex shrink-0 items-center gap-3">
          {project.githubUrl ? (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${project.title} on GitHub`}
              className="text-ink-3 transition-colors duration-[var(--dur-fast)] hover:text-ink"
            >
              <GitHubIcon size={16} />
            </a>
          ) : null}
          {project.demoUrl ? (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${project.title} demo`}
              className="text-ink-3 transition-colors duration-[var(--dur-fast)] hover:text-ink"
            >
              <ArrowUpRight size={16} strokeWidth={1.5} aria-hidden="true" />
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}

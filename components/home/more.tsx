import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Mail } from "lucide-react";
import { Portrait } from "@/components/founder/portrait";
import { GitHubIcon, SOCIAL_ICONS } from "@/components/ui/icons";
import { site, socialProfiles } from "@/config/site";
import { CATEGORY_LABEL, type LoadedProject } from "@/lib/projects";
import { reveal } from "@/lib/reveal";
import { TYPE_LABEL, type LoadedPost } from "@/lib/writing";
import { CARD_HOVER, Glow, PANEL, Tag } from "./ui";

/**
 * Block 05 — projects as rounded cards; the whole card is the link. The grid
 * follows the count: one project is a single wide card rather than a lone
 * third of an empty row, two share the width, three fill it.
 */
const PROJECT_COLS = ["", "grid-cols-1", "md:grid-cols-2", "md:grid-cols-2 lg:grid-cols-3"];

export function ProjectsGrid({ projects }: { projects: LoadedProject[] }) {
  const wide = projects.length === 1;
  return (
    <ul className={`grid grid-cols-1 gap-4 lg:gap-5 ${PROJECT_COLS[Math.min(projects.length, 3)]}`}>
      {projects.map((project, index) => (
        <li key={project.slug} {...reveal(index)}>
          <article
            className={`group relative flex h-full flex-col overflow-hidden p-6 sm:p-7 ${wide ? "lg:p-10" : ""} ${PANEL} ${CARD_HOVER}`}
          >
            {wide ? <Glow className="-top-40 -right-40 size-[480px]" /> : null}
            <div className="relative flex items-center justify-between gap-3">
              <Tag tone="accent">{CATEGORY_LABEL[project.category]}</Tag>
              <span className="font-mono text-sm text-ink-3">{project.year}</span>
            </div>

            <h3
              className={`relative mt-6 font-semibold tracking-tight ${wide ? "text-[clamp(1.5rem,1.2rem+1vw,2rem)]" : "text-xl"}`}
            >
              <Link
                href={`/projects/${project.slug}`}
                className="transition-colors group-hover:text-accent after:absolute after:inset-0 after:rounded-3xl after:content-['']"
              >
                {project.title}
              </Link>
            </h3>
            <p
              className={`relative mt-3 flex-1 leading-relaxed text-ink-2 ${wide ? "max-w-[70ch] text-base" : "line-clamp-3 text-[0.9375rem]"}`}
            >
              {project.description}
            </p>

            {project.technologies.length > 0 ? (
              <ul className="relative mt-6 flex flex-wrap gap-2">
                {project.technologies.slice(0, wide ? 8 : 4).map((tech) => (
                  <li key={tech}>
                    <Tag>{tech}</Tag>
                  </li>
                ))}
              </ul>
            ) : null}

            <div className="relative mt-6 flex items-center justify-between border-t border-line pt-5 text-sm">
              <span className="inline-flex items-center gap-2 font-semibold text-accent">
                Read more
                <ArrowRight
                  size={16}
                  strokeWidth={2}
                  aria-hidden="true"
                  className="transition-transform duration-[var(--dur-fast)] group-hover:translate-x-0.5"
                />
              </span>
              {project.githubUrl ? (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${project.title} on GitHub`}
                  className="relative z-10 grid size-9 place-items-center rounded-full border border-line text-ink-3 transition-colors hover:border-accent hover:text-ink"
                >
                  <GitHubIcon size={16} />
                </a>
              ) : null}
            </div>
          </article>
        </li>
      ))}
    </ul>
  );
}

/**
 * Block 06 — writing. Every post gets the same card at the same height, so a
 * row reads as a set rather than one big card and a leftover. The grid follows
 * the count: two share the row, three fill it, four make a 2×2.
 */
const POST_COLS = ["", "grid-cols-1", "md:grid-cols-2", "md:grid-cols-2 lg:grid-cols-3", "md:grid-cols-2"];

export function WritingGrid({ posts }: { posts: LoadedPost[] }) {
  if (posts.length === 0) return null;

  return (
    <ul className={`grid grid-cols-1 gap-4 lg:gap-5 ${POST_COLS[Math.min(posts.length, 4)]}`}>
      {posts.map((post, index) => (
        <li key={post.slug} {...reveal(index)}>
          <article
            className={`group relative flex h-full flex-col overflow-hidden p-6 sm:p-7 ${PANEL} ${CARD_HOVER}`}
          >
            {/* The same faint corner wash as the capability cards, on hover only. */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -top-24 -right-24 size-56 rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--accent)_18%,transparent),transparent_70%)] opacity-0 transition-opacity duration-[var(--dur-slow)] group-hover:opacity-100"
            />
            {post.featuredImage ? (
              <div className="relative mb-6 overflow-hidden rounded-2xl border border-line">
                <Image
                  src={post.featuredImage}
                  alt=""
                  width={1200}
                  height={630}
                  sizes="(min-width: 768px) 600px, 100vw"
                  className="h-auto w-full"
                />
              </div>
            ) : null}
            <PostMeta post={post} />
            <h3 className="relative mt-5 text-xl leading-snug font-semibold tracking-tight">
              <PostLink post={post} />
            </h3>
            <p className="relative mt-3 line-clamp-3 flex-1 text-[0.9375rem] leading-relaxed text-ink-2">
              {post.description}
            </p>
            <div className="relative mt-6 border-t border-line pt-5">
              <ReadMore />
            </div>
          </article>
        </li>
      ))}
    </ul>
  );
}

function PostMeta({ post }: { post: LoadedPost }) {
  return (
    <div className="relative flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-ink-3">
      <Tag tone={post.type === "build-log" ? "accent" : "neutral"}>{TYPE_LABEL[post.type]}</Tag>
      <time dateTime={post.publishedAt}>{post.publishedAt}</time>
      <span aria-hidden="true">·</span>
      <span>{post.readingMinutes} min read</span>
    </div>
  );
}

function PostLink({ post }: { post: LoadedPost }) {
  return (
    <Link
      href={`/writing/${post.slug}`}
      className="transition-colors group-hover:text-accent after:absolute after:inset-0 after:rounded-3xl after:content-['']"
    >
      {post.title}
    </Link>
  );
}

function ReadMore() {
  return (
    <span className="inline-flex items-center gap-2 text-sm font-semibold text-accent">
      Read it
      <ArrowRight
        size={16}
        strokeWidth={2}
        aria-hidden="true"
        className="transition-transform duration-[var(--dur-fast)] group-hover:translate-x-0.5"
      />
    </span>
  );
}

/**
 * Block 07 — the person behind it. Techenzo is still the subject: this is a
 * panel inside the page, not a second hero.
 */
export function FounderPanel() {
  return (
    <div className={`relative overflow-hidden p-5 sm:p-8 lg:p-10 ${PANEL}`} {...reveal()}>
      <Glow className="-bottom-48 -left-40 size-[520px]" />
      <div className="relative grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-12">
        <div className="mx-auto w-full max-w-[320px] lg:col-span-4 lg:max-w-none">
          <div className="overflow-hidden rounded-2xl">
            <Portrait sizes="(min-width: 1024px) 380px, 320px" />
          </div>
        </div>

        <div className="lg:col-span-8">
          <p className="t-kicker text-accent">Founder</p>
          <h3 className="mt-3 text-[clamp(1.75rem,1.3rem+1.6vw,2.5rem)] leading-tight font-semibold tracking-[-0.03em]">
            {site.founder.name}
          </h3>
          <ul className="mt-4 flex flex-wrap gap-2">
            {site.founder.roles.map((role) => (
              <li key={role}>
                <Tag>{role}</Tag>
              </li>
            ))}
          </ul>
          <p className="mt-6 max-w-[60ch] text-lg leading-relaxed text-ink-2">{site.founder.bio}</p>

          <ul className="mt-8 flex flex-wrap gap-2.5">
            {socialProfiles.map(({ label, href }) => {
              const Icon = SOCIAL_ICONS[label];
              return (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-10 items-center gap-2 rounded-full border border-line bg-canvas px-4 text-sm font-medium transition-colors hover:border-accent"
                  >
                    {Icon ? <Icon size={16} /> : null}
                    {label}
                    <ArrowUpRight size={14} strokeWidth={1.75} aria-hidden="true" className="text-ink-3" />
                  </a>
                </li>
              );
            })}
            <li>
              <a
                href={`mailto:${site.social.email}`}
                className="inline-flex h-10 items-center gap-2 rounded-full border border-line bg-canvas px-4 text-sm font-medium transition-colors hover:border-accent"
              >
                <Mail size={16} strokeWidth={1.75} aria-hidden="true" />
                {site.social.email}
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

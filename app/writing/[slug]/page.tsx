import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, FlaskConical } from "lucide-react";
import { Container } from "@/components/layout/container";
import { MdxContent } from "@/components/mdx/mdx-content";
import { ReadingProgress } from "@/components/lab/reading-progress";
import { PrevNextNav } from "@/components/ui/prev-next-nav";
import { Byline } from "@/components/writing/byline";
import { JsonLd } from "@/components/seo/json-ld";
import { TYPE_LABEL, getPost, getPostNeighbours, getPosts } from "@/lib/writing";
import { site } from "@/config/site";

type Params = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/writing/${slug}` },
    robots: post.draft ? { index: false, follow: false } : undefined,
    openGraph: {
      type: "article",
      url: `/writing/${slug}`,
      siteName: site.name,
      title: post.title,
      description: post.description,
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [post.author],
      tags: [...post.tags],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
  };
}

export default async function PostPage({ params }: Params) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const { newer, older } = await getPostNeighbours(slug);

  // Build logs are notes, not essays — they read in the interface face at
  // interface size, with tighter rhythm (spec §9.7).
  const proseClass = post.type === "build-log" ? "prose prose-notes" : "prose";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt ?? post.publishedAt,
    author: { "@type": "Person", name: post.author },
    publisher: { "@type": "Organization", name: site.name, url: site.url },
    mainEntityOfPage: `${site.url}/writing/${slug}`,
    keywords: post.tags.join(", "),
  };

  return (
    <>
      {!post.draft ? <JsonLd data={jsonLd} /> : null}
      <ReadingProgress targetId="post" />

      <article id="post">
        <Container width="prose" className="pt-14 lg:pt-20">
          <Link
            href="/writing"
            className="link-draw t-mono-sm inline-flex items-center gap-2 text-ink-3 hover:text-ink"
          >
            <ArrowLeft size={14} strokeWidth={1.5} aria-hidden="true" />
            Writing
          </Link>

          <div className="t-mono-sm mt-8 flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <span className="text-accent">{TYPE_LABEL[post.type]}</span>
            {post.draft ? (
              <span className="rounded-full border border-status-building/30 bg-status-building/10 px-2 text-status-building">
                Draft — not published
              </span>
            ) : null}
          </div>

          <h1 className="t-h1 mt-4">{post.title}</h1>

          {/* Standfirst: the serif lead that tells a reader whether to continue */}
          <p className="t-prose-lead mt-6 text-ink-2">{post.description}</p>

          <div className="mt-8">
            <Byline
              publishedAt={post.publishedAt}
              updatedAt={post.updatedAt}
              readingMinutes={post.readingMinutes}
            />
          </div>
        </Container>

        {post.featuredImage ? (
          <Container width="default" className="mt-12">
            <Image
              src={post.featuredImage}
              alt=""
              width={2400}
              height={1500}
              sizes="(min-width: 1200px) 1200px, 100vw"
              priority
              className="w-full rounded-md border border-line"
            />
          </Container>
        ) : null}

        <Container width="prose" className="pt-12">
          <div className={proseClass}>
            <MdxContent source={post.body} />
          </div>

          {post.experiment ? (
            <aside className="mt-14 flex flex-col gap-3 border border-line p-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="t-body-sm flex items-center gap-2.5 text-ink-2">
                <FlaskConical
                  size={16}
                  strokeWidth={1.5}
                  aria-hidden="true"
                  className="shrink-0 text-accent"
                />
                The measurements behind this piece are published as an experiment.
              </p>
              <Link
                href={`/lab/${post.experiment}`}
                className="link-draw t-mono-sm shrink-0 text-accent"
              >
                Read the experiment
              </Link>
            </aside>
          ) : null}

          {post.tags.length > 0 ? (
            <p className="t-mono-sm mt-10 border-t border-line pt-5 text-ink-3">
              {post.tags.join(" · ")}
            </p>
          ) : null}
        </Container>
      </article>

      {/* Outside the article: progress should complete at the end of the piece. */}
      <Container width="prose" className="pb-24">
        <PrevNextNav
          label="More writing"
          newer={newer ? { href: `/writing/${newer.slug}`, title: newer.title } : null}
          older={older ? { href: `/writing/${older.slug}`, title: older.title } : null}
        />
      </Container>
    </>
  );
}

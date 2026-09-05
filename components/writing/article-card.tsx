import Link from "next/link";
import Image from "next/image";
import { TYPE_LABEL, type ContentType, type LoadedPost } from "@/lib/writing";

/**
 * A row in the writing index — spec §8.7. A list, not a grid: the index should
 * read like a publication's contents page.
 *
 * Content type is carried by a left rule *and* a text label. The colour alone
 * would be meaningless to a colourblind reader and invisible in forced-colors
 * mode, so the label is not optional decoration — it is the actual signal, and
 * the rule is the shortcut for people who can use it.
 */
const TYPE_RULE: Record<ContentType, string> = {
  article: "border-line-strong",
  "build-log": "border-accent",
  note: "border-series-3",
};

export function ArticleCard({
  post,
  featured = false,
}: {
  post: LoadedPost;
  featured?: boolean;
}) {
  return (
    <article
      className={`group relative border-b border-l-2 border-line py-7 pl-5 transition-colors duration-[var(--dur-fast)] hover:bg-raised ${TYPE_RULE[post.type]}`}
    >
      <div className={featured ? "flex flex-col gap-6 md:flex-row-reverse" : ""}>
        {featured && post.featuredImage ? (
          <div className="aspect-16/10 shrink-0 overflow-hidden rounded-md border border-line md:w-2/5">
            <Image
              src={post.featuredImage}
              alt=""
              width={1200}
              height={750}
              sizes="(min-width: 768px) 40vw, 100vw"
              className="size-full object-cover"
            />
          </div>
        ) : null}

        <div className="min-w-0 flex-1">
          <div className="t-mono-sm flex flex-wrap items-baseline gap-x-4 gap-y-1 text-ink-3">
            <time dateTime={post.publishedAt}>{post.publishedAt}</time>
            <span>{post.readingMinutes} min read</span>
            <span className="text-ink-2">{TYPE_LABEL[post.type]}</span>
            {post.draft ? (
              <span className="rounded-full border border-status-building/30 bg-status-building/10 px-2 text-status-building">
                Draft
              </span>
            ) : null}
          </div>

          <h3 className={featured ? "t-h2 mt-3" : "t-h3 mt-2.5"}>
            <Link
              href={`/writing/${post.slug}`}
              className="transition-colors duration-[var(--dur-fast)] group-hover:text-accent after:absolute after:inset-0 after:content-['']"
            >
              {post.title}
            </Link>
          </h3>

          <p className="t-body-sm measure-copy mt-2 line-clamp-2 text-ink-2">
            {post.description}
          </p>

          {post.tags.length > 0 ? (
            <p className="t-mono-sm mt-4 text-ink-3">{post.tags.join(" · ")}</p>
          ) : null}
        </div>
      </div>
    </article>
  );
}

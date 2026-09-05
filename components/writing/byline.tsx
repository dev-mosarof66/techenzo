import { site } from "@/config/site";

const initials = site.founder.name
  .split(" ")
  .map((part) => part.charAt(0))
  .join("");

/**
 * Author line. The avatar falls back to initials rather than a generated
 * illustration — a made-up face attached to a real byline is worse than no
 * face at all.
 */
export function Byline({
  publishedAt,
  updatedAt,
  readingMinutes,
}: {
  publishedAt: string;
  updatedAt?: string;
  readingMinutes: number;
}) {
  return (
    <div className="flex items-center gap-3 border-y border-line py-4">
      <span
        aria-hidden="true"
        className="grid size-8 shrink-0 place-items-center rounded-full border border-line bg-raised font-mono text-[0.625rem] text-ink-3"
      >
        {initials}
      </span>
      <div className="t-mono-sm flex flex-wrap items-baseline gap-x-3 gap-y-0.5 text-ink-3">
        <span className="text-ink">{site.founder.name}</span>
        <span aria-hidden="true">·</span>
        <time dateTime={publishedAt}>{publishedAt}</time>
        <span aria-hidden="true">·</span>
        <span>{readingMinutes} min read</span>
        {updatedAt ? (
          <>
            <span aria-hidden="true">·</span>
            <span>updated {updatedAt}</span>
          </>
        ) : null}
      </div>
    </div>
  );
}

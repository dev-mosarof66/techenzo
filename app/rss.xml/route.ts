import { site } from "@/config/site";
import { getExperiments } from "@/lib/content";
import { getPosts } from "@/lib/writing";

export const dynamic = "force-static";

const escape = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

interface FeedEntry {
  title: string;
  description: string;
  path: string;
  publishedAt: string;
  tags: readonly string[];
}

export async function GET() {
  // Drafts never reach the feed — a subscriber's reader is the one place you
  // cannot unpublish something from. This filter is deliberately independent of
  // TECHENZO_INCLUDE_DRAFTS: a preview deploy may render draft pages, but it
  // must never publish them to a feed.
  const experiments = (await getExperiments()).filter((e) => !e.draft);
  const posts = (await getPosts()).filter((p) => !p.draft);

  const entries: FeedEntry[] = [
    ...experiments.map((experiment) => ({
      title: experiment.title,
      description: experiment.description,
      path: `/lab/${experiment.slug}`,
      publishedAt: experiment.publishedAt,
      tags: experiment.tags,
    })),
    ...posts.map((post) => ({
      title: post.title,
      description: post.description,
      path: `/writing/${post.slug}`,
      publishedAt: post.publishedAt,
      tags: post.tags,
    })),
  ].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));

  const items = entries.map((entry) => {
    const url = `${site.url}${entry.path}`;
    const categories = entry.tags
      .map((tag) => `      <category>${escape(tag)}</category>`)
      .join("\n");

    return `    <item>
      <title>${escape(entry.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${escape(entry.description)}</description>
      <pubDate>${new Date(`${entry.publishedAt}T09:00:00Z`).toUTCString()}</pubDate>
${categories}
    </item>`;
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escape(site.name)}</title>
    <link>${site.url}</link>
    <description>${escape(site.description)}</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${site.url}/rss.xml" rel="self" type="application/rss+xml" />
${items.join("\n")}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}

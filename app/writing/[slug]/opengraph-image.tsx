import { OG_SIZE, renderBrandCard } from "@/lib/og";
import { TYPE_LABEL, getPost, getPosts } from "@/lib/writing";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Techenzo writing";

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);

  return renderBrandCard({
    kicker: post ? `Techenzo · ${TYPE_LABEL[post.type]}` : "Techenzo · Writing",
    title: post?.title ?? "Writing",
    description: post?.description ?? "Building with AI in production.",
  });
}

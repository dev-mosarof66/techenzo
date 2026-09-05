import { OG_SIZE, renderBrandCard } from "@/lib/og";
import { getProduct, getProducts } from "@/lib/products";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Techenzo product";

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((product) => ({ slug: product.slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProduct(slug);

  return renderBrandCard({
    kicker: "Techenzo · Product",
    title: product?.name ?? "Products",
    description: product?.tagline ?? "Products built and shipped by Techenzo.",
  });
}

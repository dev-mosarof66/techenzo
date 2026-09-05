import { Card, CardLink } from "@/components/ui/card";
import { StatusChip } from "@/components/ui/status-chip";
import { TechList } from "@/components/ui/tech-list";
import type { LoadedProduct } from "@/lib/products";
import { ProductImage } from "./product-image";

export function ProductCard({ product }: { product: LoadedProduct }) {
  return (
    <Card>
      <ProductImage
        product={product}
        sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
        className="mb-5"
      />

      <div className="mb-3.5 flex items-center justify-between gap-3">
        <StatusChip status={product.status} />
        {product.category ? (
          <span className="t-mono-sm truncate text-ink-3">{product.category}</span>
        ) : null}
      </div>

      <h3 className="t-h3">
        <CardLink href={`/products/${product.slug}`}>{product.name}</CardLink>
      </h3>

      <p className="t-body-sm mt-2 line-clamp-3 text-ink-2">{product.tagline}</p>

      <TechList items={product.technologies} className="mt-auto pt-5" />
    </Card>
  );
}

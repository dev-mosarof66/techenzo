import Image from "next/image";
import type { LoadedProduct } from "@/lib/products";
import { cn } from "@/lib/utils";

/**
 * Product screenshot, framed per spec §5.3 — 1px border, 4px radius, no browser
 * chrome, no perspective tilt, no floating shadow.
 *
 * A missing screenshot degrades to the product's initial rather than a broken
 * frame. Most products spend a while with no screenshot, so this is the normal
 * state, not an error state.
 */
export function ProductImage({
  product,
  sizes,
  priority,
  className,
}: {
  product: LoadedProduct;
  sizes: string;
  priority?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "aspect-16/10 overflow-hidden rounded-md border border-line bg-raised",
        className,
      )}
    >
      {product.image ? (
        <Image
          src={product.image}
          alt={`${product.name} in use`}
          width={2400}
          height={1500}
          sizes={sizes}
          priority={priority}
          className="size-full object-cover"
        />
      ) : (
        <div className="grid size-full place-items-center">
          <span
            aria-hidden="true"
            // Pure decoration (WCAG 1.4.3 exempt) and hidden from AT. axe still
            // reports it as low contrast; that is a known, accepted exception —
            // see docs/ui-ux-spec.md §11.
            className="select-none text-6xl font-medium leading-none tracking-[-0.03em] text-ink opacity-8 lg:text-8xl"
          >
            {product.name.charAt(0)}
          </span>
        </div>
      )}
    </div>
  );
}

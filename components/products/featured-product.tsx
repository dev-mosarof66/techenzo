import Link from "next/link";
import { StatusChip } from "@/components/ui/status-chip";
import { TechList } from "@/components/ui/tech-list";
import { ButtonLink } from "@/components/ui/button";
import { ProductImage } from "./product-image";
import type { LoadedProduct } from "@/lib/products";

/**
 * Homepage block 02 — the asymmetric featured card (spec §9.1).
 *
 * The important rule here is the one about honesty: when nothing has launched
 * yet, this renders the most advanced product carrying its *true* status and a
 * "Follow the build" CTA. It never dresses a work in progress as a shipped
 * thing, and there is no code path that can produce a "Try it" button for a
 * product with nowhere to go.
 */
export function FeaturedProduct({ product }: { product: LoadedProduct }) {
  const isUsable = Boolean(product.url);

  return (
    <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-12">
      {/* Image first in the DOM, so the mobile stack leads with it */}
      <div className="lg:col-span-7">
        <ProductImage
          product={product}
          sizes="(min-width: 1024px) 58vw, 100vw"
          className="ticks"
        />
      </div>

      <div className="lg:col-span-5">
        <div className="flex flex-wrap items-center gap-3">
          <StatusChip status={product.status} />
          {product.category ? (
            <span className="t-mono-sm text-ink-3">{product.category}</span>
          ) : null}
        </div>

        <h3 className="t-h2 mt-4">
          <Link
            href={`/products/${product.slug}`}
            className="link-draw transition-colors duration-[var(--dur-fast)] hover:text-accent"
          >
            {product.name}
          </Link>
        </h3>

        <p className="t-body-lg mt-3 text-ink-2">{product.tagline}</p>

        {product.problem || product.solution ? (
          <dl className="mt-8 border-t border-line">
            {product.problem ? (
              <div className="border-b border-line py-4">
                <dt className="t-kicker mb-2 text-ink-3">Problem</dt>
                <dd className="t-body-sm m-0 text-ink-2">{product.problem}</dd>
              </div>
            ) : null}
            {product.solution ? (
              <div className="border-b border-line py-4">
                <dt className="t-kicker mb-2 text-ink-3">Solution</dt>
                <dd className="t-body-sm m-0 text-ink-2">{product.solution}</dd>
              </div>
            ) : null}
          </dl>
        ) : null}

        <TechList items={product.technologies} className="mt-6" />

        <div className="mt-8 flex flex-wrap gap-3">
          {isUsable ? (
            <>
              <ButtonLink href={product.url!} variant="primary" external>
                Try it
              </ButtonLink>
              <ButtonLink href={`/products/${product.slug}`} variant="secondary">
                Read the case study
              </ButtonLink>
            </>
          ) : (
            <>
              <ButtonLink href={`/products/${product.slug}`} variant="primary">
                Follow the build
              </ButtonLink>
              {product.githubUrl ? (
                <ButtonLink href={product.githubUrl} variant="secondary" external>
                  GitHub
                </ButtonLink>
              ) : null}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

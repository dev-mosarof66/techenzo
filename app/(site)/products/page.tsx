import type { Metadata } from "next";
import { PageHero } from "@/components/layout/page-hero";
import { Section } from "@/components/layout/section";
import { ButtonLink } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { FilterRow, type FilterOption } from "@/components/ui/filter-row";
import { Pagination, paginate, resolvePage } from "@/components/ui/pagination";
import { ProductCard } from "@/components/products/product-card";
import { getProducts, PRODUCT_STATUSES, type ProductStatus } from "@/lib/products";
import { pageMetadata } from "@/lib/seo";

type Props = {
  searchParams: Promise<{ status?: string | string[]; page?: string | string[] }>;
};

const STATUS_LABEL: Record<ProductStatus, string> = {
  launched: "Live",
  beta: "Beta",
  building: "Building",
  idea: "Idea",
  archived: "Archived",
};

/** Status arriving from the URL is matched against known values, never trusted. */
function resolveStatus(raw: string | string[] | undefined): ProductStatus | null {
  const candidate = Array.isArray(raw) ? raw[0] : raw;
  if (!candidate) return null;
  return (
    PRODUCT_STATUSES.find(
      (status) =>
        status === candidate.toLowerCase() ||
        STATUS_LABEL[status].toLowerCase() === candidate.toLowerCase(),
    ) ?? null
  );
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const products = (await getProducts()).filter((p) => !p.draft);
  const status = resolveStatus((await searchParams).status);

  // A filtered view is the same products in a different order — it stays out of
  // the index and points its canonical at the unfiltered page.
  if (status) {
    return pageMetadata("/products", {
      title: `${STATUS_LABEL[status]} products`,
      description: `Techenzo products at the ${STATUS_LABEL[status].toLowerCase()} stage.`,
      alternates: { canonical: "/products" },
      robots: { index: false, follow: true },
    });
  }

  return pageMetadata("/products", {
    robots:
      products.length > 0 ? { index: true, follow: true } : { index: false, follow: true },
  });
}

export default async function ProductsPage({ searchParams }: Props) {
  const products = await getProducts();
  const published = products.filter((p) => !p.draft);
  const activeStatus = resolveStatus((await searchParams).status);

  const visible = activeStatus
    ? products.filter((product) => product.status === activeStatus)
    : products;

  // Only offer statuses that exist. A filter for a stage with nothing in it is
  // a dead end dressed up as a choice.
  const present = PRODUCT_STATUSES.filter((status) =>
    products.some((product) => product.status === status),
  );

  const params = await searchParams;
  const page = paginate(visible, resolvePage(params.page));

  const options: FilterOption[] = [
    {
      label: "All",
      href: "/products",
      active: activeStatus === null,
      count: products.length,
    },
    ...present.map((status) => ({
      label: STATUS_LABEL[status],
      href: `/products?status=${status}`,
      active: activeStatus === status,
      count: products.filter((product) => product.status === status).length,
    })),
  ];

  const live = published.filter((p) => p.status === "launched").length;

  return (
    <>
      <PageHero
        title="Products"
        intro="Systems people use daily — each one with the problem it solves, what it is built on, and where it honestly stands."
        meta={
          published.length > 0
            ? `${published.length} ${published.length === 1 ? "product" : "products"}${live > 0 ? ` · ${live} live` : ""}`
            : undefined
        }
      />

      <Section>
        <h2 className="sr-only">Products</h2>
        <FilterRow options={options} label="Filter products by status" />

        {visible.length > 0 ? (
        <>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {page.items.map((product) => (
                // The featured product takes a wider cell, but only in the
                // unfiltered first page — inside a filter it is just a result.
                <div
                  key={product.slug}
                  className={
                    product.featured && !activeStatus && page.current === 1
                      ? "lg:col-span-2"
                      : undefined
                  }
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>

            <Pagination
              {...page}
              label="Pagination"
              hrefFor={(n: number) =>
                  `/products?${new URLSearchParams({
                    ...(activeStatus ? { status: activeStatus } : {}),
                    ...(n > 1 ? { page: String(n) } : {}),
                  })}`.replace(/\?$/, "")}
            />
        </>
        ) : activeStatus ? (
          <EmptyState
            title={`Nothing at the ${STATUS_LABEL[activeStatus].toLowerCase()} stage.`}
            body="Everything else is listed under All."
            action={
              <ButtonLink href="/products" variant="secondary" size="sm">
                Show all products
              </ButtonLink>
            }
          />
        ) : (
          <EmptyState
            title="No products listed yet."
            body="The first product page goes up when there is something worth using, not before."
            action={
              <ButtonLink href="/lab" variant="secondary" size="sm">
                Read the Lab
              </ButtonLink>
            }
          />
        )}
      </Section>
    </>
  );
}

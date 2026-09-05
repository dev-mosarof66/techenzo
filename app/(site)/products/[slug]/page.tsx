import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Container } from "@/components/layout/container";
import { MdxContent } from "@/components/mdx/mdx-content";
import { MetricBlock } from "@/components/ui/metric-block";
import { StatusChip } from "@/components/ui/status-chip";
import { ButtonLink } from "@/components/ui/button";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbJsonLd, FEED_ALTERNATE, OG_LOCALE } from "@/lib/seo";
import { Architecture } from "@/components/products/architecture";
import {
  ChangelogList,
  FeatureGrid,
  StackList,
} from "@/components/products/sections";
import { getProduct, getProducts } from "@/lib/products";
import { site } from "@/config/site";

type Params = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return {};

  return {
    title: product.name,
    description: product.description,
    alternates: { canonical: `/products/${slug}`, types: FEED_ALTERNATE },
    robots: product.draft ? { index: false, follow: false } : undefined,
    openGraph: {
      type: "website",
      locale: OG_LOCALE,
      url: `/products/${slug}`,
      siteName: site.name,
      title: `${product.name} — ${product.tagline}`,
      description: product.description,
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} — ${product.tagline}`,
      description: product.description,
    },
  };
}

export default async function ProductPage({ params }: Params) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const meta = [
    `Started ${product.startedAt}`,
    product.version,
    product.license,
  ].filter(Boolean) as string[];

  // SoftwareApplication only describes something that exists to be used.
  // An idea or a build-in-progress is not an application yet.
  const structured =
    product.status === "launched" || product.status === "beta"
      ? {
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: product.name,
          description: product.description,
          applicationCategory: product.category ?? "DeveloperApplication",
          url: product.url ?? `${site.url}/products/${slug}`,
          softwareVersion: product.version,
          author: { "@type": "Organization", name: site.name, url: site.url },
        }
      : null;

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Products", path: "/products" },
          { name: product.name, path: `/products/${slug}` },
        ])}
      />
      {structured && !product.draft ? <JsonLd data={structured} /> : null}

      <Container className="pt-14 lg:pt-20">
        <Link
          href="/products"
          className="link-draw t-mono-sm inline-flex items-center gap-2 text-ink-3 hover:text-ink"
        >
          <ArrowLeft size={14} strokeWidth={1.5} aria-hidden="true" />
          Products
        </Link>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <StatusChip status={product.status} />
          {product.draft ? (
            <span className="t-mono-sm rounded-full border border-status-building/30 bg-status-building/10 px-2 py-0.5 text-status-building">
              Draft — not published
            </span>
          ) : null}
        </div>

        <h1 className="t-h1 measure-copy mt-4">{product.name}</h1>
        <p className="t-body-lg measure-copy mt-4 text-ink-2">{product.tagline}</p>

        {meta.length > 0 ? (
          <p className="t-mono-sm mt-6 text-ink-3">{meta.join(" · ")}</p>
        ) : null}

        <div className="mt-8 flex flex-wrap gap-3">
          {product.url ? (
            <ButtonLink href={product.url} variant="primary" external>
              Try it
            </ButtonLink>
          ) : null}
          {product.githubUrl ? (
            <ButtonLink href={product.githubUrl} variant="secondary" external>
              GitHub
            </ButtonLink>
          ) : null}
        </div>
      </Container>

      {product.image ? (
        <Container width="wide" className="mt-12">
          <figure className="m-0">
            <Image
              src={product.image}
              alt={`${product.name} in use`}
              width={2400}
              height={1500}
              sizes="(min-width: 1440px) 1440px, 100vw"
              priority
              className="w-full rounded-md border border-line"
            />
          </figure>
        </Container>
      ) : null}

      <Container className="pb-24 pt-14">
        <div className="prose measure-prose">
          <MdxContent
            source={product.body}
            extra={{
              // Placed by the author, bound to frontmatter — so the numbers and
              // the features on the page can never drift from the data the
              // cards and the index read.
              Metrics: () => <MetricBlock results={product.metrics} />,
              Features: () => <FeatureGrid features={product.features} />,
              Architecture: () => <Architecture {...(product.architecture ?? {})} />,
            }}
          />

          <StackList stack={product.stack} />
          <ChangelogList changelog={product.changelog} />

          <div className="mt-14 border-t border-line pt-8">
            <p className="t-body-lg measure-copy text-ink-2">
              {product.url
                ? "Built in the open — the experiments behind it are published in the Lab."
                : "Not shipped yet. The build is documented as it happens."}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              {product.url ? (
                <ButtonLink href={product.url} variant="primary" external>
                  Try it
                </ButtonLink>
              ) : null}
              <ButtonLink href="/lab" variant="secondary">
                Read the Lab
              </ButtonLink>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}

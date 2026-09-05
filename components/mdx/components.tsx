import type { ComponentPropsWithoutRef, ReactNode } from "react";
import Link from "next/link";
import type { MDXComponents } from "mdx/types";
import { CodeBlock } from "./code-block";

function Anchor({ href = "", children, ...props }: ComponentPropsWithoutRef<"a">) {
  const external = /^https?:\/\//.test(href);

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} {...props}>
      {children}
    </Link>
  );
}

/**
 * Tables scroll inside their own container. The prose column is 68ch and a
 * results table is often wider — the page body must never scroll sideways.
 */
function Table(props: ComponentPropsWithoutRef<"table">) {
  return (
    <div className="my-8 overflow-x-auto">
      <table {...props} />
    </div>
  );
}

/** Available inside any .mdx file. */
export function Callout({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <aside className="my-8 border-l-2 border-accent py-1 pl-5">
      <p className="t-kicker mb-2 text-accent">{label}</p>
      <div className="t-body-lg text-ink-2 [&>p]:m-0">{children}</div>
    </aside>
  );
}

export function Figure({
  caption,
  children,
}: {
  caption: string;
  children: ReactNode;
}) {
  return (
    <figure className="my-10">
      {children}
      <figcaption className="t-caption mt-3 text-center text-ink-3">{caption}</figcaption>
    </figure>
  );
}

export const mdxComponents: MDXComponents = {
  a: Anchor,
  table: Table,
  pre: (
    props: ComponentPropsWithoutRef<"pre"> & {
      "data-title"?: string;
      "data-language"?: string;
    },
  ) => (
    <CodeBlock title={props["data-title"]} language={props["data-language"]}>
      <pre {...props} />
    </CodeBlock>
  ),
  Callout,
  Figure,
};

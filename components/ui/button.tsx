import type { ComponentProps, ReactNode } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "link";
type Size = "sm" | "md" | "lg";

const BASE =
  "inline-flex items-center justify-center gap-2 rounded-sm border border-transparent font-medium " +
  "transition-[background-color,border-color,color] duration-[var(--dur-fast)] " +
  "disabled:opacity-40 disabled:cursor-not-allowed";

const VARIANT: Record<Variant, string> = {
  // Hover changes colour and border only — never scale, never lift (§8.1).
  primary: "bg-accent text-on-accent hover:bg-accent-hover active:bg-accent-pressed",
  secondary:
    "border-control text-ink hover:border-ink hover:bg-raised active:bg-sunken",
  ghost: "text-ink-2 hover:bg-raised hover:text-ink active:bg-sunken",
  link: "link-draw text-accent hover:text-accent-hover",
};

const SIZE: Record<Size, string> = {
  sm: "h-8 px-3 t-body-sm",
  md: "h-10 px-4 t-body-sm",
  lg: "h-12 px-6 t-body",
};

type BaseProps = {
  variant?: Variant;
  size?: Size;
  external?: boolean;
  className?: string;
  children: ReactNode;
};

export function Button({
  variant = "secondary",
  size = "md",
  external,
  className,
  children,
  ...props
}: BaseProps & ComponentProps<"button">) {
  return (
    <button
      className={cn(BASE, VARIANT[variant], variant !== "link" && SIZE[size], className)}
      {...props}
    >
      {children}
      {external ? <ArrowUpRight size={14} strokeWidth={1.5} aria-hidden="true" /> : null}
    </button>
  );
}

export function ButtonLink({
  href,
  variant = "secondary",
  size = "md",
  external,
  className,
  children,
}: BaseProps & { href: string }) {
  const outboundProps = external
    ? { target: "_blank", rel: "noopener noreferrer" as const }
    : {};

  return (
    <Link
      href={href}
      className={cn(BASE, VARIANT[variant], variant !== "link" && SIZE[size], className)}
      {...outboundProps}
    >
      {children}
      {external ? <ArrowUpRight size={14} strokeWidth={1.5} aria-hidden="true" /> : null}
    </Link>
  );
}

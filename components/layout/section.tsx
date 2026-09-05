import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Container } from "./container";

/**
 * Sections are separated by a full-bleed hairline, never by a background
 * change — spec §4.4. `divider={false}` is for the first section on a page,
 * which sits directly under the hero and needs no rule above it.
 */
export function Section({
  id,
  divider = true,
  surface,
  width = "default",
  className,
  children,
}: {
  id?: string;
  divider?: boolean;
  surface?: "sunken";
  width?: "prose" | "default" | "wide";
  className?: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      className={cn(
        "py-[var(--section-pad)]",
        divider && "border-t border-line",
        surface === "sunken" && "bg-sunken",
        className,
      )}
    >
      <Container width={width}>{children}</Container>
    </section>
  );
}

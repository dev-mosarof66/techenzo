import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Width = "prose" | "default" | "wide";

const WIDTH: Record<Width, string> = {
  prose: "max-w-[var(--container-prose)]",
  default: "max-w-[var(--container-default)]",
  wide: "max-w-[var(--container-wide)]",
};

export function Container({
  width = "default",
  className,
  children,
}: {
  width?: Width;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-[var(--page-pad)]",
        WIDTH[width],
        className,
      )}
    >
      {children}
    </div>
  );
}

import Image from "next/image";
import { site } from "@/config/site";
import { cn } from "@/lib/utils";

const initials = site.founder.name
  .split(" ")
  .map((part) => part.charAt(0))
  .join("");

/**
 * The founder portrait — spec §9.1 block 06.
 *
 * Grayscale at rest, full colour on hover. This is the *only* decorative image
 * treatment in the system, which is what keeps it from reading as a filter
 * applied for its own sake.
 *
 * Until a real photograph exists it falls back to initials in the same hairline
 * frame. No placeholder avatar illustration, and no stock photograph of someone
 * who is not Mosarof.
 */
export function Portrait({
  sizes,
  className,
}: {
  sizes: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "ticks aspect-square overflow-hidden rounded-md border border-line bg-raised",
        className,
      )}
    >
      {site.founder.portrait ? (
        <Image
          src={site.founder.portrait}
          alt={site.founder.name}
          width={1200}
          height={1200}
          sizes={sizes}
          className="size-full object-cover grayscale transition-[filter] duration-[var(--dur-slow)] ease-[var(--ease-standard)] hover:grayscale-0"
        />
      ) : (
        <div className="grid size-full place-items-center">
          <span
            aria-hidden="true"
            // Pure decoration (WCAG 1.4.3 exempt) and hidden from AT. axe still
            // reports it as low contrast; that is a known, accepted exception —
            // see docs/ui-ux-spec.md §11.
            className="select-none font-mono text-7xl font-medium leading-none tracking-[-0.03em] text-ink opacity-8 lg:text-8xl"
          >
            {initials}
          </span>
        </div>
      )}
    </div>
  );
}

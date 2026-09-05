"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { nav, site } from "@/config/site";
import { cn } from "@/lib/utils";
import { GitHubIcon, XIcon } from "@/components/ui/icons";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { MobileNav } from "./mobile-nav";
import { Wordmark } from "./wordmark";

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Transparent at rest, hairline + blur once the page moves — spec §7.1.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setMenuOpen(false), [pathname]);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 h-[var(--nav-height)] transition-[background-color,border-color,backdrop-filter] duration-[var(--dur-base)]",
          scrolled
            ? "border-b border-line bg-[color-mix(in_srgb,var(--bg)_72%,transparent)] backdrop-blur-[12px] backdrop-saturate-[1.4]"
            : "border-b border-transparent bg-transparent",
        )}
      >
        <div className="mx-auto flex h-full max-w-[var(--container-default)] items-center justify-between gap-5 px-[var(--page-pad)]">
          <Wordmark />

          <nav aria-label="Main" className="hidden lg:block">
            <ul className="flex items-center gap-6">
              {nav.map((item) => {
                const active =
                  pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "t-body-sm inline-block py-0.5 transition-colors duration-[var(--dur-fast)]",
                        active
                          ? "border-b border-accent text-ink"
                          : "link-draw text-ink-2 hover:text-ink",
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-3">
            <a
              href={site.social.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Techenzo on GitHub"
              className="hidden size-8 place-items-center rounded-sm text-ink-3 transition-colors duration-[var(--dur-fast)] hover:text-ink sm:grid"
            >
              <GitHubIcon size={18} />
            </a>
            <a
              href={site.social.x}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Techenzo on X"
              className="hidden size-8 place-items-center rounded-sm text-ink-3 transition-colors duration-[var(--dur-fast)] hover:text-ink sm:grid"
            >
              <XIcon size={16} />
            </a>
            <span aria-hidden="true" className="hidden h-4 w-px bg-line sm:block" />
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open navigation"
              aria-expanded={menuOpen}
              className="-mr-2 grid size-11 place-items-center rounded-sm text-ink-2 hover:text-ink lg:hidden"
            >
              <Menu size={24} strokeWidth={1.5} aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      <MobileNav open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}

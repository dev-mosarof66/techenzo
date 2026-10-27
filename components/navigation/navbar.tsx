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

  // A floating pill, frosted at rest; once the page moves it picks up a
  // stronger rule and the floating-layer shadow so it reads above the content.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setMenuOpen(false), [pathname]);

  return (
    <>
      <header className="pointer-events-none sticky top-0 z-50 px-[var(--page-pad)] pt-3">
        <div
          className={cn(
            "pointer-events-auto mx-auto flex h-14 max-w-[980px] items-center justify-between gap-5 rounded-full border pr-2 pl-5",
            "bg-[color-mix(in_srgb,var(--bg)_72%,transparent)] backdrop-blur-[12px] backdrop-saturate-[1.4]",
            "transition-[border-color,box-shadow] duration-[var(--dur-base)]",
            scrolled ? "border-line-strong shadow-[var(--shadow-layer)]" : "border-line",
          )}
        >
          <Wordmark />

          <nav aria-label="Main" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {nav.map((item) => {
                const active =
                  pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "t-body-sm inline-block rounded-full px-3.5 py-1.5 transition-colors duration-[var(--dur-fast)]",
                        active
                          ? "bg-raised text-ink"
                          : "text-ink-2 hover:bg-raised hover:text-ink",
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            {site.social.github ? (
              <a
                href={site.social.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Techenzo on GitHub"
                className="hidden size-9 place-items-center rounded-full text-ink-3 transition-colors duration-[var(--dur-fast)] hover:bg-raised hover:text-ink sm:grid"
              >
                <GitHubIcon size={18} />
              </a>
            ) : null}
            {site.social.x ? (
              <a
                href={site.social.x}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Techenzo on X"
                className="hidden size-9 place-items-center rounded-full text-ink-3 transition-colors duration-[var(--dur-fast)] hover:bg-raised hover:text-ink sm:grid"
              >
                <XIcon size={16} />
              </a>
            ) : null}
            <span aria-hidden="true" className="hidden h-4 w-px bg-line sm:block" />
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open navigation"
              aria-expanded={menuOpen}
              className="grid size-10 place-items-center rounded-full text-ink-2 hover:bg-raised hover:text-ink lg:hidden"
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

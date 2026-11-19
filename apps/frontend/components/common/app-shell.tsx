"use client";

import { Home, Menu, Settings, Upload, Video, X } from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navigation = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/posts", label: "Video Library", icon: Video },
  { href: "/upload", label: "Upload Video", icon: Upload },
  { href: "/settings", label: "Settings", icon: Settings },
];

function getPageTitle(pathname: string) {
  if (pathname.startsWith("/posts/") || pathname.startsWith("/videos/")) {
    return "Video Workspace";
  }
  return (
    navigation.find(
      ({ href }) => pathname === href || pathname.startsWith(`${href}/`),
    )?.label ?? "Dashboard"
  );
}

function isMobileViewport() {
  return window.matchMedia("(max-width: 767px)").matches;
}

export default function AppShell({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const pageTitle = getPageTitle(pathname);

  const closeMenu = () => {
    setIsMenuOpen(false);
    if (isMobileViewport()) {
      menuButtonRef.current?.focus();
    }
  };

  useEffect(() => {
    const sidebar = document.getElementById("app-sidebar");
    const activeElement = document.activeElement;
    const shouldRestoreFocus =
      isMobileViewport() &&
      activeElement instanceof HTMLElement &&
      sidebar?.contains(activeElement);

    setIsMenuOpen(false);

    if (shouldRestoreFocus) {
      menuButtonRef.current?.focus();
    }
  }, [pathname]);

  useEffect(() => {
    if (!isMenuOpen || !isMobileViewport()) return;

    closeButtonRef.current?.focus();
  }, [isMenuOpen]);

  useEffect(() => {
    if (!isMenuOpen) return;

    const desktopQuery = window.matchMedia("(min-width: 768px)");

    if (desktopQuery.matches) {
      const activeElement = document.activeElement;
      if (
        activeElement instanceof HTMLElement &&
        document.getElementById("app-sidebar")?.contains(activeElement)
      ) {
        activeElement.blur();
      }
      setIsMenuOpen(false);
      return;
    }

    const handleDesktopChange = (event: MediaQueryListEvent) => {
      if (!event.matches) return;

      const activeElement = document.activeElement;
      if (
        activeElement instanceof HTMLElement &&
        document.getElementById("app-sidebar")?.contains(activeElement)
      ) {
        activeElement.blur();
      }
      setIsMenuOpen(false);
    };

    desktopQuery.addEventListener("change", handleDesktopChange);

    return () => {
      desktopQuery.removeEventListener("change", handleDesktopChange);
    };
  }, [isMenuOpen]);

  useEffect(() => {
    if (!isMenuOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;

      setIsMenuOpen(false);
      if (isMobileViewport()) {
        menuButtonRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMenuOpen]);

  return (
    <div className="flex min-h-dvh bg-white text-[#202124]">
      {isMenuOpen && (
        <button
          type="button"
          aria-label="Close navigation menu"
          tabIndex={-1}
          className="fixed inset-0 z-30 bg-black/20 md:hidden"
          onClick={closeMenu}
        />
      )}

      <aside
        id="app-sidebar"
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-[#dee1e6] bg-white transition-[transform,visibility] duration-200 md:static md:translate-x-0",
          isMenuOpen
            ? "translate-x-0"
            : "-translate-x-full invisible md:visible",
        )}
      >
        <div className="flex h-[72px] shrink-0 items-center justify-between border-b border-[#dee1e6] px-5">
          <Link
            href="/dashboard"
            className="flex min-w-0 items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#064e3b] focus-visible:ring-offset-2"
            onClick={closeMenu}
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#064e3b]/20 bg-[#064e3b]/5">
              <img
                src="/breeze.svg"
                alt=""
                aria-hidden="true"
                className="h-6 w-6"
              />
            </span>
            <span className="truncate font-heading text-lg font-bold tracking-tight text-[#064e3b]">
              InsightFlow
            </span>
          </Link>
          <button
            ref={closeButtonRef}
            type="button"
            aria-label="Close navigation menu"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-[#064e3b] transition-colors hover:bg-[#ecfdf5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#064e3b] focus-visible:ring-offset-2 md:hidden"
            onClick={closeMenu}
          >
            <X aria-hidden="true" className="h-5 w-5" />
          </button>
        </div>

        <nav
          className="min-h-0 flex-1 space-y-1 overflow-y-auto p-4"
          aria-label="Application navigation"
        >
          {navigation.map(({ href, label, icon: Icon }) => {
            const isActive =
              pathname === href ||
              (href !== "/dashboard" && pathname.startsWith(`${href}/`)) ||
              (href === "/posts" && pathname.startsWith("/videos/"));

            return (
              <Link
                key={href}
                href={href}
                onClick={closeMenu}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#064e3b] focus-visible:ring-offset-2",
                  isActive
                    ? "bg-[#ecfdf5] text-[#064e3b]"
                    : "text-[#5f6368] hover:bg-[#f1f3f5] hover:text-[#064e3b]",
                )}
              >
                {isActive && (
                  <span
                    aria-hidden="true"
                    className="absolute inset-y-2 left-0 w-[3px] rounded-full bg-[#064e3b]"
                  />
                )}
                <Icon aria-hidden="true" className="h-4 w-4" />
                {label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-[72px] items-center justify-between gap-4 border-b border-[#dee1e6] bg-white px-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <button
              ref={menuButtonRef}
              type="button"
              aria-label={
                isMenuOpen ? "Close navigation menu" : "Open navigation menu"
              }
              aria-expanded={isMenuOpen}
              aria-controls="app-sidebar"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-[#064e3b] transition-colors hover:bg-[#ecfdf5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#064e3b] focus-visible:ring-offset-2 md:hidden"
              onClick={() => setIsMenuOpen((open) => !open)}
            >
              <Menu aria-hidden="true" className="h-5 w-5" />
            </button>
            <span className="truncate font-heading text-sm font-semibold text-[#064e3b] sm:text-base">
              {pageTitle}
            </span>
          </div>

          <div className="flex shrink-0 items-center gap-3">
            <Button
              asChild
              size="sm"
              className="h-9 rounded-lg bg-[#064e3b] px-3.5 font-heading text-xs font-semibold text-white shadow-sm hover:bg-[#04382b] sm:text-sm"
            >
              <Link href="/upload" aria-label="Upload video">
                <Upload aria-hidden="true" className="h-4 w-4" />
                <span className="hidden sm:inline">Upload</span>
              </Link>
            </Button>
            <span
              aria-hidden="true"
              className="h-6 w-px shrink-0 bg-[#dee1e6]"
            />
            <UserButton />
          </div>
        </header>

        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}

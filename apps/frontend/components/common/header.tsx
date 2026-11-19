"use client";

import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { ArrowUpRight, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/#how-to-use", label: "How To Use" },
  { href: "/#Features", label: "Features" },
];

const navLinkBase =
  "rounded-md text-sm font-semibold text-[#3c4043] transition-colors duration-200 hover:bg-[#ecfdf5] hover:text-[#064e3b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#064e3b] focus-visible:ring-offset-2";

const navLinkClass = `${navLinkBase} px-3 py-2`;

const mobileNavLinkClass = `${navLinkBase} block px-3 py-3`;

const primaryActionBase =
  "inline-flex items-center justify-center gap-2 rounded-lg bg-[#064e3b] px-5 font-heading text-sm font-bold text-white shadow-sm transition-colors duration-200 hover:bg-[#04382b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#064e3b] focus-visible:ring-offset-2";

const primaryActionClass = `${primaryActionBase} py-2.5`;

const mobilePrimaryActionClass = `${primaryActionBase} mt-2 w-full py-3`;

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (!menuOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;

      setMenuOpen(false);
      menuButtonRef.current?.focus();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [menuOpen]);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav
      aria-label="Primary"
      className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white"
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-6 md:px-10">
        <Link
          href="/"
          aria-label="InsightFlow Home"
          onClick={closeMenu}
          className="group flex shrink-0 items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#064e3b] focus-visible:ring-offset-2"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#064e3b]/20 bg-[#064e3b]/5 transition-transform duration-200 ">
            <img
              src="/breeze.svg"
              alt=""
              aria-hidden="true"
              className="h-6 w-6"
            />
          </span>
          <span className="font-heading text-xl font-bold tracking-tight text-[#064e3b]">
            InsightFlow
          </span>
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={
                link.href === "/" && pathname === "/" ? "page" : undefined
              }
              className={navLinkClass}
            >
              {link.label}
            </Link>
          ))}
          <SignedIn>
            <Link
              href="/posts"
              aria-current={pathname === "/posts" ? "page" : undefined}
              className={navLinkClass}
            >
              Dashboard
            </Link>
          </SignedIn>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <SignedIn>
            <Link
              href="/upload"
              className={`hidden sm:inline-flex ${primaryActionClass}`}
            >
              Upload Video
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <span className="hidden font-heading text-sm font-semibold text-[#064e3b] lg:inline">
              Pro
            </span>
            <UserButton />
          </SignedIn>
          <SignedOut>
            <Link
              href="/sign-in"
              className={`hidden sm:inline-flex ${primaryActionClass}`}
            >
              Sign In
            </Link>
          </SignedOut>
          <button
            ref={menuButtonRef}
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={
              menuOpen ? "Close navigation menu" : "Open navigation menu"
            }
            className="inline-flex h-11 w-11 items-center justify-center rounded-lg text-[#064e3b] transition-colors duration-200 hover:bg-[#ecfdf5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#064e3b] focus-visible:ring-offset-2 lg:hidden"
          >
            {menuOpen ? (
              <X className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div
          id="mobile-nav"
          className="max-h-[calc(100dvh-5rem)] overflow-y-auto border-t border-gray-100 bg-white lg:hidden"
        >
          <div className="mx-auto flex max-w-7xl flex-col gap-1 px-6 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                aria-current={
                  link.href === "/" && pathname === "/" ? "page" : undefined
                }
                className={mobileNavLinkClass}
              >
                {link.label}
              </Link>
            ))}
            <SignedIn>
              <Link
                href="/posts"
                onClick={closeMenu}
                aria-current={pathname === "/posts" ? "page" : undefined}
                className={mobileNavLinkClass}
              >
                Dashboard
              </Link>
              <Link
                href="/upload"
                onClick={closeMenu}
                className={mobilePrimaryActionClass}
              >
                Upload Video
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </SignedIn>
            <SignedOut>
              <Link
                href="/sign-in"
                onClick={closeMenu}
                className={mobilePrimaryActionClass}
              >
                Sign In
              </Link>
            </SignedOut>
          </div>
        </div>
      )}
    </nav>
  );
}

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
  "rounded-full text-sm font-medium text-[#52525B] transition-colors duration-200 hover:bg-[#F4F4F5] hover:text-[#111111] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#111111] focus-visible:ring-offset-2";

const navLinkClass = `${navLinkBase} px-3.5 py-2`;

const mobileNavLinkClass = `${navLinkBase} block rounded-xl px-3.5 py-3`;

const primaryActionBase =
  "inline-flex items-center justify-center gap-2 rounded-full bg-[#111111] px-5 font-heading text-sm font-semibold text-white shadow-xs transition-colors duration-200 hover:bg-[#27272A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#111111] focus-visible:ring-offset-2";

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
      className="sticky top-0 z-50 w-full border-b border-[#E5E7EB]/80 bg-white/95 backdrop-blur-md"
    >
      <div className="mx-auto flex h-[74px] max-w-6xl items-center justify-between gap-4 px-5 sm:px-6 md:px-10">
        <Link
          href="/"
          aria-label="InsightFlow Home"
          onClick={closeMenu}
          className="group flex shrink-0 items-center gap-2.5 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#111111] focus-visible:ring-offset-2"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[#E5E7EB] bg-[#FAFAFA] transition-transform duration-200 group-hover:scale-105">
            <img
              src="/breeze.svg"
              alt=""
              aria-hidden="true"
              className="h-4.5 w-4.5"
            />
          </span>
          <span className="font-heading text-[17px] font-semibold tracking-tight text-[#111111]">
            <span className="mr-1.5 font-normal text-[#A1A1AA]">/</span>
            InsightFlow
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
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
            <span className="hidden font-heading text-xs font-semibold text-[#52525B] lg:inline">
              Pro
            </span>
            <UserButton />
          </SignedIn>
          <SignedOut>
            <Link
              href="/upload"
              className="hidden rounded-full px-3.5 py-2 text-sm font-medium text-[#52525B] transition-colors hover:bg-[#F4F4F5] hover:text-[#111111] sm:inline-flex"
            >
              Upload
            </Link>
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
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-[#111111] transition-colors duration-200 hover:bg-[#F4F4F5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#111111] focus-visible:ring-offset-2 md:hidden"
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
          className="max-h-[calc(100dvh-5rem)] overflow-y-auto border-t border-[#E5E7EB] bg-white md:hidden"
        >
          <div className="mx-auto flex max-w-6xl flex-col gap-1 px-5 py-4 sm:px-6">
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
                href="/upload"
                onClick={closeMenu}
                className={mobileNavLinkClass}
              >
                Upload Video
              </Link>
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

"use client";

import { Home, Menu, Settings, Upload, Video, X } from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
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

export default function AppShell({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pageTitle = getPageTitle(pathname);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  return (
    <div className="flex min-h-screen bg-[#f8faf9] text-[#202124]">
      {isMenuOpen && (
        <button
          type="button"
          aria-label="Close navigation menu"
          className="fixed inset-0 z-30 bg-black/20 md:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-64 -translate-x-full flex-col border-r border-[#dee1e6] bg-white transition-transform duration-200 md:static md:translate-x-0",
          isMenuOpen && "translate-x-0",
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-[#dee1e6] px-5">
          <Link
            href="/dashboard"
            className="flex items-center gap-2.5 font-bold tracking-tight text-[#064e3b]"
            onClick={() => setIsMenuOpen(false)}
          >
            <img src="/breeze.svg" alt="" className="h-8 w-8" />
            <span>InsightFlow</span>
          </Link>
          <button
            type="button"
            aria-label="Close navigation menu"
            className="rounded-md p-1.5 text-[#5f6368] hover:bg-[#ecfdf5] md:hidden"
            onClick={() => setIsMenuOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav
          className="flex-1 space-y-1 p-4"
          aria-label="Application navigation"
        >
          {navigation.map(({ href, label, icon: Icon }) => {
            const isActive =
              pathname === href ||
              (href !== "/dashboard" && pathname.startsWith(`${href}/`));

            return (
              <Link
                key={href}
                href={href}
                onClick={() => setIsMenuOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-[#5f6368] transition-colors hover:bg-[#ecfdf5] hover:text-[#064e3b]",
                  isActive && "bg-[#ecfdf5] text-[#064e3b]",
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-[#dee1e6] bg-white px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Open navigation menu"
              aria-expanded={isMenuOpen}
              className="rounded-md p-2 text-[#5f6368] hover:bg-[#ecfdf5] md:hidden"
              onClick={() => setIsMenuOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </button>
            <span className="text-sm font-bold text-[#202124] sm:text-base">
              {pageTitle}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Button
              asChild
              size="sm"
              className="bg-[#064e3b] text-white hover:bg-[#04382b]"
            >
              <Link href="/upload">
                <Upload className="h-4 w-4" />
                <span className="hidden sm:inline">Upload</span>
              </Link>
            </Button>
            <UserButton />
          </div>
        </header>

        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}

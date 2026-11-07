'use client';

import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`sticky top-0 z-50 w-full border-b border-gray-100 bg-white transition-shadow duration-300 ${
        scrolled ? 'shadow-sm' : 'shadow-none'
      }`}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 md:px-10">
        <Link href="/" aria-label="InsightFlow Home" className="group flex items-center gap-3">
          <img
            src="/breeze.svg"
            alt="InsightFlow Logo"
            className="h-8 w-8 transition-transform duration-200 group-hover:scale-105"
          />
          <span className="text-xl font-bold tracking-tight text-[#064e3b]">InsightFlow</span>
        </Link>

        <div className="hidden items-center gap-6 text-sm font-semibold text-[#3c4043] md:flex">
          <Link href="/" className="rounded-md px-2 py-1.5 transition-all duration-200 hover:bg-[#ecfdf5] hover:text-[#064e3b] hover:shadow-sm">Home</Link>
          <Link href="/#how-to-use" className="rounded-md px-2 py-1.5 transition-all duration-200 hover:bg-[#ecfdf5] hover:text-[#064e3b] hover:shadow-sm">How To Use</Link>
          <Link href="/#Features" className="rounded-md px-2 py-1.5 transition-all duration-200 hover:bg-[#ecfdf5] hover:text-[#064e3b] hover:shadow-sm">Features</Link>
          <SignedIn>
            <Link href="/posts" className="rounded-md px-2 py-1.5 transition-all duration-200 hover:bg-[#ecfdf5] hover:text-[#064e3b] hover:shadow-sm">Dashboard</Link>
          </SignedIn>
        </div>

        <div className="flex items-center gap-4">
          <SignedIn>
            <Link
              href="/upload"
              className="hidden items-center gap-2 rounded-lg bg-[#064e3b] px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#04382b] hover:shadow-md active:translate-y-0 sm:inline-flex"
            >
              Upload Video
              <ArrowUpRight className="h-4 w-4" />
            </Link>
            <span className="hidden text-sm font-semibold text-[#064e3b] lg:inline">Pro</span>
            <UserButton />
          </SignedIn>
          <SignedOut>
            <Link href="/sign-in" className="rounded-lg bg-[#064e3b] px-4 py-2.5 text-sm font-bold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#04382b] hover:shadow-md active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#10b981] focus-visible:ring-offset-2">Sign In</Link>
          </SignedOut>
        </div>
      </div>
    </nav>
  );
}

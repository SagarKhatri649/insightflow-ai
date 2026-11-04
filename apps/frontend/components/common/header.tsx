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
        <Link href="/" aria-label="InsightFlow Home" className="flex items-center gap-3">
          <img
            src="/breeze.svg"
            alt="InsightFlow Logo"
            className="h-8 w-8"
          />
          <span className="text-xl font-bold tracking-tight text-[#064e3b]">InsightFlow</span>
        </Link>

        <div className="hidden items-center gap-6 text-sm font-semibold text-[#3c4043] md:flex">
          <Link href="/" className="transition-colors hover:text-[#064e3b]">Home</Link>
          <Link href="/#how-to-use" className="transition-colors hover:text-[#064e3b]">How To Use</Link>
          <Link href="/#Features" className="transition-colors hover:text-[#064e3b]">Features</Link>
          <SignedIn>
            <Link href="/posts" className="transition-colors hover:text-[#064e3b]">Dashboard</Link>
          </SignedIn>
        </div>

        <div className="flex items-center gap-4">
          <SignedIn>
            <Link
              href="/upload"
              className="hidden items-center gap-2 rounded-lg bg-[#064e3b] px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#04382b] sm:inline-flex"
            >
              Upload Video
              <ArrowUpRight className="h-4 w-4" />
            </Link>
            <span className="hidden text-sm font-semibold text-[#064e3b] lg:inline">Pro</span>
            <UserButton />
          </SignedIn>
          <SignedOut>
            <Link href="/sign-in" className="text-sm font-semibold text-[#064e3b]">Sign In</Link>
          </SignedOut>
        </div>
      </div>
    </nav>
  );
}

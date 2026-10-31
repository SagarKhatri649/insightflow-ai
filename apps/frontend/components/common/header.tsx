// import { Link } from "lucide-react";
"use client";
import { SignedIn, SignedOut } from '@clerk/nextjs';
import { FileVideo } from 'lucide-react';
import { UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import { useState, useEffect } from 'react';
export default function Header() {
  // const isloogedIn = false;

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  return (
    <nav
      className={`
    sticky top-0 z-50 w-full bg-black/50 backdrop-blur-md transition-shadow duration-300
    ${scrolled ? 'shadow-lg' : 'shadow-none'}
  `}
    >
      <div className="container flex items-center justify-between py-4 lg:px-8 mx-auto">
        <div className="flex lg:flex-1">
          <Link href="/" className="flex items-center gap-2 lg:gap-2 shrink-0">
            {/* <FileVideo className="w-5 h-5 lg:w-8 lg:h-8 text-white-900 hover:rotate-12 transform transition duration-200 ease ease-in-out" /> */}
            <img
              src="/breeze.svg"
              alt="InsightFlow Logo"
              className="w-8 h-8 lg:w-8 lg:h-8 hover:rotate-12 transform transition duration-200 ease-in-out"
            />
            <span className="font-extrabold  text-2xl lg:text-2xl text-white">
              InsightFlow
            </span>

          </Link>
        </div>

        <div className="flex text-lg lg:justify-center gap-4 lg:gap-12 lg:items-center">

          {/* <Link href="/">Home</Link>
          <Link href="/#How To USE">How To Use </Link>
          <Link href="/#Pricing">Pricing</Link>
          <Link href="/#Features">Features</Link> */}
          <Link href="/" className="relative px-2 py-1 text-white group">
            Home
            <span className="absolute left-0 -bottom-0.5 h-0.5 w-0 bg-primary 
                   group-hover:w-full transition-all duration-300" />
          </Link>
          <Link href="/#How TO Use" className="relative px-2 py-1 text-white group">
            How To Use
            <span className="absolute left-0 -bottom-0.5 h-0.5 w-0 bg-primary 
                   group-hover:w-full transition-all duration-300" />
          </Link>
          <Link href="/#Pricing" className="relative px-2 py-1 text-white group">
            Pricing
            <span className="absolute left-0 -bottom-0.5 h-0.5 w-0 bg-primary 
                   group-hover:w-full transition-all duration-300" />
          </Link>
          <Link href="/#Features" className="relative px-2 py-1 text-white group">
            Features
            <span className="absolute left-0 -bottom-0.5 h-0.5 w-0 bg-primary 
                   group-hover:w-full transition-all duration-300" />
          </Link>
          {/* 
        {isloogedIn && <Link href="/dashboard">Dashboard</Link>} */}
          <SignedIn>
            {/* <Link href="/dashboard">Dashboard</Link> */}
            <Link href="/posts" className="relative px-2 py-1 text-white group">
              Dashboard
              <span className="absolute left-0 -bottom-0.5 h-0.5 w-0 bg-primary 
                     group-hover:w-full transition-all duration-300" />
            </Link>
          </SignedIn>
        </div>

        {/* <div className="flex lg:justify-center gap-4 lg:gap-12 lg:items-center">
        <Link href="/#How To USE">How To Use </Link>
         
      </div> */}

        <div className="flex lg:justify-end lg:flex-1">
          {/* {isloogedIn ? (
          <div className="flex gap-2 items-center">
            <Link href="/upload">Upload Video</Link>
            <div>Pro</div>
              <SignedIn>
                  <UserButton />
             </SignedIn>
          </div>
        ) : (
          <div className="text-lg">
            <Link href="/sign-in">Sign In</Link>
          </div>
        )} */}

          <SignedIn>
            <div className="flex gap-4 items-center">
              <Link href="/upload">Upload Video</Link>
              <div className="text-white">Pro</div>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </div>
          </SignedIn>
          <SignedOut>
            <div className="text-lg ">
              <Link href="/sign-in" className="text-white font-semibold">Sign In</Link>
            </div>
          </SignedOut>
        </div>
      </div>
    </nav>

  );
}
// import { Link } from "lucide-react";
import { FileVideo } from 'lucide-react';

import Link from 'next/link';
export default function Header() {
  const isloogedIn = false;
  return (
    <nav className="container flex items-center justify-between py-4 lg:px-8 py-2 mx-auto border-b border-gray-200 shadow-md">
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
        <Link href="/#How To USE">How To Use </Link>
        <Link href="/#Pricing">Pricing</Link>

        {isloogedIn && <Link href="/dashboard">Dashboard</Link>}
      </div>

      {/* <div className="flex lg:justify-center gap-4 lg:gap-12 lg:items-center">
        <Link href="/#How To USE">How To Use </Link>
         
      </div> */}

      <div className="flex lg:justify-end lg:flex-1">
        {isloogedIn ? (
          <div className="flex gap-2 items-center">
            <Link href="/upload">Upload Video</Link>
            <div>Pro</div>
            {/* <Button>User</Button> */}
          </div>
        ) : (
          <div className="text-lg">
            <Link href="/sign-in">Sign In</Link>
          </div>
        )}
      </div>
    </nav>

  );
}
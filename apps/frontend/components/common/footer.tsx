import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-emerald-900/50 bg-[#04382b] px-6 py-8 text-sm text-[#ecfdf5] md:px-10">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-center lg:flex-row lg:text-left">
        <p className="font-medium">
          © {new Date().getFullYear()} InsightFlow. All rights reserved.
        </p>
        <p className="font-normal text-emerald-300/80">
          Video insights, without the extra hours.
        </p>
        <nav
          aria-label="Footer"
          className="flex flex-wrap justify-center gap-6 text-emerald-100/80 lg:justify-end"
        >
          <Link
            href="/privacy"
            className="inline-flex items-center rounded-sm py-1 transition-colors duration-200 hover:text-white hover:underline hover:underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ecfdf5] focus-visible:ring-offset-2 focus-visible:ring-offset-[#04382b]"
          >
            Privacy
          </Link>
          <Link
            href="/terms"
            className="inline-flex items-center rounded-sm py-1 transition-colors duration-200 hover:text-white hover:underline hover:underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ecfdf5] focus-visible:ring-offset-2 focus-visible:ring-offset-[#04382b]"
          >
            Terms
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center rounded-sm py-1 transition-colors duration-200 hover:text-white hover:underline hover:underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ecfdf5] focus-visible:ring-offset-2 focus-visible:ring-offset-[#04382b]"
          >
            Contact
          </Link>
        </nav>
      </div>
    </footer>
  );
}

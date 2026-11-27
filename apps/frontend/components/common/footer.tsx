import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-[#E5E7EB] bg-white px-6 py-10 text-sm text-[#52525B] md:px-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-center lg:flex-row lg:text-left">
        <div className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-full border border-[#E5E7EB] bg-[#FAFAFA]">
            <img
              src="/breeze.svg"
              alt=""
              aria-hidden="true"
              className="h-3.5 w-3.5"
            />
          </span>
          <p className="font-heading font-semibold text-[#111111]">
            © {new Date().getFullYear()} InsightFlow
          </p>
        </div>

        <p className="text-[#71717A]">
          Video insights, without the extra hours.
        </p>

        <nav
          aria-label="Footer"
          className="flex flex-wrap justify-center gap-6 text-[#52525B] lg:justify-end"
        >
          <Link
            href="/privacy"
            className="inline-flex items-center rounded-sm py-1 transition-colors duration-200 hover:text-[#111111] hover:underline hover:underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#111111] focus-visible:ring-offset-2"
          >
            Privacy
          </Link>
          <Link
            href="/terms"
            className="inline-flex items-center rounded-sm py-1 transition-colors duration-200 hover:text-[#111111] hover:underline hover:underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#111111] focus-visible:ring-offset-2"
          >
            Terms
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center rounded-sm py-1 transition-colors duration-200 hover:text-[#111111] hover:underline hover:underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#111111] focus-visible:ring-offset-2"
          >
            Contact
          </Link>
        </nav>
      </div>
    </footer>
  );
}

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-emerald-900/50 bg-[#04382b] px-6 py-8 text-sm text-[#ecfdf5]">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
        <p className="font-medium">© {new Date().getFullYear()} InsightFlow. All rights reserved.</p>
        <p className="font-normal text-emerald-300/80">Built with for creators, educators, and innovators.</p>
        <nav className="flex flex-wrap justify-center gap-6 text-emerald-100/80 sm:justify-end">
          <Link href="/privacy" className="transition-all duration-200 hover:text-white hover:underline hover:underline-offset-4">Privacy</Link>
          <Link href="/terms" className="transition-all duration-200 hover:text-white hover:underline hover:underline-offset-4">Terms</Link>
          <Link href="/contact" className="transition-all duration-200 hover:text-white hover:underline hover:underline-offset-4">Contact</Link>
        </nav>
      </div>
    </footer>
  );
}

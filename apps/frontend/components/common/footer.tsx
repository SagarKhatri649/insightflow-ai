import Link from "next/link";


export default function Footer() {
  return <footer
    className="bg-[#111111] text-white text-sm py-6 px-6 relative z-20">
    <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
      {/* Left Side: Footer nav */}
      <p>© {new Date().getFullYear()} InsightFlow. All rights reserved.</p>
      <p className="text-3xs text-gray-300 ">Built with for creators, educators, and innovators.</p>

      {/* Right Side: Footer nav */}
      <nav className="flex gap-6 flex-wrap justify-center sm:justify-end text-gray-400">
        <Link href="/privacy" className="hover:text-white transition">Privacy</Link>
        <Link href="/terms" className="hover:text-white transition">Terms</Link>
        <Link href="/contact" className="hover:text-white transition">Contact</Link>
      </nav>
    </div>


  </footer>;
}
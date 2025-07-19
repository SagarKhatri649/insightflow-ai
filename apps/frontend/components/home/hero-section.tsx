import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from 'next/link';


export default function HeroSection() {
  return (
    <section className="relative mx-auto flex flex-col z-0 items-center justify-center py-16 sm:py-20 lg:pb-28 transition-all animate-in lg:px-12 max-w-7xl ">

      <div className="group relative p-[1px] overflow-hidden rounded-full bg-gradient-to-r from-rose-200 via-rose-500 to-rose-800 animate-gradient-x">

        <Badge
          variant={'secondary'} className="flex items-center px-6 py-2 bg-white text-black rounded-full transition-colors duration-200 group-hover:bg-rose-100">

          <Sparkles className="h-6 w-6 mr-2 text-rose-600 animate-pulse" />

          <span className="text-base text-black">Powered by AI</span>

        </Badge>

      </div>

      <h1 className="font-bold py-6 text-center">Know what’s inside — without watching the whole video.</h1>

      <h2 className="text-lg sm:text-xl lg:text-2xl text-center px-4 lg:px-0 lg:max-w-4xl text-gray-300">Process Indian and English videos to generate English summaries, smart Q&A, and metadata across education, business, and more.</h2>
      <div>
        <Button
          variant={'link'}
          className="text-white mt-8 text-base sm:text-lg lg:text-2xl rounded-full px-8 sm:px-10 lg:px-12 sm:py-7 lg:py-8 lg:mt-16 bg-linear-to-r  from-slate-500 to-rose-500 hover:from-rose-500 hover:to-slate-500 hover:no-underline font-bold shadow-lg transition-all duration-300">
          <Link href="/#Pricing" className="flex gap-2 items-center">
            <span>Try Now</span>
            <ArrowRight className="animate-pulse" />
          </Link>
        </Button>
      </div>

    </section>
  )
}
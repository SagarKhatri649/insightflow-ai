import { ArrowRight } from "lucide-react";
import { Button } from "../ui/button";
import Link from 'next/link';

export default function CTASection() {
  return (
    <section className="bg-gradient-to-b from-slate-100 to-white dark:from-[#111111] dark:to-black py-16">
      <div className="py-12 lg:py-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">

          <div className="space-y-2">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-tight text-balance text-black dark:text-white">
              Ready to save hours of watching videos?
            </h2>
            <p className="mx-auto max-w-[700px] text-gray-600 dark:text-gray-400 text-base sm:text-lg md:text-xl">
              Podcasters, creators, and educators use our platform to generate accurate timestamps, summaries, and titles — all in seconds, with a single click.
            </p>

          </div>
          <div className="flex flex-col gap-2 min-[400px]:flex-row justify-center">
            <div className="">
              <Button
                size="lg"
                variant={'link'}
                className="
        text-base sm:text-lg px-6 py-4 sm:px-8 lg:px-10
        rounded-full font-semibold
        bg-gradient-to-r from-teal-400 via-emerald-400 to-cyan-400
        text-white shadow-lg
        hover:brightness-110 hover:scale-[1.03]
        transition duration-300
        flex items-center gap-2
      ">

                <Link href="/#Pricing"
                  className="flex  items-center justify-center">
                  Get Started{' '}
                  <ArrowRight className="h-5 w-5 animate-pulse" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>

  );

};
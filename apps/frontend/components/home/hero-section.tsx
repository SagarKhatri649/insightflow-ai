// import { Badge } from "../ui/badge";
// import { Button } from "../ui/button";
// import { ArrowRight, Sparkles } from "lucide-react";
// import Link from 'next/link';


// export default function HeroSection() {
//   return (
//     <section className="bg-hero-gradient text-white w-full">
//       <div className="container mx-auto flex flex-col lg:flex-row items-center gap-12 transition-all animate-in px-4 sm:px-6 lg:px-8">
//         {/* Left Column: Text & CTA */}
//         <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left space-y-6">
//           {/* Badge */}
//           <Link href="/#Features">
//             <div className="group relative p-[1px] overflow-hidden rounded-full bg-gradient-to-r from-blue-200 via-sky-300 to-blue-400 animate-gradient-x shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_28px_rgba(59,130,246,0.5)] transition duration-300">


//               <Badge
//                 variant={'secondary'} className="flex items-center px-6 py-2 bg-white text-blue-900 rounded-full text-sm font-semibold transition-colors duration-200 group-hover:bg-blue-100">

//                 <Sparkles className="h-5 w-5 mr-2 text-sky-600 animate-pulse" />

//                 <span >Powered by AI</span>

//               </Badge>

//             </div>
//           </Link>

//           {/* <h1 className="font-bold py-6 text-center">Know what’s inside — without watching the whole video.</h1>

//         <h2 className="text-lg sm:text-xl lg:text-2xl text-center px-4 lg:px-0 lg:max-w-4xl text-gray-300">Process Indian and English videos to generate English summaries, smart Q&A, and metadata across education, business, and more.</h2> */}

//           {/* Headline */}
//           <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-center py-6 leading-tight text-balance">
//             Know <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-blue-500">what’s inside</span> — without watching the whole video.
//           </h1>

//           <p className="text-base sm:text-xl lg:text-2xl text-center px-4 lg:px-0 lg:max-w-3xl text-white/80 text-balance">
//             Upload your video. Instantly get smart summaries, AI-generated questions, and metadata — in clear, fluent English. Great for educators, founders, students, and teams.
//           </p>
//           <div>
//             {/* <Button
//             variant={'link'}
//             className="text-white mt-8 text-base sm:text-lg lg:text-2xl rounded-full px-8 sm:px-10 lg:px-12 sm:py-7 lg:py-8 lg:mt-16 bg-linear-to-r  from-slate-500 to-rose-500 hover:from-rose-500 hover:to-slate-500 hover:no-underline font-bold shadow-lg transition-all duration-300"> */}

//             {/* CTA Button */}
//             <Button
//               className="
//       mt-8 sm:mt-10 lg:mt-16
//       text-sm sm:text-base lg:text-lg
//       px-6 sm:px-8 lg:px-12
//       py-3 sm:py-4 lg:py-5
//       rounded-full
//       font-semibold
//       bg-gradient-to-r from-teal-400 via-emerald-400 to-cyan-400
//       text-white
//       shadow-lg
//       hover:brightness-110 hover:scale-[1.03]
//       transition duration-300
//       flex items-center gap-2
//     "
//             >
//               <Link href="/#Pricing" className="flex gap-2 items-center">
//                 <span>Try Now</span>
//                 <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 animate-pulse" />
//               </Link>
//             </Button>
//           </div>
//         </div>
//         {/* Right Column: Visual Mockup */}
//         <div className="flex-1">
//           <img
//             src="/hero-mockup.png"
//             alt="InsightFlow App Preview"
//             className="w-full h-auto rounded-2xl shadow-2xl"
//           />
//         </div>

//       </div>
//     </section >
//   );
// }
// import { Badge } from "../ui/badge";
// import { Button } from "../ui/button";
// import { ArrowRight, Sparkles } from "lucide-react";
// import Link from "next/link";
// import Image from "next/image";

// export default function HeroSection() {
//   return (
//     <section className="hero-section pt-24 pb-20">
//       <div className="container mx-auto flex flex-col lg:flex-row items-center gap-12 px-4 sm:px-6 lg:px-8">

//         {/* Left Column */}
//         <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left space-y-6">

//           {/* 1. Badge: aligned to left with bottom margin */}
//           <div className="self-start mb-4">
//             <Link href="/#Features">
//               <div className="group inline-block p-[1px] rounded-full bg-gradient-to-r from-blue-200 via-sky-300 to-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_28px_rgba(59,130,246,0.5)] transition duration-300">
//                 <Badge
//                   variant="secondary"
//                   className="flex items-center px-5 py-2 bg-white text-blue-900 rounded-full text-sm font-semibold transition-colors duration-200 group-hover:bg-blue-100"
//                 >
//                   <Sparkles className="h-4 w-4 mr-2 text-sky-600 animate-pulse" />
//                   Powered by AI
//                 </Badge>
//               </div>
//             </Link>
//           </div>

//           {/* 2. Headline: constrained width, tight leading */}
//           <h1 className="max-w-lg text-4xl sm:text-5xl lg:text-6xl leading-tight">
//             Know{" "}
//             <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-blue-500 drop-shadow-sm">
//               what’s inside
//             </span>{" "}
//             — without watching the whole video.
//           </h1>

//           {/* 3. Subheading: better contrast & controlled width */}
//           <p className="max-w-lg text-lg sm:text-xl lg:text-2xl text-white/80 mx-auto lg:mx-0">
//             Upload your video and get AI-powered summaries, Q&A, and timestamps in seconds. Perfect for educators, creators, and teams.
//           </p>

//           {/* 4. CTA Button: spaced, centered on mobile, aligned left on desktop */}
//           <div className="w-full flex justify-center lg:justify-start mt-8">
//             <Link href="/#Pricing">
//               <Button
//                 className="
//                   text-sm sm:text-base lg:text-lg
//                   px-8 sm:px-10 lg:px-12
//                   py-3 sm:py-4 lg:py-5
//                   rounded-full font-semibold
//                   bg-gradient-to-r from-teal-400 via-emerald-400 to-cyan-400
//                   text-white shadow-lg
//                   hover:brightness-110 hover:scale-105 active:scale-95
//                   transition duration-300 ease-in-out
//                   flex items-center gap-2

//                 "
//               >
//                 Try Now
//                 <ArrowRight className="w-5 h-5 animate-pulse" />
//               </Button>
//             </Link>
//           </div>
//         </div>

//         {/* Right Column: Mockup */}
//         <div className="flex-1 flex justify-center lg:justify-end mt-12 lg:mt-0">
//           <div className="w-full max-w-md lg:max-w-lg relative">
//             <div className="flex-1 flex justify-center lg:justify-end lg:items-center mt-12 lg:mt-0">
//               <img
//                 src="/hero-mockup.png"
//                 srcSet="/hero-mockup.png 1x, /hero-mockup@2x.png 2x"
//                 alt="AI-powered video summary mockup"
//                 className="w-full max-w-md lg:max-w-lg"
//               />
//             </div>
//             {/* optional color overlay on hover */}
//             <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-sky-500/20 to-blue-500/10 opacity-0 hover:opacity-100 transition-opacity duration-500" />
//           </div>
//         </div>

//       </div>
//     </section>
//   );
// }

// import { Badge } from "../ui/badge";
// import { Button } from "../ui/button";
// import { ArrowRight, Sparkles } from "lucide-react";
// import Link from "next/link";
// import Image from "next/image";

// export default function HeroSection() {
//   return (
//     <section className="pt-24 pb-20">
//       <div className="container mx-auto flex flex-col lg:flex-row items-center gap-12 px-4 sm:px-6 lg:px-8">

//         {/* Left Column */}
//         <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left space-y-6">

//           {/* Badge */}
//           <div className="self-start mb-4">
//             <Link href="/#Features">
//               <div className="group inline-block p-[1px] rounded-full bg-gradient-to-r from-blue-200 via-sky-300 to-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_28px_rgba(59,130,246,0.5)] transition duration-300">
//                 <Badge
//                   variant="secondary"
//                   className="flex items-center px-5 py-2 bg-white text-blue-900 rounded-full text-sm font-semibold transition-colors duration-200 group-hover:bg-blue-100"
//                 >
//                   <Sparkles className="h-4 w-4 mr-2 text-sky-600 animate-pulse" />
//                   Powered by AI
//                 </Badge>
//               </div>
//             </Link>
//           </div>

//           {/* Headline */}
//           <h1 className="max-w-lg text-4xl sm:text-5xl lg:text-6xl leading-tight">
//             Know{" "}
//             <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-blue-500 drop-shadow-sm">
//               what’s inside
//             </span>{" "}
//             — without watching the whole video.
//           </h1>

//           {/* Subheading */}
//           <p className="max-w-lg text-lg sm:text-xl lg:text-2xl text-white/80 mx-auto lg:mx-0">
//             Upload your video and get AI-powered summaries, Q&A, and timestamps in seconds. Perfect for educators, creators, and teams.
//           </p>

//           {/* CTA Button */}
//           <div className="w-full flex justify-center lg:justify-start mt-8">
//             <Link href="/#Pricing">
//               <Button
//                 className="
//                   text-sm sm:text-base lg:text-lg
//                   px-8 sm:px-10 lg:px-12
//                   py-3 sm:py-4 lg:py-5
//                   rounded-full font-semibold
//                   bg-gradient-to-r from-teal-400 via-emerald-400 to-cyan-400
//                   text-white shadow-lg
//                   hover:brightness-110 hover:scale-105 active:scale-95
//                   transition duration-300 ease-in-out
//                   flex items-center gap-2
//                 "
//               >
//                 Try Now
//                 <ArrowRight className="w-5 h-5 animate-pulse" />
//               </Button>
//             </Link>
//           </div>
//         </div>

//         {/* Right Column: Mockup */}
//         <div className="flex-1 flex justify-center lg:justify-end lg:items-center mt-12 lg:mt-0">
//           <img
//             src="/hero-mockup.png"
//             srcSet="/hero-mockup.png 1x, /hero-mockup@2x.png 2x"
//             alt="AI-powered video summary mockup"
//             className="w-full max-w-md lg:max-w-lg shadow-2xl"
//           />
//         </div>
//       </div>
//     </section>
//   );
// }
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="pt-24 pb-20 bg-gradient-to-b from-black via-gray-900 to-black">
      <div className="container mx-auto flex flex-col lg:flex-row items-center gap-16 px-4 sm:px-6 lg:px-8">

        {/* Left Column */}
        <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left space-y-8">

          {/* Badge */}
          <div className="self-start mb-6">
            <Link href="/#Features">
              <div className="group inline-block p-[1px] rounded-full bg-gradient-to-r from-blue-200 via-sky-300 to-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_28px_rgba(59,130,246,0.5)] transition duration-300">
                <Badge
                  variant="secondary"
                  className="flex items-center px-4 py-2 bg-white text-blue-900 rounded-full text-sm font-semibold transition-colors duration-200 group-hover:bg-blue-100"
                >
                  <Sparkles className="h-4 w-4 mr-2 text-sky-600 animate-pulse" />
                  Powered by AI
                </Badge>
              </div>
            </Link>
          </div>

          {/* Headline */}
          <h1 className="max-w-2xl text-4xl sm:text-5xl lg:text-6xl leading-tight lg:max-w-2xl">
            Know{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-blue-500 drop-shadow-sm">
              what’s inside
            </span>{" "}
            — without watching the whole video.
          </h1>

          {/* Subheading */}
          <p className="max-w-lg text-lg sm:text-xl lg:text-2xl text-white/80 mx-auto lg:mx-0">
            Upload your video and get AI-powered summaries, Q&A, and timestamps in seconds. Perfect for educators, creators, and teams.
          </p>

          {/* CTA */}
          <div className="w-full flex flex-col items-center lg:items-start gap-2">
            <Link href="/#Pricing">
              <Button
                className="
                  text-sm sm:text-base lg:text-lg
                  px-8 sm:px-10 lg:px-12
                  py-3 sm:py-4 lg:py-5
                  rounded-full font-semibold
                  bg-gradient-to-r from-teal-400 via-emerald-400 to-cyan-400
                  text-white shadow-lg
                  hover:brightness-110 hover:scale-105 active:scale-95
                  transition duration-300 ease-in-out
                  flex items-center gap-2
                "
              >
                Try Now
                <ArrowRight className="w-5 h-5 animate-pulse" />
              </Button>
            </Link>
            <span className="text-sm text-white/60">No credit card required</span>
          </div>
        </div>

        {/* Right Column */}
        <div className="flex-1 flex justify-center lg:justify-end lg:items-center mt-12 lg:mt-0">
          <img
            src="/hero-mockup.png"
            srcSet="/hero-mockup.png 1x, /hero-mockup@2x.png 2x"
            alt="AI-powered video summary mockup"
            className="w-full max-w-md lg:max-w-lg drop-shadow-lg"
          />
        </div>
      </div>
    </section>
  );
}

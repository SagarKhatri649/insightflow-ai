// import { Badge } from '@/components/ui/badge';
// import { Sparkles } from 'lucide-react';

// export default function UploadHeader() {
//   return (
//     <div className='flex flex-col items-center justify-center gap-6 text-center'>
//       <div className='relative p-[1px] overflow-hidden rounded-full bg-linear-to-r from-rose-200 via-rose-500 to-rose-800 animate-gradient-x group'>
//         <Badge
//           variant={'secondary'} className="flex items-center px-6 py-2 bg-white text-black rounded-full transition-colors duration-200 group-hover:bg-rose-100">

//           <Sparkles className="h-6 w-6 mr-2 text-rose-600 animate-pulse" />

//           <span className="text-base text-black">AI-Powered Content Creation</span>

//         </Badge>

//       </div>
//       <div className='capitalise text-3xl font-bold tracking-tight text-white sm:text-4xl'>
//         Start Uploading{' '}
//         <span className='relative inline-block'>
//           <span className=' relative z-10 px-2 '> Your YouTube Video link
//           </span>
//           <span className='absolute inset-0 bg-rose-200/50 -rotate-2 rounded-lg transform -skew-y-1'
//             aria-hidden='true'>
//           </span>
//         </span>{' '}
//       </div>
//       <div className='mt-2 text-lg leading-8 text-gray-100 max-w-2xl text-center'>
//         <p> Drop youtube link here
//         </p>
//       </div>
//     </div>

//   );
// }

'use client';

import { Badge } from '@/components/ui/badge';
import { Sparkles } from 'lucide-react';

export default function UploadHeader() {
  return (
    <section className="py-16 bg-gradient-to-b from-gray-900 via-black to-gray-900 text-center">
      <div className="container mx-auto px-4 flex flex-col items-center">
        {/* Top badge */}
        <div className="group inline-block p-[2px] rounded-full bg-gradient-to-r from-teal-400 via-emerald-400 to-cyan-400 mb-6 hover:from-cyan-400 hover:to-teal-400 transition">
          <Badge
            variant="secondary"
            className="flex items-center px-5 py-2 bg-gray-900 text-white rounded-full font-semibold group-hover:bg-gray-800 transition-colors"
          >
            <Sparkles className="w-5 h-5 mr-2 text-teal-300 animate-pulse" />
            AI-Powered Content Creation
          </Badge>
        </div>

        {/* Main headline */}
        <h1 className="max-w-3xl text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight text-white">
          Start Uploading{' '}
          <span className="relative inline-block">
            <span className="relative z-10 px-2 text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-400">
              Your YouTube Video Link
            </span>
            <span
              className="absolute inset-0 transform -skew-y-2 bg-teal-600/20 rounded-lg"
              aria-hidden="true"
            />
          </span>
        </h1>

        {/* Subheading */}
        <p className="mt-4 max-w-2xl text-lg text-gray-400">
          Drop a YouTube URL or upload your video file to instantly unlock AI-generated
          summaries, chapters, and smart Q&A—no installs required.
        </p>
      </div>
    </section>
  );
}

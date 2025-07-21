// 'use client';

// import { Sparkles, Upload, Brain } from "lucide-react";

// export default function HowItWorksSection() {
//   return (
//     <section id="How TO Use" className="py-20 bg-white dark:bg-black">
//       {/* Section Header */}
//       <div className="text-center mb-16 px-4">

//         <h2 className="font-bold text-sm tracking-wide uppercase mb-3 text-teal-500"> How to Use

//         </h2>
//         <h3 className="font-bold text-3xl sm:text-4xl max-w-2xl mx-auto text-balance text-gray-900 dark:text-white">
//           How InsightFlow turns your videos into intelligent summaries
//         </h3>
//       </div>

//       {/* Steps Grid */}
//       <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-6 text-center">
//         {/* Step 1 */}
//         <div className="flex flex-col items-center gap-4">
//           <Upload className="w-12 h-12 text-teal-500" />

//           <h4 className="text-lg font-semibold text-gray-800 dark:text-white">
//             Upload Your Video
//           </h4>
//           <p className="text-gray-600 dark:text-gray-400 max-w-xs">
//             Start by uploading any MP4 file from your device.
//           </p>
//         </div>

//         {/* Step 2 */}
//         <div className="flex flex-col items-center gap-4">

//           <Brain className="w-12 h-12 text-teal-500" />
//           <h4 className="text-lg font-semibold text-gray-800 dark:text-white">
//             AI Transcription
//           </h4>
//           <p className="text-gray-600 dark:text-gray-400 max-w-xs">
//             Our Whisper-based engine transcribes your content accurately in seconds.
//           </p>
//         </div>

//         {/* Step 3 */}
//         <div className="flex flex-col items-center gap-4">
//           <Sparkles className="w-12 h-12 text-teal-500" />
//           <h4 className="text-lg font-semibold text-gray-800 dark:text-white">
//             Generate Smart Output
//           </h4>
//           <p className="text-gray-600 dark:text-gray-400 max-w-xs">
//             Get summaries, Q&A, chapters, and timestamps — all instantly and clearly presented.
//           </p>
//         </div>
//       </div>
//     </section>
//   );
// }
// 'use client';

// import { Sparkles, Upload, Brain } from "lucide-react";
// import { motion } from "framer-motion";

// const steps = [
//   {
//     Icon: Upload,
//     title: "Upload Your Video",
//     description: "Start by uploading any MP4 file from your device.",
//   },
//   {
//     Icon: Brain,
//     title: "AI Transcription",
//     description:
//       "Our Whisper-based engine transcribes your content accurately in seconds.",
//   },
//   {
//     Icon: Sparkles,
//     title: "Generate Smart Output",
//     description:
//       "Get summaries, Q&A, chapters, and timestamps — all instantly and clearly presented.",
//   },
// ];

// export default function HowItWorksSection() {
//   return (
//     <section
//       id="how-to-use"
//       className="scroll-mt-24 relative py-20 bg-white dark:bg-black"
//     >
//       {/* Accent blob */}
//       <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-teal-50 to-transparent dark:from-teal-900/20 z-0" />

//       {/* Section Header */}
//       <div className="relative z-10 max-w-2xl mx-auto text-center mb-16 px-4">
//         <h2 className="font-bold text-sm tracking-wide uppercase mb-3 text-teal-500">
//           How to Use
//         </h2>
//         <h3 className="font-bold text-3xl sm:text-4xl text-gray-900 dark:text-white leading-tight">
//           How InsightFlow turns your videos into intelligent summaries
//         </h3>
//       </div>

//       {/* Steps Grid */}
//       <div className="relative z-10 max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 px-4">
//         {steps.map(({ Icon, title, description }, idx) => (
//           <motion.div
//             key={title}
//             className="flex flex-col items-center text-center gap-4 px-4"
//             initial={{ opacity: 0, y: 20 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true, amount: 0.3 }}
//             transition={{ delay: idx * 0.15 }}
//           >
//             <div className="flex items-center justify-center w-16 h-16 rounded-full bg-teal-100 dark:bg-teal-800">
//               <Icon className="w-8 h-8 text-teal-600 dark:text-teal-300" />
//             </div>
//             <h4 className="text-lg font-semibold text-gray-800 dark:text-white">
//               {title}
//             </h4>
//             <p className="text-gray-600 dark:text-gray-400 max-w-xs">
//               {description}
//             </p>
//           </motion.div>
//         ))}
//       </div>
//     </section>
//   );
// }
// 'use client';

// import { Sparkles, Upload, Brain } from "lucide-react";
// import { motion } from "framer-motion";

// const steps = [
//   {
//     Icon: Upload,
//     title: "Upload Your Video",
//     description: "Start by uploading any MP4 file from your device.",
//   },
//   {
//     Icon: Brain,
//     title: "AI Transcription",
//     description:
//       "Our Whisper-based engine transcribes your content accurately in seconds.",
//   },
//   {
//     Icon: Sparkles,
//     title: "Generate Smart Output",
//     description:
//       "Get summaries, Q&A, chapters, and timestamps — all instantly and clearly presented.",
//   },
// ];

// export default function HowItWorksSection() {
//   return (
//     <section
//       id="how-to-use"
//       className="
//         scroll-mt-24 
//         relative 
//         py-24 lg:py-32 
//         bg-gradient-to-b 
//           from-gray-900 
//           via-gray-800 
//           to-gray-900 
//       "
//     >
//       {/* Section Header */}
//       <div className="relative z-10 max-w-2xl mx-auto text-center mb-16 px-4">
//         <h2 className="text-base sm:text-lg font-bold uppercase tracking-wide mb-4 text-teal-400">
//           How to Use
//         </h2>
//         <h3 className="text-3xl sm:text-4xl lg:text-5xl text-white leading-tight">
//           How InsightFlow turns your videos into intelligent summaries
//         </h3>
//       </div>

//       {/* Steps Grid */}
//       <div className="relative z-10 max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-16 px-4">
//         {steps.map(({ Icon, title, description }, idx) => (
//           <motion.div
//             key={title}
//             className="
//               bg-gray-800 
//               hover:bg-gray-700 
//               p-8 
//               rounded-2xl 
//               shadow-xl 
//               transform 
//               hover:-translate-y-2 
//               transition 
//               duration-300
//             "
//             initial={{ opacity: 0, y: 20 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true, amount: 0.3 }}
//             transition={{ delay: idx * 0.15 }}
//           >
//             <div className="flex justify-center mb-4">
//               <div className="flex items-center justify-center w-16 h-16 rounded-full bg-teal-500">
//                 <Icon className="w-8 h-8 text-white" />
//               </div>
//             </div>
//             <h4 className="text-xl font-semibold text-white mb-2 text-center">
//               {title}
//             </h4>
//             <p className="text-gray-300 text-center leading-relaxed">
//               {description}
//             </p>
//           </motion.div>
//         ))}
//       </div>
//     </section>
//   );
// }
'use client';

import { Sparkles, Upload, Brain } from 'lucide-react';
import { motion } from 'framer-motion';

const steps = [
  {
    Icon: Upload,
    title: 'Upload Your Video',
    description: 'Start by uploading any MP4 file from your device.',
  },
  {
    Icon: Brain,
    title: 'AI Transcription',
    description:
      'Our Whisper-based engine transcribes your content accurately in seconds.',
  },
  {
    Icon: Sparkles,
    title: 'Generate Smart Output',
    description:
      'Get summaries, Q&A, chapters, and timestamps — all instantly and clearly presented.',
  },
];

export default function HowItWorksSection() {
  return (
    <section
      id="how-to-use"
      className="
        scroll-mt-24
        py-24 lg:py-32
        bg-gradient-to-b from-black via-gray-900 to-black
      "
    >
      {/* Section Header */}
      <div className="max-w-2xl mx-auto text-center mb-16 px-4">
        <h2 className="text-base sm:text-lg font-bold uppercase tracking-wide mb-4 text-teal-400">
          How to Use
        </h2>
        <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
          How InsightFlow turns your videos into intelligent summaries
        </h3>
      </div>

      {/* Steps Grid */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-16 px-4">
        {steps.map(({ Icon, title, description }, idx) => (
          <motion.div
            key={title}
            className="
              bg-gray-800 hover:bg-gray-700
              p-8
              rounded-2xl
              shadow-lg
              transform hover:-translate-y-2
              transition
              duration-300
            "
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ delay: idx * 0.15 }}
          >
            <div className="flex justify-center mb-4">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-teal-500">
                <Icon className="w-8 h-8 text-white" />
              </div>
            </div>
            <h4 className="text-xl font-semibold text-white mb-2 text-center">
              {title}
            </h4>
            <p className="text-gray-300 text-center leading-relaxed">
              {description}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// import { FileVideo } from 'lucide-react';
// export function DemoSection() {
//   return (
//     <section className="relative">
//       <div className="py-12 lg:py-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 lg:pt-12">

//         <div className='flex flex-col items-center text-center space-y-4'>
//           <div className='inline-flex items-center justify-center p-2 rounded-2xl bg-gray-100/80  backdrop-blur-xs border border-gray-500/20 mb-4'>
//             <FileVideo className='w-6 h-6 text-rose-500' />
//           </div>

//           <div className="text-center mb-16">
//             <h3 className="font-bold text-3xl max-w-2xl mx-auto px-4 sm:px-6">
//               Watch InsightFlow turn a regional language video into {' '}
//               <span className='bg-linear-to-r from-rose-500 to-rose-700 bg-clip-text text-transparent'>
//                 easy, structured English insights
//               </span>{' '}
//               in seconds!
//             </h3>
//           </div>
//           <div className='flex justify-center items-center px-2 sm:px-4 lg:px-6'>
//             {/* summarry */}
//           </div>
//         </div>
//       </div>
//     </section >


//   );
// }
import { Zap, Check, Share2 } from "lucide-react";

export default function DemoSection() {
  const benefits = [
    { Icon: Zap, label: "Instant AI Summaries" },
    { Icon: Check, label: "99%+ Accurate Transcripts" },
    { Icon: Share2, label: "Easy Export & Share" },
  ];

  return (
    <section
      id="Features"
      className="py-12 bg-gradient-to-b from-black via-gray-960 to-black"
    >
      <div className="max-w-4xl mx-auto text-center px-4 mb-8">
        <h2 className="text-base sm:text-lg font-bold uppercase tracking-wide mb-4 text-teal-400">
          Key Benefits
        </h2>
      </div>
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-8 px-4">
        {benefits.map(({ Icon, label }) => (
          <div key={label} className="flex items-center space-x-3">
            <Icon className="w-6 h-6 text-teal-400" />
            <span className="text-lg font-medium text-white">{label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

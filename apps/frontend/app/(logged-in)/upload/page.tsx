// import UploadHeader from "@/components/upload/upload-header"
// import UploadForm from "@/components/upload/upload-form"
// export default function Page() {

//   return (

//     <section className='min-h-screen'>
//       {/* <BgGradient/> */}
//       <div className='mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8'>

//         <UploadHeader />
//         <UploadForm />
//       </div>
//     </section>
//   )
// }
// import UploadHeader from "@/components/upload/upload-header"
// import UploadForm from "@/components/upload/upload-form"

// export default function UploadPage() {
//   return (
//     <>
//       <UploadHeader />
//       <UploadForm />
//     </>
//   );
// }

// import UploadHeader from "@/components/upload/upload-header";
// import UploadForm from "@/components/upload/upload-form";

// // app/upload/page.tsx


// export default function UploadPage() {
//   return (
//     <section
//       id="upload-hero"
//       className="
//         min-h-screen                 /* fill full viewport */
//         flex flex-col items-center justify-start
//         bg-gradient-to-b
//           from-gray-900 via-black to-gray-900
//         px-4 py-16
//       "
//     >
//       {/* add bottom padding so form sits lower */}
//       <div className="pb-12">
//         <UploadHeader />
//       </div>

//       <div className="w-full max-w-lg">
//         <UploadForm />
//       </div>
//     </section>
//   );
// }


import UploadHeader from '@/components/upload/upload-header';
import UploadForm from '@/components/upload/upload-form';

export default function UploadPage() {
  return (
    <section
      id="upload-hero"
      className="min-h-screen flex flex-col items-center justify-start
                 bg-gradient-to-b from-gray-900 via-black to-gray-900 px-4 py-8"
    >
      <div className="w-full max-w-4xl mx-auto space-y-2">
        <UploadHeader />
        <UploadForm />
      </div>
    </section>
  );
}

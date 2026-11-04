
// "use client";

// import { z } from "zod";
// import { Input } from "../ui/input";
// import { Button } from "../ui/button";
// import { Toaster, useToast } from "@/components/ui/sonner";
// import { useUploadThing } from "@/utils/uploadthing";
// import { transcribeUploadedFile } from "@/actions/upload-actions";
// import { generateBlogPostAction } from "@/actions/upload-actions";

// const schema = z.object({
//   file: z
//     .instanceof(File, { message: "Invalid file" })
//     .refine(
//       f => f.size <= 20 * 1024 * 1024,
//       "File size must not exceed 20 MB"
//     )
//     .refine(
//       f => f.type.startsWith("audio/") || f.type.startsWith("video/"),
//       "File must be an audio or video file"
//     ),
// });

// export default function UploadForm() {
//   const { toast } = useToast();

//   const { startUpload } = useUploadThing("videoOrAudioUploader", {
//     onClientUploadComplete: () => {
//       alert("uploaded successfully!");
//     },
//     onUploadError: () => {
//       alert("error occurred while uploading");
//     },
//     onUploadBegin: ({ }) => {
//       console.log("upload has begun for");
//     },

//   });

//   /** client‑side submit handler */
//   const handleTranscribe = async (
//     e: React.FormEvent<HTMLFormElement>,
//   ) => {
//     e.preventDefault();

//     const formData = new FormData(e.currentTarget);
//     const file = formData.get("file") as File | null;

//     ////////////////////////////
//     const res = schema.safeParse({ file });

//     if (!res.success) {
//       toast("Something went wrong", {
//         description:
//           res.error.flatten().fieldErrors.file?.[0] ?? "Invalid file",
//       })

//     }
//     if (file) {
//       const resp: any = await startUpload([file]);
//       console.log({ resp });

//       if (!resp || resp.length === 0) {

//         toast(
//           "Something went wrong", {
//           description: " Please use a different file",
//           // variant: "destructive",
//         });
//         return;

//       }
//       toast(
//         " Transcription is in progress..", {
//         description: " Hang tight! Our digital wizards are sprinkling magic dust on your file",
//       });

//       const result = await transcribeUploadedFile(resp);

//       const { data = null, message = null } = result || {};

//       if (!result || (!data && !message)) {
//         toast(
//           "An unexpected error occurred",
//           {
//             description:
//               "An erro occurred during transcription. please try again.",
//           });

//       }
//       if (data) {
//         toast(
//           "Generating AI blog post..",
//           {
//             description:
//               "Please wait while we generate your blog post",
//           });

//         await generateBlogPostAction({
//           transcriptions: data.transcriptions,

//           userId: data.userId
//         });

//         toast(
//           "Woohoo! Your AI Insight is created!",
//           {
//             description:
//               "Time to Click on it and download it",
//           });


//       }

//     }
//     // // TODO: your upload / transcribe logic here
//     // toast("Uploading…", { description: file!.name });
//   };

//   return (
//     <div>
//       {/* Mount once per page or in your root layout */}
//       <Toaster />

//       <form className="flex flex-col gap-6" onSubmit={handleTranscribe}>
//         <div className="flex justify-end items-center gap-1.5">
//           <Input
//             id="file"
//             name="file"
//             type="file"
//             accept="audio/*,video/*"
//             required
//           />
//           <Button className="bg-purple-600" type="submit">
//             Transcribe
//           </Button>
//         </div>
//       </form>
//     </div>
//   );
// }


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// "use client";

// import { z } from "zod";
// import { useState } from "react";
// import { Input } from "../ui/input";
// import { Button } from "../ui/button";
// import { Toaster, useToast } from "@/components/ui/sonner";
// import { useUploadThing } from "@/utils/uploadthing";

// const schema = z.object({
//   file: z
//     .instanceof(File, { message: "Invalid file" })
//     .refine((f) => f.size <= 20 * 1024 * 1024, "File must be ≤20 MB")
//     .refine(
//       (f) => f.type.startsWith("audio/") || f.type.startsWith("video/"),
//       "Must be an audio or video file"
//     ),
// });

// export default function UploadForm() {
//   const { toast } = useToast();
//   const [fileName, setFileName] = useState<string | null>(null);
//   const [transcript, setTranscript] = useState<string | null>(null);

//   function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
//     const f = e.target.files?.[0] ?? null;
//     setFileName(f ? f.name : null);
//     setTranscript(null);
//   }

//   const { startUpload } = useUploadThing("videoOrAudioUploader", {
//     onUploadBegin: () => console.log("📤 Upload started"),
//     onClientUploadComplete: () => console.log("✅ Upload complete"),
//     onUploadError: () => console.error("❌ Upload error"),
//   });

//   const handleTranscribe = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();

//     const formData = new FormData(e.currentTarget);
//     const file = formData.get("file") as File | null;
//     const parse = schema.safeParse({ file });
//     if (!parse.success || !file) {
//       return toast("Invalid file", {
//         description:
//           parse.error.flatten().fieldErrors.file?.[0] ||
//           "Please select a valid file.",
//       });
//     }

//     toast("Uploading…", { description: "Sending file to server…" });
//     const [uploaded] = await startUpload([file]);
//     if (!uploaded) {
//       return toast("Upload failed", { description: "No response from uploader." });
//     }

//     toast("Transcribing…", { description: "Generating transcript…" });
//     const res = await fetch("/api/transcribe", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         ufsUrl: uploaded.ufsUrl,
//         fileName: uploaded.name,
//       }),
//     });
//     const result = await res.json();
//     if (!result.success || !result.data) {
//       return toast("Transcription failed", {
//         description: result.message || "Please try again.",
//       });
//     }

//     setTranscript(result.data.transcriptions.text);
//     toast("✅ Transcript ready!", { description: "See it below." });
//   };

//   return (
//     <>
//       <Toaster richColors position="top-center" />

//       {/* Upload Form Section */}
//       <section className="py-16 px-4 bg-gradient-to-b from-black via-gray-900 to-black">
//         <div className="max-w-lg mx-auto bg-gray-800/60 backdrop-blur-sm p-8 rounded-2xl shadow-xl">
//           <form onSubmit={handleTranscribe} className="space-y-4">
//             <label htmlFor="file" className="block text-lg font-semibold text-white">
//               Choose Audio or Video File
//             </label>

//             <div className="flex items-center gap-4">
//               <Input
//                 id="file"
//                 name="file"
//                 type="file"
//                 accept="audio/*,video/*"
//                 required
//                 onChange={handleFileChange}
//                 className="flex-1 bg-gray-700 border-gray-600 text-white placeholder-gray-500 focus:border-teal-400 focus:ring-2 focus:ring-teal-400"
//               />
//               <Button
//                 type="submit"
//                 className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-2 rounded-full transition"
//               >
//                 Transcribe
//               </Button>
//             </div>

//             {fileName && (
//               <p className="text-gray-400 text-sm">
//                 Selected file:{" "}
//                 <span className="text-white">{fileName}</span>
//               </p>
//             )}
//           </form>
//         </div>
//       </section>

//       {/* Transcript Result Section */}
//       {transcript && (
//         <section className="py-16 px-4 bg-black">
//           <div className="max-w-4xl mx-auto bg-gray-900/80 p-10 rounded-2xl shadow-2xl border border-gray-700">
//             <h2 className="text-2xl font-bold text-teal-400 mb-6">Transcript</h2>
//             <div className="text-gray-100 text-base leading-relaxed whitespace-pre-wrap max-h-[50vh] overflow-y-auto">
//               {transcript}
//             </div>
//           </div>
//         </section>
//       )}
//     </>
//   );
// }


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// "use client";

// import { z } from "zod";
// import { useState } from "react";
// import { Input } from "../ui/input";
// import { Button } from "../ui/button";
// import { Toaster, useToast } from "@/components/ui/sonner";
// import { useUploadThing } from "@/utils/uploadthing";
// import { transcribeUploadedFile } from "@/actions/upload-actions";
// import { generateBlogPostAction } from "@/actions/upload-actions";

// const schema = z.object({
//   file: z
//     .instanceof(File, { message: "Invalid file" })
//     .refine(f => f.size <= 20 * 1024 * 1024, "File size must not exceed 20 MB")
//     .refine(
//       f => f.type.startsWith("audio/") || f.type.startsWith("video/"),
//       "File must be an audio or video file"
//     ),
// });

// export default function UploadForm() {
//   const { toast } = useToast();
//   const [fileName, setFileName] = useState<string | null>(null);
//   const [transcript, setTranscript] = useState<string | null>(null);

//   const { startUpload } = useUploadThing("videoOrAudioUploader", {
//     onClientUploadComplete: () => {
//       alert("uploaded successfully!");
//     },
//     onUploadError: () => {
//       alert("error occurred while uploading");
//     },
//     onUploadBegin: ({ }) => {
//       console.log("upload has begun for");
//     },
//   });

//   const handleTranscribe = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();

//     const formData = new FormData(e.currentTarget);
//     const file = formData.get("file") as File | null;

//     const res = schema.safeParse({ file });

//     if (!res.success) {
//       toast("Something went wrong", {
//         description:
//           res.error.flatten().fieldErrors.file?.[0] ?? "Invalid file",
//       });
//       return;
//     }

//     if (file) {
//       const resp: any = await startUpload([file]);
//       console.log("📦 Upload response:", resp);

//       if (!resp || resp.length === 0) {
//         toast("Something went wrong", {
//           description: " Please use a different file",
//         });
//         return;
//       }

//       console.log("📦 Upload response:", JSON.stringify(resp, null, 2));

//       const uploaded = resp?.[0];

//       const ufsUrl = uploaded?.ufsUrl;
//       const fileName = uploaded?.name;


//       if (!ufsUrl || !fileName) {
//         toast("Missing upload data", {
//           description: "Upload succeeded but URL or filename is missing.",
//         });
//         return;
//       }

//       toast("Transcription is in progress..", {
//         description:
//           "Hang tight! Our digital wizards are sprinkling magic dust on your file",
//       });

//       const result = await transcribeUploadedFile({
//         ufsUrl,
//         fileName,
//       });

//       const { data = null, message = null } = result || {};

//       if (!result || (!data && !message)) {
//         toast("An unexpected error occurred", {
//           description: "An error occurred during transcription. Please try again.",
//         });
//         return;
//       }

//       if (data) {
//         setTranscript(data.transcriptions?.text || "");
//         toast("Generating AI blog post..", {
//           description: "Please wait while we generate your blog post",
//         });

//         await generateBlogPostAction({
//           transcriptions: data.transcriptions,
//           userId: data.userId,
//         });

//         toast("Woohoo! Your AI Insight is created!", {
//           description: "Time to Click on it and download it",
//         });
//       }
//     }
//   };


//   return (
//     <>
//       <Toaster richColors position="top-center" />

//       {/* Upload Form Section */}
//       <section className="py-16 px-4 bg-gradient-to-b from-black via-gray-900 to-black">
//         <div className="max-w-lg mx-auto bg-gray-800/60 backdrop-blur-sm p-8 rounded-2xl shadow-xl">
//           <form onSubmit={handleTranscribe} className="space-y-4">
//             <label htmlFor="file" className="block text-lg font-semibold text-white">
//               Choose Audio or Video File
//             </label>

//             <div className="flex items-center gap-4">
//               <Input
//                 id="file"
//                 name="file"
//                 type="file"
//                 accept="audio/*,video/*"
//                 required
//                 onChange={(e) =>
//                   setFileName(e.target.files?.[0]?.name ?? null)
//                 }
//                 className="flex-1 bg-gray-700 border-gray-600 text-white placeholder-gray-500 focus:border-teal-400 focus:ring-2 focus:ring-teal-400"
//               />
//               <Button
//                 type="submit"
//                 className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-2 rounded-full transition"
//               >
//                 Transcribe
//               </Button>
//             </div>

//             {fileName && (
//               <p className="text-gray-400 text-sm">
//                 Selected file:{" "}
//                 <span className="text-white">{fileName}</span>
//               </p>
//             )}
//           </form>
//         </div>
//       </section>

//       {/* Transcript Result Section */}
//       {transcript && (
//         <section className="py-16 px-4 bg-black">
//           <div className="max-w-4xl mx-auto bg-gray-900/80 p-10 rounded-2xl shadow-2xl border border-gray-700">
//             <h2 className="text-2xl font-bold text-teal-400 mb-6">Transcript</h2>
//             <div className="text-gray-100 text-base leading-relaxed whitespace-pre-wrap max-h-[50vh] overflow-y-auto">
//               {transcript}
//             </div>
//           </div>
//         </section>
//       )}
//     </>
//   );
// }
///////////////////////////////////////////////////////////////////////////////////////////////////////////////

// components/UploadForm.tsx
// components/UploadForm.tsx
// components/UploadForm.tsx
// 'use client';

// import { z } from 'zod';
// import { useState, useRef, useEffect } from 'react';
// import { Input } from '@/components/ui/input';
// import { Button } from '@/components/ui/button';
// import { Toaster, useToast } from '@/components/ui/sonner';
// import { useUploadThing } from '@/utils/uploadthing';
// import { generateBlogPostAction } from '@/actions/upload-actions';
// import { useRouter } from 'next/navigation';
// import { useUser } from '@clerk/nextjs';

// const schema = z.object({
//   file: z
//     .instanceof(File)
//     .refine(f => f.size <= 20 * 1024 * 1024, 'File must be ≤20 MB')
//     .refine(
//       f => f.type.startsWith('audio/') || f.type.startsWith('video/'),
//       'Must be an audio or video file'
//     ),
// });

// export default function UploadForm() {
//   const { toast } = useToast();
//   const { user } = useUser();
//   const router = useRouter();

//   const [fileName, setFileName] = useState<string>('');
//   const [isProcessing, setIsProcessing] = useState(false);

//   // Track mounted state to avoid setting state after unmount
//   const isMounted = useRef(true);
//   useEffect(() => {
//     return () => {
//       isMounted.current = false;
//     };
//   }, []);

//   const { startUpload } = useUploadThing('videoOrAudioUploader', {
//     onClientUploadBegin: () => toast('Upload started'),
//     onClientUploadComplete: () => toast.success('Upload complete'),
//     onClientUploadError: () => toast.error('Upload error'),
//   });

//   const handleTranscribe = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     if (!user) {
//       toast.error('Please sign in first');
//       return;
//     }

//     const input = e.currentTarget.elements.namedItem('file') as HTMLInputElement;
//     const file = input.files?.[0] ?? null;

//     // 1) Validate
//     const parsed = schema.safeParse({ file });
//     if (!parsed.success) {
//       toast.error(parsed.error.flatten().fieldErrors.file?.[0]!);
//       return;
//     }

//     setFileName(file.name);
//     setIsProcessing(true);

//     try {
//       // 2) Transcribe
//       toast('Transcribing…');
//       const form = new FormData();
//       form.append('file', file, file.name);
//       form.append('userId', user.id);

//       const res = await fetch('/api/transcribe', {
//         method: 'POST',
//         body: form,
//       });
//       const result = await res.json();
//       if (!res.ok || !result.success) {
//         throw new Error(result.message || `Transcription failed (${res.status})`);
//       }

//       // 3) Store the file after transcription
//       const uploadResults = await startUpload([file]);
//       const uploaded = Array.isArray(uploadResults) ? uploadResults[0] : undefined;
//       if (!uploaded?.url) {
//         throw new Error('File storage failed');
//       }

//       // 4) Generate blog post
//       toast('Generating post…');
//       const postResult = await generateBlogPostAction({
//         transcriptions: { text: result.data.transcriptions.text },
//         userId: user.id,
//       });
//       if (!postResult.success || !postResult.postId) {
//         throw new Error(postResult.message || 'Post creation failed');
//       }

//       // 5) Stop processing and redirect
//       if (isMounted.current) {
//         setIsProcessing(false);
//       }
//       toast.success('All done! Redirecting…');
//       router.push(`/posts/${postResult.postId}`);
//     } catch (err: any) {
//       console.error('handleTranscribe error:', err);
//       toast.error(err.message || 'Something went wrong');
//       if (isMounted.current) {
//         setIsProcessing(false);
//       }
//     }
//   };

//   return (
//     <>
//       <Toaster richColors position="top-center" />
//       <section className="py-16 px-4 bg-gradient-to-b from-black via-gray-900 to-black">
//         <div className="max-w-lg mx-auto bg-gray-800/60 backdrop-blur-sm p-8 rounded-2xl shadow-xl">
//           <form onSubmit={handleTranscribe} className="space-y-4">
//             <label htmlFor="file" className="block text-lg font-semibold text-white">
//               Choose Audio or Video File
//             </label>
//             <div className="flex items-center gap-4">
//               <Input
//                 id="file"
//                 name="file"
//                 type="file"
//                 accept="audio/*,video/*"
//                 required
//                 disabled={isProcessing}
//                 onChange={(e) => setFileName(e.target.files?.[0]?.name || '')}
//                 className="flex-1 bg-gray-700 border-gray-600 text-white placeholder-gray-500 focus:border-teal-400 focus:ring-2 focus:ring-teal-400"
//               />
//               <Button
//                 type="submit"
//                 disabled={isProcessing}
//                 className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-2 rounded-full transition disabled:opacity-50"
//               >
//                 {isProcessing ? 'Processing…' : 'Upload & Transcribe'}
//               </Button>
//             </div>
//             {fileName && (
//               <p className="text-gray-400 text-sm">
//                 Selected file: <span className="text-white">{fileName}</span>
//               </p>
//             )}
//           </form>
//         </div>
//       </section>
//     </>
//   );
// }



'use client';

import { z } from 'zod';
import { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Toaster, useToast } from '@/components/ui/sonner';
import { useUploadThing } from '@/utils/uploadthing';
import { generateBlogPostAction } from '@/actions/upload-actions';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { Check, FileText, Lightbulb, Lock, Menu, Sparkles, Upload, Video, X } from 'lucide-react';

const schema = z.object({
  file: z
    .instanceof(File)
    .refine(f => f.size <= 20 * 1024 * 1024, 'File must be ≤20 MB')
    .refine(
      f => f.type.startsWith('audio/') || f.type.startsWith('video/'),
      'Must be an audio or video file'
    ),
});

export default function UploadForm() {
  const { toast } = useToast();
  const { user } = useUser();
  const router = useRouter();

  const [fileName, setFileName] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);

  const isMounted = useRef(true);
  useEffect(() => () => { isMounted.current = false; }, []);

  const { startUpload } = useUploadThing('videoOrAudioUploader', {
    onClientUploadBegin: () => toast('Upload started'),
    onClientUploadComplete: () => toast.success('Upload complete'),
    onClientUploadError: () => toast.error('Upload error'),
  });

  const handleTranscribe = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return toast.error('Please sign in first');

    const input = e.currentTarget.elements.namedItem('file') as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    const parsed = schema.safeParse({ file });
    if (!parsed.success) return toast.error(parsed.error.flatten().fieldErrors.file?.[0]!);

    setFileName(file.name);
    setIsProcessing(true);

    try {
      toast('Transcribing…');
      const form = new FormData();
      form.append('file', file, file.name);
      form.append('userId', user.id);

      const res = await fetch('/api/transcribe', { method: 'POST', body: form });
      const result = await res.json();
      if (!res.ok || !result.success) throw new Error(result.message || `Transcription failed (${res.status})`);

      const uploadResults = await startUpload([file]);
      const uploaded = Array.isArray(uploadResults) ? uploadResults[0] : undefined;
      if (!uploaded?.url) throw new Error('File storage failed');

      toast('Generating post…');
      const postResult = await generateBlogPostAction({
        transcriptions: { text: result.data.transcriptions.text },
        userId: user.id,
      });
      if (!postResult.success || !postResult.postId) throw new Error(postResult.message || 'Post creation failed');

      if (isMounted.current) setIsProcessing(false);
      toast.success('All done! Redirecting…');
      router.push(`/posts/${postResult.postId}`);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Something went wrong');
      if (isMounted.current) setIsProcessing(false);
    }
  };

  return (
    <>
      <Toaster richColors position="top-center" />
      <section className="w-full px-4 py-8 sm:px-6 md:py-12">
        <div className="mx-auto flex w-full max-w-4xl flex-col items-center">
          <div className="mb-7 max-w-2xl text-center">
            <h1 className="mb-3 text-3xl font-bold tracking-tight text-[#064e3b] sm:text-4xl lg:text-[40px]">
              Turn your video into clear insights
            </h1>
            <p className="text-base leading-[160%] text-[#5f6368]">
              Upload an audio or video file and get a transcript, summary, and actionable insights in minutes.
            </p>
          </div>
          <div className="w-full rounded-xl border border-[#dee1e6] bg-white p-4 shadow-sm sm:p-8">
            <form onSubmit={handleTranscribe}>
              <div className="flex w-full flex-col items-center justify-center rounded-xl border border-dashed border-[#10b981] bg-[#ecfdf5] p-6 transition-colors hover:bg-[#e6fbf2] sm:p-10">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-[#d1fae5] bg-white text-[#10b981] shadow-sm">
                  <Upload className="h-6 w-6" />
                </div>
                <h2 className="mb-2 text-center text-lg font-bold text-[#064e3b]">Upload your audio or video</h2>
                <div className="mb-2 flex flex-wrap items-center justify-center gap-1.5 text-center text-sm text-[#5f6368]">
                  <span>Drag and drop a file here, or</span>
                  <label htmlFor="file" className="inline-flex cursor-pointer items-center rounded-lg border border-[#dee1e6] bg-white px-2.5 py-1 font-medium text-[#064e3b] shadow-sm transition-colors hover:border-[#10b981] focus-within:ring-2 focus-within:ring-[#10b981] focus-within:ring-offset-2">
                    Browse files
                  </label>
                  <span>from your computer</span>
                </div>
                <p className="mt-1 text-center text-sm text-[#5f6368]">Audio or video files up to 20MB</p>
                <Input
                  id="file" name="file" type="file" accept="audio/*,video/*"
                  required disabled={isProcessing}
                  onChange={e => setFileName(e.target.files?.[0]?.name || '')}
                  className="sr-only"
                />
                {fileName && (
                  <div className="mt-6 flex w-full max-w-xl items-center justify-between rounded-xl border border-[#dee1e6] bg-white p-3.5 shadow-sm sm:p-4">
                    <div className="flex min-w-0 items-center space-x-3 sm:space-x-4">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-[#064e3b] text-white">
                        <Video className="h-5 w-5 text-[#10b981]" />
                      </div>
                      <div className="min-w-0 text-left">
                        <p className="truncate font-semibold text-[#064e3b]">{fileName}</p>
                        <p className="text-xs text-[#5f6368]">Selected audio or video file</p>
                      </div>
                    </div>
                    <div className="flex flex-shrink-0 items-center space-x-2">
                      <span className="inline-flex items-center rounded-md border border-[#a7f3d0] bg-[#ecfdf5] px-2.5 py-1 text-xs font-medium text-[#064e3b]">
                        <Check className="mr-1 h-3.5 w-3.5 text-[#10b981]" />
                        Ready
                      </span>
                      <button aria-label="Remove file" className="rounded-md border border-transparent p-1.5 text-[#979797] transition-colors hover:border-[#dee1e6] hover:text-[#5f6368] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#10b981] focus-visible:ring-offset-2" type="button">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <div className="mt-6 grid grid-cols-1 gap-3.5 md:grid-cols-3">
                <div className="rounded-lg border border-[#dee1e6] bg-white p-3.5">
                  <div className="mb-3 flex items-center space-x-2 text-xs font-semibold text-[#064e3b]"><FileText className="h-4 w-4 text-[#5f6368]" /><span>Transcript</span></div>
                  <div className="space-y-2"><div className="h-1.5 w-full rounded-full bg-[#f1f3f5]" /><div className="h-1.5 w-2/3 rounded-full bg-[#f1f3f5]" /></div>
                </div>
                <div className="rounded-lg border border-[#dee1e6] bg-white p-3.5">
                  <div className="mb-3 flex items-center space-x-2 text-xs font-semibold text-[#064e3b]"><Menu className="h-4 w-4 text-[#5f6368]" /><span>AI Summary</span></div>
                  <div className="space-y-2"><div className="h-1.5 w-full rounded-full bg-[#f1f3f5]" /><div className="h-1.5 w-2/3 rounded-full bg-[#f1f3f5]" /></div>
                </div>
                <div className="rounded-lg border border-[#dee1e6] bg-white p-3.5">
                  <div className="mb-3 flex items-center space-x-2 text-xs font-semibold text-[#064e3b]"><Lightbulb className="h-4 w-4 text-[#5f6368]" /><span>Actionable Takeaways</span></div>
                  <div className="space-y-2"><div className="h-1.5 w-full rounded-full bg-[#f1f3f5]" /><div className="h-1.5 w-2/3 rounded-full bg-[#f1f3f5]" /></div>
                </div>
              </div>
              <div className="mt-7 flex flex-col items-center justify-center">
                <Button type="submit" disabled={isProcessing} className="flex w-full items-center justify-center space-x-2.5 whitespace-nowrap rounded-lg bg-[#064e3b] px-7 py-3 font-bold text-white shadow-sm transition-colors hover:bg-[#04382b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#10b981] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto">
                  <Sparkles className="h-4 w-4 text-[#10b981]" />
                  <span>{isProcessing ? 'Processing…' : 'Upload and Generate Insights'}</span>
                </Button>
                <div className="mt-3 flex items-center space-x-1.5 text-xs text-[#5f6368]">
                  <Lock className="h-3.5 w-3.5 flex-shrink-0" />
                  <span>Your file stays private. Processing starts on click.</span>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}

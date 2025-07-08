// "use client";
// import { z } from "zod";
// import { Input } from "../ui/input";
// import { Button } from "../ui/button";
// import { Toaster, useToast } from "@/components/ui/sonner";
// const schema = z.object({
//   file: z
//     .instanceof(File, { message: "Invalid file" })
//     .refine(
//       (file) => file.size <= 20 * 1024 * 1024,
//       "File size must not exceed 20MB"
//     )
//     .refine(
//       (file) =>
//         file.type.startsWith("audio/") || file.type.startsWith("video/"),
//       "File must be an audio or  a  video file"
//     ),

// });
// export default function UploadForm() {
//   const { toast } = useToast();

//   const handleTranscribe = async (formData: FormData) => {

//     const file = formData.get('file') as File;

//     const validateFields = schema.safeParse({
//       file
//     });

//     if (!validateFields.success) {
//       console.log("validatedFields", validateFields.error.flatten().fieldErrors);
//       toast({
//         title: "Something went wrong",
//         description:
//           validateFields.error.flatten().
//             fieldErrors.file?.[0] ??
//           "Invalid file",
//         variant: "destructive",
//       });
//     }
//   };
//   return (
//     <div>
//       <form className="flex flex-col gap-6"
//         //  onSubmit={handleTranscribe}
//          onSubmit={async (e) => {
//     e.preventDefault();
//     const formData = new FormData(e.currentTarget);
//     await handleTranscribe(formData);
//       >

//         <div className="flex justify-end items-center gap-1.5">
//           <Input
//             id="file"
//             name="file"
//             type="file"
//             accept="audio/*,video/*"
//             required
//           />
//           <Button className="bg-purple-600">
//             Transcribe
//           </Button>
//         </div>
//       </form>
//     </div>
//   );
// }

"use client";

import { z } from "zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Toaster, useToast } from "@/components/ui/sonner";
import { useUploadThing } from "@/utils/uploadthing";
import { transcribeUploadedFile } from "@/actions/upload-actions";
import { generateBlogPostAction } from "@/actions/upload-actions";

const schema = z.object({
  file: z
    .instanceof(File, { message: "Invalid file" })
    .refine(
      f => f.size <= 20 * 1024 * 1024,
      "File size must not exceed 20 MB"
    )
    .refine(
      f => f.type.startsWith("audio/") || f.type.startsWith("video/"),
      "File must be an audio or video file"
    ),
});

export default function UploadForm() {
  const { toast } = useToast();

  const { startUpload } = useUploadThing("videoOrAudioUploader", {
    onClientUploadComplete: () => {
      alert("uploaded successfully!");
    },
    onUploadError: () => {
      alert("error occurred while uploading");
    },
    onUploadBegin: ({ }) => {
      console.log("upload has begun for");
    },

  });

  /** client‑side submit handler */
  const handleTranscribe = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const file = formData.get("file") as File | null;

    ////////////////////////////
    const res = schema.safeParse({ file });

    if (!res.success) {
      toast("Something went wrong", {
        description:
          res.error.flatten().fieldErrors.file?.[0] ?? "Invalid file",
      })

    }
    if (file) {
      const resp: any = await startUpload([file]);
      console.log({ resp });

      if (!resp || resp.length === 0) {

        toast(
          "Something went wrong", {
          description: " Please use a different file",
          // variant: "destructive",
        });
        return;

      }
      toast(
        " Transcription is in progress..", {
        description: " Hang tight! Our digital wizards are sprinkling magic dust on your file",
      });

      const result = await transcribeUploadedFile(resp);

      const { data = null, message = null } = result || {};

      if (!result || (!data && !message)) {
        toast(
          "An unexpected error occurred",
          {
            description:
              "An erro occurred during transcription. please try again.",
          });

      }
      if (data) {
        toast(
          "Generating AI blog post..",
          {
            description:
              "Please wait while we generate your blog post",
          });

        await generateBlogPostAction({
          transcriptions: data.transcriptions,

          userId: data.userId
        });

      }

    }
    // // TODO: your upload / transcribe logic here
    // toast("Uploading…", { description: file!.name });
  };

  return (
    <div>
      {/* Mount once per page or in your root layout */}
      <Toaster />

      <form className="flex flex-col gap-6" onSubmit={handleTranscribe}>
        <div className="flex justify-end items-center gap-1.5">
          <Input
            id="file"
            name="file"
            type="file"
            accept="audio/*,video/*"
            required
          />
          <Button className="bg-purple-600" type="submit">
            Transcribe
          </Button>
        </div>
      </form>
    </div>
  );
}


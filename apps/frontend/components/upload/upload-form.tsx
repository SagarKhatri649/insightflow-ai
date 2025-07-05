"use client"
import { z } from "zod"
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Toaster } from "@/components/ui/sonner"
const schema = z.object({
  file: z
    .instanceof(File, { message: "Invalid file" })
    .refine(
      (file) => file.size <= 20 * 1024 * 1024,
      "File size must not exceed 20MB"
    )
    .refine(
      (file) =>
        file.type.startsWith("audio/") || file.type.startsWith("video/"),
      "File must be an audio or  a  video file"
    ),

});
export default function UploadForm() {
  const { toast } = useToast();

  const handleTranscribe = async (formData: FormData) => {
    // "use server";
    const file = formData.get('file') as File;

    const validateFields = schema.safeParse({
      file
    });

    if (!validateFields.success) {
      console.log("validatedFields", validateFields.error.flatten().fieldErrors);
      toast({
        title: "Something went wrong",
        description:
          validateFields.error.flatten().
            fieldErrors.file?.[0] ??
          "Invalid file",
        variant: "descructive",
      });
    }
  }
};
return (
  <div>
    <form className="flex flex-col gap-6"
      //  onSubmit={handleTranscribe}
      action={handleTranscribe}
    >

      <div className="flex justify-end item-center gap-1.5">
        <Input
          id="file"
          name="file"
          type="file"
          accept="audio/*,video/*"
          required
        />
        <Button className="bg-purple-600">
          Transcribe
        </Button>
      </div>
    </form>
  </div>
);
}
import UploadForm from "@/components/upload/upload-form";

export default function UploadPage() {
  return (
    <section
      id="upload-hero"
      className="min-h-screen flex flex-col items-center justify-start
                 bg-white px-4 py-0"
    >
      <div className="w-full">
        <UploadForm />
      </div>
    </section>
  );
}

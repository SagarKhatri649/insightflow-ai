import UploadForm from "@/components/upload/upload-form";
import YouTubeUrlForm from "@/components/upload/youtube-url-form";

export default function UploadPage() {
  return (
    <>
      <section id="upload-hero" className="w-full bg-white">
        <UploadForm />
      </section>

      <section
        id="upload-youtube"
        aria-label="Import from YouTube"
        className="w-full bg-white px-4 pb-10 sm:px-6 md:pb-14"
      >
        <div className="mx-auto w-full max-w-4xl border-t border-[#dee1e6] pt-8">
          <p className="mb-3 font-heading text-xs font-bold tracking-wider text-[#111111] uppercase">
            Or import from YouTube
          </p>
          <YouTubeUrlForm />
        </div>
      </section>
    </>
  );
}

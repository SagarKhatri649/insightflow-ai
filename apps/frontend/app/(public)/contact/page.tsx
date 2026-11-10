import Link from "next/link";
import LegalPageLayout from "@/components/common/legal-page-layout";

export const metadata = {
  title: "Contact InsightFlow",
  description:
    "Get help with your InsightFlow account, uploads, and workspace.",
};

export default function ContactPage() {
  return (
    <LegalPageLayout
      eyebrow="Get in touch"
      title="Contact InsightFlow"
      description="We are here to help with account questions, upload issues, privacy requests, and feedback about your workspace."
      updated="November 6, 2026"
    >
      <div className="not-prose mb-12 grid gap-5 sm:grid-cols-2">
        <a
          href="mailto:insightflowai@gmail.com"
          className="group rounded-xl border border-[#a7f3d0] bg-[#ecfdf5] p-6 transition-shadow hover:shadow-sm sm:p-7"
        >
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-[#064e3b]">
            Email support
          </p>
          <p className="break-all text-lg font-bold tracking-[-0.01em] text-[#064e3b] group-hover:underline group-hover:underline-offset-4">
            insightflowai@gmail.com
          </p>
          <p className="mt-2 text-sm leading-6 text-[#5f6368]">
            Send us the details of your question and we will review it.
          </p>
        </a>
        <div className="rounded-xl border border-[#dee1e6] bg-white p-6 sm:p-7">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-[#064e3b]">
            Helpful details
          </p>
          <p className="text-sm leading-7 text-[#5f6368]">
            Include the account email you use with InsightFlow, the workspace
            item involved, and any error message that appeared. Please do not
            send passwords or API keys.
          </p>
        </div>
      </div>

      <h2>What can we help with?</h2>
      <ul>
        <li>Account access and sign-in questions.</li>
        <li>Upload, transcription, or summary problems.</li>
        <li>Questions about transcripts, insights, or workspace data.</li>
        <li>Privacy, data deletion, or content concerns.</li>
        <li>Product feedback and partnership inquiries.</li>
      </ul>

      <h2>Explore InsightFlow</h2>
      <p>
        If you are ready to try the product, you can return to the{" "}
        <Link
          href="/"
          className="font-semibold text-[#064e3b] underline underline-offset-4"
        >
          InsightFlow home page
        </Link>
        .
      </p>
    </LegalPageLayout>
  );
}

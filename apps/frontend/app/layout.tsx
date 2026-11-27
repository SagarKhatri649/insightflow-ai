import type { Metadata } from "next";
import "./globals.css";
import { JetBrains_Mono, Plus_Jakarta_Sans } from "next/font/google";

import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import { ORIGIN_URL } from "@/lib/constants";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans-body",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-code",
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "InsightFlow-AI: Multilingual Video Insight Platform",
  description:
    "InsightFlow-AI lets users upload or link Indian and English videos, generate summaries, search transcripts, ask AI questions, and export PDFs.",

  icons: {
    icon: "/icon.ico",
  },
  metadataBase: new URL(ORIGIN_URL),

  alternates: {
    canonical: ORIGIN_URL,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        className={`${plusJakartaSans.variable} ${jetbrainsMono.variable}`}
      >
        <body className="bg-white font-sans text-[#111111] antialiased scroll-smooth">
          {children}
          <Toaster richColors position="top-center" />
        </body>
      </html>
    </ClerkProvider>
  );
}

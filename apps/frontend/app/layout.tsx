import type { Metadata } from "next";
import "./globals.css";
import { DM_Sans, Inter } from "next/font/google";

import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import { ORIGIN_URL } from "@/lib/constants";
// import { Component } from "lucide-react";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "InsightFlow-AI: Multilingual Video Insight Platform",
  description:
    "InsightFlow-AI lets users upload or link Indian and English videos, generate summaries, create chapter-wise timestamps, ask questions with AI responses, and interact prompts.",

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
      <html lang="en" className={`${inter.variable} ${dmSans.variable}`}>
        <body className="font-sans antialiased bg-background text-foreground scroll-smooth">
          {children}
          <Toaster richColors position="top-center" />
        </body>
      </html>
    </ClerkProvider>
  );
}

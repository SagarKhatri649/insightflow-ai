import type { Metadata } from "next";
import "./globals.css";
import { Source_Sans_3 } from 'next/font/google';

import Header from '../components/common/header';
import Footer from '../components/common/footer';
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import { ORIGIN_URL } from "@/lib/constants";
// import { Component } from "lucide-react";

const sourceSans = Source_Sans_3({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "InsightFlow-AI: Multilingual Video Insight Platform",
  description: "InsightFlow-AI lets users upload or link Indian and English videos, generate summaries, create chapter-wise timestamps, ask questions with AI responses, and interact prompts.",

  icons: {
    icon: '/icon.ico'
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
      <html lang="en" className={`${sourceSans.variable} dark`} >
        <body className={`${sourceSans.variable} font-sans antialiased bg-background text-foreground scroll-smooth`} >

          <div className="relative flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Toaster />
            <Footer />
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}

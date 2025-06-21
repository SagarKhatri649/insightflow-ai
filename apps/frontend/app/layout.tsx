import type { Metadata } from "next";
import { Source_Sans_3 as FontSans } from "next/font/google";
import "./globals.css";

import Header from '../components/common/header';
import Footer from '../components/common/footer';
// import { Component } from "lucide-react";

const fontSans = FontSans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ['200', '300', '400', '500', '600', '700', '800', '900']
});

export const metadata: Metadata = {
  title: "InsightFlow-AI: Multilingual Video Insight Platform",
  description: "InsightFlow-AI lets users upload or link Indian and English videos, generate summaries, create chapter-wise timestamps, ask questions with AI responses, and interact prompts.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" >
      <body className={`${fontSans.variable} font-sans antialiased bg-background text-foreground`}>

        <div className="relative flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}

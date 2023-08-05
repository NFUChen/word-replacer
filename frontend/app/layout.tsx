import "./globals.css";
import { Inter } from "next/font/google";
import { Metadata } from "next";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/core/common/ThemeProvider";
import React from "react";
import { Header } from "@/components/core/home/Header";
import { SWRProvider } from "@/components/core/common/SWRProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "首頁 - 文案校正",
  description: "首頁 - 文案校正",
};

interface IRootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: IRootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <div className="fixed w-screen h-screen z-[-99]">
          <svg
            className="stroke-zinc-300/10 dark:stroke-zinc-900/20"
            width="100%"
            height="100%"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern id="smallGrid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" strokeWidth="0.5" />
              </pattern>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <rect width="10" height="10" fill="url(#smallGrid)" />
                <path d="M 10 0 L 0 0 0 10" fill="none" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
        <SWRProvider>
          <ThemeProvider attribute="class" defaultTheme="light">
            <Header />
            {children}
            <Toaster />
          </ThemeProvider>
        </SWRProvider>
      </body>
    </html>
  );
}

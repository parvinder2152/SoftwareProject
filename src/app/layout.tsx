import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import SiteNav from "@/components/site-nav";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "CEH | Campus Event Hub",
  description:
    "Discover, organize, and manage campus events with one student-friendly platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={spaceGrotesk.variable}>
      <body className="min-h-screen bg-white text-slate-900 antialiased">
        <div className="min-h-screen bg-transparent">
          <SiteNav />
          <main className="mx-auto w-full max-w-6xl px-6 pb-16 pt-10">{children}</main>
          <footer className="border-t border-sky-100 bg-white/70 py-6 text-center text-xs text-slate-500">
            Campus Event Hub
          </footer>
        </div>
      </body>
    </html>
  );
}

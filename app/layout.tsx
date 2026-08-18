import type { Metadata } from "next";
import Script from "next/script";
import { Inter, JetBrains_Mono } from "next/font/google";
import { HeaderNav } from "@/components/HeaderNav";
import { SiteFooter } from "@/components/SiteFooter";
import { AgeVerificationModal } from "@/components/AgeVerificationModal";
import { GlobalAdScripts } from "@/components/GlobalAdScripts";
import "./globals.css";

const body = Inter({ subsets: ["latin"], variable: "--font-body" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://xhub-hd.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "XHub HD — Free High-Density Adult Media Portal",
    template: "%s | XHub HD",
  },
  description:
    "Watch thousands of high-definition videos for free on XHub HD. Ultra-fast playback, high retention catalog, and no account required.",
  openGraph: {
    type: "website",
    siteName: "XHub HD",
    url: SITE_URL,
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${body.variable} ${mono.variable} dark`}>
      <head>
        <link rel="dns-prefetch" href="https://eporner.com" />
        <link rel="preconnect" href="https://eporner.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://www.eporner.com" />
        <link rel="preconnect" href="https://www.eporner.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen bg-[#0B0B0C] font-body text-white antialiased flex flex-col selection:bg-[#FF9900] selection:text-black">
        {/* Zero-CLS Age Verification Gate Modal */}
        <AgeVerificationModal />

        {/* Global Navigation Bar */}
        <HeaderNav />

        {/* Main Content Area */}
        <main className="flex-1 w-full max-w-[1700px] mx-auto px-4 pt-4 pb-6 sm:px-6">
          {children}
        </main>

        {/* Site Footer */}
        <SiteFooter />

        {/* Dynamic Global Ads (Popunder & Social Bar) */}
        <GlobalAdScripts />
      </body>
    </html>
  );
}

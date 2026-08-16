import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { HeaderNav } from "@/components/HeaderNav";
import { SiteFooter } from "@/components/SiteFooter";
import { AgeVerificationModal } from "@/components/AgeVerificationModal";
import { AdSlot } from "@/components/AdSlot";
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
      <body className="min-h-screen bg-[#0B0B0C] font-body text-white antialiased flex flex-col selection:bg-[#FF9900] selection:text-black">
        {/* Zero-CLS Age Verification Gate Modal */}
        <AgeVerificationModal />

        {/* Global Navigation Bar */}
        <HeaderNav />

        {/* Top Header Leaderboard Ad (Fixed 728x90) */}
        <div className="mx-auto w-full max-w-[1700px] px-4 pt-3 sm:px-6">
          <AdSlot name="header-leaderboard" />
        </div>

        {/* Main Content Area */}
        <main className="flex-1 w-full max-w-[1700px] mx-auto px-4 py-4 sm:px-6">
          {children}
        </main>

        {/* Sticky Floating Footer Ad Slot */}
        <AdSlot name="sticky-footer" />

        {/* Site Footer */}
        <SiteFooter />

        {/* Global Ad & Analytics Script Injection */}
        <GlobalAdScripts />
      </body>
    </html>
  );
}

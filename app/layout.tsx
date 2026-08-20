import type { Metadata } from "next";
import Script from "next/script";
import { Inter, JetBrains_Mono } from "next/font/google";
import { HeaderNav } from "@/components/HeaderNav";
import { SiteFooter } from "@/components/SiteFooter";
import { GlobalAdScripts } from "@/components/GlobalAdScripts";
import dynamic from "next/dynamic";

const AgeVerificationModal = dynamic(
  () => import("@/components/AgeVerificationModal").then((mod) => mod.AgeVerificationModal),
  { ssr: false }
);
import "./globals.css";

const body = Inter({ subsets: ["latin"], variable: "--font-body" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

const SITE_URL = "https://xvideoz.dpdns.org";

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
    title: "XHub HD — Free High-Density Adult Media Portal",
    description: "Watch thousands of high-definition videos for free on XHub HD. Ultra-fast playback, high retention catalog, and no account required.",
    url: SITE_URL,
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "XHub HD",
      },
    ],
  },
  twitter: { 
    card: "summary_large_image",
    title: "XHub HD — Free High-Density Adult Media Portal",
    description: "Watch thousands of high-definition videos for free on XHub HD. Ultra-fast playback, high retention catalog, and no account required.",
    images: ["/og-image.jpg"],
  },
  robots: { index: true, follow: true },
  verification: {
    google: "UxjDGj-M2Ls-Cp3IB9jc94Eiy0JHpoGef2PKZxKxAfY",
  },
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "XHub HD",
              url: SITE_URL,
              potentialAction: {
                "@type": "SearchAction",
                target: `${SITE_URL}/catalog?q={search_term_string}`,
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
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

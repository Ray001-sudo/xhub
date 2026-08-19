import Link from "next/link";
import type { Metadata } from "next";
import { getCatalog, getTags } from "@/lib/api";
import { VideoCard } from "@/components/VideoCard";
import { TagCloud } from "@/components/TagCloud";
import { VideoGrid } from "@/components/VideoGrid";

export const metadata: Metadata = {
  title: "XHub HD — Free HD Adult Videos & High-Density Media Site",
  description:
    "Watch thousands of free high-quality HD adult videos on XHub HD. Ultra-dense grid, fast streaming, interactive frame previews, and no sign-up required.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "XHub HD — Free HD Adult Videos & High-Density Media Site",
    description: "Watch thousands of free high-quality HD adult videos on XHub HD. Ultra-dense grid, fast streaming, interactive frame previews, and no sign-up required.",
    url: "/",
    type: "website",
    siteName: "XHub HD",
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
    title: "XHub HD — Free HD Adult Videos & High-Density Media Site",
    description: "Watch thousands of free high-quality HD adult videos on XHub HD. Ultra-dense grid, fast streaming, interactive frame previews, and no sign-up required.",
    images: ["/og-image.jpg"],
  },
};

export const revalidate = 3600;

export default async function HomePage() {
  const [popular, newest, tags] = await Promise.all([
    getCatalog({ page: 1, pageSize: 60, sort: "popular" }),
    getCatalog({ page: 1, pageSize: 24, sort: "newest" }),
    getTags(),
  ]);

  return (
    <div className="flex flex-col gap-8 pb-12">
      {/* Hero Category & Tag Cloud Pills */}
      <section className="rounded-2xl border border-zinc-800 bg-[#161618] p-4 sm:p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4 border-b border-zinc-800 pb-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded bg-[#FF9900] text-black font-mono text-xs font-bold">
                X
              </span>
              XHub HD Media Site
            </h1>
            <p className="mt-1 text-xs text-zinc-400">
              High-density adult video directory · 100% free · Instant 1080p playback
            </p>
          </div>

          <Link
            href="/catalog"
            className="inline-flex items-center justify-center rounded-xl bg-[#FF9900] px-4 py-2 text-xs font-bold text-black uppercase tracking-wider transition-all hover:bg-[#E08600] active:scale-95 shadow-md shadow-[#FF9900]/20"
          >
            Browse Full Catalog ({popular.totalCount || "10,000+"}) →
          </Link>
        </div>

        {/* Tag Interlinking Pill Cloud */}
        <div>
          <span className="block text-[11px] font-bold uppercase tracking-wider text-zinc-500 mb-2">
            Trending Categories & Tags
          </span>
          <TagCloud tags={tags} limit={18} />
        </div>
      </section>

      {/* Fresh New Releases Section */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-[#FF9900] animate-pulse" />
            <h2 className="text-lg font-bold tracking-tight text-white uppercase">
              Fresh New Releases
            </h2>
          </div>
          <Link
            href="/catalog?sort=newest"
            className="text-xs font-semibold text-[#FF9900] hover:underline"
          >
            View All New →
          </Link>
        </div>

        {/* Ultra-Dense Grid Layout */}
        <VideoGrid items={newest.items} />
      </section>

      {/* Most Popular Video Catalog Grid */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-2">
            <svg
              className="h-5 w-5 text-[#FF9900]"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2.5a.75.75 0 01.75.75v3.2a.75.75 0 01-1.5 0V3.25A.75.75 0 0112 2.5zM17.657 6.343a.75.75 0 011.06 0l2.263 2.263a.75.75 0 01-1.06 1.06l-2.263-2.263a.75.75 0 010-1.06zM20.75 12a.75.75 0 01-.75.75h-3.2a.75.75 0 010-1.5h3.2a.75.75 0 01.75.75zM17.657 17.657a.75.75 0 010 1.06l-2.263 2.263a.75.75 0 01-1.06-1.06l2.263-2.263a.75.75 0 011.06 0zM12 20.75a.75.75 0 01-.75-.75v-3.2a.75.75 0 011.5 0v3.2a.75.75 0 01-.75.75zM6.343 17.657a.75.75 0 01-1.06 0l-2.263-2.263a.75.75 0 011.06-1.06l2.263 2.263a.75.75 0 010 1.06zM3.25 12a.75.75 0 01.75-.75h3.2a.75.75 0 010 1.5H4a.75.75 0 01-.75-.75zM6.343 6.343a.75.75 0 010-1.06l2.263-2.263a.75.75 0 111.06 1.06L7.403 6.343a.75.75 0 01-1.06 0z" />
            </svg>
            <h2 className="text-lg font-bold tracking-tight text-white uppercase">
              Most Popular Videos
            </h2>
          </div>
          <Link
            href="/catalog?sort=popular"
            className="text-xs font-semibold text-[#FF9900] hover:underline"
          >
            Explore All Popular →
          </Link>
        </div>

        {/* Dense Grid */}
        <VideoGrid items={popular.items} />
      </section>
    </div>
  );
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getClipBySlug, getRelatedClips } from "@/lib/api";
import { sanitizeSlugParam, formatViewCount } from "@/lib/utils";
import { generateVideoObjectSchema, generatePageMetadata } from "@/lib/seo";
import { VideoPlayer } from "@/components/VideoPlayer";
import { AdSlot } from "@/components/AdSlot";
import { VideoCard } from "@/components/VideoCard";
import { TagCloud } from "@/components/TagCloud";
import { AutoplayToggle } from "@/components/AutoplayToggle";
import { DynamicAdGrid } from "@/components/DynamicAdGrid";

export const revalidate = 3600;

interface WatchPageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: WatchPageProps): Promise<Metadata> {
  const slug = sanitizeSlugParam(params.slug);
  const clip = await getClipBySlug(slug);
  if (!clip) return { title: "Video Not Found" };

  return generatePageMetadata({
    title: clip.title,
    description: `${clip.title} - Watch high quality HD video online for free on XHub HD. Views: ${formatViewCount(clip.views)}.`,
    path: `/watch/${clip.slug}`,
    image: clip.thumbnailUrl,
  });
}

export default async function WatchPage({ params }: WatchPageProps) {
  const slug = sanitizeSlugParam(params.slug);
  const clip = await getClipBySlug(slug);
  if (!clip) notFound();

  const related = await getRelatedClips(clip.tags, clip.slug);
  const jsonLd = generateVideoObjectSchema(clip);

  return (
    <div className="flex flex-col gap-6 py-4">
      {/* Schema.org VideoObject JSON-LD Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Top Controls Bar */}
      <div className="flex items-center justify-between">
        <Link
          href="/catalog"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-400 hover:text-[#FF9900]"
        >
          ← Back to Catalog
        </Link>
        <AutoplayToggle />
      </div>

      {/* Main Layout Grid: Player + Sidebars + Recommended Rail */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        {/* Left Column: Player & Metadata */}
        <div className="flex flex-col gap-4">
          {/* Player flanked by 300x250 ad units on Desktop */}
          <div className="flex flex-col gap-4 xl:flex-row xl:items-start">
            {/* Desktop Left Ad Sidebar (300x250) */}
            <AdSlot
              name="player-sidebar-left"
              className="hidden xl:flex shrink-0 w-[300px]"
            />

            {/* Video Player */}
            <div className="min-w-0 flex-1 flex flex-col gap-4">
              <VideoPlayer clip={clip} />

              {/* Title & Stats */}
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-white leading-tight">
                  {clip.title}
                </h1>

                <div className="mt-2 flex flex-wrap items-center gap-3 font-mono text-xs text-zinc-400 border-b border-zinc-800 pb-3">
                  <span className="font-bold text-white">
                    {formatViewCount(clip.views)} views
                  </span>
                  <span>•</span>
                  <span>Duration: {clip.duration}</span>
                  {clip.rating && (
                    <>
                      <span>•</span>
                      <span className="text-[#FF9900] font-bold">
                        Rating: {clip.rating}
                      </span>
                    </>
                  )}
                  <span className="ml-auto rounded bg-[#FF9900] px-2 py-0.5 text-[10px] font-extrabold text-black">
                    1080p HD
                  </span>
                </div>
              </div>

              {/* Interlinking Tag Cloud */}
              {clip.tags.length > 0 && (
                <div className="flex flex-col gap-2 pt-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">
                    Video Categories & Related Tags
                  </span>
                  <TagCloud tags={clip.tags} />
                </div>
              )}

              {/* Below Player Native Ad Slot */}
              <div className="pt-2">
                <AdSlot name="below-player-native" />
              </div>
            </div>

            {/* Desktop Right Ad Sidebar (300x250) */}
            <AdSlot
              name="player-sidebar-right"
              className="hidden xl:flex shrink-0 w-[300px]"
            />
          </div>
        </div>

        {/* Recommended Videos Sidebar (Desktop 2-column or Mobile grid) */}
        <aside className="flex flex-col gap-3">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-white flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[#FF9900]" />
              Up Next / Recommended
            </h2>
          </div>

          <div>
            <DynamicAdGrid items={related} frequency={6} adFormat="native" />
          </div>
        </aside>
      </div>
    </div>
  );
}

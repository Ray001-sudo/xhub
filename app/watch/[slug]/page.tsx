import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getClipBySlug, getRelatedClips } from "@/lib/api";
import { sanitizeSlugParam, formatViewCount } from "@/lib/utils";
import { generateVideoObjectSchema, generatePageMetadata } from "@/lib/seo";
import VideoPlayerFacade from "@/components/VideoPlayerFacade";
import { VideoCard } from "@/components/VideoCard";
import { TagCloud } from "@/components/TagCloud";
import { AutoplayToggle } from "@/components/AutoplayToggle";
import { VideoGrid } from "@/components/VideoGrid";
import { AdsterraRectangleDynamic } from "@/components/AdsterraRectangleDynamic";

export const revalidate = 3600;

interface WatchPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: WatchPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = sanitizeSlugParam(resolvedParams.slug);
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
  const resolvedParams = await params;
  const slug = sanitizeSlugParam(resolvedParams.slug);
  const clip = await getClipBySlug(slug);
  if (!clip) notFound();

  const related = await getRelatedClips(clip.tags, clip.slug);
  const jsonLd = generateVideoObjectSchema(clip);

  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto px-4 py-6 w-full">
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

      {/* Main Layout: Player Stack */}
      <div className="flex flex-col gap-8 w-full">
        {/* Top Section: Player & Metadata */}
        <div className="flex flex-col gap-4">

            {/* Video Player */}
            <div className="min-w-0 flex-1 flex flex-col gap-4">
              {clip.embedUrl ? (
                <VideoPlayerFacade embedUrl={clip.embedUrl} posterUrl={clip.thumbnailUrl} title={clip.title} />
              ) : (
                <div className="flex aspect-video w-full items-center justify-center rounded-xl border border-zinc-800 bg-black">
                  <p className="font-mono text-sm text-zinc-500">Clip unavailable — embed could not be verified.</p>
                </div>
              )}

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
            </div>
        </div>
        
        {/* Adsterra Rectangle Ad */}
        <AdsterraRectangleDynamic />

        {/* Recommended Videos Grid */}
        <section className="flex flex-col gap-4 mt-6">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-white flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[#FF9900]" />
              Up Next / Recommended
            </h2>
          </div>

          <div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mt-2">
              {related.map((clip, i) => (
                <VideoCard key={clip.id} clip={clip} priority={i < 6} />
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

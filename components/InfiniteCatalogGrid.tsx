"use client";

import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import type { SortOption, VideoClip } from "@/lib/types";
import { VideoCard } from "./VideoCard";
import { GameCardSkeleton } from "./Skeletons";
import { AdSlot } from "./AdSlot";

interface InfiniteCatalogGridProps {
  initialItems: VideoClip[];
  initialHasNextPage: boolean;
  search: string;
  tag: string;
  sort: SortOption;
}

export function InfiniteCatalogGrid({
  initialItems,
  initialHasNextPage,
  search,
  tag,
  sort,
}: InfiniteCatalogGridProps) {
  const [items, setItems] = useState<VideoClip[]>(initialItems);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(initialHasNextPage);
  const [isLoading, setIsLoading] = useState(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setItems(initialItems);
    setPage(1);
    setHasNextPage(initialHasNextPage);
  }, [initialItems, initialHasNextPage]);

  const loadNextPage = useCallback(async () => {
    if (isLoading || !hasNextPage) return;
    setIsLoading(true);
    try {
      const nextPage = page + 1;
      const params = new URLSearchParams({
        page: String(nextPage),
        search,
        tag,
        sort,
      });
      const res = await fetch(`/api/search?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to load more videos");
      const data: { items: VideoClip[]; hasNextPage: boolean } = await res.json();
      setItems((prev) => [...prev, ...data.items]);
      setHasNextPage(data.hasNextPage);
      setPage(nextPage);
    } catch (err) {
      console.error(err);
      setHasNextPage(false);
    } finally {
      setIsLoading(false);
    }
  }, [hasNextPage, isLoading, page, search, sort, tag]);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadNextPage();
      },
      { rootMargin: "600px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [loadNextPage]);

  if (items.length === 0 && !isLoading) {
    return (
      <div className="rounded-2xl border border-dashed border-zinc-800 bg-[#161618] p-12 text-center">
        <p className="text-lg font-bold text-white">No videos matched your criteria.</p>
        <p className="mt-2 text-xs text-zinc-400">
          Try adjusting your search terms or clearing tag filters.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* High-density grid: Mobile 2, Tablet 3, Desktop 5, 1080p+ 6 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-4">
        {items.map((clip, i) => (
          <Fragment key={clip.id}>
            <VideoCard clip={clip} priority={i < 6} />
            {/* Native ad every 12 cards, blended into grid */}
            {(i + 1) % 12 === 0 && (
              <div className="col-span-full py-2">
                <AdSlot name="in-grid-native" />
              </div>
            )}
          </Fragment>
        ))}
        {isLoading &&
          Array.from({ length: 6 }).map((_, i) => (
            <GameCardSkeleton key={`skeleton-${i}`} />
          ))}
      </div>

      {hasNextPage && <div ref={sentinelRef} className="h-12 w-full" aria-hidden="true" />}
      {!hasNextPage && items.length > 0 && (
        <p className="py-6 text-center font-mono text-xs text-zinc-500">
          You&apos;ve reached the end of the catalog.
        </p>
      )}
    </div>
  );
}

export default InfiniteCatalogGrid;

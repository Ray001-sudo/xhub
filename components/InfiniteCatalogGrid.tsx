"use client";

import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import type { SortOption, VideoClip } from "@/lib/types";
import { GameCardSkeleton } from "./Skeletons";
import { VideoGrid } from "./VideoGrid";

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
  
  // Optional toggle for infinite scroll. Defaults to false (Numbered Pagination mode)
  const [isInfiniteMode, setIsInfiniteMode] = useState(false);
  
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
        q: search,
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

  // Pre-fetch Page N+1 when idle
  useEffect(() => {
    if (!hasNextPage || isLoading) return;
    
    const prefetchNextPage = () => {
      const nextPage = page + 1;
      const params = new URLSearchParams({
        page: String(nextPage),
        q: search,
        tag,
        sort,
      });
      // Background non-blocking fetch to populate browser HTTP cache
      fetch(`/api/search?${params.toString()}`, { priority: "low" }).catch(() => {});
    };

    if (typeof window !== "undefined" && 'requestIdleCallback' in window) {
      requestIdleCallback(prefetchNextPage);
    } else {
      const timeoutId = setTimeout(prefetchNextPage, 2000);
      return () => clearTimeout(timeoutId);
    }
  }, [page, hasNextPage, isLoading, search, sort, tag]);

  useEffect(() => {
    if (!isInfiniteMode) return;
    
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
  }, [loadNextPage, isInfiniteMode]);

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
      {/* View Mode Toggle */}
      <div className="flex justify-end px-2">
        <button
          onClick={() => setIsInfiniteMode(!isInfiniteMode)}
          className="text-xs font-semibold text-zinc-400 hover:text-white transition-colors flex items-center gap-2"
        >
          {isInfiniteMode ? "Disable Infinite Scroll" : "Enable Infinite Scroll"}
          <div className={`w-8 h-4 rounded-full p-0.5 transition-colors ${isInfiniteMode ? 'bg-[#FF9900]' : 'bg-zinc-700'}`}>
            <div className={`w-3 h-3 rounded-full bg-white transition-transform ${isInfiniteMode ? 'translate-x-4' : 'translate-x-0'}`} />
          </div>
        </button>
      </div>

      {/* High-density grid */}
      <div>
        <VideoGrid items={items} />
        {isLoading && isInfiniteMode && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-4 mt-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <GameCardSkeleton key={`skeleton-${i}`} />
            ))}
          </div>
        )}
      </div>

      {isInfiniteMode && hasNextPage && (
        <div ref={sentinelRef} className="flex justify-center py-8">
          <button
            onClick={loadNextPage}
            disabled={isLoading}
            className="rounded-full bg-[#161618] border border-zinc-800 px-6 py-2.5 text-sm font-bold text-white hover:border-[#FF9900] hover:text-[#FF9900] transition-all disabled:opacity-50"
          >
            {isLoading ? "Loading..." : "Load More Videos"}
          </button>
        </div>
      )}
      
      {isInfiniteMode && !hasNextPage && items.length > 0 && (
        <p className="py-6 text-center font-mono text-xs text-zinc-500">
          You&apos;ve reached the end of the catalog.
        </p>
      )}
    </div>
  );
}

export default InfiniteCatalogGrid;

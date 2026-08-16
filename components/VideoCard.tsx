"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import type { VideoClip } from "@/lib/types";
import { formatViewCount } from "@/lib/utils";
import { useFavorites } from "@/hooks/useFavorites";

interface VideoCardProps {
  clip: VideoClip;
  priority?: boolean;
}

const POSITIONS = [
  "object-center",
  "object-top",
  "object-bottom",
  "object-left",
  "object-right",
];

export function VideoCard({ clip, priority = false }: VideoCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [frameIndex, setFrameIndex] = useState(0);
  const { isFavorite, toggleFavorite, isLoaded } = useFavorites();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const prefetchTimerRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();

  const favorited = isLoaded && isFavorite(clip.id);

  // Start animated frame scrubber on hover
  useEffect(() => {
    if (isHovered) {
      setFrameIndex(0);
      intervalRef.current = setInterval(() => {
        setFrameIndex((prev) => (prev + 1) % POSITIONS.length);
      }, 600);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setFrameIndex(0);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (prefetchTimerRef.current) clearTimeout(prefetchTimerRef.current);
    };
  }, [isHovered]);

  const handleMouseEnter = () => {
    setIsHovered(true);
    prefetchTimerRef.current = setTimeout(() => {
      router.prefetch(`/watch/${clip.slug}`);
    }, 100);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (prefetchTimerRef.current) clearTimeout(prefetchTimerRef.current);
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(clip);
  };

  const scrubProgress = ((frameIndex + 1) / POSITIONS.length) * 100;

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border border-zinc-800 bg-[#161618] transition-all duration-300 hover:border-[#FF9900]/50 hover:bg-[#222225] hover:shadow-lg hover:shadow-[#FF9900]/10">
      <Link
        href={`/watch/${clip.slug}`}
        prefetch={true}
        className="block relative w-full"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* 16:9 Aspect Ratio Thumbnail Container */}
        <div className="relative aspect-video w-full overflow-hidden bg-zinc-900">
          <Image
            src={clip.thumbnailUrl}
            alt={clip.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, (max-width: 1536px) 20vw, 16vw"
            loading={priority ? "eager" : "lazy"}
            className={`object-cover transition-transform duration-500 ease-out ${
              POSITIONS[frameIndex]
            } ${isHovered ? "scale-110" : "scale-100"}`}
          />

          {/* Dark Overlay Gradient */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 transition-opacity group-hover:opacity-40" />

          {/* Top-Left Rating / HD Badge */}
          <div className="absolute left-2 top-2 flex items-center gap-1.5">
            <span className="rounded bg-[#FF9900] px-1.5 py-0.5 font-mono text-[10px] font-extrabold uppercase text-black shadow-sm">
              HD
            </span>
            {clip.rating && (
              <span className="rounded bg-black/80 px-1.5 py-0.5 font-mono text-[10px] font-bold text-[#FF9900] backdrop-blur-sm border border-zinc-800">
                {clip.rating}
              </span>
            )}
          </div>

          {/* Heart Icon Button */}
          <button
            type="button"
            onClick={handleFavoriteClick}
            aria-label={favorited ? "Remove from favorites" : "Add to favorites"}
            className="absolute right-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm transition-all hover:scale-110 hover:bg-black/90 active:scale-95"
          >
            <svg
              className={`h-4 w-4 transition-colors ${
                favorited ? "fill-[#FF9900] text-[#FF9900]" : "fill-none stroke-white stroke-2"
              }`}
              viewBox="0 0 24 24"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </button>

          {/* Bottom-Right Duration Badge */}
          {clip.duration && (
            <span className="absolute bottom-2 right-2 rounded bg-black/80 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-white backdrop-blur-sm">
              {clip.duration}
            </span>
          )}

          {/* Animated Hover Scrub Bar */}
          {isHovered && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-zinc-800/80">
              <div
                className="h-full bg-[#FF9900] transition-all duration-300"
                style={{ width: `${scrubProgress}%` }}
              />
            </div>
          )}
        </div>

        {/* Card Content Details */}
        <div className="flex flex-1 flex-col justify-between p-2.5">
          <h3 className="line-clamp-2 text-xs sm:text-sm font-semibold leading-tight text-white transition-colors group-hover:text-[#FF9900]">
            {clip.title}
          </h3>

          <div className="mt-2 flex items-center justify-between text-[11px] font-medium text-zinc-400">
            <span>{formatViewCount(clip.views)} views</span>
            {clip.tags && clip.tags.length > 0 && (
              <span className="truncate max-w-[100px] text-[10px] text-zinc-500 uppercase tracking-wide">
                {clip.tags[0]}
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}

export default VideoCard;

"use client";

import { useState } from "react";
import Image from "next/image";
import type { VideoClip } from "@/lib/types";

/**
 * VideoPlayer
 * -----------------------------------------------------------------------
 * Renders a partner-API-provided clip inside a responsive 16:9 box.
 *
 * Security note: this component takes the whole `VideoClip` but only ever
 * reads `clip.embedUrl` — the pre-validated, allow-listed URL produced by
 * `lib/api.ts#sanitizeEmbedHtml`. It never touches `clip.embedHtml` (the
 * partner's raw <iframe> string). We build our own <iframe> from scratch
 * with a locked-down `sandbox` attribute, so none of the partner's original
 * markup or attributes — trusted or not — ever reaches the DOM directly.
 */
export function VideoPlayer({ clip }: { clip: VideoClip }) {
  const [isPlaying, setIsPlaying] = useState(false);

  if (!clip.embedUrl) {
    return (
      <div className="flex aspect-video w-full items-center justify-center rounded-xl border border-line bg-surface">
        <p className="font-mono text-sm text-ink-muted">Clip unavailable — embed could not be verified.</p>
      </div>
    );
  }

  // Append autoplay=1 to the embed URL when we load it so it plays immediately after user click
  const embedSrc = clip.embedUrl.includes("?") ? `${clip.embedUrl}&autoplay=1` : `${clip.embedUrl}?autoplay=1`;

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-line bg-black shadow-glow group">
      {!isPlaying ? (
        <button 
          onClick={() => setIsPlaying(true)} 
          className="absolute inset-0 w-full h-full flex items-center justify-center cursor-pointer"
          aria-label="Play Video"
        >
          <Image
            src={clip.thumbnailUrl}
            alt={clip.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            priority
            unoptimized={true}
            sizes="(max-width: 1700px) 100vw, 1700px"
          />
          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
          <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-[#FF9900] shadow-lg transition-transform group-hover:scale-110">
            <svg className="h-8 w-8 text-black ml-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </button>
      ) : (
        <iframe
          src={embedSrc}
          title={`${clip.title} — clip player`}
          className="absolute inset-0 h-full w-full border-0"
          sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
          allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
          referrerPolicy="no-referrer"
          allowFullScreen
        />
      )}
    </div>
  );
}

import React from "react";
import type { VideoClip } from "@/lib/types";
import { VideoCard } from "./VideoCard";
import AdsterraNative from "./AdsterraNative";

interface VideoGridProps {
  items: VideoClip[];
}

export function VideoGrid({ items }: VideoGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-4">
      {items.map((clip, i) => (
        <React.Fragment key={clip.id}>
          <VideoCard clip={clip} priority={i < 6} />
          {(i + 1) % 9 === 0 && <AdsterraNative instanceId={`native-${clip.id}-${i}`} />}
        </React.Fragment>
      ))}
    </div>
  );
}

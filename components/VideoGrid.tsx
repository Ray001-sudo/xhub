import React from "react";
import type { VideoClip, GridVideoClip } from "@/lib/types";
import { VideoCard } from "./VideoCard";
import { AdsterraNativeDynamic } from './AdsterraNativeDynamic';

interface VideoGridProps {
  items: GridVideoClip[] | VideoClip[];
}

export function VideoGrid({ items }: VideoGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-4">
      {items.map((clip, i) => (
        <React.Fragment key={clip.id}>
          <VideoCard clip={clip} priority={i < 6} isLcp={i === 0} />
          {(i + 1) % 9 === 0 && <AdsterraNativeDynamic instanceId={`native-${clip.id}-${i}`} />}
        </React.Fragment>
      ))}
    </div>
  );
}

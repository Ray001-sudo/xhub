import type { VideoClip } from "@/lib/types";
import { VideoCard } from "./VideoCard";

interface VideoGridProps {
  items: VideoClip[];
}

export function VideoGrid({ items }: VideoGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-4">
      {items.map((clip, i) => (
        <VideoCard key={clip.id} clip={clip} priority={i < 6} />
      ))}
    </div>
  );
}

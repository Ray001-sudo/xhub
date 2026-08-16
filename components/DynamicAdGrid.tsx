"use client";

import { Fragment } from "react";
import type { VideoClip } from "@/lib/types";
import { VideoCard } from "./VideoCard";
import { AdNativeBanner } from "./AdNativeBanner";
import { AdBanner300x250 } from "./AdBanner300x250";

interface DynamicAdGridProps {
  items: VideoClip[];
  frequency?: number;
  adFormat?: "native" | "300x250";
}

export function DynamicAdGrid({
  items,
  frequency = 6,
  adFormat = "native",
}: DynamicAdGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-4">
      {items.map((clip, i) => (
        <Fragment key={clip.id}>
          <VideoCard clip={clip} priority={i < 6} />
          {(i + 1) % frequency === 0 && (
            <div className="col-span-full py-2 flex justify-center">
              {adFormat === "native" ? <AdNativeBanner /> : <AdBanner300x250 />}
            </div>
          )}
        </Fragment>
      ))}
    </div>
  );
}

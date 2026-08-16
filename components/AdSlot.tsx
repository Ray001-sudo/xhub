"use client";

import { useState } from "react";
import { AdNativeBanner } from "./AdNativeBanner";
import { AdBanner300x250 } from "./AdBanner300x250";

export type AdSlotName =
  | "header-leaderboard"
  | "catalog-leaderboard"
  | "player-sidebar-left"
  | "player-sidebar-right"
  | "below-player-native"
  | "in-grid-native"
  | "sticky-footer";

export function AdSlot({
  name,
  className = "",
}: {
  name: AdSlotName | string;
  className?: string;
}) {
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) return null;

  if (name === "sticky-footer") {
    return (
      <div className={`fixed bottom-0 left-0 right-0 z-30 flex items-center justify-center bg-[#0B0B0C]/90 p-2 backdrop-blur-md border-t border-zinc-800 shadow-2xl ${className}`}>
        <div className="relative flex w-full max-w-[728px] items-center justify-center rounded-lg bg-[#161618]">
          <AdNativeBanner />
          <button
            type="button"
            onClick={() => setIsDismissed(true)}
            className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-[#FF9900] text-black font-bold text-xs shadow hover:bg-[#E08600] z-10"
            aria-label="Close Ad"
          >
            ✕
          </button>
        </div>
      </div>
    );
  }

  if (name === "player-sidebar-left" || name === "player-sidebar-right") {
    return (
      <div className={className}>
        <AdBanner300x250 />
      </div>
    );
  }

  return (
    <div className={className}>
      <AdNativeBanner />
    </div>
  );
}

export default AdSlot;

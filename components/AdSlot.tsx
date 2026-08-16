"use client";

import { useState } from "react";

export type AdSlotName =
  | "header-leaderboard"
  | "catalog-leaderboard"
  | "player-sidebar-left"
  | "player-sidebar-right"
  | "below-player-native"
  | "in-grid-native"
  | "sticky-footer";

interface AdSpec {
  width: number;
  height: number;
  label: string;
}

const AD_SPECS: Record<AdSlotName, AdSpec> = {
  "header-leaderboard": { width: 728, height: 90, label: "Leaderboard 728x90" },
  "catalog-leaderboard": { width: 728, height: 90, label: "Leaderboard 728x90" },
  "player-sidebar-left": { width: 300, height: 250, label: "Medium Rectangle 300x250" },
  "player-sidebar-right": { width: 300, height: 250, label: "Medium Rectangle 300x250" },
  "below-player-native": { width: 0, height: 100, label: "Native Content Banner" },
  "in-grid-native": { width: 0, height: 120, label: "Native Catalog Ad" },
  "sticky-footer": { width: 728, height: 90, label: "Sticky Banner 728x90" },
};

export function AdSlot({
  name,
  className = "",
}: {
  name: AdSlotName;
  className?: string;
}) {
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) return null;

  const spec = AD_SPECS[name];
  const isFixedSize = spec.width > 0;

  if (name === "sticky-footer") {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-30 flex items-center justify-center bg-[#0B0B0C]/90 p-2 backdrop-blur-md border-t border-zinc-800 shadow-2xl">
        <div className="relative flex w-full max-w-[728px] items-center justify-center rounded-lg border border-dashed border-zinc-800 bg-[#161618] py-2 px-4 text-xs font-mono text-zinc-500">
          <span>SPONSORED ADVERTISEMENT (728x90)</span>
          <button
            type="button"
            onClick={() => setIsDismissed(true)}
            className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-[#FF9900] text-black font-bold text-xs shadow hover:bg-[#E08600]"
            aria-label="Close Ad"
          >
            ✕
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      data-ad-slot={name}
      data-ad-size={isFixedSize ? `${spec.width}x${spec.height}` : "native"}
      aria-hidden="true"
      className={`ad-slot mx-auto flex w-full items-center justify-center overflow-hidden rounded-xl border border-dashed border-zinc-800 bg-[#161618]/70 text-center text-xs font-mono uppercase tracking-wider text-zinc-500 ${className}`}
      style={
        isFixedSize
          ? { maxWidth: spec.width, minHeight: spec.height }
          : { minHeight: spec.height || 100 }
      }
    >
      <div className="flex flex-col items-center gap-1 p-3">
        <span className="rounded bg-zinc-800/80 px-2 py-0.5 text-[10px] text-[#FF9900] font-bold">
          ADVERTISEMENT
        </span>
        <span className="text-[11px] text-zinc-400">{spec.label}</span>
      </div>
    </div>
  );
}

export default AdSlot;

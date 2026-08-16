"use client";

import { useState } from "react";
import { AdNativeBanner } from "./AdNativeBanner";

export function StickyFooter() {
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-black/90 p-2 flex justify-center items-center shadow-lg border-t border-zinc-800 backdrop-blur-md">
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

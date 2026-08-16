"use client";

import { useState } from "react";

export function AutoplayToggle() {
  const [autoplay, setAutoplay] = useState(true);

  return (
    <button
      type="button"
      onClick={() => setAutoplay(!autoplay)}
      className="flex items-center gap-2 rounded-full border border-zinc-800 bg-[#161618] px-3 py-1 text-xs font-semibold text-zinc-300 transition-colors hover:border-[#FF9900]"
    >
      <span>Autoplay Next</span>
      <div
        className={`h-4 w-7 rounded-full p-0.5 transition-colors ${
          autoplay ? "bg-[#FF9900]" : "bg-zinc-700"
        }`}
      >
        <div
          className={`h-3 w-3 rounded-full bg-black transition-transform ${
            autoplay ? "translate-x-3" : "translate-x-0"
          }`}
        />
      </div>
    </button>
  );
}

export default AutoplayToggle;

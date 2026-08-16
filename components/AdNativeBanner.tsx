"use client";

import { useEffect, useRef } from "react";

export function AdNativeBanner() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    
    // Prevent multiple injections if re-rendered
    if (containerRef.current.hasChildNodes()) return;

    const script = document.createElement("script");
    script.type = "text/javascript";
    script.async = true;
    script.dataset.cfasync = "false";
    script.src = "https://pl30877898.effectivecpmnetwork.com/086ceec8969172a6a773f12c75c02d0b/invoke.js";

    containerRef.current.appendChild(script);
  }, []);

  return (
    <div className="w-full flex justify-center py-2 min-h-[100px]">
      <div id="container-086ceec8969172a6a773f12c75c02d0b" ref={containerRef}></div>
    </div>
  );
}

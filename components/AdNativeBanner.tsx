"use client";

import { useEffect, useRef } from "react";

export function AdNativeBanner() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    
    // Clear existing inner HTML
    containerRef.current.innerHTML = "";

    const target = document.createElement("div");
    target.id = "container-086ceec8969172a6a773f12c75c02d0b";
    containerRef.current.appendChild(target);

    const script = document.createElement("script");
    script.type = "text/javascript";
    script.async = true;
    script.setAttribute("data-cfasync", "false");
    script.src = "https://pl30877898.effectivecpmnetwork.com/086ceec8969172a6a773f12c75c02d0b/invoke.js";

    containerRef.current.appendChild(script);
  }, []);

  return (
    <div className="w-full flex justify-center py-2 min-h-[100px] my-4" ref={containerRef}>
    </div>
  );
}

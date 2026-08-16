"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    atOptions: any;
  }
}

export function AdBanner300x250() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    // Clear existing inner HTML
    containerRef.current.innerHTML = "";

    // Set Adsterra configuration safely
    (window as any).atOptions = {
      key: "2ff57a74a041dca59c83132a424444cc",
      format: "iframe",
      height: 250,
      width: 300,
      params: {}
    };

    const script = document.createElement("script");
    script.type = "text/javascript";
    script.async = true;
    script.src = "https://www.highperformanceformat.com/2ff57a74a041dca59c83132a424444cc/invoke.js";

    containerRef.current.appendChild(script);
  }, []);

  return (
    <div className="w-[300px] h-[250px] mx-auto bg-[#161618] border border-dashed border-zinc-800 rounded-xl overflow-hidden min-h-[250px] min-w-[300px] flex items-center justify-center my-4">
      <div ref={containerRef}></div>
    </div>
  );
}

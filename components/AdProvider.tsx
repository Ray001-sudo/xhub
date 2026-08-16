"use client";

import React, { createContext, useContext, useEffect, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { NEXT_PUBLIC_SMARTLINK_URL } from "@/lib/constants";

const AdContext = createContext({
  smartlinkUrl: NEXT_PUBLIC_SMARTLINK_URL,
});

export function useSmartlink() {
  const context = useContext(AdContext);
  if (!context) {
    throw new Error("useSmartlink must be used within an AdProvider");
  }
  return context;
}

function AdTrackerInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // In a real implementation, you might notify the ad network of a pageview
    // console.log("Route changed, AdProvider tracking:", pathname, searchParams.toString());
  }, [pathname, searchParams]);

  return null;
}

export function AdProvider({ children }: { children: React.ReactNode }) {
  return (
    <AdContext.Provider value={{ smartlinkUrl: NEXT_PUBLIC_SMARTLINK_URL }}>
      <Suspense fallback={null}>
        <AdTrackerInner />
      </Suspense>
      {children}
    </AdContext.Provider>
  );
}

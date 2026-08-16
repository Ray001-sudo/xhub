"use client";

import React, { createContext, useContext, useEffect } from "react";
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

export function AdProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Track route changes for potential ad re-injections or analytics
  useEffect(() => {
    // In a real implementation, you might notify the ad network of a pageview
    // console.log("Route changed, AdProvider tracking:", pathname, searchParams.toString());
  }, [pathname, searchParams]);

  return (
    <AdContext.Provider value={{ smartlinkUrl: NEXT_PUBLIC_SMARTLINK_URL }}>
      {children}
    </AdContext.Provider>
  );
}

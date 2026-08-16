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
  | "in-grid-native";

export function AdSlot({
  name,
  className = "",
}: {
  name: AdSlotName | string;
  className?: string;
}) {
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) return null;

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

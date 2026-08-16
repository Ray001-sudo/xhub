"use client";

import { useState, useEffect, useCallback } from "react";
import type { VideoClip } from "@/lib/types";

const STORAGE_KEY = "xhub_favorites";
const FAVORITES_EVENT = "xhub_favorites_updated";

export function useFavorites() {
  const [favorites, setFavorites] = useState<VideoClip[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load favorites from localStorage
  const loadFavorites = useCallback(() => {
    if (typeof window === "undefined") return;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setFavorites(parsed);
        }
      } else {
        setFavorites([]);
      }
    } catch (e) {
      console.error("[useFavorites] Error reading localStorage:", e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    loadFavorites();

    const handleStorageChange = (e: StorageEvent | CustomEvent) => {
      if ("key" in e && e.key !== STORAGE_KEY) return;
      loadFavorites();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener(FAVORITES_EVENT, handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener(FAVORITES_EVENT, handleStorageChange);
    };
  }, [loadFavorites]);

  const saveFavorites = (newFavs: VideoClip[]) => {
    setFavorites(newFavs);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newFavs));
      window.dispatchEvent(new CustomEvent(FAVORITES_EVENT));
    } catch (e) {
      console.error("[useFavorites] Error saving to localStorage:", e);
    }
  };

  const isFavorite = useCallback(
    (id: string) => favorites.some((item) => item.id === id),
    [favorites]
  );

  const toggleFavorite = useCallback(
    (clip: VideoClip) => {
      if (isFavorite(clip.id)) {
        const updated = favorites.filter((item) => item.id !== clip.id);
        saveFavorites(updated);
      } else {
        const updated = [clip, ...favorites];
        saveFavorites(updated);
      }
    },
    [favorites, isFavorite]
  );

  return {
    favorites,
    count: favorites.length,
    isLoaded,
    isFavorite,
    toggleFavorite,
  };
}

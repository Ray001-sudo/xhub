"use client";

import Link from "next/link";
import { useFavorites } from "@/hooks/useFavorites";
import { VideoCard } from "@/components/VideoCard";

export default function FavoritesPage() {
  const { favorites, count, isLoaded } = useFavorites();

  return (
    <div className="flex flex-col gap-6 py-4">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
        <div>
          <h1 className="text-2xl font-black text-white sm:text-3xl flex items-center gap-2">
            <svg
              className="h-7 w-7 text-[#FF9900]"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            My Saved Favorites
          </h1>
          <p className="mt-1 text-xs text-zinc-400">
            Your saved videos stored locally in your browser. No account required.
          </p>
        </div>

        {isLoaded && count > 0 && (
          <span className="rounded-full bg-[#FF9900] px-3 py-1 font-mono text-xs font-bold text-black">
            {count} Saved
          </span>
        )}
      </div>

      {!isLoaded ? (
        <div className="py-12 text-center text-xs text-zinc-500 font-mono">
          Loading your favorites library...
        </div>
      ) : favorites.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-zinc-800 bg-[#161618] p-12 text-center">
          <p className="text-base font-bold text-white">No favorites saved yet.</p>
          <p className="mt-2 text-xs text-zinc-400">
            Click the heart icon on any video card or watch page to save videos to your personal library.
          </p>
          <Link
            href="/catalog"
            className="mt-6 inline-block rounded-xl bg-[#FF9900] px-5 py-2.5 text-xs font-bold text-black uppercase tracking-wider transition-all hover:bg-[#E08600]"
          >
            Explore Catalog →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-4">
          {favorites.map((clip) => (
            <VideoCard key={clip.id} clip={clip} />
          ))}
        </div>
      )}
    </div>
  );
}

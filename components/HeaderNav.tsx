"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useFavorites } from "@/hooks/useFavorites";

export function HeaderNav() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { count, isLoaded } = useFavorites();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setSearchTerm(searchParams.get("search") || "");
  }, [searchParams]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/catalog?search=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      router.push("/catalog");
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-800 bg-[#0B0B0C]/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1700px] items-center justify-between gap-4 px-4 py-2.5 sm:px-6">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FF9900] font-black text-black shadow-md shadow-[#FF9900]/20 transition-transform group-hover:scale-105">
            <span className="font-mono text-lg leading-none">X</span>
          </div>
          <span className="text-lg font-bold tracking-tight text-white sm:text-xl">
            Hub <span className="text-[#FF9900] font-extrabold">HD</span>
          </span>
        </Link>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="flex max-w-md flex-1 items-center">
          <div className="relative w-full">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search thousands of HD videos..."
              className="w-full rounded-full border border-zinc-800 bg-[#161618] py-1.5 pl-4 pr-10 text-xs text-white placeholder-zinc-500 transition-colors focus:border-[#FF9900] focus:outline-none focus:ring-1 focus:ring-[#FF9900] sm:text-sm"
            />
            <button
              type="submit"
              aria-label="Search"
              className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-zinc-400 hover:text-[#FF9900]"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          </div>
        </form>

        {/* Navigation & Actions */}
        <nav className="flex items-center gap-3 sm:gap-6">
          <Link
            href="/catalog"
            className="hidden text-xs font-semibold uppercase tracking-wider text-zinc-300 transition-colors hover:text-[#FF9900] md:block"
          >
            Catalog
          </Link>
          <Link
            href="/catalog?sort=newest"
            className="hidden text-xs font-semibold uppercase tracking-wider text-zinc-300 transition-colors hover:text-[#FF9900] sm:block"
          >
            New
          </Link>
          <Link
            href="/catalog?sort=top-rated"
            className="hidden text-xs font-semibold uppercase tracking-wider text-zinc-300 transition-colors hover:text-[#FF9900] sm:block"
          >
            Top Rated
          </Link>

          {/* Favorites Tab */}
          <Link
            href="/favorites"
            className="flex items-center gap-1.5 rounded-full border border-zinc-800 bg-[#161618] px-3 py-1.5 text-xs font-semibold text-white transition-all hover:border-[#FF9900] hover:text-[#FF9900]"
          >
            <svg
              className="h-4 w-4 text-[#FF9900]"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            <span className="hidden sm:inline">Favorites</span>
            {isLoaded && count > 0 && (
              <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-[#FF9900] px-1 text-[10px] font-bold text-black">
                {count}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default HeaderNav;

"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { SortOption } from "@/lib/types";

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "popular", label: "Most Popular" },
  { value: "newest", label: "Newest" },
  { value: "top-rated", label: "Top Rated" },
  { value: "alphabetical", label: "A–Z" },
];

/**
 * Client-rendered filter form. Submits via Next.js router to prevent
 * full-page browser refreshes, providing a snappy SPA-like experience
 * while still maintaining shareable URL state (?q=&tag=&sort=).
 */
export function SearchFilters({
  tags,
  currentSearch,
  currentTag,
  currentSort,
}: {
  tags: string[];
  currentSearch: string;
  currentTag: string;
  currentSort: SortOption;
}) {
  const router = useRouter();
  const [search, setSearch] = useState(currentSearch);
  const [tag, setTag] = useState(currentTag);
  const [sort, setSort] = useState<SortOption>(currentSort);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search.trim()) params.set("q", search.trim());
    if (tag) params.set("tag", tag);
    if (sort && sort !== "popular") params.set("sort", sort);

    const query = params.toString();
    router.push(`/catalog${query ? `?${query}` : ""}`);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 rounded-xl border border-zinc-800 bg-[#161618] p-4 sm:flex-row sm:items-center shadow-md"
    >
      <div className="flex-1">
        <label htmlFor="q" className="sr-only">
          Search clips
        </label>
        <input
          id="q"
          name="q"
          type="search"
          maxLength={100}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search thousands of HD videos..."
          className="w-full rounded-lg border border-zinc-700 bg-[#0B0B0C] px-3 py-2 text-sm text-white placeholder-zinc-500 transition-colors focus:border-[#FF9900] focus:outline-none focus:ring-1 focus:ring-[#FF9900]"
        />
      </div>

      <div className="flex flex-wrap gap-3">
        <select
          name="tag"
          value={tag}
          onChange={(e) => setTag(e.target.value)}
          className="rounded-lg border border-zinc-700 bg-[#0B0B0C] px-3 py-2 text-sm text-white transition-colors focus:border-[#FF9900] focus:outline-none focus:ring-1 focus:ring-[#FF9900]"
        >
          <option value="">All Categories</option>
          {tags.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>

        <select
          name="sort"
          value={sort}
          onChange={(e) => setSort(e.target.value as SortOption)}
          className="rounded-lg border border-zinc-700 bg-[#0B0B0C] px-3 py-2 text-sm text-white transition-colors focus:border-[#FF9900] focus:outline-none focus:ring-1 focus:ring-[#FF9900]"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="rounded-lg bg-[#FF9900] px-4 py-2 text-sm font-bold text-black transition-colors hover:bg-[#e68a00]"
        >
          Filter
        </button>
      </div>
    </form>
  );
}

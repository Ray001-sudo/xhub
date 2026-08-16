import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { getCatalog, getTags } from "@/lib/api";
import { sanitizeSearchTerm, sanitizeSort, sanitizeTagParam } from "@/lib/utils";
import { SearchFilters } from "@/components/SearchFilters";
import { InfiniteCatalogGrid } from "@/components/InfiniteCatalogGrid";
import { CatalogGridSkeleton } from "@/components/Skeletons";
import { TagCloud } from "@/components/TagCloud";
import { Pagination } from "@/components/Pagination";

export const revalidate = 3600;

const PAGE_SIZE = 60;

interface CatalogPageProps {
  searchParams: { q?: string; tag?: string; sort?: string; page?: string };
}

export function generateMetadata({ searchParams }: CatalogPageProps): Metadata {
  const search = sanitizeSearchTerm(searchParams.q);
  const tag = sanitizeTagParam(searchParams.tag);
  const parts = ["Free HD Video Catalog", "XHub HD"];
  if (tag) parts.unshift(tag);
  if (search) parts.unshift(`"${search}"`);
  const title = parts.join(" — ");

  return {
    title,
    description: `Watch free ${tag ? `${tag} ` : ""}HD videos on XHub HD. Ultra-fast high-density catalog, sorted by popularity, recency, and ratings.`,
    alternates: {
      canonical: `/catalog${tag ? `?tag=${encodeURIComponent(tag)}` : ""}`,
    },
  };
}

export default async function CatalogPage({ searchParams }: CatalogPageProps) {
  const search = sanitizeSearchTerm(searchParams.q);
  const tag = sanitizeTagParam(searchParams.tag);
  const sort = sanitizeSort(searchParams.sort);
  const pageNum = Math.max(1, Number.parseInt(searchParams.page || "1", 10));

  const [catalog, tags] = await Promise.all([
    getCatalog({ page: pageNum, pageSize: PAGE_SIZE, search, tag, sort }),
    getTags(),
  ]);

  return (
    <div className="flex flex-col gap-6 py-2">
      {/* Catalog Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
          {tag ? `${tag} HD Videos` : search ? `Search results for "${search}"` : "Full HD Video Catalog"}
        </h1>
        <p className="text-xs text-zinc-400">
          Showing {catalog.items.length} of {catalog.totalCount || "10,000+"} available videos
        </p>
      </div>

      {/* Interlinking Tag Cloud Pill Bar */}
      <div className="rounded-xl border border-zinc-800 bg-[#161618] p-4 shadow-md">
        <span className="block text-[11px] font-bold uppercase tracking-wider text-zinc-500 mb-2">
          Filter by Popular Tags & Categories
        </span>
        <TagCloud tags={tags} activeTag={tag} />
      </div>

      {/* Search & Sort Filters */}
      <SearchFilters tags={tags} currentSearch={search} currentTag={tag} currentSort={sort} />

      {/* Infinite Grid */}
      <Suspense fallback={<CatalogGridSkeleton />}>
        <InfiniteCatalogGrid
          initialItems={catalog.items}
          initialHasNextPage={catalog.hasNextPage}
          search={search}
          tag={tag}
          sort={sort}
        />
      </Suspense>

      {/* Numbered Pagination */}
      <Pagination 
        currentPage={pageNum} 
        totalPages={catalog.totalPages} 
        q={search} 
        tag={tag} 
        sort={sort} 
      />
    </div>
  );
}

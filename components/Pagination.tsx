"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  q?: string;
  tag?: string;
  sort?: string;
}

export function Pagination({ currentPage, totalPages, q, tag, sort }: PaginationProps) {
  const pathname = usePathname();

  useEffect(() => {
    // Optionally smooth scroll to top when page changes, if we want client-side scroll effect
    // But since it's a server component loading a new page, the browser handles scroll restoration usually.
    // To ensure it scrolls up:
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  if (totalPages <= 1) return null;

  const createPageUrl = (page: number) => {
    const params = new URLSearchParams();
    if (page > 1) params.set("page", page.toString());
    if (q) params.set("q", q);
    if (tag) params.set("tag", tag);
    if (sort) params.set("sort", sort);

    const query = params.toString();
    return `${pathname}${query ? `?${query}` : ""}`;
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  const pages = getPageNumbers();

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 py-8">
      {/* Previous Button */}
      {currentPage > 1 ? (
        <Link
          href={createPageUrl(currentPage - 1)}
          className="flex h-10 items-center justify-center rounded-lg border border-zinc-800 bg-[#161618] px-4 text-sm font-semibold text-zinc-300 transition-colors hover:border-[#FF9900] hover:text-[#FF9900]"
        >
          &larr; Prev
        </Link>
      ) : (
        <span className="flex h-10 items-center justify-center rounded-lg border border-zinc-900 bg-[#0B0B0C] px-4 text-sm font-semibold text-zinc-700 cursor-not-allowed">
          &larr; Prev
        </span>
      )}

      {/* First Page & Ellipsis */}
      {pages[0] > 1 && (
        <>
          <Link
            href={createPageUrl(1)}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-800 bg-[#161618] text-sm font-semibold text-zinc-300 transition-colors hover:border-[#FF9900] hover:text-[#FF9900]"
          >
            1
          </Link>
          {pages[0] > 2 && <span className="text-zinc-500">...</span>}
        </>
      )}

      {/* Page Numbers */}
      {pages.map((page) => (
        <Link
          key={page}
          href={createPageUrl(page)}
          className={`flex h-10 w-10 items-center justify-center rounded-lg border text-sm font-semibold transition-colors ${
            page === currentPage
              ? "border-[#FF9900] bg-[#FF9900]/10 text-[#FF9900]"
              : "border-zinc-800 bg-[#161618] text-zinc-300 hover:border-[#FF9900] hover:text-[#FF9900]"
          }`}
        >
          {page}
        </Link>
      ))}

      {/* Last Page & Ellipsis */}
      {pages[pages.length - 1] < totalPages && (
        <>
          {pages[pages.length - 1] < totalPages - 1 && <span className="text-zinc-500">...</span>}
          <Link
            href={createPageUrl(totalPages)}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-800 bg-[#161618] text-sm font-semibold text-zinc-300 transition-colors hover:border-[#FF9900] hover:text-[#FF9900]"
          >
            {totalPages}
          </Link>
        </>
      )}

      {/* Next Button */}
      {currentPage < totalPages ? (
        <Link
          href={createPageUrl(currentPage + 1)}
          className="flex h-10 items-center justify-center rounded-lg border border-zinc-800 bg-[#161618] px-4 text-sm font-semibold text-zinc-300 transition-colors hover:border-[#FF9900] hover:text-[#FF9900]"
        >
          Next &rarr;
        </Link>
      ) : (
        <span className="flex h-10 items-center justify-center rounded-lg border border-zinc-900 bg-[#0B0B0C] px-4 text-sm font-semibold text-zinc-700 cursor-not-allowed">
          Next &rarr;
        </span>
      )}
    </div>
  );
}

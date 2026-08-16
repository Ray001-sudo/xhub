import type { SortOption } from "@/lib/types";

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "popular", label: "Most Popular" },
  { value: "newest", label: "Newest" },
  { value: "top-rated", label: "Top Rated" },
  { value: "alphabetical", label: "A–Z" },
];

/**
 * Server-rendered filter form. Submits as a GET request so every filtered
 * view is a plain, shareable, indexable URL (?search=&tag=&sort=) rather
 * than client-only state — good for SEO and for the browser back button.
 *
 * `tag` replaces the old RAWG-era `genre` param: the clip network's
 * categories ("FPS", "Battle Royale", "Tournament") aren't a fixed genre
 * taxonomy, so the filter is presented and labeled as "Category" instead.
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
  return (
    <form
      method="GET"
      action="/catalog"
      className="flex flex-col gap-3 rounded-xl border border-line bg-surface p-4 sm:flex-row sm:items-center"
    >
      <div className="flex-1">
        <label htmlFor="search" className="sr-only">
          Search clips
        </label>
        <input
          id="search"
          name="search"
          type="search"
          maxLength={100}
          defaultValue={currentSearch}
          placeholder="Search esports clips…"
          className="w-full rounded-lg border border-line bg-bg px-3 py-2 text-sm text-ink placeholder:text-ink-muted focus:border-signal focus:outline-none"
        />
      </div>

      <div className="flex flex-wrap gap-3">
        <select
          name="tag"
          defaultValue={currentTag}
          className="rounded-lg border border-line bg-bg px-3 py-2 text-sm text-ink focus:border-signal focus:outline-none"
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
          defaultValue={currentSort}
          className="rounded-lg border border-line bg-bg px-3 py-2 text-sm text-ink focus:border-signal focus:outline-none"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="rounded-lg bg-signal px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-signal-dim"
        >
          Filter
        </button>
      </div>
    </form>
  );
}

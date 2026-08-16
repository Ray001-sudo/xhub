import type { SortOption } from "./types";

/** Format a synthetic view counter like "12.4K views". */
export function formatViewCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M views`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K views`;
  return `${n} views`;
}

export function formatDate(iso: string | null): string {
  if (!iso) return "TBA";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "TBA";
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

/**
 * Converts the partner API's pre-formatted duration string ("10:45",
 * "1:02:03") into ISO 8601 duration format ("PT10M45S") for schema.org
 * VideoObject structured data, which Google's rich-results parser requires.
 * Returns undefined for anything that doesn't parse cleanly, so callers can
 * omit the field rather than emit invalid structured data.
 */
export function toIso8601Duration(formatted: string): string | undefined {
  const parts = formatted.split(":").map((p) => Number.parseInt(p, 10));
  if (parts.length < 1 || parts.length > 3 || parts.some((p) => Number.isNaN(p))) {
    return undefined;
  }
  const [hours, minutes, seconds] =
    parts.length === 3 ? parts : parts.length === 2 ? [0, ...parts] : [0, 0, ...parts];

  const h = hours ? `${hours}H` : "";
  const m = minutes ? `${minutes}M` : "";
  const s = seconds || (!hours && !minutes) ? `${seconds}S` : "";
  return `PT${h}${m}${s}`;
}

const SORT_VALUES: SortOption[] = ["popular", "newest", "top-rated", "alphabetical"];

/**
 * Strict allow-list sanitization for anything that came from the URL
 * (searchParams). Never trust query-string input directly in an API call,
 * a <meta> tag, or JSX — always route it through one of these first.
 */
export function sanitizeSearchTerm(raw: string | string[] | undefined): string {
  if (!raw) return "";
  const value = Array.isArray(raw) ? raw[0] : raw;
  // Strip anything that isn't a normal search character; hard length cap.
  return value.replace(/[^\w\s\-':]/g, "").slice(0, 100).trim();
}

export function sanitizeSlugParam(raw: string | string[] | undefined): string {
  if (!raw) return "";
  const value = Array.isArray(raw) ? raw[0] : raw;
  return value.replace(/[^a-z0-9\-]/gi, "").slice(0, 200);
}

/**
 * Tag/category names from the clip network ("Battle Royale", "FPS") can
 * contain spaces, unlike the old slug-style genre param — so this allows
 * letters, numbers, spaces, and hyphens only, with a short length cap.
 */
export function sanitizeTagParam(raw: string | string[] | undefined): string {
  if (!raw) return "";
  const value = Array.isArray(raw) ? raw[0] : raw;
  return value.replace(/[^\w\s-]/g, "").slice(0, 60).trim();
}

export function sanitizeSort(raw: string | string[] | undefined): SortOption {
  const value = Array.isArray(raw) ? raw[0] : raw;
  return (SORT_VALUES as string[]).includes(value ?? "") ? (value as SortOption) : "popular";
}

export function sanitizePage(raw: string | string[] | undefined): number {
  const value = Array.isArray(raw) ? raw[0] : raw;
  const n = Number.parseInt(value ?? "1", 10);
  if (!Number.isFinite(n) || n < 1) return 1;
  return Math.min(n, 500); // guard against absurd pagination depth-of-scan abuse
}

export function classNames(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

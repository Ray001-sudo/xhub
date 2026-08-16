import "server-only";
import type { CatalogQuery, CatalogResult, SortOption, VideoClip } from "./types";

// -----------------------------------------------------------------------------
// Configuration — Eporner API v2
// -----------------------------------------------------------------------------
const BASE_URL = "https://www.eporner.com/api/v2";
const REVALIDATE_SECONDS = Number(process.env.REVALIDATE_SECONDS ?? 300);

// Only ever render iframes from these hosts.
const ALLOWED_EMBED_HOSTS = new Set(
  (process.env.ALLOWED_IFRAME_HOSTS ?? "")
    .split(",")
    .map((host) => host.trim().toLowerCase())
    .filter(Boolean)
);

// Add eporner to allowed hosts
ALLOWED_EMBED_HOSTS.add("www.eporner.com");
ALLOWED_EMBED_HOSTS.add("eporner.com");

if (ALLOWED_EMBED_HOSTS.size === 0) {
  console.warn(
    "[clips-api] ALLOWED_IFRAME_HOSTS is not set — every clip embed will be " +
      "rejected as untrusted until it's configured. Set a comma-separated " +
      "list of trusted embed hostnames in your environment (see .env.example)."
  );
}

// -----------------------------------------------------------------------------
// Low-level fetch wrapper
// -----------------------------------------------------------------------------
class ClipsApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = "ClipsApiError";
  }
}

interface FetchOptions {
  /** Per-request override of the ISR revalidation window. */
  revalidateSeconds?: number;
  retries?: number;
}

/**
 * Thin wrapper around fetch() that:
 *  - injects auth + base URL
 *  - uses Next.js ISR caching (`next: { revalidate }`) so we don't hammer the
 *    partner API on every request
 *  - retries transient failures (5xx, network errors) with backoff
 *  - normalizes rate-limit (429) responses into a typed error the caller can
 *    catch and degrade gracefully from
 */
async function apiFetch<T>(
  path: string,
  params: Record<string, string | number | undefined> = {},
  { revalidateSeconds = REVALIDATE_SECONDS, retries = 2 }: FetchOptions = {}
): Promise<T> {
  // Ensure path starts with /
  const endpoint = path.startsWith("/") ? path : `/${path}`;
  const url = new URL(`${BASE_URL}${endpoint}`);
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== "") url.searchParams.set(k, String(v));
  }

  let lastError: unknown;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url.toString(), {
        next: { revalidate: revalidateSeconds },
        headers: {
          Accept: "application/json",
        },
      });

      if (res.status === 429) {
        // Rate limited — back off and retry rather than surfacing a 500.
        const retryAfter = Number(res.headers.get("retry-after") ?? 1);
        await sleep(Math.min(retryAfter, 3) * 1000 * (attempt + 1));
        continue;
      }

      if (!res.ok) {
        throw new ClipsApiError(`Partner API responded ${res.status} for ${path}`, res.status);
      }

      return (await res.json()) as T;
    } catch (err) {
      lastError = err;
      if (attempt < retries) {
        await sleep(250 * 2 ** attempt); // exponential backoff
      }
    }
  }

  throw lastError instanceof Error ? lastError : new ClipsApiError(`Failed to fetch ${path}`);
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// -----------------------------------------------------------------------------
// Embed sanitization
// -----------------------------------------------------------------------------
export function sanitizeEmbedHtml(rawHtml: string | null | undefined): string | null {
  if (!rawHtml) return null;

  const srcMatch = rawHtml.match(/src=["']([^"']+)["']/i);
  if (!srcMatch) return null;

  try {
    const parsed = new URL(srcMatch[1]);
    if (parsed.protocol !== "https:") return null;
    if (!ALLOWED_EMBED_HOSTS.has(parsed.hostname)) return null;
    return parsed.toString();
  } catch {
    return null;
  }
}

/** Deterministic, URL-safe slug for /watch/[slug] routes: "<title>-<id>". */
function slugify(title: string, id: string): string {
  const base = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-+|-+$)/g, "");
  return base ? `${base}-${id}` : id;
}

/** Reverses slugify() — the id is always the last hyphen-delimited segment. */
function idFromSlug(slug: string): string {
  const parts = slug.split("-");
  return parts[parts.length - 1] || slug;
}

// -----------------------------------------------------------------------------
// Eporner API v2 response shapes + normalizer
// -----------------------------------------------------------------------------
interface EpornerVideoRaw {
  id: string;
  title: string;
  url: string;
  embed: string;
  length_sec: number;
  rate: string;
  views: number;
  default_thumb: { src: string };
  thumbs: { src: string }[];
  keywords: string;
}

interface EpornerSearchResponse {
  count: number;
  start: number;
  total_count: number;
  total_pages: number;
  videos: EpornerVideoRaw[];
}

function sortToApiOrdering(sort: SortOption | undefined): string {
  switch (sort) {
    case "newest":
      return "latest";
    case "top-rated":
      return "top-rated";
    case "alphabetical":
      return "most-popular"; // Alphabetical is not supported, map to most-popular
    case "popular":
    default:
      return "most-popular";
  }
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function normalizeClip(raw: EpornerVideoRaw): VideoClip {
  // Synthetic iframe HTML maintaining a 16:9 aspect ratio
  const syntheticEmbedHtml = `<iframe src="${raw.embed}" style="aspect-ratio: 16 / 9; width: 100%; height: 100%;" frameborder="0" allowfullscreen></iframe>`;
  
  return {
    id: raw.id,
    slug: slugify(raw.title, raw.id),
    title: raw.title,
    thumbnailUrl: raw.default_thumb?.src || "",
    embedHtml: syntheticEmbedHtml,
    embedUrl: raw.embed,
    duration: formatDuration(raw.length_sec),
    rating: raw.rate ? `${raw.rate}%` : "", // Assuming rate is like "98"
    views: raw.views,
    tags: raw.keywords ? raw.keywords.split(",").map((k) => k.trim()).filter(Boolean) : [],
  };
}

// -----------------------------------------------------------------------------
// Public service API — this is what pages/components import.
// -----------------------------------------------------------------------------

/** Fetch a paginated, filtered, sorted catalog of clips. */
export async function getCatalog(query: CatalogQuery): Promise<CatalogResult> {
  const { page, pageSize, search, tag, sort } = query;

  let searchQuery = "all";
  if (search && tag) {
    searchQuery = `${search} ${tag}`;
  } else if (search) {
    searchQuery = search;
  } else if (tag) {
    searchQuery = tag;
  }

  try {
    const data = await apiFetch<EpornerSearchResponse>("/video/search/", {
      query: searchQuery,
      per_page: pageSize,
      page,
      thumbsize: "medium",
      order: sortToApiOrdering(sort),
      gay: 0,
      lq: 1,
      format: "json",
    });

    const items = (data.videos || []).map(normalizeClip);
    return {
      items,
      page,
      pageSize,
      totalCount: data.total_count,
      totalPages: data.total_pages,
      hasNextPage: page < data.total_pages,
    };
  } catch (err) {
    console.error("[clips-api] getCatalog failed:", err);
    // Graceful degradation: an empty catalog page (with a friendly empty
    // state) beats a hard 500 for a public discovery surface.
    return { items: [], page, pageSize, totalCount: 0, totalPages: 0, hasNextPage: false };
  }
}

/** Fetch full detail for a single clip, by slug (id is embedded in the slug). */
export async function getClipBySlug(slug: string): Promise<VideoClip | null> {
  const id = idFromSlug(slug);
  try {
    // Note: ID lookup uses a different response shape (just the object)
    const raw = await apiFetch<EpornerVideoRaw>(`/video/id/`, {
      id,
      format: "json",
    });
    // Eporner may return an empty array or object if not found
    if (!raw || Object.keys(raw).length === 0 || Array.isArray(raw)) return null;
    return normalizeClip(raw);
  } catch (err) {
    console.error(`[clips-api] getClipBySlug(${slug}) failed:`, err);
    return null;
  }
}

/** Related clips for the "More Clips" grid on the watch page. */
export async function getRelatedClips(tags: string[], excludeSlug: string): Promise<VideoClip[]> {
  if (tags.length === 0) return [];
  try {
    const data = await apiFetch<EpornerSearchResponse>("/video/search/", {
      query: tags.slice(0, 2).join(" "),
      per_page: 30,
      order: "most-popular",
      thumbsize: "medium",
      gay: 0,
      lq: 1,
      format: "json",
    });
    return (data.videos || [])
      .map(normalizeClip)
      .filter((c) => c.slug !== excludeSlug);
  } catch (err) {
    console.error("[clips-api] getRelatedClips failed:", err);
    return [];
  }
}

/** All distinct categories/tags, used to populate the filter bar. */
export async function getTags(): Promise<string[]> {
  return ["4k", "hd", "top rated", "popular"];
}

/** Lightweight slug list for sitemap generation — no full payload needed. */
export async function getAllSlugsForSitemap(
  limit = 1000
): Promise<{ slug: string }[]> {
  try {
    const data = await apiFetch<EpornerSearchResponse>("/video/search/", {
      query: "all",
      per_page: Math.min(limit, 100),
      order: "most-popular",
      thumbsize: "medium",
      gay: 0,
      lq: 1,
      format: "json",
    });
    return (data.videos || []).map((c) => ({ slug: slugify(c.title, c.id) }));
  } catch (err) {
    console.error("[clips-api] getAllSlugsForSitemap failed:", err);
    return [];
  }
}

/** Fetch removed video IDs for local database synchronization. */
export async function getRemovedVideos(): Promise<{ id: string }[]> {
  try {
    const data = await apiFetch<any>("/video/removed/", { format: "json" });
    if (Array.isArray(data)) {
        return data.map(item => ({ id: typeof item === 'object' ? item.id : item }));
    } else if (data && data.videos) {
        return data.videos.map((item: any) => ({ id: item.id }));
    }
    return [];
  } catch (err) {
    console.error("[clips-api] getRemovedVideos failed:", err);
    return [];
  }
}

export { ClipsApiError };

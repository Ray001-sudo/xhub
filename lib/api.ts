import "server-only";
import type { CatalogQuery, CatalogResult, SortOption, VideoClip } from "./types";

// -----------------------------------------------------------------------------
// Configuration — Decentralized Esports VOD & Clip Network
// -----------------------------------------------------------------------------
const BASE_URL = process.env.CLIPS_API_BASE_URL ?? "https://api.esports-vods.tv/v1";
const API_KEY = process.env.CLIPS_API_KEY ?? "";
const REVALIDATE_SECONDS = Number(process.env.REVALIDATE_SECONDS ?? 3600);

if (!API_KEY && process.env.NODE_ENV === "production") {
  console.warn(
    "[clips-api] CLIPS_API_KEY is not set. Requests to the partner API will fail. " +
      "Set it in your environment (see .env.example)."
  );
}

// Only ever render iframes from these hosts. This is the single choke point
// that keeps the `iframe_embed` string returned by the partner API from
// becoming an XSS vector — see sanitizeEmbedHtml() below and
// components/VideoPlayer.tsx for how the result is consumed.
//
// Driven entirely by ALLOWED_IFRAME_HOSTS (comma-separated hostnames, no
// protocol — e.g. "embed.esports-vods.tv,player.clip-network.com") so
// staging/production can point at different partner domains without code
// changes. Deliberately fails CLOSED: if the env var is unset or empty, no
// host is trusted and every embed is rejected — that's a broken embed on
// screen, not a silent hole in the allow-list.
//
// IMPORTANT: `next.config.js` reads the *same* env var to build the CSP
// `frame-src` directive. Keep both pointed at ALLOWED_IFRAME_HOSTS — CSP is
// defense-in-depth on top of this allow-list, not a replacement for it, and
// a browser without a strictly-enforced CSP still relies on this check
// happening server-side before the URL ever reaches JSX.
const ALLOWED_EMBED_HOSTS = new Set(
  (process.env.ALLOWED_IFRAME_HOSTS ?? "")
    .split(",")
    .map((host) => host.trim().toLowerCase())
    .filter(Boolean)
);

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
  const url = new URL(path, BASE_URL);
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== "") url.searchParams.set(k, String(v));
  }

  let lastError: unknown;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url.toString(), {
        // Next.js ISR: cache the response at the edge/server and
        // transparently revalidate after N seconds instead of hitting the
        // upstream API on every request.
        next: { revalidate: revalidateSeconds },
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${API_KEY}`,
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

/**
 * Extracts the `src` from a raw <iframe> HTML string returned by the
 * partner API and validates it against ALLOWED_EMBED_HOSTS. Returns null if
 * the string is missing, malformed, not HTTPS, or points at an untrusted
 * host. This is the ONLY function in the codebase allowed to parse
 * `embedHtml` — nothing downstream should regex or string-match it again.
 *
 * We deliberately do NOT pass the raw HTML through — even after validating
 * the host, we rebuild a plain URL and let VideoPlayer.tsx construct its own
 * <iframe> with a locked-down `sandbox` attribute. The partner's original
 * frameborder/width/height/allowfullscreen attributes are never trusted or
 * reused.
 */
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
// Esports VOD & Clip Network response shapes + normalizer
// -----------------------------------------------------------------------------
interface EsportsClipRaw {
  clip_id: string;
  title: string;
  thumb_url: string;
  iframe_embed: string;
  duration_formatted: string;
  user_rating: string;
  total_views: number;
  categories?: { category_name: string }[];
}

interface EsportsListResponse {
  total: number;
  clips: EsportsClipRaw[];
}

function sortToApiOrdering(sort: SortOption | undefined): string {
  switch (sort) {
    case "newest":
      return "recent";
    case "top-rated":
      return "rating";
    case "alphabetical":
      return "title";
    case "popular":
    default:
      return "views";
  }
}

function normalizeClip(raw: EsportsClipRaw): VideoClip {
  return {
    id: raw.clip_id,
    slug: slugify(raw.title, raw.clip_id),
    title: raw.title,
    thumbnailUrl: raw.thumb_url,
    embedHtml: raw.iframe_embed,
    embedUrl: sanitizeEmbedHtml(raw.iframe_embed),
    duration: raw.duration_formatted,
    rating: raw.user_rating,
    views: raw.total_views,
    tags: raw.categories?.map((c) => c.category_name) ?? [],
  };
}

// -----------------------------------------------------------------------------
// Public service API — this is what pages/components import.
// -----------------------------------------------------------------------------

/** Fetch a paginated, filtered, sorted catalog of clips. */
export async function getCatalog(query: CatalogQuery): Promise<CatalogResult> {
  const { page, pageSize, search, tag, sort } = query;

  try {
    const data = await apiFetch<EsportsListResponse>("/clips", {
      page,
      page_size: pageSize,
      q: search?.slice(0, 100), // hard cap to prevent abuse via huge query strings
      category: tag,
      sort: sortToApiOrdering(sort),
    });

    const items = data.clips.map(normalizeClip);
    return {
      items,
      page,
      pageSize,
      totalCount: data.total,
      hasNextPage: page * pageSize < data.total,
    };
  } catch (err) {
    console.error("[clips-api] getCatalog failed:", err);
    // Graceful degradation: an empty catalog page (with a friendly empty
    // state) beats a hard 500 for a public discovery surface.
    return { items: [], page, pageSize, totalCount: 0, hasNextPage: false };
  }
}

/** Fetch full detail for a single clip, by slug (id is embedded in the slug). */
export async function getClipBySlug(slug: string): Promise<VideoClip | null> {
  const id = idFromSlug(slug);
  try {
    const raw = await apiFetch<EsportsClipRaw>(`/clips/${encodeURIComponent(id)}`, {});
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
    const data = await apiFetch<EsportsListResponse>("/clips", {
      category: tags.slice(0, 2).join(","),
      page_size: 9,
      sort: "views",
    });
    return data.clips
      .map(normalizeClip)
      .filter((c) => c.slug !== excludeSlug)
      .slice(0, 8);
  } catch (err) {
    console.error("[clips-api] getRelatedClips failed:", err);
    return [];
  }
}

/** All distinct categories/tags, used to populate the filter bar. Cached for a day. */
export async function getTags(): Promise<string[]> {
  try {
    const data = await apiFetch<{ categories: { category_name: string }[] }>(
      "/categories",
      {},
      { revalidateSeconds: 86400 }
    );
    return data.categories.map((c) => c.category_name);
  } catch (err) {
    console.error("[clips-api] getTags failed:", err);
    return ["FPS", "MOBA", "Battle Royale", "Fighting", "Tournament", "Highlights"];
  }
}

/** Lightweight slug list for sitemap generation — no full payload needed. */
export async function getAllSlugsForSitemap(
  limit = 1000
): Promise<{ slug: string }[]> {
  try {
    const data = await apiFetch<EsportsListResponse>(
      "/clips",
      { page_size: Math.min(limit, 40), sort: "views" },
      { revalidateSeconds: 86400 }
    );
    return data.clips.map((c) => ({ slug: slugify(c.title, c.clip_id) }));
  } catch (err) {
    console.error("[clips-api] getAllSlugsForSitemap failed:", err);
    return [];
  }
}

export { ClipsApiError };

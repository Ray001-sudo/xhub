// -----------------------------------------------------------------------------
// Normalized domain types. The service layer (lib/api.ts) maps whatever shape
// the partner API returns into this shape, so every page and component only
// ever depends on this contract — never on a specific provider's payload
// format. This makes future data-source pivots (like this one) a two-file
// change (types.ts + api.ts) instead of a rewrite.
// -----------------------------------------------------------------------------

/**
 * VideoClip — core content type, sourced from the Decentralized Esports VOD
 * & Clip Network partner API (see lib/api.ts for the raw payload mapping).
 */
export interface VideoClip {
  id: string;
  title: string;
  thumbnailUrl: string;

  /**
   * Raw <iframe> HTML string exactly as returned by the partner API.
   * Kept for audit/debugging purposes only.
   *
   * ⚠️ SECURITY: never render this field directly (no
   * `dangerouslySetInnerHTML`, no string interpolation into JSX). A
   * compromised or malicious upstream response could smuggle arbitrary
   * markup/script through this string. Always render `embedUrl` below
   * instead, inside our own sandboxed <iframe> — see
   * components/VideoPlayer.tsx.
   */
  embedHtml: string;

  /**
   * The `src` extracted from `embedHtml` and validated against the embed
   * host allow-list in `lib/api.ts#sanitizeEmbedHtml`. `null` if the embed
   * was missing or didn't match a trusted host. This is the only field
   * that should ever reach an <iframe>.
   */
  embedUrl: string | null;

  duration: string; // pre-formatted by the partner API, e.g. "10:45"
  rating: string; // pre-formatted by the partner API, e.g. "98%"
  views: number;
  tags: string[];

  /** URL-safe identifier for /watch/[slug] routes, derived from title + id. */
  slug: string;
}

export type GridVideoClip = Omit<VideoClip, "embedHtml" | "embedUrl">;

export type SortOption = "popular" | "newest" | "top-rated" | "alphabetical";

export interface CatalogQuery {
  page: number;
  pageSize: number;
  search?: string;
  tag?: string;
  sort?: SortOption;
}

export interface CatalogResult {
  items: GridVideoClip[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
}

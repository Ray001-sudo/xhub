import { NextRequest, NextResponse } from "next/server";
import { getCatalog } from "@/lib/api";
import { sanitizePage, sanitizeSearchTerm, sanitizeSort, sanitizeTagParam } from "@/lib/utils";

const PAGE_SIZE = 60;

/**
 * GET /api/search
 * Thin, sanitized proxy in front of the cached server-side service layer —
 * this is what InfiniteCatalogGrid calls for pages 2+ of the catalog. Kept
 * as a route handler (rather than a Server Action) so it's a plain,
 * cacheable GET endpoint.
 */
export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;

  const page = sanitizePage(params.get("page") ?? undefined);
  const search = sanitizeSearchTerm(params.get("q") ?? undefined);
  const tag = sanitizeTagParam(params.get("tag") ?? undefined);
  const sort = sanitizeSort(params.get("sort") ?? undefined);

  const result = await getCatalog({ page, pageSize: PAGE_SIZE, search, tag, sort });

  return NextResponse.json(
    { items: result.items, hasNextPage: result.hasNextPage },
    { headers: { "Cache-Control": "public, max-age=60, stale-while-revalidate=300" } }
  );
}

# IndieTrailerHub

Open-access indie game trailer directory. No accounts, no signups — Next.js
14 App Router, Tailwind CSS, server-rendered + ISR-cached, ad-supported.

## File structure

```
indie-trailer-hub/
├── app/
│   ├── layout.tsx              Root shell: fonts, header/footer, global ad/analytics scripts
│   ├── globals.css             Tailwind layers + base theme
│   ├── page.tsx                Homepage (hero, header ad, featured grids)
│   ├── sitemap.ts               Dynamic XML sitemap from live catalog data
│   ├── robots.ts                robots.txt
│   ├── error.tsx                Global error boundary / fallback UI
│   ├── catalog/
│   │   ├── page.tsx             Search/filter/sort + infinite-scroll grid
│   │   └── loading.tsx          Skeleton loader
│   ├── watch/[slug]/
│   │   ├── page.tsx             Player, metadata, ad slots, related games, JSON-LD
│   │   ├── not-found.tsx        404 for missing trailers
│   │   └── loading.tsx          Skeleton loader
│   └── api/search/route.ts     Sanitized JSON endpoint backing infinite scroll
├── components/
│   ├── AdSlot.tsx                Reusable IAB ad slot wrapper (all placements)
│   ├── GlobalAdScripts.tsx       <Script> container for ad-network/analytics tags
│   ├── VideoPlayer.tsx           Sandboxed, responsive 16:9 iframe player
│   ├── GameCard.tsx              Catalog card ("cartridge" signature shape)
│   ├── SearchFilters.tsx         GET-form search/genre/sort controls
│   ├── InfiniteCatalogGrid.tsx   Client component: IntersectionObserver pagination
│   ├── Skeletons.tsx             Loading skeletons
│   ├── SiteHeader.tsx / SiteFooter.tsx
├── lib/
│   ├── api.ts                    Server-side service layer (partner API integration)
│   ├── types.ts                  Normalized domain types
│   └── utils.ts                  Formatting + strict input sanitization
├── next.config.js                CSP + security headers, image domains
├── tailwind.config.js            Design tokens (documented inline)
└── .env.example
```

## Design system

Dark "HUD" gaming theme — near-black background (`#0A0B10`), signal-violet
accent (`#7C5CFF`) for interactive elements, cartridge-amber (`#FFB454`) for
ratings/new tags. Display type is Chakra Petch (techy, used sparingly for
headings), body is Inter, and JetBrains Mono renders stats/durations like a
HUD readout. The signature visual motif is an angled "cartridge notch" corner
on every trailer card plus a scanline glow on hover — see
`tailwind.config.js` and `components/GameCard.tsx`.

## Partner API integration

`lib/api.ts` is the single place that talks to the partner gaming database
(RAWG by default — swap in IGDB by changing the fetch calls; the rest of the
app only depends on the normalized types in `lib/types.ts`, so no other file
needs to change). It handles:

- **ISR caching** via `fetch(..., { next: { revalidate } })` — set the
  window with `REVALIDATE_SECONDS` in `.env`.
- **Rate-limit handling**: 429s are retried with backoff instead of
  surfacing an error to the user.
- **Graceful degradation**: any upstream failure returns an empty
  result set (rendered as a friendly empty state) rather than a 500.
- **Embed sanitization** (`sanitizeEmbedUrl`): every trailer URL from the
  partner API is validated against an allow-list of trusted video hosts
  before it's ever rendered — see the Security section below.

## Security notes

- **CSP** (`next.config.js`) locks `default-src` to `'self'` and explicitly
  allow-lists only the origins the app actually needs: YouTube's
  privacy-enhanced embed domain, Vimeo's player domain, the RAWG image CDN,
  and whatever ad/analytics origins you configure via env vars.
- **Iframe sandboxing** (`components/VideoPlayer.tsx`): trailers render in
  an `<iframe sandbox="allow-scripts allow-presentation">` — no
  `allow-same-origin`, no top-navigation, no popups. The raw HTML/iframe
  string returned by the partner API is never injected directly; we extract
  and validate the URL, then build our own iframe.
- **Input sanitization** (`lib/utils.ts`): every value read from
  `searchParams` (search text, genre, sort, page, slug) is passed through a
  strict allow-list sanitizer before use in an API call, a `<meta>` tag, or
  a URL — this covers both XSS and API-parameter injection.
- **No accounts / no PII**: there's no auth surface, cookie-based session,
  or user data store to secure, by design.

## Ad placements

All four requested IAB slots are implemented via the single reusable
`<AdSlot name="..." />` component:

| Slot name              | Location                          | Typical size        |
|-------------------------|------------------------------------|----------------------|
| `header-leaderboard`    | Top of homepage & catalog          | 728×90               |
| `player-sidebar-left/right` | Flanking the video player (desktop) | 300×250 each     |
| `below-player-native`   | Beneath trailer details/tags       | Native/in-content    |
| `in-grid-native`        | Interleaved every 12 catalog cards | Native/in-grid       |

`components/GlobalAdScripts.tsx`, mounted once in `app/layout.tsx`, is the
single place to load a global ad-network initialization tag and analytics
script — both gated behind env vars, so nothing third-party loads until
you configure a real network. Remember to add that network's script origin
to the CSP `script-src`/`connect-src` list in `next.config.js`.

## Local development

```bash
npm install
cp .env.example .env.local   # then fill in GAMES_API_KEY (free at rawg.io/apidocs)
npm run dev
```

## Deployment (Vercel, recommended for Next.js ISR)

1. Push this repo to GitHub/GitLab/Bitbucket.
2. Import the repo in Vercel → it auto-detects Next.js.
3. Under **Project Settings → Environment Variables**, add everything from
   `.env.example` (at minimum `GAMES_API_KEY` and `NEXT_PUBLIC_SITE_URL`).
4. Deploy. ISR revalidation, the sitemap, and the CSP headers all work
   out of the box on Vercel's Edge/Node runtime — no extra config needed.

### Self-hosted / Docker (Node runtime)

```bash
npm run build
npm run start   # serves on :3000; put behind Nginx/Caddy + your CDN
```

Set the same environment variables via your platform's secret manager. If
you front the app with a CDN or WAF, make sure it forwards `Accept` headers
correctly so ISR's stale-while-revalidate behavior isn't defeated.

## Scaling notes / next steps

- **Sitemap pagination**: `app/sitemap.ts` currently pulls one page of
  results. At real scale, split into a sitemap index
  (`/sitemap/0.xml`, `/sitemap/1.xml`, …) using Next's
  [generateSitemaps](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap#generate-multiple-sitemaps).
- **IGDB adapter**: if you prefer IGDB over RAWG, implement an equivalent
  `normalizeGame`/`apiFetch` pair against IGDB's Apicalypse query syntax
  (OAuth via `IGDB_CLIENT_ID`/`SECRET` in `.env.example`) — every page above
  is written against `lib/types.ts`, not RAWG's shape, so no page-level code
  needs to change.
- **Real view counts**: RAWG doesn't expose trailer view counts, so
  `viewCount` is currently derived from RAWG's own popularity metric
  (`added * 37`) as a presentable stand-in. Swap in real analytics-driven
  counts once you have first-party tracking.

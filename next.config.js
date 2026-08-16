/**
 * Security headers, notably a strict-but-functional Content-Security-Policy
 * that allow-lists exactly the third-party origins this app needs.
 *
 * PARTNER: Decentralized Esports VOD & Clip Network.
 *
 * `frame-src` is driven by ALLOWED_IFRAME_HOSTS — the SAME comma-separated
 * env var that `lib/api.ts#ALLOWED_EMBED_HOSTS` parses to validate each
 * clip's embed URL server-side. This is intentional: CSP is defense-in-depth
 * on top of that server-side allow-list, not a separate source of truth, so
 * staging/production can point at different partner domains by changing one
 * env var instead of editing code in two places.
 *
 * next.config.js runs at build time under plain Node, so ALLOWED_IFRAME_HOSTS
 * must be set at BUILD time (not just runtime) for this to take effect —
 * e.g. as a build-time environment variable in your CI/Vercel project
 * settings, not just a `.env` read at request time.
 *
 * Image and ad-script origins remain as configured previously; only the
 * iframe allow-list moved to an env var per this pass.
 */
const CLIP_EMBED_HOSTS = (process.env.ALLOWED_IFRAME_HOSTS ?? "")
  .split(",")
  .map((host) => host.trim().toLowerCase())
  .filter(Boolean)
  .map((host) => `https://${host}`);

const CLIP_IMAGE_HOSTS = ["https://cdn.esports-vods.tv", "https://media.gaming-statics.com", "https://*.eporner.com"];
const AD_SCRIPT_HOSTS = [
  "https://ad-delivery.esports-network.com",
  "https://analytics.gaming-tracker.com",
];

// Still honor any network configured purely via env (e.g. a secondary
// analytics tag), same pattern as before — additive to the hosts above.
const ENV_SCRIPT_SRC = [
  process.env.NEXT_PUBLIC_AD_NETWORK_SCRIPT_URL,
  process.env.NEXT_PUBLIC_ANALYTICS_SCRIPT_URL,
]
  .filter(Boolean)
  .map((url) => new URL(url).origin);

const SCRIPT_SRC = [...new Set([...AD_SCRIPT_HOSTS, ...ENV_SCRIPT_SRC])];

// Fails closed: if ALLOWED_IFRAME_HOSTS isn't set at build time, frame-src
// only permits 'self' — no external clip embed will render (matching the
// fail-closed behavior of lib/api.ts's server-side allow-list) rather than
// silently falling back to some hardcoded default host.
const CSP = [
  `default-src 'self'`,
  `base-uri 'self'`,
  `frame-src 'self' https://www.eporner.com https://eporner.com https://*.eporner.com https://*.highperformanceformat.com https://www.highperformanceformat.com https://*.effectivecpmnetwork.com https://effectivecpmnetwork.com ${CLIP_EMBED_HOSTS.join(" ")}`.trim(),
  `img-src 'self' data: blob: https://* ${CLIP_IMAGE_HOSTS.join(" ")}`,
  `style-src 'self' 'unsafe-inline' https://*`,
  `script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.highperformanceformat.com https://www.highperformanceformat.com https://*.effectivecpmnetwork.com https://effectivecpmnetwork.com https://ad-delivery.esports-network.com https://analytics.gaming-tracker.com ${SCRIPT_SRC.join(" ")}`,
  `connect-src 'self' https://* wss://* ${SCRIPT_SRC.join(" ")}`,
  `font-src 'self' data:`,
  `object-src 'none'`,
  `frame-ancestors 'self'`,
  `form-action 'self'`,
  `upgrade-insecure-requests`,
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: CSP },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.esports-vods.tv" },
      { protocol: "https", hostname: "media.gaming-statics.com" },
      { protocol: "https", hostname: "**.eporner.com" },
    ],
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

module.exports = nextConfig;

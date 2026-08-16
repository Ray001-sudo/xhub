import Script from "next/script";

/**
 * GlobalAdScripts
 * -----------------------------------------------------------------------
 * Single, designated place to load the Esports Ad Network's site-wide
 * initialization tag and the analytics script. Mounted once in the root
 * layout (app/layout.tsx) so it's present on every page exactly once.
 *
 * Uses next/script with strategy="afterInteractive" so third-party tags
 * never block first paint. Both scripts are no-ops until you set the
 * corresponding env vars — nothing loads (and no third-party origin is
 * contacted) until you configure the real network.
 *
 * SECURITY: whatever origin you put in NEXT_PUBLIC_AD_NETWORK_SCRIPT_URL /
 * NEXT_PUBLIC_ANALYTICS_SCRIPT_URL must also be allow-listed in
 * next.config.js's CSP `script-src`/`connect-src`, or the browser will
 * silently block the tag. See next.config.js's AD_SCRIPT_HOSTS.
 */
export function GlobalAdScripts() {
  const adNetworkUrl = process.env.NEXT_PUBLIC_AD_NETWORK_SCRIPT_URL;
  const adSiteId = process.env.NEXT_PUBLIC_AD_NETWORK_SITE_ID;
  const analyticsUrl = process.env.NEXT_PUBLIC_ANALYTICS_SCRIPT_URL;

  return (
    <>
      {adNetworkUrl ? (
        <Script
          id="esports-ad-network-init"
          src={adNetworkUrl}
          strategy="afterInteractive"
          data-site-id={adSiteId}
        />
      ) : null}

      {analyticsUrl ? (
        <Script id="site-analytics" src={analyticsUrl} strategy="afterInteractive" />
      ) : null}
    </>
  );
}

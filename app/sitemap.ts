import type { MetadataRoute } from "next";
import { getAllSlugsForSitemap } from "@/lib/api";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

// Regenerates alongside the rest of the ISR-cached content.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const clips = await getAllSlugsForSitemap();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/catalog`, changeFrequency: "hourly", priority: 0.9 },
  ];

  // The clip network doesn't expose a last-modified timestamp per clip, so
  // `lastModified` is intentionally omitted rather than guessed at.
  const clipRoutes: MetadataRoute.Sitemap = clips.map((c) => ({
    url: `${SITE_URL}/watch/${c.slug}`,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...clipRoutes];
}

import type { Metadata } from "next";
import type { VideoClip } from "./types";
import { toIso8601Duration } from "./utils";

const SITE_NAME = "XHub HD";
const SITE_URL = "https://xvideoz.dpdns.org";

export function generateCanonicalUrl(path: string): string {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${cleanPath}`;
}

export function generateVideoObjectSchema(clip: VideoClip) {
  const uploadDate = "2026-01-01T00:00:00Z";
  const durationIso = toIso8601Duration(clip.duration);

  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: clip.title,
    description: `${clip.title} - Watch high quality HD video online for free on XHub HD.`,
    thumbnailUrl: [clip.thumbnailUrl],
    uploadDate: uploadDate,
    duration: durationIso || "PT10M00S",
    embedUrl: clip.embedUrl || `${SITE_URL}/embed/${clip.id}`,
    interactionStatistic: {
      "@type": "InteractionCounter",
      interactionType: { "@type": "WatchAction" },
      userInteractionCount: clip.views || 150000,
    },
  };
}

export function generatePageMetadata({
  title,
  description,
  path = "",
  image,
}: {
  title: string;
  description: string;
  path?: string;
  image?: string;
}): Metadata {
  const fullTitle = `${title} | ${SITE_NAME}`;
  const canonical = generateCanonicalUrl(path);
  const ogImage = image || `${SITE_URL}/og-image.png`;

  return {
    title: fullTitle,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      type: "video.other",
      siteName: SITE_NAME,
      title: fullTitle,
      description,
      url: canonical,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [ogImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-video-preview": -1,
        "max-snippet": -1,
      },
    },
  };
}

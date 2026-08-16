import type { VideoClip } from "@/lib/types";

/**
 * VideoPlayer
 * -----------------------------------------------------------------------
 * Renders a partner-API-provided clip inside a responsive 16:9 box.
 *
 * Security note: this component takes the whole `VideoClip` but only ever
 * reads `clip.embedUrl` — the pre-validated, allow-listed URL produced by
 * `lib/api.ts#sanitizeEmbedHtml`. It never touches `clip.embedHtml` (the
 * partner's raw <iframe> string). We build our own <iframe> from scratch
 * with a locked-down `sandbox` attribute, so none of the partner's original
 * markup or attributes — trusted or not — ever reaches the DOM directly.
 */
export function VideoPlayer({ clip }: { clip: VideoClip }) {
  if (!clip.embedUrl) {
    return (
      <div className="flex aspect-video w-full items-center justify-center rounded-xl border border-line bg-surface">
        <p className="font-mono text-sm text-ink-muted">Clip unavailable — embed could not be verified.</p>
      </div>
    );
  }

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-line bg-black shadow-glow">
      <iframe
        src={clip.embedUrl}
        title={`${clip.title} — clip player`}
        loading="lazy"
        className="absolute inset-0 h-full w-full"
        // Locked-down sandbox: allow only what's required to play video +
        // go fullscreen. No same-origin, no top-navigation, no popups.
        sandbox="allow-scripts allow-presentation"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />
    </div>
  );
}

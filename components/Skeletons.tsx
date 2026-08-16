export function GameCardSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-lg border border-line bg-surface">
      <div className="aspect-video w-full bg-surface-2" />
      <div className="space-y-2 p-3">
        <div className="h-3.5 w-3/4 rounded bg-surface-2" />
        <div className="h-2.5 w-1/2 rounded bg-surface-2" />
      </div>
    </div>
  );
}

export function CatalogGridSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <GameCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function WatchPageSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="aspect-video w-full rounded-xl bg-surface" />
      <div className="h-6 w-2/3 rounded bg-surface" />
      <div className="h-4 w-1/3 rounded bg-surface" />
    </div>
  );
}

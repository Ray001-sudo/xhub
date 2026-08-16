import { CatalogGridSkeleton } from "@/components/Skeletons";

export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
      <div className="mb-6 h-24 animate-pulse rounded-xl bg-surface" />
      <CatalogGridSkeleton />
    </div>
  );
}

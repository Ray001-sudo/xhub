import { WatchPageSkeleton } from "@/components/Skeletons";

export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
      <WatchPageSkeleton />
    </div>
  );
}

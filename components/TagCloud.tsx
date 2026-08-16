import Link from "next/link";

interface TagCloudProps {
  tags: string[];
  activeTag?: string;
  className?: string;
  limit?: number;
}

export function TagCloud({ tags, activeTag, className = "", limit }: TagCloudProps) {
  const displayTags = limit ? tags.slice(0, limit) : tags;

  if (!displayTags || displayTags.length === 0) return null;

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {displayTags.map((tag) => {
        const isActive = activeTag?.toLowerCase() === tag.toLowerCase();
        return (
          <Link
            key={tag}
            href={isActive ? "/catalog" : `/catalog?tag=${encodeURIComponent(tag)}`}
            className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
              isActive
                ? "bg-[#FF9900] text-black shadow-md shadow-[#FF9900]/20"
                : "border border-zinc-800 bg-[#161618] text-zinc-300 hover:border-[#FF9900] hover:text-[#FF9900] hover:bg-[#222225]"
            }`}
          >
            #{tag}
          </Link>
        );
      })}
    </div>
  );
}

export default TagCloud;

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Saved Favorites | XHub HD",
  description: "View your personal library of saved videos on XHub HD.",
  alternates: {
    canonical: "/favorites",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function FavoritesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

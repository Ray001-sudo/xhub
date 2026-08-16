"use client";

import Link from "next/link";
import { Suspense } from "react";

function HeaderNavContent() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-800 bg-[#0B0B0C]/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1700px] items-center justify-between gap-4 px-4 py-2.5 sm:px-6">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FF9900] font-black text-black shadow-md shadow-[#FF9900]/20 transition-transform group-hover:scale-105">
            <span className="font-mono text-lg leading-none">X</span>
          </div>
          <span className="text-lg font-bold tracking-tight text-white sm:text-xl">
            Hub <span className="text-[#FF9900] font-extrabold">HD</span>
          </span>
        </Link>
      </div>
    </header>
  );
}

export function HeaderNav() {
  return (
    <Suspense fallback={null}>
      <HeaderNavContent />
    </Suspense>
  );
}

export default HeaderNav;

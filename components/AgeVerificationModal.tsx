"use client";

import { useEffect, useState } from "react";

export function AgeVerificationModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check local storage on client side mount
    const verified = localStorage.getItem("age_verified");
    if (!verified || verified !== "true") {
      setIsOpen(true);
      document.body.classList.add("modal-open");
    }
  }, []);

  const handleEnter = () => {
    localStorage.setItem("age_verified", "true");
    document.body.classList.remove("modal-open");
    setIsOpen(false);
  };

  const handleExit = () => {
    window.location.href = "https://www.google.com";
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl transition-all duration-300"
      role="dialog"
      aria-modal="true"
      aria-labelledby="age-gate-heading"
    >
      <div className="relative w-full max-w-md rounded-2xl border border-zinc-800 bg-[#161618] p-6 sm:p-8 shadow-2xl text-center">
        {/* Brand Badge */}
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-[#FF9900] shadow-lg shadow-[#FF9900]/20">
          <span className="font-mono text-2xl font-black text-black">X</span>
        </div>

        <h2
          id="age-gate-heading"
          className="text-2xl font-bold tracking-tight text-white sm:text-3xl"
        >
          18+ Age Verification Required
        </h2>

        <p className="mt-3 text-sm text-zinc-400 leading-relaxed">
          This site contains age-restricted content. By entering, you confirm you are 18 years or older.
        </p>

        <div className="mt-8 flex flex-col gap-3">
          <button
            type="button"
            onClick={handleEnter}
            className="w-full rounded-xl bg-[#FF9900] py-3.5 px-4 text-sm font-bold text-black uppercase tracking-wider transition-all duration-200 hover:bg-[#E08600] active:scale-[0.98] shadow-lg shadow-[#FF9900]/25"
          >
            I AM 18 OR OLDER — ENTER
          </button>

          <button
            type="button"
            onClick={handleExit}
            className="w-full rounded-xl border border-zinc-800 bg-zinc-900/80 py-3 px-4 text-sm font-medium text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white"
          >
            EXIT
          </button>
        </div>

        <p className="mt-6 text-[11px] text-zinc-500">
          By accessing this website, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}

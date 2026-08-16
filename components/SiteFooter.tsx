export function SiteFooter() {
  return (
    <footer className="mt-12 border-t border-zinc-800 bg-[#0B0B0C]">
      <div className="mx-auto max-w-[1700px] px-4 py-8 text-xs text-zinc-500 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="font-bold text-white text-sm">XHub HD</span>
            <p className="mt-1 text-[11px] leading-relaxed max-w-xl">
              Strictly 18+ adult entertainment directory. All models were 18 years of age or older at the time of depiction.
            </p>
          </div>
          <div className="flex flex-wrap gap-4 text-[11px] text-zinc-400">
            <span>2257 Statement</span>
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>DMCA / Removal</span>
          </div>
        </div>
        <p className="mt-6 border-t border-zinc-900 pt-4 text-[10px] text-zinc-600">
          © {new Date().getFullYear()} XHub HD. All rights reserved. High-Density Adult Media Portal.
        </p>
      </div>
    </footer>
  );
}

export default SiteFooter;

'use client';

import { useState, useEffect } from 'react';

interface VideoPlayerFacadeProps {
  embedUrl: string;
  posterUrl: string;
  title: string;
}

export default function VideoPlayerFacade({ embedUrl, posterUrl, title }: VideoPlayerFacadeProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPreRollActive, setIsPreRollActive] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [popupBlocked, setPopupBlocked] = useState(false);

  const getSmartlinkUrl = () => process.env.NEXT_PUBLIC_ADSTERRA_SMARTLINK_URL || "https://www.effectivecpmnetwork.com/yihrjzg0a?key=6b6846eaf462e8144703da5cb9af391a";

  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    const smartlinkUrl = getSmartlinkUrl();

    if (smartlinkUrl) {
      try {
        const adTab = window.open(smartlinkUrl, '_blank', 'noopener,noreferrer');
        
        // Handle immediate pop-up suppression by strict ad blockers
        if (!adTab || adTab.closed || typeof adTab.closed === 'undefined') {
          console.warn('Smartlink pop-up blocked or intercepted by ad blocker.');
          setPopupBlocked(true);
        }
      } catch (err) {
        console.warn('Pop-up execution error:', err);
        setPopupBlocked(true);
      }
    }

    // Always trigger pre-roll state independently of ad tab outcome
    setIsPreRollActive(true);
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPreRollActive && countdown > 0) {
      timer = setInterval(() => setCountdown((prev) => prev - 1), 1000);
    } else if (isPreRollActive && countdown === 0) {
      setIsPreRollActive(false);
      setIsPlaying(true);
    }
    return () => clearInterval(timer);
  }, [isPreRollActive, countdown]);

  const forcePlayVideo = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setIsPreRollActive(false);
    setIsPlaying(true);
  };

  if (isPlaying) {
    return (
      <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black shadow-2xl border border-zinc-800">
        <iframe
          src={embedUrl}
          title={title}
          className="w-full h-full border-0"
          allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
          allowFullScreen
          referrerPolicy="no-referrer"
          sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
        />
      </div>
    );
  }

  return (
    <div 
      onClick={!isPreRollActive ? handlePlayClick : undefined}
      className="relative w-full aspect-video rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800 group cursor-pointer select-none"
    >
      <img 
        src={posterUrl} 
        alt={title} 
        className="w-full h-full object-cover pointer-events-none" 
      />

      {!isPreRollActive && (
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all flex items-center justify-center z-10">
          <button 
            type="button"
            onClick={handlePlayClick}
            className="w-20 h-20 bg-amber-500 rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform cursor-pointer border-0 outline-none"
            aria-label="Play Video"
          >
            <svg className="w-10 h-10 text-black fill-current translate-x-0.5 pointer-events-none" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </button>
        </div>
      )}

      {isPreRollActive && (
        <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center gap-4 p-6 text-center z-20 pointer-events-auto">
          {popupBlocked && (
            <div className="mb-2 p-4 bg-zinc-800/80 border border-zinc-600 rounded-xl shadow-lg animate-in fade-in zoom-in duration-300">
              <p className="text-zinc-200 text-sm mb-3 font-medium">Having trouble viewing the video?</p>
              <a 
                href={getSmartlinkUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-5 py-2 bg-[#FF9900] hover:bg-amber-400 text-black font-bold rounded-lg transition-colors"
                onClick={() => setPopupBlocked(false)}
              >
                Click here to continue
              </a>
            </div>
          )}
          <p className="text-zinc-300 font-medium text-sm sm:text-base">
            Loading video player after advertisement...
          </p>
          <div className="text-5xl font-extrabold text-amber-500 tracking-wider">
            {countdown}s
          </div>
          
          <button
            type="button"
            onClick={forcePlayVideo}
            className="mt-2 px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-lg transition-colors cursor-pointer text-sm shadow-md"
          >
            Skip Ad & Play Video Now
          </button>
        </div>
      )}
    </div>
  );
}

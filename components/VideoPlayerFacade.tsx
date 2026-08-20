'use client';

import { useState, useEffect } from 'react';

import Image from 'next/image';

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

  const getSmartlinkUrl = () => process.env.NEXT_PUBLIC_ADSTERRA_SMARTLINK_URL || "https://www.effectivecpmnetwork.com/sw0gxjtd?key=5d91e60c0890598a5f09b65dd893a854";

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
      <Image 
        src={posterUrl} 
        alt={title} 
        fill
        priority={true}
        unoptimized={true}
        sizes="(max-width: 1536px) 100vw, 1536px"
        className="object-cover pointer-events-none" 
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

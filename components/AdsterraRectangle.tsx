'use client';

import { useState, useEffect, useRef } from 'react';

export default function AdsterraRectangle() {
  const [isBlocked, setIsBlocked] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    // Check if ad loaded after a short delay
    const timer = setTimeout(() => {
      try {
        const doc = iframeRef.current?.contentDocument;
        if (!doc) {
          setIsBlocked(true);
          return;
        }
        
        // The srcDoc initially has 2 script tags. If the ad script successfully runs, 
        // it will inject additional elements (like an iframe or div) into the body.
        // If it's still <= 2, it means it was blocked or there was no fill.
        if (doc.body.children.length <= 2) {
          setIsBlocked(true);
        }
      } catch (err) {
        // Cross-origin blocked usually means the ad took over or is doing something complex.
        // We assume it's working if we can't access it.
      }
    }, 4500); // Extended to 4.5s to prevent false positives on slow 3G connections

    return () => clearTimeout(timer);
  }, []);

  const iframeSrcDoc = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; overflow: hidden; background: transparent; }
        </style>
      </head>
      <body>
        <script>
          atOptions = {
            'key' : 'e1b916236319b86131a6a333ad46f34e',
            'format' : 'iframe',
            'height' : 250,
            'width' : 300,
            'params' : {}
          };
        </script>
        <script async defer src="https://www.highperformanceformat.com/e1b916236319b86131a6a333ad46f34e/invoke.js" onerror="window.parent.postMessage({ type: 'adsterra-blocked' }, '*')"></script>
      </body>
    </html>
  `;

  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (e.data?.type === 'adsterra-blocked') {
        setIsBlocked(true);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
    <div className="w-full flex justify-center items-center my-6">
      <div className="w-[300px] h-[250px] bg-zinc-900/40 rounded-lg overflow-hidden border border-zinc-800 relative flex items-center justify-center">
        {isBlocked ? (
          <div className="flex flex-col items-center justify-center text-center p-4">
            <span className="text-zinc-600 mb-2">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
            </span>
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">Support XHub HD</p>
            <p className="text-[10px] text-zinc-500 mt-1">Please consider allowing ads to support free content.</p>
          </div>
        ) : (
          <iframe
            ref={iframeRef}
            title="Advertisement"
            width="300"
            height="250"
            style={{ border: 'none', overflow: 'hidden' }}
            scrolling="no"
            sandbox="allow-scripts allow-popups allow-popups-to-escape-sandbox allow-same-origin"
            srcDoc={iframeSrcDoc}
            className="absolute inset-0"
          />
        )}
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect, useRef } from 'react';

interface AdsterraNativeProps {
  instanceId?: string | number;
}

export default function AdsterraNative({ instanceId }: AdsterraNativeProps) {
  const [isBlocked, setIsBlocked] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const doc = iframeRef.current?.contentDocument;
        if (!doc) {
          setIsBlocked(true);
          return;
        }
        
        // srcDoc has the container div and the script (2 elements in body)
        // If ad loads, the container div will have children inside it.
        const container = doc.getElementById('container-fe01bc3006e6efa34119cb83f1f49201');
        if (!container || container.children.length === 0) {
          setIsBlocked(true);
        }
      } catch (err) {
        // Assume loaded if cross-origin blocked (taking over window)
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
        <div id="container-fe01bc3006e6efa34119cb83f1f49201"></div>
        <script async="async" data-cfasync="false" src="https://pl30903654.effectivecpmnetwork.com/fe01bc3006e6efa34119cb83f1f49201/invoke.js" onerror="window.parent.postMessage({ type: 'adsterra-native-blocked' }, '*')"></script>
      </body>
    </html>
  `;

  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (e.data?.type === 'adsterra-native-blocked') {
        setIsBlocked(true);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  if (isBlocked) {
    return (
      <div className="col-span-full my-4 flex flex-col justify-center items-center w-full min-h-[100px] border border-zinc-800/50 bg-zinc-900/20 rounded-lg p-4">
        <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-1">Advertisement</p>
        <p className="text-sm text-zinc-400">Please consider whitelisting us in your ad blocker to support free content.</p>
      </div>
    );
  }

  return (
    <div className="col-span-full my-4 flex flex-col justify-center items-center w-full min-h-[100px]">
      <div className="w-full h-full min-h-[100px] bg-transparent">
        <iframe
          ref={iframeRef}
          title="Native Advertisement"
          width="100%"
          height="100%"
          style={{ border: 'none', overflow: 'hidden', minHeight: '100px' }}
          scrolling="no"
          sandbox="allow-scripts allow-popups allow-popups-to-escape-sandbox allow-same-origin"
          srcDoc={iframeSrcDoc}
        />
      </div>
    </div>
  );
}

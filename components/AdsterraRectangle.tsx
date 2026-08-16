'use client';

import { useEffect, useRef, useState } from 'react';

export default function AdsterraRectangle() {
  const adRef = useRef<HTMLDivElement>(null);
  const [isBlocked, setIsBlocked] = useState(false);

  useEffect(() => {
    if (!adRef.current || adRef.current.childElementCount > 0) return;

    (window as any).atOptions = {
      key: '2ff57a74a041dca59c83132a424444cc',
      format: 'iframe',
      height: 250,
      width: 300,
      params: {},
    };

    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://www.highperformanceformat.com/2ff57a74a041dca59c83132a424444cc/invoke.js';
    script.async = true;

    script.onerror = () => setIsBlocked(true);

    adRef.current.appendChild(script);
  }, []);

  if (isBlocked) return null;

  return (
    <div className="w-full flex justify-center items-center my-6">
      <div ref={adRef} className="w-[300px] h-[250px] bg-zinc-900/40 rounded-lg flex items-center justify-center overflow-hidden border border-zinc-800" />
    </div>
  );
}

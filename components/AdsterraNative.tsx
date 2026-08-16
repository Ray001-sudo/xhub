'use client';

import { useEffect, useRef, useState } from 'react';

export default function AdsterraNative() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isBlocked, setIsBlocked] = useState(false);

  useEffect(() => {
    if (!containerRef.current || containerRef.current.querySelector('script')) return;

    const script = document.createElement('script');
    script.src = 'https://pl30877898.effectivecpmnetwork.com/086ceec8969172a6a773f12c75c02d0b/invoke.js';
    script.async = true;
    script.setAttribute('data-cfasync', 'false');

    script.onerror = () => setIsBlocked(true);

    containerRef.current.appendChild(script);
  }, []);

  if (isBlocked) return null;

  return (
    <div className="col-span-full my-4 flex flex-col justify-center items-center w-full min-h-[100px]">
      <div id="container-086ceec8969172a6a773f12c75c02d0b" ref={containerRef} />
    </div>
  );
}

'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function GlobalAdScripts() {
  const pathname = usePathname();

  useEffect(() => {
    // APPROACH USED: Server-Side Capping
    // Adsterra's publisher dashboard explicitly exposes native frequency capping 
    // for both Popunder and Social Bar zones (e.g., 1 impression per 24 hours). 
    // Relying on their cookie-based server-side capping is the recommended approach 
    // rather than a naive frontend throttle. 
    // We re-inject the scripts on route change so Adsterra can re-evaluate its cookies,
    // and we remove the old script tags to prevent DOM bloat.
    
    const injectScript = (id: string, src: string) => {
      const existing = document.getElementById(id);
      if (existing) {
        existing.remove();
      }
      
      const script = document.createElement('script');
      script.id = id;
      script.src = src;
      script.async = true;
      document.body.appendChild(script);
    };

    injectScript('adsterra-popunder-script', 'https://pl30903653.effectivecpmnetwork.com/57/9a/b8/579ab8df64367f0c432b639a634d440c.js');
    injectScript('adsterra-socialbar-script', 'https://pl30877900.effectivecpmnetwork.com/2f/40/62/2f4062e529e230649e9dfd5dab3fb5b2.js');
  }, [pathname]);

  return null;
}

'use client';

import Script from 'next/script';

export function GlobalAdScripts() {
  return (
    <>
      <Script 
        id="adsterra-popunder-script"
        src="https://pl30903653.effectivecpmnetwork.com/57/9a/b8/579ab8df64367f0c432b639a634d440c.js"
        strategy="lazyOnload"
      />
      <Script 
        id="adsterra-socialbar-script"
        src="https://pl30877900.effectivecpmnetwork.com/2f/40/62/2f4062e529e230649e9dfd5dab3fb5b2.js"
        strategy="lazyOnload"
      />
    </>
  );
}

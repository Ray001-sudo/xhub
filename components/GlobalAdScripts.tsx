'use client';

import Script from 'next/script';

export function GlobalAdScripts() {
  return (
    <>
      <Script 
        id="adsterra-popunder-script"
        src="https://pl30937411.effectivecpmnetwork.com/1a/ac/1f/1aac1fc36a1fb24fdd26020c66c08946.js"
        strategy="lazyOnload"
      />
      <Script 
        id="adsterra-socialbar-script"
        src="https://pl30937415.effectivecpmnetwork.com/82/f2/fb/82f2fb33e8a91645eafd2c11d4d573f6.js"
        strategy="lazyOnload"
      />
    </>
  );
}

'use client';

interface AdsterraNativeProps {
  instanceId?: string | number;
}

export default function AdsterraNative({ instanceId }: AdsterraNativeProps) {
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
        <script async="async" data-cfasync="false" src="https://pl30903654.effectivecpmnetwork.com/fe01bc3006e6efa34119cb83f1f49201/invoke.js"></script>
      </body>
    </html>
  `;

  return (
    <div className="col-span-full my-4 flex flex-col justify-center items-center w-full min-h-[100px]">
      <div className="w-full h-full min-h-[100px] bg-transparent">
        <iframe
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

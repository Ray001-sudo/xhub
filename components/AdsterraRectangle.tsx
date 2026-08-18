'use client';

export default function AdsterraRectangle() {
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
            'key' : '5ef8b9c19845cd59aff1af47af7491a2',
            'format' : 'iframe',
            'height' : 250,
            'width' : 300,
            'params' : {}
          };
        </script>
        <script src="https://www.highperformanceformat.com/5ef8b9c19845cd59aff1af47af7491a2/invoke.js"></script>
      </body>
    </html>
  `;

  return (
    <div className="w-full flex justify-center items-center my-6">
      <div className="w-[300px] h-[250px] bg-zinc-900/40 rounded-lg overflow-hidden border border-zinc-800">
        <iframe
          title="Advertisement"
          width="300"
          height="250"
          style={{ border: 'none', overflow: 'hidden' }}
          scrolling="no"
          sandbox="allow-scripts allow-popups allow-popups-to-escape-sandbox allow-same-origin"
          srcDoc={iframeSrcDoc}
        />
      </div>
    </div>
  );
}

import React, { useEffect, useRef } from 'react';

const DigitalRainHeader: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.width = canvas.offsetWidth;
    let height = canvas.height = canvas.offsetHeight;

    const characters = 'SAP ABAP CDS BTP HANA Fiori UI5 01'.split('');
    const fontSize = 16;
    const columns = Math.floor(width / fontSize);
    const drops: number[] = [];

    for (let i = 0; i < columns; i++) {
      drops[i] = 1;
    }

    const draw = () => {
      // White background with slight opacity to create a fading trail effect
      ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.fillRect(0, 0, width, height);

      // Light gray for the falling characters (Reverted to previous version)
      ctx.fillStyle = '#CCCCCC';
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = characters[Math.floor(Math.random() * characters.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    // Initial fill to make the background white from the start
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, width, height);

    const interval = setInterval(draw, 50);

    const handleResize = () => {
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
      // Reset background on resize
      if(ctx) {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="relative w-full h-48 mb-4 bg-white rounded-lg overflow-hidden shadow-md border border-gray-200">
      <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <h1 className="text-5xl font-bold text-gray-800 m-0 p-0 leading-tight animate-fade-in" style={{ animationDelay: '0.2s' }}>
          Yunus Tez
        </h1>
        {/* Updated font size and weight */}
        <p className="text-2xl font-bold text-gray-600 m-0 p-0 mt-2 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          ABAP Developer
        </p>
      </div>
    </div>
  );
};

export default DigitalRainHeader;

import { useEffect, useRef } from 'react';

const DNAHelix = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 300;
    canvas.height = 400;

    let time = 0;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const helixHeight = canvas.height * 0.8;
      const radius = 60;

      // Draw DNA strands
      for (let i = 0; i < 2; i++) {
        ctx.beginPath();
        ctx.strokeStyle = i === 0 ? '#0D7377' : '#A239EA';
        ctx.lineWidth = 3;

        for (let y = 20; y < helixHeight; y += 2) {
          const angle = (y * 0.02 + time * 0.01 + i * Math.PI) % (Math.PI * 2);
          const x = centerX + Math.cos(angle) * radius;
          
          if (y === 20) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      }

      // Draw connecting base pairs
      for (let y = 40; y < helixHeight; y += 20) {
        const angle1 = (y * 0.02 + time * 0.01) % (Math.PI * 2);
        const angle2 = (y * 0.02 + time * 0.01 + Math.PI) % (Math.PI * 2);
        
        const x1 = centerX + Math.cos(angle1) * radius;
        const x2 = centerX + Math.cos(angle2) * radius;

        ctx.beginPath();
        ctx.strokeStyle = '#21E6C1';
        ctx.lineWidth = 2;
        ctx.moveTo(x1, y);
        ctx.lineTo(x2, y);
        ctx.stroke();

        // Draw base pair dots
        [x1, x2].forEach(x => {
          ctx.beginPath();
          ctx.fillStyle = '#21E6C1';
          ctx.arc(x, y, 4, 0, Math.PI * 2);
          ctx.fill();
        });
      }

      time += 0.02;
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        className="animate-float opacity-80"
        style={{ filter: 'drop-shadow(0 0 20px rgba(33, 230, 193, 0.5))' }}
      />
    </div>
  );
};

export default DNAHelix;
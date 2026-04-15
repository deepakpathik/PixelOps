import React, { useRef, useEffect, useState } from "react";

export function TargetClicker({ isPlaying, setGameOver, onScore }: any) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [target, setTarget] = useState({ x: 150, y: 150, radius: 25, active: false });

  // Target spawner logic
  useEffect(() => {
    if (!isPlaying) return;
    const spawner = setInterval(() => {
      setTarget({
        x: Math.floor(Math.random() * 250) + 25,
        y: Math.floor(Math.random() * 150) + 25,
        radius: Math.floor(Math.random() * 10) + 15,
        active: true
      });
    }, 850);
    return () => clearInterval(spawner);
  }, [isPlaying]);

  // Rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#18181b"; 
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (isPlaying && target.active) {
      ctx.beginPath();
      ctx.arc(target.x, target.y, target.radius, 0, Math.PI * 2);
      ctx.fillStyle = "#107C10";
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "#ffffff";
      ctx.stroke();
    }
  }, [isPlaying, target]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isPlaying || !target.active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const dist = Math.sqrt(Math.pow(x - target.x, 2) + Math.pow(y - target.y, 2));
    if (dist <= target.radius) {
      onScore();
      setTarget({ ...target, active: false });
    }
  };

  return (
    <canvas
      ref={canvasRef}
      width={300}
      height={200}
      onClick={handleCanvasClick}
      className={`w-full h-full ${isPlaying ? 'cursor-crosshair' : 'cursor-default'}`}
    />
  );
}

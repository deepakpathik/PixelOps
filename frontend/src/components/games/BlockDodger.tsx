import React, { useRef, useEffect, useState } from "react";

export function BlockDodger({ isPlaying, setGameOver, onScore }: any) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Game states inside refs to avoid re-renders during high-speed animation
  const stateRef = useRef({
    player: { x: 140, y: 170, w: 20, h: 20 },
    blocks: [] as { x: number, y: number, w: number, h: number, speed: number }[],
    scoreTimer: 0,
    active: false
  });

  useEffect(() => {
    stateRef.current.active = isPlaying;
    if (isPlaying) {
      // Reset state
      stateRef.current.player.x = 140;
      stateRef.current.blocks = [];
      stateRef.current.scoreTimer = 0;
    }
  }, [isPlaying]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let frameId: number;

    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#18181b"; 
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const s = stateRef.current;
      if (!s.active) {
        frameId = requestAnimationFrame(loop);
        return;
      }

      // Spawn blocks
      if (Math.random() < 0.05) {
        s.blocks.push({
          x: Math.random() * (canvas.width - 20),
          y: -20,
          w: 20 + Math.random() * 30,
          h: 20,
          speed: 2 + Math.random() * 2
        });
      }

      // Update & Draw blocks
      ctx.fillStyle = "#ef4444"; // red-500
      for (let i = s.blocks.length - 1; i >= 0; i--) {
        const b = s.blocks[i];
        b.y += b.speed;
        ctx.fillRect(b.x, b.y, b.w, b.h);

        // Check collision
        if (
          s.player.x < b.x + b.w &&
          s.player.x + s.player.w > b.x &&
          s.player.y < b.y + b.h &&
          s.player.y + s.player.h > b.y
        ) {
          s.active = false;
          setGameOver();
        }

        // Remove off-screen blocks
        if (b.y > canvas.height) {
          s.blocks.splice(i, 1);
        }
      }

      // Draw Player
      ctx.fillStyle = "#3b82f6"; // blue-500
      ctx.fillRect(s.player.x, s.player.y, s.player.w, s.player.h);

      // Score accumulator
      s.scoreTimer++;
      if (s.scoreTimer % 30 === 0) { // ~2 times per second
        onScore();
      }

      frameId = requestAnimationFrame(loop);
    };

    frameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameId);
  }, [isPlaying, setGameOver, onScore]);

  const handlePointerDown = (e: React.MouseEvent | React.TouchEvent) => {
    if (!stateRef.current.active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    let clientX = 0;
    if ("touches" in e) {
      clientX = e.touches[0].clientX;
    } else {
      clientX = (e as React.MouseEvent).clientX;
    }

    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;

    if (x < canvas.width / 2) {
      // Move Left
      stateRef.current.player.x = Math.max(0, stateRef.current.player.x - 30);
    } else {
      // Move Right
      stateRef.current.player.x = Math.min(canvas.width - stateRef.current.player.w, stateRef.current.player.x + 30);
    }
  };

  return (
    <canvas
      ref={canvasRef}
      width={300}
      height={200}
      onMouseDown={handlePointerDown}
      onTouchStart={handlePointerDown}
      className="w-full h-full cursor-pointer touch-none"
    />
  );
}

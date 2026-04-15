import React, { useRef, useEffect } from "react";

export function SpaceShooter({ isPlaying, setGameOver, onScore }: any) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const stateRef = useRef({
    player: { x: 140, y: 170, w: 20, h: 20 },
    bullets: [] as { x: number, y: number }[],
    enemies: [] as { x: number, y: number, w: number, h: number, hp: number }[],
    fireTimer: 0,
    active: false
  });

  useEffect(() => {
    stateRef.current.active = isPlaying;
    if (isPlaying) {
      stateRef.current.bullets = [];
      stateRef.current.enemies = [];
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

      // Player fire
      s.fireTimer++;
      if (s.fireTimer % 15 === 0) { // Shoot periodically
        s.bullets.push({ x: s.player.x + s.player.w / 2 - 2, y: s.player.y });
      }

      // Spawn enemies
      if (Math.random() < 0.03) {
        s.enemies.push({
          x: Math.random() * (canvas.width - 20),
          y: -20,
          w: 20,
          h: 20,
          hp: 1
        });
      }

      // Draw Bullets
      ctx.fillStyle = "#eab308"; // yellow
      for (let i = s.bullets.length - 1; i >= 0; i--) {
        const b = s.bullets[i];
        b.y -= 5;
        ctx.fillRect(b.x, b.y, 4, 10);

        if (b.y < 0) s.bullets.splice(i, 1);
      }

      // Draw Enemies & Check collisions
      ctx.fillStyle = "#10b981"; // emerald
      for (let i = s.enemies.length - 1; i >= 0; i--) {
        const e = s.enemies[i];
        e.y += 1; // Move down slowly
        ctx.fillRect(e.x, e.y, e.w, e.h);

        // Check if enemy hits bottom -> game over
        if (e.y > canvas.height) {
          s.active = false;
          setGameOver();
          break;
        }

        // Bullet hit enemy
        let enemyHit = false;
        for (let j = s.bullets.length - 1; j >= 0; j--) {
          const b = s.bullets[j];
          if (
            b.x < e.x + e.w &&
            b.x + 4 > e.x &&
            b.y < e.y + e.h &&
            b.y + 10 > e.y
          ) {
            enemyHit = true;
            s.bullets.splice(j, 1);
            break;
          }
        }

        if (enemyHit) {
          onScore();
          s.enemies.splice(i, 1);
        }
      }

      // Draw Player
      ctx.fillStyle = "#a855f7"; // purple
      ctx.beginPath();
      ctx.moveTo(s.player.x + s.player.w / 2, s.player.y);
      ctx.lineTo(s.player.x + s.player.w, s.player.y + s.player.h);
      ctx.lineTo(s.player.x, s.player.y + s.player.h);
      ctx.fill();

      frameId = requestAnimationFrame(loop);
    };

    frameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameId);
  }, [isPlaying, setGameOver, onScore]);

  const handlePointerMove = (e: React.MouseEvent | React.TouchEvent) => {
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

    stateRef.current.player.x = Math.max(0, Math.min(canvas.width - stateRef.current.player.w, x - stateRef.current.player.w / 2));
  };

  return (
    <canvas
      ref={canvasRef}
      width={300}
      height={200}
      onMouseMove={handlePointerMove}
      onTouchMove={handlePointerMove}
      className={`w-full h-full ${isPlaying ? 'cursor-none touch-none' : 'cursor-default'}`}
    />
  );
}

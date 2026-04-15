import React, { useState, useEffect } from "react";
import { X, Play, Trophy } from "lucide-react";
import { ApiGame } from "../services/api";
import { TargetClicker } from "./games/TargetClicker";
import { BlockDodger } from "./games/BlockDodger";
import { SpaceShooter } from "./games/SpaceShooter";

interface PlayableGameModalProps {
  game: ApiGame;
  onClose: () => void;
  onSubmitScore: (score: number) => void;
  isSubmitting: boolean;
}

export function PlayableGameModal({ game, onClose, onSubmitScore, isSubmitting }: PlayableGameModalProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [gameOver, setGameOver] = useState(false);

  // Game loop and timer logic
  useEffect(() => {
    let timer: number;
    if (isPlaying && timeLeft > 0) {
      timer = window.setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isPlaying && timeLeft === 0) {
      setIsPlaying(false);
      setGameOver(true);
    }
    return () => clearInterval(timer);
  }, [isPlaying, timeLeft]);

  const startGame = () => {
    setScore(0);
    setTimeLeft(15);
    setGameOver(false);
    setIsPlaying(true);
  };

  const handleScore = () => {
    setScore((s) => s + 100);
  };

  const triggerGameOver = () => {
    setIsPlaying(false);
    setGameOver(true);
  };

  // Determine game engine
  const renderGameEngine = () => {
    const title = game.title.toLowerCase();
    if (title.includes("drift") || title.includes("neon")) {
      return <BlockDodger isPlaying={isPlaying} setGameOver={triggerGameOver} onScore={handleScore} />;
    }
    if (title.includes("space") || title.includes("pixel")) {
      return <SpaceShooter isPlaying={isPlaying} setGameOver={triggerGameOver} onScore={handleScore} />;
    }
    return <TargetClicker isPlaying={isPlaying} setGameOver={triggerGameOver} onScore={handleScore} />;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm">
      <div className="w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-lg shadow-2xl relative overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-zinc-800 bg-zinc-900/50">
          <div>
            <h3 className="font-bold text-white leading-tight">{game.title}</h3>
            <span className="text-xs text-zinc-500">{game.format} Engine</span>
          </div>
          <button onClick={onClose} className="p-2 text-zinc-500 hover:text-white rounded-md hover:bg-zinc-800 transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Game Viewport */}
        <div className="relative w-full aspect-video bg-zinc-900 flex items-center justify-center">
          {renderGameEngine()}

          {!isPlaying && !gameOver && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60">
              <button 
                onClick={startGame}
                className="w-16 h-16 rounded-full bg-[#107C10] text-white flex items-center justify-center hover:scale-110 transition-transform shadow-[0_0_20px_rgba(16,124,16,0.4)]"
              >
                <Play size={24} className="ml-1" />
              </button>
              <p className="mt-4 text-sm font-bold text-zinc-300">Click targets to earn points!</p>
            </div>
          )}

          {gameOver && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80">
              <Trophy size={48} className="text-[#107C10] mb-2" />
              <div className="text-3xl font-mono font-bold text-white mb-1">{score}</div>
              <p className="text-xs text-zinc-400 mb-6 uppercase tracking-widest">Final Score</p>
              <button
                onClick={() => onSubmitScore(score)}
                disabled={isSubmitting || score === 0}
                className="px-8 py-3 bg-[#107C10] hover:bg-[#0d6b0d] disabled:opacity-50 text-white font-bold rounded-sm shadow-lg tracking-wider"
              >
                {isSubmitting ? "SUBMITTING..." : "SUBMIT SCORE"}
              </button>
              <button 
                onClick={startGame}
                disabled={isSubmitting}
                className="mt-3 text-xs text-zinc-500 hover:text-white underline underline-offset-4"
              >
                Play Again
              </button>
            </div>
          )}
        </div>

        {/* HUD Footers */}
        <div className="grid grid-cols-2 bg-zinc-950 p-4 border-t border-zinc-800">
          <div className="text-left">
            <div className="text-xs text-zinc-500 font-bold uppercase tracking-wider mb-1">Time Left</div>
            <div className={`text-xl font-mono font-bold ${timeLeft <= 5 && isPlaying ? "text-red-500 animate-pulse" : "text-white"}`}>
              00:{timeLeft.toString().padStart(2, "0")}
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-zinc-500 font-bold uppercase tracking-wider mb-1">Score</div>
            <div className="text-xl font-mono font-bold text-[#107C10]">{score}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

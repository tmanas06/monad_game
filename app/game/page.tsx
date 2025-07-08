"use client"

import { useState, useEffect } from "react";
import BubbleTapGame from "@/components/game";
import SnakeGame from "@/components/SnakeGame";
import { Gamepad2, MoveRight } from "lucide-react";

type GameType = 'bubble' | 'snake';

export default function GamePage() {
  const [activeGame, setActiveGame] = useState<GameType>('bubble');

  // Prevent scroll when game is mounted
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white pt-20 pb-10 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-center mb-8">
          <div className="inline-flex rounded-lg bg-gray-800 p-1">
            <button
              onClick={() => setActiveGame('bubble')}
              className={`flex items-center px-6 py-3 rounded-md transition-colors ${
                activeGame === 'bubble' 
                  ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Gamepad2 className="w-5 h-5 mr-2" />
              Bubble Tap
            </button>
            <button
              onClick={() => setActiveGame('snake')}
              className={`flex items-center px-6 py-3 rounded-md transition-colors ${
                activeGame === 'snake' 
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <MoveRight className="w-5 h-5 mr-2" />
              Snake Game
            </button>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl overflow-hidden shadow-2xl">
          {activeGame === 'bubble' ? (
            <div className="p-4">
              <BubbleTapGame />
            </div>
          ) : (
            <div className="p-4">
              <SnakeGame />
            </div>
          )}
        </div>

        <div className="mt-6 text-center text-gray-400 text-sm">
          <p>Use the buttons above to switch between games</p>
          <p className="mt-1">
            {activeGame === 'bubble' 
              ? 'Click the bubbles to pop them and score points!' 
              : 'Use arrow keys to control the snake and eat the red food!'}
          </p>
        </div>
      </div>
    </div>
  );
}

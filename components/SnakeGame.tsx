'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Play, RotateCcw } from 'lucide-react';

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
type Position = { x: number; y: number };

const GRID_SIZE = 20;
const CELL_SIZE = 20;
const GAME_SPEED = 100;

export default function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  
  const snakeRef = useRef<Position[]>([]);
  const foodRef = useRef<Position>({ x: 0, y: 0 });
  const directionRef = useRef<Direction>('RIGHT');
  const nextDirectionRef = useRef<Direction>('RIGHT');
  const gameLoopRef = useRef<number>();

  // Generate food at random position
  const generateFood = useCallback(() => {
    const x = Math.floor(Math.random() * GRID_SIZE);
    const y = Math.floor(Math.random() * GRID_SIZE);
    
    // Make sure food doesn't spawn on snake
    const isOnSnake = snakeRef.current.some(segment => segment.x === x && segment.y === y);
    if (isOnSnake) {
      generateFood();
      return;
    }
    
    foodRef.current = { x, y };
  }, []);

  // Draw the game state
  const drawGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#1F2937';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 0.5;
    for (let i = 0; i < GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * CELL_SIZE, 0);
      ctx.lineTo(i * CELL_SIZE, GRID_SIZE * CELL_SIZE);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(0, i * CELL_SIZE);
      ctx.lineTo(GRID_SIZE * CELL_SIZE, i * CELL_SIZE);
      ctx.stroke();
    }

    // Draw snake
    snakeRef.current.forEach((segment, index) => {
      ctx.fillStyle = index === 0 ? '#4F46E5' : '#6366F1';
      ctx.fillRect(
        segment.x * CELL_SIZE + 1,
        segment.y * CELL_SIZE + 1,
        CELL_SIZE - 2,
        CELL_SIZE - 2
      );
    });

    // Draw food
    ctx.fillStyle = '#EC4899';
    ctx.beginPath();
    const centerX = foodRef.current.x * CELL_SIZE + CELL_SIZE / 2;
    const centerY = foodRef.current.y * CELL_SIZE + CELL_SIZE / 2;
    const radius = CELL_SIZE / 2 - 2;
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fill();
  }, []);

  // Initialize game
  const initGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set canvas size
    canvas.width = GRID_SIZE * CELL_SIZE;
    canvas.height = GRID_SIZE * CELL_SIZE;

    // Initial snake position (center of the grid)
    const startX = Math.floor(GRID_SIZE / 2);
    const startY = Math.floor(GRID_SIZE / 2);
    snakeRef.current = [
      { x: startX, y: startY },
      { x: startX - 1, y: startY },
      { x: startX - 2, y: startY },
    ];

    // Initial food position
    generateFood();
    
    // Reset direction
    directionRef.current = 'RIGHT';
    nextDirectionRef.current = 'RIGHT';
    
    // Reset score
    setScore(0);
    setGameOver(false);
    
    // Draw initial state
    drawGame();
  }, [drawGame, generateFood]);

  // Game loop
  const gameLoop = useCallback(() => {
    if (gameOver || !isPlaying) return;

    // Update direction
    directionRef.current = nextDirectionRef.current;

    // Move snake
    const head = { ...snakeRef.current[0] };
    
    switch (directionRef.current) {
      case 'UP': head.y--; break;
      case 'DOWN': head.y++; break;
      case 'LEFT': head.x--; break;
      case 'RIGHT': head.x++; break;
    }

    // Check collision with walls
    if (
      head.x < 0 || 
      head.x >= GRID_SIZE || 
      head.y < 0 || 
      head.y >= GRID_SIZE ||
      // Check collision with self
      snakeRef.current.some((segment, index) => 
        index > 0 && segment.x === head.x && segment.y === head.y
      )
    ) {
      setGameOver(true);
      setIsPlaying(false);
      if (score > highScore) {
        setHighScore(score);
      }
      return;
    }

    // Add new head
    const newSnake = [head, ...snakeRef.current];

    // Check if food is eaten
    if (head.x === foodRef.current.x && head.y === foodRef.current.y) {
      setScore(prev => prev + 10);
      generateFood();
    } else {
      // Remove tail if no food is eaten
      newSnake.pop();
    }

    snakeRef.current = newSnake;

    // Draw everything
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw food
    ctx.fillStyle = '#FF6B6B';
    ctx.fillRect(
      foodRef.current.x * CELL_SIZE,
      foodRef.current.y * CELL_SIZE,
      CELL_SIZE - 1,
      CELL_SIZE - 1
    );

    // Draw snake
    ctx.fillStyle = '#4ECDC4';
    snakeRef.current.forEach((segment, index) => {
      // Head is a different color
      if (index === 0) {
        ctx.fillStyle = '#45B7D1';
      } else {
        ctx.fillStyle = '#4ECDC4';
      }
      ctx.fillRect(
        segment.x * CELL_SIZE,
        segment.y * CELL_SIZE,
        CELL_SIZE - 1,
        CELL_SIZE - 1
      );
    });

    // Draw grid
    ctx.strokeStyle = '#2D3748';
    ctx.lineWidth = 0.5;
    for (let i = 0; i < GRID_SIZE; i++) {
      // Vertical lines
      ctx.beginPath();
      ctx.moveTo(i * CELL_SIZE, 0);
      ctx.lineTo(i * CELL_SIZE, GRID_SIZE * CELL_SIZE);
      ctx.stroke();
      
      // Horizontal lines
      ctx.beginPath();
      ctx.moveTo(0, i * CELL_SIZE);
      ctx.lineTo(GRID_SIZE * CELL_SIZE, i * CELL_SIZE);
      ctx.stroke();
    }
  }, [gameOver, score, highScore]);

  // Handle keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isPlaying) return;
      
      switch (e.key) {
        case 'ArrowUp':
          if (directionRef.current !== 'DOWN') nextDirectionRef.current = 'UP';
          break;
        case 'ArrowDown':
          if (directionRef.current !== 'UP') nextDirectionRef.current = 'DOWN';
          break;
        case 'ArrowLeft':
          if (directionRef.current !== 'RIGHT') nextDirectionRef.current = 'LEFT';
          break;
        case 'ArrowRight':
          if (directionRef.current !== 'LEFT') nextDirectionRef.current = 'RIGHT';
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying]);

  // Game loop effect
  useEffect(() => {
    if (!isPlaying) return;

    const gameStep = () => {
      // Update direction
      directionRef.current = nextDirectionRef.current;

      // Move snake
      const head = { ...snakeRef.current[0] };
      
      switch (directionRef.current) {
        case 'UP': head.y--; break;
        case 'DOWN': head.y++; break;
        case 'LEFT': head.x--; break;
        case 'RIGHT': head.x++; break;
      }

      // Check collision with walls
      if (
        head.x < 0 || 
        head.x >= GRID_SIZE || 
        head.y < 0 || 
        head.y >= GRID_SIZE ||
        // Check collision with self
        snakeRef.current.some((segment, index) => 
          index > 0 && segment.x === head.x && segment.y === head.y
        )
      ) {
        setGameOver(true);
        setIsPlaying(false);
        setHighScore(prev => Math.max(prev, score));
        return;
      }

      // Add new head
      const newSnake = [head, ...snakeRef.current];

      // Check if food is eaten
      if (head.x === foodRef.current.x && head.y === foodRef.current.y) {
        setScore(prev => prev + 10);
        generateFood();
      } else {
        // Remove tail if no food is eaten
        newSnake.pop();
      }

      snakeRef.current = newSnake;

      // Draw everything
      drawGame();
    };

    const interval = setInterval(gameStep, GAME_SPEED);
    return () => clearInterval(interval);
  }, [isPlaying, gameOver, score, generateFood, drawGame]);

  // Initialize game on mount
  useEffect(() => {
    initGame();
  }, [initGame]);

  // Handle keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isPlaying && e.key === ' ') {
        startGame();
        return;
      }
      
      switch (e.key) {
        case 'ArrowUp':
          if (directionRef.current !== 'DOWN') nextDirectionRef.current = 'UP';
          break;
        case 'ArrowDown':
          if (directionRef.current !== 'UP') nextDirectionRef.current = 'DOWN';
          break;
        case 'ArrowLeft':
          if (directionRef.current !== 'RIGHT') nextDirectionRef.current = 'LEFT';
          break;
        case 'ArrowRight':
          if (directionRef.current !== 'LEFT') nextDirectionRef.current = 'RIGHT';
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying]);

  const startGame = () => {
    initGame();
    setIsPlaying(true);
    setGameOver(false);
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="mb-4 flex items-center justify-between w-full max-w-md">
        <div className="text-xl font-bold text-white">
          Score: <span className="text-yellow-400">{score}</span>
        </div>
        <div className="text-lg text-gray-300">
          High Score: <span className="text-green-400">{highScore}</span>
        </div>
      </div>
      
      <div className="relative bg-gray-900 rounded-lg overflow-hidden shadow-xl">
        <canvas 
          ref={canvasRef}
          className="bg-gray-800"
          style={{
            width: '100%',
            height: 'auto',
            maxWidth: '400px',
            maxHeight: '400px',
          }}
        />
        
        {!isPlaying && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-70">
            {gameOver ? (
              <>
                <h2 className="text-3xl font-bold text-red-500 mb-4">Game Over!</h2>
                <p className="text-white mb-6">Your score: {score}</p>
              </>
            ) : (
              <h2 className="text-3xl font-bold text-white mb-6">Snake Game</h2>
            )}
            <Button 
              onClick={startGame}
              className="px-6 py-3 text-lg flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
            >
              {gameOver ? <RotateCcw className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              {gameOver ? 'Play Again' : 'Start Game'}
            </Button>
          </div>
        )}
      </div>
      
      <div className="mt-6 text-center text-gray-400">
        <p className="mb-2">Use arrow keys to control the snake</p>
        <div className="flex justify-center gap-2">
          <div className="p-2 bg-gray-800 rounded">
            <ArrowUp className="w-5 h-5" />
          </div>
          <div className="p-2 bg-gray-800 rounded">
            <ArrowDown className="w-5 h-5" />
          </div>
          <div className="p-2 bg-gray-800 rounded">
            <ArrowLeft className="w-5 h-5" />
          </div>
          <div className="p-2 bg-gray-800 rounded">
            <ArrowRight className="w-5 h-5" />
          </div>
        </div>
      </div>
    </div>
  );
}

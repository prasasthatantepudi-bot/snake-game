import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GameStatus, Point } from '../types';
import { Trophy, RefreshCw, Play, Pause } from 'lucide-react';

const GRID_SIZE = 20;
const INITIAL_SNAKE: Point[] = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION = { x: 0, y: -1 };

export default function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [status, setStatus] = useState<GameStatus>('IDLE');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const gameLoopRef = useRef<number | null>(null);
  const lastTickTime = useRef<number>(0);
  const speed = 150; // ms per tick

  const generateFood = useCallback((currentSnake: Point[]): Point => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      const onSnake = currentSnake.some(seg => seg.x === newFood.x && seg.y === newFood.y);
      if (!onSnake) break;
    }
    return newFood;
  }, []);

  const moveSnake = useCallback(() => {
    setSnake(prevSnake => {
      const head = prevSnake[0];
      const newHead = {
        x: (head.x + direction.x + GRID_SIZE) % GRID_SIZE,
        y: (head.y + direction.y + GRID_SIZE) % GRID_SIZE,
      };

      // Check self collision
      if (prevSnake.some(seg => seg.x === newHead.x && seg.y === newHead.y)) {
        setStatus('GAME_OVER');
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check food
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(s => s + 10);
        setFood(generateFood(newSnake));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, generateFood]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp': if (direction.y === 0) setDirection({ x: 0, y: -1 }); break;
        case 'ArrowDown': if (direction.y === 0) setDirection({ x: 0, y: 1 }); break;
        case 'ArrowLeft': if (direction.x === 0) setDirection({ x: -1, y: 0 }); break;
        case 'ArrowRight': if (direction.x === 0) setDirection({ x: 1, y: 0 }); break;
        case ' ': // Space to Pause/Play
          setStatus(prev => prev === 'PLAYING' ? 'PAUSED' : 'PLAYING');
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  const tick = useCallback((time: number) => {
    if (status !== 'PLAYING') return;

    if (time - lastTickTime.current >= speed) {
      moveSnake();
      lastTickTime.current = time;
    }
    gameLoopRef.current = requestAnimationFrame(tick);
  }, [status, moveSnake]);

  useEffect(() => {
    if (status === 'PLAYING') {
      gameLoopRef.current = requestAnimationFrame(tick);
    } else if (gameLoopRef.current) {
      cancelAnimationFrame(gameLoopRef.current);
    }
    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    };
  }, [status, tick]);

  useEffect(() => {
    if (score > highScore) setHighScore(score);
  }, [score, highScore]);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setScore(0);
    setStatus('PLAYING');
    setFood(generateFood(INITIAL_SNAKE));
  };

  return (
    <div id="game-container" className="flex flex-col items-center gap-6 p-4">
      {/* Game Header */}
      <div className="w-full max-w-[400px] flex justify-between items-end px-2">
        <div className="space-y-1">
          <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-mono">Score</p>
          <p className="text-3xl font-mono font-bold text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.5)]">
            {score.toString().padStart(4, '0')}
          </p>
        </div>
        <div className="flex flex-col items-end space-y-1">
          <div className="flex items-center gap-2 text-zinc-500">
            <Trophy className="w-3 h-3" />
            <p className="text-[10px] uppercase tracking-widest font-mono">High Score</p>
          </div>
          <p className="text-xl font-mono text-zinc-400">
            {highScore.toString().padStart(4, '0')}
          </p>
        </div>
      </div>

      {/* Game Board */}
      <div className="relative p-2 bg-zinc-800 rounded-xl border-4 border-zinc-700 shadow-2xl overflow-hidden">
        {/* CRT Scanline Effect */}
        <div className="absolute inset-0 pointer-events-none z-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-[length:100%_4px,3px_100%]" />
        
        <div 
          className="grid gap-px bg-zinc-900 border border-zinc-700/50"
          style={{ 
            gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
            width: 'clamp(280px, 80vw, 400px)',
            height: 'clamp(280px, 80vw, 400px)'
          }}
        >
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
            const x = i % GRID_SIZE;
            const y = Math.floor(i / GRID_SIZE);
            const isSnake = snake.some(seg => seg.x === x && seg.y === y);
            const isHead = snake[0].x === x && snake[0].y === y;
            const isFood = food.x === x && food.y === y;

            return (
              <div 
                key={i} 
                className={`relative rounded-sm transition-all duration-150 ${
                  isSnake ? (isHead ? 'bg-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.8)]' : 'bg-blue-600/80') : 
                  isFood ? 'bg-pink-500 shadow-[0_0_15px_rgba(236,72,153,0.8)] animate-pulse' : 
                  'bg-zinc-950/20'
                }`}
              >
                {isFood && (
                  <div className="absolute inset-0 bg-pink-400 blur-[2px] opacity-50" />
                )}
              </div>
            );
          })}
        </div>

        {/* Overlays */}
        <AnimatePresence>
          {status !== 'PLAYING' && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm"
            >
              {status === 'GAME_OVER' ? (
                <div className="text-center space-y-4">
                  <h2 className="text-4xl font-black text-pink-500 tracking-tighter uppercase italic">Game Over</h2>
                  <p className="text-zinc-400 text-sm uppercase tracking-[0.3em]">Final Score: {score}</p>
                  <button 
                    onClick={resetGame}
                    className="flex items-center gap-2 mx-auto px-6 py-2 bg-blue-500 text-white rounded-full font-bold hover:bg-blue-400 transition-colors shadow-[0_0_20px_rgba(59,130,246,0.4)]"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Try Again
                  </button>
                </div>
              ) : (
                <div className="text-center space-y-6">
                  <div className="space-y-2">
                    <h2 className="text-3xl font-bold text-white tracking-tight">Neon Beats</h2>
                    <p className="text-zinc-500 text-xs uppercase tracking-widest">Master the Rhythm</p>
                  </div>
                  <button 
                    onClick={status === 'IDLE' ? resetGame : () => setStatus('PLAYING')}
                    className="group relative flex items-center justify-center w-20 h-20 bg-blue-500 rounded-full hover:scale-110 active:scale-95 transition-all shadow-[0_0_30px_rgba(59,130,246,0.5)]"
                  >
                    <Play className="w-8 h-8 text-white fill-current ml-1" />
                    <div className="absolute inset-0 rounded-full border-2 border-blue-400 animate-ping opacity-20" />
                  </button>
                  <p className="text-zinc-400 text-[10px] uppercase tracking-widest animate-pulse">Press Arrow Keys to Start</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Controls Legend */}
      <div className="flex gap-8 text-[10px] font-mono text-zinc-600 uppercase tracking-widest">
        <div className="flex items-center gap-2">
          <span className="bg-zinc-800 px-1.5 py-0.5 rounded border border-zinc-700 text-zinc-400 select-none">ARROWS</span>
          <span>Move</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="bg-zinc-800 px-1.5 py-0.5 rounded border border-zinc-700 text-zinc-400 select-none">SPACE</span>
          <span>Pause</span>
        </div>
      </div>
    </div>
  );
}

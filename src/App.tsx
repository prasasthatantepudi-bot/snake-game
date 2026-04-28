/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { motion } from 'motion/react';
import { Github, Twitter, Info } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-black text-zinc-100 selection:bg-pink-500/30 selection:text-pink-200 overflow-hidden relative">
      {/* Immersive Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
            x: [0, 20, 0],
            y: [0, -20, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-1/4 -left-1/4 w-[150%] h-[150%] bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.15)_0%,transparent_50%)] blur-[100px]" 
        />
        <motion.div 
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2],
            x: [0, -30, 0],
            y: [0, 30, 0]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-1/4 -right-1/4 w-[150%] h-[150%] bg-[radial-gradient(circle_at_50%_50%,rgba(236,72,153,0.12)_0%,transparent_55%)] blur-[120px]" 
        />
      </div>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-4 py-8 min-h-screen flex flex-col items-center justify-between">
        {/* Header */}
        <motion.header 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="w-full flex justify-between items-center"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-pink-500 rounded-xl flex items-center justify-center p-0.5 shadow-[0_0_20px_rgba(59,130,246,0.4)]">
              <div className="w-full h-full bg-black rounded-[9px] flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
              </div>
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tighter uppercase italic leading-none">Neon Beats</h1>
              <span className="text-[10px] uppercase tracking-[0.4em] text-zinc-500 font-bold">V 1.0.4</span>
            </div>
          </div>
          <div className="flex items-center gap-6 text-zinc-500">
            <Info className="w-5 h-5 hover:text-white cursor-pointer transition-colors" />
            <Github className="w-5 h-5 hover:text-white cursor-pointer transition-colors" />
          </div>
        </motion.header>

        {/* Center: Game Cockpit */}
        <motion.section 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex-1 flex items-center justify-center w-full"
        >
          <SnakeGame />
        </motion.section>

        {/* Footer: Music Player Component */}
        <motion.footer 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="w-full max-w-2xl mb-4"
        >
          <MusicPlayer />
          
          <div className="mt-8 flex justify-center gap-8 text-[10px] uppercase tracking-[0.3em] font-bold text-zinc-600">
            <span className="hover:text-blue-400 cursor-help transition-colors">Privacy</span>
            <span className="hover:text-pink-400 cursor-help transition-colors">Terms</span>
            <span className="hover:text-white cursor-help transition-colors">© 2026 AI-Synth</span>
          </div>
        </motion.footer>
      </main>

      {/* Background Grid Lines Overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-0 bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:40px_40px]" />
    </div>
  );
}


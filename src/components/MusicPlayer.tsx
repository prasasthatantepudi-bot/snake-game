import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Music } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Track } from '../types';

const DUMMY_TRACKS: Track[] = [
  {
    id: '1',
    title: 'Neon Pulse',
    artist: 'Cyber Synth',
    duration: 372,
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    cover: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=400&h=400&fit=crop'
  },
  {
    id: '2',
    title: 'Digital Horizon',
    artist: 'Vector Wave',
    duration: 425,
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    cover: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=400&h=400&fit=crop'
  },
  {
    id: '3',
    title: 'Midnight Drive',
    artist: 'Lofi Glitch',
    duration: 310,
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    cover: 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=400&h=400&fit=crop'
  }
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = DUMMY_TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Playback failed:", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const p = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(p || 0);
    }
  };

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % DUMMY_TRACKS.length);
    setProgress(0);
  };

  const handlePrevious = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + DUMMY_TRACKS.length) % DUMMY_TRACKS.length);
    setProgress(0);
  };

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div id="music-player-container" className="w-full bg-zinc-900/80 backdrop-blur-xl border border-zinc-700/50 rounded-2xl p-6 shadow-2xl">
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleNext}
      />

      <div className="flex flex-col md:flex-row items-center gap-6">
        {/* Album Art */}
        <motion.div 
          key={currentTrack.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative w-24 h-24 md:w-32 md:h-32 shrink-0 group"
        >
          <img 
            src={currentTrack.cover} 
            alt={currentTrack.title}
            className="w-full h-full object-cover rounded-xl shadow-lg border-2 border-pink-500/30 group-hover:border-pink-500 transition-colors duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-xl" />
          {isPlaying && (
            <motion.div 
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute -bottom-1 -right-1 bg-pink-500 p-1.5 rounded-full shadow-lg"
            >
              <Music className="w-4 h-4 text-white" />
            </motion.div>
          )}
        </motion.div>

        {/* Info & Controls */}
        <div className="flex-1 w-full space-y-4">
          <div>
            <h3 className="text-xl font-bold text-white tracking-tight leading-none">{currentTrack.title}</h3>
            <p className="text-zinc-400 text-sm mt-1">{currentTrack.artist}</p>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1">
            <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden cursor-pointer group">
              <motion.div 
                className="h-full bg-gradient-to-r from-blue-500 to-pink-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] uppercase tracking-widest font-mono text-zinc-500">
              <span>{audioRef.current ? formatTime(audioRef.current.currentTime) : '0:00'}</span>
              <span>{formatTime(currentTrack.duration)}</span>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={handlePrevious}
                className="p-2 text-zinc-400 hover:text-white transition-colors hover:scale-110 active:scale-95"
              >
                <SkipBack className="w-5 h-5 fill-current" />
              </button>
              
              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-12 h-12 flex items-center justify-center rounded-full bg-white text-black shadow-lg hover:shadow-pink-500/20 active:scale-90 transition-all"
              >
                {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 ml-0.5 fill-current" />}
              </button>

              <button 
                onClick={handleNext}
                className="p-2 text-zinc-400 hover:text-white transition-colors hover:scale-110 active:scale-95"
              >
                <SkipForward className="w-5 h-5 fill-current" />
              </button>
            </div>

            <div className="flex items-center gap-2 text-zinc-500">
              <Volume2 className="w-4 h-4" />
              <div className="w-20 h-1 bg-zinc-800 rounded-full">
                <div className="w-2/3 h-full bg-zinc-600 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

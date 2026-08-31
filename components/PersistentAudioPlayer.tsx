'use client';

import { createContext, useContext, useRef, useState, ReactNode } from 'react';
import { Play, Pause, Music2 } from 'lucide-react';
import { DEFAULT_MUSIC_URL } from '@/lib/siteDefaults';
import { usePathname } from 'next/navigation';

type AudioContextType = {
  isPlaying: boolean;
  togglePlay: () => void;
  musicUrl: string;
  setMusicUrl: (url: string) => void;
  error: string;
};

const AudioContext = createContext<AudioContextType | null>(null);

export function useAudio() {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
}

export function AudioProvider({
  initialMusicUrl,
  children
}: {
  initialMusicUrl?: string | null;
  children: ReactNode;
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [musicUrl, setMusicUrl] = useState(initialMusicUrl?.trim() || DEFAULT_MUSIC_URL);
  const [error, setError] = useState('');

  async function togglePlay() {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      try {
        setError('');
        await audioRef.current.play();
        setIsPlaying(true);
      } catch {
        setIsPlaying(false);
        setError('Musik belum bisa diputar.');
      }
    }
  }

  return (
    <AudioContext.Provider value={{ isPlaying, togglePlay, musicUrl, setMusicUrl, error }}>
      {children}
      <audio
        ref={audioRef}
        src={musicUrl}
        loop
        preload="metadata"
        onError={() => {
          setIsPlaying(false);
          setError('Format musik tidak didukung.');
        }}
        onEnded={() => setIsPlaying(false)}
      />
    </AudioContext.Provider>
  );
}

export function PersistentAudioWidget() {
  const pathname = usePathname();
  const { isPlaying, togglePlay, error } = useAudio();

  // Hide on admin routes
  if (pathname.startsWith('/admin') || pathname.startsWith('/api')) {
    return null;
  }

  return (
    <aside className="fixed bottom-5 left-4 z-40 sm:bottom-6 sm:left-6" aria-label="Pemutar musik latar">
      <div className="flex items-center gap-2 rounded-full border border-burgundy/15 bg-[#FDFBF7]/95 p-1.5 pr-3.5 shadow-card backdrop-blur-md transition-all duration-300 hover:border-burgundy/30 hover:shadow-elevated">
        <button
          type="button"
          onClick={togglePlay}
          aria-label={isPlaying ? 'Jeda musik cerita' : 'Putar musik cerita'}
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white shadow-subtle transition duration-300 hover:scale-105 active:scale-95 ${
            isPlaying ? 'bg-burgundy ring-2 ring-dustyrose/40' : 'bg-dustyrose hover:bg-dustyrose-dark'
          }`}
        >
          {isPlaying ? <Pause size={14} /> : <Play size={14} className="ml-0.5" />}
        </button>

        <div className="flex flex-col text-left">
          <span className="flex items-center gap-1 text-[11px] font-semibold text-burgundy sm:text-xs">
            <Music2 size={11} className="text-dustyrose shrink-0" />
            <span className="truncate max-w-[90px] sm:max-w-[130px]">
              {isPlaying ? 'Memutar musik' : 'Musik cerita'}
            </span>
          </span>
          <span className="text-[9px] sm:text-[10px] text-ink-muted leading-none">
            {error ? error : isPlaying ? 'Klik untuk jeda' : 'Klik dengarkan'}
          </span>
        </div>
      </div>
    </aside>
  );
}

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
      <div className="flex items-center gap-2.5 rounded-2xl border-2 border-[#8C4E28] bg-[#FFF3CC]/95 p-2 pr-4 shadow-[0_6px_20px_rgba(0,0,0,0.45)] backdrop-blur-md transition-all duration-150">
        <button
          type="button"
          onClick={togglePlay}
          aria-label={isPlaying ? 'Jeda musik cerita' : 'Putar musik cerita'}
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 border-[#4A2411] text-[#FFF3CC] shadow-md transition duration-150 active:scale-95 ${
            isPlaying
              ? 'bg-gradient-to-b from-[#A05A2C] to-[#7A3C18] ring-2 ring-[#F9EC88]'
              : 'bg-gradient-to-b from-[#8C4E28] to-[#663300] hover:brightness-110'
          }`}
        >
          {isPlaying ? <Pause size={16} /> : <Play size={16} className="ml-0.5 text-[#F9EC88]" />}
        </button>

        <div className="flex flex-col text-left">
          <span className="flex items-center gap-1 font-nunito text-xs font-black text-[#663300] sm:text-sm">
            <Music2 size={13} className="text-[#B53000] shrink-0" />
            <span className="truncate max-w-[100px] sm:max-w-[140px]">
              {isPlaying ? 'Memutar Musik' : 'Musik Cerita'}
            </span>
          </span>
          <span className="font-nunito text-[10px] sm:text-[11px] font-bold text-[#8C4E28] leading-tight">
            {error ? error : isPlaying ? 'Klik untuk jeda' : 'Klik dengarkan'}
          </span>
        </div>
      </div>
    </aside>
  );
}

'use client';

import { Pause, Play, Music2 } from 'lucide-react';
import { useAudio } from './PersistentAudioPlayer';

export type AudioPlayerProps = {
  src?: string | null;
};

export default function AudioPlayer({ src }: AudioPlayerProps = {}) {
  const { isPlaying, togglePlay, error } = useAudio();
  void src;

  return (
    <div className="flex flex-wrap items-center justify-center gap-3 rounded-2xl border border-[rgba(90,40,52,0.12)] bg-[#FDFBF7] px-5 py-3.5 text-sm text-ink shadow-subtle">
      <button
        type="button"
        onClick={togglePlay}
        aria-label={isPlaying ? 'Jeda musik' : 'Putar musik'}
        className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-burgundy text-white transition hover:bg-burgundy-dark active:scale-95"
      >
        {isPlaying ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
      </button>
      <div className="text-left">
        <p className="font-medium text-burgundy flex items-center gap-1.5">
          <Music2 size={14} className="text-dustyrose" />
          Musik kecil untuk menemani
        </p>
        <p className={`text-xs leading-5 ${error ? 'text-error' : 'text-ink-muted'}`}>
          {error || (isPlaying ? 'Sedang memutar... Klik untuk jeda.' : 'Klik play kalau kamu ingin mendengarkan.')}
        </p>
      </div>
    </div>
  );
}

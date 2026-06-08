'use client';

import { Pause, Play } from 'lucide-react';
import { useRef, useState } from 'react';
import { DEFAULT_MUSIC_URL } from '@/lib/siteDefaults';

export default function AudioPlayer({ src }: { src?: string | null }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [failedSrc, setFailedSrc] = useState('');
  const music = src?.trim() || DEFAULT_MUSIC_URL;
  const error = failedSrc === music ? 'Musik belum bisa diputar. Cek URL musik di admin.' : '';

  async function toggle() {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      try {
        setFailedSrc('');
        await audioRef.current.play();
        setPlaying(true);
      } catch {
        setPlaying(false);
        setFailedSrc(music);
      }
    }
  }

  return (
    <div className="flex flex-wrap items-center justify-center gap-3 rounded-2xl border border-[rgba(196,138,106,0.22)] bg-white px-4 py-3 text-sm text-cocoa shadow-xs">
      <button type="button" onClick={toggle} aria-label={playing ? 'Jeda musik' : 'Putar musik'} className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-rose text-white transition hover:bg-rose-dark">
        {playing ? <Pause size={18} /> : <Play size={18} />}
      </button>
      <div className="text-left">
        <p className="font-medium">Musik kecil untuk menemani</p>
        <p className={`text-xs leading-5 ${error ? 'text-error' : 'text-muted'}`}>
          {error || 'Klik play kalau kamu ingin mendengarkan.'}
        </p>
      </div>
      <audio ref={audioRef} src={music} loop preload="none" onError={() => { setPlaying(false); setFailedSrc(music); }} />
    </div>
  );
}

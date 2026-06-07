'use client';

import { Pause, Play } from 'lucide-react';
import { useRef, useState } from 'react';

export default function AudioPlayer({ src }: { src?: string | null }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const music = src || '/audio/placeholder.txt';
  const playable = Boolean(src);

  async function toggle() {
    if (!playable || !audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      await audioRef.current.play();
      setPlaying(true);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-3xl border border-rose/20 bg-white/70 px-4 py-3 text-sm text-cocoa shadow-sm backdrop-blur">
      <button onClick={toggle} disabled={!playable} className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-maroon text-white disabled:cursor-not-allowed disabled:bg-rosegold/50">
        {playing ? <Pause size={18} /> : <Play size={18} />}
      </button>
      <div>
        <p className="font-bold">Musik kecil untuk menemani</p>
        <p className="text-xs text-cocoa/60">{playable ? 'Klik tombol play kalau kamu ingin mendengarkan.' : 'Placeholder musik. Upload file nanti ke public/audio dan isi URL di admin.'}</p>
      </div>
      {playable && <audio ref={audioRef} src={music} loop />}
    </div>
  );
}

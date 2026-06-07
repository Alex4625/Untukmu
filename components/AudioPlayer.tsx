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
    <div className="flex flex-wrap items-center justify-center gap-3 rounded-2xl border border-[rgba(196,138,106,0.22)] bg-white px-4 py-3 text-sm text-cocoa shadow-xs">
      <button onClick={toggle} disabled={!playable} aria-label={playing ? 'Jeda musik' : 'Putar musik'} className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-rose text-white transition hover:bg-rose-dark disabled:cursor-not-allowed disabled:bg-softpink">
        {playing ? <Pause size={18} /> : <Play size={18} />}
      </button>
      <div className="text-left">
        <p className="font-medium">Musik kecil untuk menemani</p>
        <p className="text-xs leading-5 text-muted">{playable ? 'Klik play kalau kamu ingin mendengarkan.' : 'Placeholder musik. Isi URL musik di admin.'}</p>
      </div>
      {playable && <audio ref={audioRef} src={music} loop />}
    </div>
  );
}

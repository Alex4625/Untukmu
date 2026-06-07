'use client';

import { useEffect, useMemo, useState } from 'react';

type Props = { unlockIso: string };

type Remaining = { days: number; hours: number; minutes: number; seconds: number; done: boolean };

const initialRemaining: Remaining = { days: 0, hours: 0, minutes: 0, seconds: 0, done: false };

function getRemaining(unlockIso: string): Remaining {
  const target = new Date(unlockIso).getTime();
  const diff = target - Date.now();

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, done: true };
  }

  const totalSeconds = Math.floor(diff / 1000);

  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
    done: false
  };
}

export default function Countdown({ unlockIso }: Props) {
  const [mounted, setMounted] = useState(false);
  const [time, setTime] = useState<Remaining>(initialRemaining);

  useEffect(() => {
    setMounted(true);
    setTime(getRemaining(unlockIso));

    const timer = window.setInterval(() => {
      setTime(getRemaining(unlockIso));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [unlockIso]);

  const items = useMemo(
    () => [
      ['Hari', time.days],
      ['Jam', time.hours],
      ['Menit', time.minutes],
      ['Detik', time.seconds]
    ],
    [time]
  );

  if (!mounted) {
    return (
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4" suppressHydrationWarning>
        {['Hari', 'Jam', 'Menit', 'Detik'].map((label) => (
          <div key={label} className="rounded-3xl border border-rose/20 bg-white/75 p-4 text-center shadow-sm backdrop-blur">
            <div className="font-display text-4xl font-bold text-maroon sm:text-5xl">--</div>
            <div className="mt-1 text-xs font-bold uppercase tracking-[0.25em] text-rosegold">{label}</div>
          </div>
        ))}
      </div>
    );
  }

  if (time.done) {
    return <p className="text-lg font-bold text-maroon">Hari ini akhirnya datang.</p>;
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4" suppressHydrationWarning>
      {items.map(([label, value]) => (
        <div key={String(label)} className="rounded-3xl border border-rose/20 bg-white/75 p-4 text-center shadow-sm backdrop-blur">
          <div className="font-display text-4xl font-bold text-maroon sm:text-5xl">{String(value).padStart(2, '0')}</div>
          <div className="mt-1 text-xs font-bold uppercase tracking-[0.25em] text-rosegold">{label}</div>
        </div>
      ))}
    </div>
  );
}
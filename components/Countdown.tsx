'use client';

import { useMemo, useSyncExternalStore } from 'react';

type Props = { unlockIso: string };

type Remaining = { days: number; hours: number; minutes: number; seconds: number; done: boolean };

const initialRemaining: Remaining = { days: 0, hours: 0, minutes: 0, seconds: 0, done: false };
let nowSnapshot = 0;

function getRemaining(unlockIso: string, now = Date.now()): Remaining {
  const target = new Date(unlockIso).getTime();
  const diff = target - now;

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

function subscribe(callback: () => void) {
  nowSnapshot = Date.now();
  const firstTick = window.setTimeout(callback, 0);
  const timer = window.setInterval(() => {
    nowSnapshot = Date.now();
    callback();
  }, 1000);
  return () => {
    window.clearTimeout(firstTick);
    window.clearInterval(timer);
  };
}

function getClientSnapshot() {
  return nowSnapshot;
}

function getServerSnapshot() {
  return 0;
}

export default function Countdown({ unlockIso }: Props) {
  const now = useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);
  const mounted = now > 0;
  const time = mounted ? getRemaining(unlockIso, now) : initialRemaining;

  const items = useMemo(
    () => [
      ['Hari', time.days],
      ['Jam', time.hours],
      ['Menit', time.minutes],
      ['Detik', time.seconds]
    ],
    [time]
  );

  if (time.done) {
    return <p className="text-lg font-bold text-maroon">Hari ini akhirnya datang.</p>;
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4" aria-live="polite" suppressHydrationWarning>
      {items.map(([label, value]) => {
        const display = mounted ? String(value).padStart(2, '0') : '--';
        return (
          <div key={String(label)} className="rounded-2xl border border-[rgba(196,138,106,0.22)] bg-white px-4 py-6 text-center shadow-romantic">
            <div className="font-display text-6xl font-light leading-none text-maroon sm:text-7xl">{display}</div>
            <div className="mt-2 text-[11px] font-medium uppercase tracking-[0.08em] text-muted">{label}</div>
          </div>
        );
      })}
    </div>
  );
}

'use client';

import { useEffect, useMemo, useSyncExternalStore } from 'react';

type Props = {
  unlockIso: string;
  onComplete?: () => void;
};

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

export default function Countdown({ unlockIso, onComplete }: Props) {
  const now = useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);
  const mounted = now > 0;
  const time = mounted ? getRemaining(unlockIso, now) : initialRemaining;

  useEffect(() => {
    if (time.done && onComplete) {
      onComplete();
    }
  }, [time.done, onComplete]);

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
    return (
      <div className="card p-6 text-center">
        <p className="font-nunito text-3xl font-extrabold text-[#663300]">Hari ini akhirnya datang!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4 max-w-xl mx-auto" aria-live="polite" suppressHydrationWarning>
      {items.map(([label, value]) => {
        const display = mounted ? String(value).padStart(2, '0') : '--';
        return (
          <div
            key={String(label)}
            className="rounded-xl border-2 border-[#8C4E28] bg-[#FFF3CC] px-3 py-4 text-center shadow-[0_4px_10px_rgba(0,0,0,0.25)] sm:px-4 sm:py-6"
          >
            <div className="font-nunito text-4xl sm:text-5xl font-black leading-none text-[#663300] drop-shadow-sm">
              {display}
            </div>
            <div className="mt-2 text-xs sm:text-sm font-extrabold uppercase tracking-wider text-[#B53000]">
              {label}
            </div>
          </div>
        );
      })}
    </div>
  );
}

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Heart, Play, Pause } from 'lucide-react';
import { previewPath } from '@/lib/publicUrl';
import { useAudio } from './PersistentAudioPlayer';

export default function PublicNav({
  preview = false,
  currentChapterNumber
}: {
  preview?: boolean;
  currentChapterNumber?: string;
}) {
  const pathname = usePathname();
  const { isPlaying, togglePlay } = useAudio();

  const navLinks = [
    { label: 'Beranda', href: '/' },
    { label: 'Countdown', href: '/countdown' },
    { label: 'Daftar Cerita', href: '/hub' }
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-14 border-b-2 border-[#F9EC88] bg-[#154794]/95 shadow-[0_4px_16px_rgba(0,0,0,0.4)] backdrop-blur-md">
      <div className="mx-auto flex h-full max-w-5xl items-center justify-between px-4 sm:px-6">
        {/* Brand / Logo */}
        <Link
          href={previewPath('/', preview)}
          className="group flex items-center gap-2 font-nunito text-base sm:text-lg font-black text-white transition hover:text-[#F9EC88]"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-full border border-[#8C4E28] bg-[#FFE8A3] text-[#B53000] shadow-sm">
            <Heart size={14} fill="currentColor" />
          </span>
          <span className="tracking-wide">Untuk Nona</span>
        </Link>

        {/* Center Links (Desktop / Tablet) */}
        <nav className="hidden items-center gap-1 sm:flex" aria-label="Navigasi utama">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={previewPath(link.href, preview)}
                className={`rounded-lg px-3 py-1.5 font-nunito text-xs sm:text-sm font-extrabold uppercase tracking-wider transition ${
                  isActive
                    ? 'border-b-2 border-[#F9EC88] text-[#F9EC88]'
                    : 'text-white/90 hover:bg-white/10 hover:text-[#F9EC88]'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Controls: Chapter indicator & Music toggle */}
        <div className="flex items-center gap-2 sm:gap-3">
          {currentChapterNumber && (
            <Link
              href={previewPath('/hub', preview)}
              className="rounded-lg border border-[#4A2411] bg-gradient-to-b from-[#A05A2C] to-[#7A3C18] px-2.5 py-1 font-nunito text-xs font-black text-[#F9EC88] shadow-sm transition hover:brightness-110"
              title="Klik untuk lihat daftar chapter"
            >
              Ch. {currentChapterNumber}/07
            </Link>
          )}

          {/* Integrated Header Audio Button */}
          <button
            type="button"
            onClick={togglePlay}
            aria-label={isPlaying ? 'Jeda musik cerita' : 'Putar musik cerita'}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#F9EC88] bg-[#FFE8A3] text-[#663300] shadow-sm transition hover:scale-105 active:scale-95"
            title={isPlaying ? 'Jeda musik' : 'Putar musik'}
          >
            {isPlaying ? (
              <Pause size={15} className="text-[#663300]" />
            ) : (
              <Play size={15} className="ml-0.5 text-[#663300]" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}

'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import type { DeskPolaroid } from '@/lib/types';
import { Maximize2, X, Music, Heart, Volume2, VolumeX } from 'lucide-react';
import { useAudio } from '@/components/PersistentAudioPlayer';

export default function DeskSurface({
  polaroids = [],
  showPetals = false,
  children
}: {
  polaroids?: DeskPolaroid[];
  showPetals?: boolean;
  children: React.ReactNode;
}) {
  const [activePhoto, setActivePhoto] = useState<DeskPolaroid | null>(null);
  const { isPlaying, togglePlay } = useAudio();

  // Fallback sample polaroids if none uploaded yet so the desk looks rich and authentic
  const displayPolaroids = polaroids.length > 0 ? polaroids : [
    {
      id: 'sample-1',
      caption: 'Hari paling berharga ♡',
      media_key: null,
      image_url: '/uploads/memories/cavohv3geer6f21n22gq.jpg',
      rotation_deg: -5,
      sort_order: 1,
      status: 'active' as const,
      created_at: new Date().toISOString()
    },
    {
      id: 'sample-2',
      caption: 'Senyum favoritku selalu',
      media_key: null,
      image_url: '/uploads/memories/weewsbbc7olcom3ur9jw.jpg',
      rotation_deg: 6,
      sort_order: 2,
      status: 'active' as const,
      created_at: new Date().toISOString()
    }
  ];

  return (
    <div className="antique-desk-surface relative min-h-screen w-full overflow-x-hidden text-stardew-ink flex flex-col items-center justify-center py-6 sm:py-10 px-2 sm:px-6">
      {/* Delicate Ambient Vignette & Warm Desk Lamp Glow */}
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-40 mix-blend-soft-light"
        style={{
          background: 'radial-gradient(circle at 50% 30%, rgba(255, 230, 180, 0.25) 0%, transparent 70%)'
        }}
      />

      {/* Floating Flower Petals (Falling gentle sakura / rose petals for Chapter 7) */}
      {showPetals && (
        <div className="pointer-events-none fixed inset-0 z-40 overflow-hidden">
          {Array.from({ length: 22 }).map((_, i) => {
            const leftPos = (i * 4.6 + (i % 3) * 2) % 96;
            const duration = 7 + (i % 5) * 1.5;
            const delay = (i * 0.45) % 6;
            const driftX = (i % 2 === 0 ? 1 : -1) * (50 + (i % 4) * 20);
            const spin = 240 + (i % 5) * 80;
            return (
              <div
                key={i}
                className="animate-petal absolute -top-8"
                style={{
                  left: `${leftPos}%`,
                  // @ts-expect-error CSS variable custom properties
                  '--duration': `${duration}s`,
                  '--drift-x': `${driftX}px`,
                  '--spin-deg': `${spin}deg`,
                  animationDelay: `${delay}s`
                }}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="drop-shadow-sm opacity-80"
                >
                  <path
                    d="M12 2C9 7 4 9 4 14C4 18.5 7.5 22 12 22C16.5 22 20 18.5 20 14C20 9 15 7 12 2Z"
                    fill={i % 2 === 0 ? '#ECA0B2' : '#F6C1CB'}
                  />
                  <path
                    d="M12 4C10.5 7.5 7.5 9 7.5 13C7.5 16 9.5 18.5 12 19"
                    stroke="#D87890"
                    strokeWidth="0.8"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            );
          })}
        </div>
      )}

      {/* Top Ambient Floating Controls (Vintage Music Box & Desk Title) */}
      <header className="relative z-20 mb-3 sm:mb-6 flex w-full max-w-6xl items-center justify-between px-3 sm:px-4">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full border border-[#D4A325]/40 bg-[#361B0E]/80 text-[#F9EC88] shadow-md backdrop-blur-sm">
            <Heart size={14} className="fill-[#D4A325]/40 text-[#F9EC88]" />
          </span>
          <div>
            <h1 className="font-display text-base sm:text-xl font-bold tracking-wide text-[#FBF6EB] drop-shadow-md">
              Untuk Nona
            </h1>
            <p className="text-[10px] sm:text-xs font-semibold text-[#D9C4A5]/80">
              10 Desember 2026 · Buku Kenangan
            </p>
          </div>
        </div>

        {/* Vintage Desk Music Player Widget */}
        <button
          onClick={togglePlay}
          className="group flex items-center gap-2 rounded-full border border-[#D4A325]/40 bg-[#2A150B]/90 px-3 py-1.5 sm:px-4 sm:py-2 text-xs font-bold text-[#FBF6EB] shadow-lg transition-all duration-200 hover:border-[#D4A325] hover:bg-[#3D1F10] hover:scale-105 active:scale-95"
          title={isPlaying ? 'Pause musik latar' : 'Putar musik latar'}
        >
          <span className={`flex h-5 w-5 items-center justify-center rounded-full bg-[#D4A325]/20 text-[#F9EC88] ${isPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '4s' }}>
            <Music size={12} />
          </span>
          <span className="hidden sm:inline font-display text-sm tracking-wide text-[#E8D4B4]">
            {isPlaying ? 'Musik Berputar' : 'Putar Musik Meja'}
          </span>
          {isPlaying ? (
            <Volume2 size={14} className="text-[#F9EC88]" />
          ) : (
            <VolumeX size={14} className="text-[#BBA388]" />
          )}
        </button>
      </header>

      {/* Main Center Area: Antique Book & Keepsakes */}
      <div className="relative z-10 w-full max-w-7xl flex flex-col items-center justify-center">
        {/* Children (The 3D Book Container) */}
        {children}

        {/* Scattered Keepsake Polaroids on the Wooden Desk (Desktop View) */}
        <div className="hidden xl:block pointer-events-none absolute inset-0 z-0">
          {/* Left Side Polaroid (Pinned to the desk) */}
          {displayPolaroids[0] && (
            <div
              className="pointer-events-auto polaroid-frame absolute -left-8 top-16 w-52 p-3 pb-4 rounded-sm cursor-pointer"
              style={{
                transform: `rotate(${displayPolaroids[0].rotation_deg ?? -5}deg)`
              }}
              onClick={() => setActivePhoto(displayPolaroids[0])}
            >
              {/* Washi tape on top */}
              <div className="washi-tape absolute -top-3 left-1/2 -translate-x-1/2 h-5 w-16 -rotate-2" />
              <div className="relative h-44 w-full overflow-hidden rounded-xs bg-[#EFE6D5]">
                {displayPolaroids[0].image_url ? (
                  <Image
                    src={displayPolaroids[0].image_url}
                    alt={displayPolaroids[0].caption || 'Polaroid Meja'}
                    fill
                    sizes="200px"
                    className="object-cover sepia-[0.12] transition-transform duration-300 hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-[#D9C4A5] text-[#5A3E2D] font-display text-sm">
                    Foto Kenangan
                  </div>
                )}
              </div>
              <p className="mt-2.5 text-center font-display text-sm font-semibold italic text-[#4A2614] line-clamp-1">
                {displayPolaroids[0].caption || 'Momen kecil kita'}
              </p>
            </div>
          )}

          {/* Right Side Polaroid */}
          {displayPolaroids[1] && (
            <div
              className="pointer-events-auto polaroid-frame absolute -right-8 bottom-12 w-52 p-3 pb-4 rounded-sm cursor-pointer"
              style={{
                transform: `rotate(${displayPolaroids[1].rotation_deg ?? 6}deg)`
              }}
              onClick={() => setActivePhoto(displayPolaroids[1])}
            >
              {/* Washi tape on top */}
              <div className="washi-tape absolute -top-3 left-1/2 -translate-x-1/2 h-5 w-16 rotate-3" />
              <div className="relative h-44 w-full overflow-hidden rounded-xs bg-[#EFE6D5]">
                {displayPolaroids[1].image_url ? (
                  <Image
                    src={displayPolaroids[1].image_url}
                    alt={displayPolaroids[1].caption || 'Polaroid Meja'}
                    fill
                    sizes="200px"
                    className="object-cover sepia-[0.12] transition-transform duration-300 hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-[#D9C4A5] text-[#5A3E2D] font-display text-sm">
                    Foto Kenangan
                  </div>
                )}
              </div>
              <p className="mt-2.5 text-center font-display text-sm font-semibold italic text-[#4A2614] line-clamp-1">
                {displayPolaroids[1].caption || 'Senyum favoritku'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Mobile/Tablet Polaroids row underneath the book */}
      <div className="xl:hidden relative z-20 mt-8 flex flex-wrap items-center justify-center gap-4 px-2">
        {displayPolaroids.slice(0, 2).map((item, idx) => (
          <div
            key={item.id || idx}
            onClick={() => setActivePhoto(item)}
            className="polaroid-frame w-36 sm:w-44 p-2.5 pb-3 rounded-sm cursor-pointer"
            style={{
              transform: `rotate(${idx === 0 ? -3 : 4}deg)`
            }}
          >
            <div className="washi-tape absolute -top-2 left-1/2 -translate-x-1/2 h-4 w-12" />
            <div className="relative h-32 sm:h-36 w-full overflow-hidden rounded-xs bg-[#EFE6D5]">
              {item.image_url ? (
                <Image
                  src={item.image_url}
                  alt={item.caption || 'Polaroid Meja'}
                  fill
                  sizes="160px"
                  className="object-cover sepia-[0.12]"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-[#D9C4A5] text-[#5A3E2D] font-display text-xs">
                  Foto Kenangan
                </div>
              )}
            </div>
            <p className="mt-1.5 text-center font-display text-xs font-semibold italic text-[#4A2614] truncate">
              {item.caption || 'Foto Kenangan'}
            </p>
          </div>
        ))}
      </div>

      {/* Focused Polaroid Zoom Modal */}
      {activePhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onClick={() => setActivePhoto(null)}
        >
          <div
            className="polaroid-frame relative max-w-md w-full p-4 pb-6 rounded-sm scale-100 animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActivePhoto(null)}
              className="absolute -top-3 -right-3 flex h-8 w-8 items-center justify-center rounded-full bg-[#4A2614] text-[#F9EC88] border border-[#D4A325] shadow-lg hover:bg-[#663300]"
            >
              <X size={18} />
            </button>
            <div className="relative h-80 sm:h-96 w-full overflow-hidden rounded-xs bg-[#EFE6D5]">
              {activePhoto.image_url && (
                <Image
                  src={activePhoto.image_url}
                  alt={activePhoto.caption || 'Foto Meja'}
                  fill
                  sizes="(max-width: 600px) 100vw, 450px"
                  className="object-contain"
                />
              )}
            </div>
            <p className="mt-4 text-center font-display text-xl font-bold italic text-[#4A2614]">
              {activePhoto.caption || 'Momen Kecil yang Abadi ♡'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

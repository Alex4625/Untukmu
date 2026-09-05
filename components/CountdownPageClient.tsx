'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Gift, Lock, ArrowRight } from 'lucide-react';
import AudioPlayer from './AudioPlayer';
import ConfettiButton, { burstConfetti } from './ConfettiButton';
import Countdown from './Countdown';
import type { PublicContent } from '@/lib/types';
import { previewPath } from '@/lib/publicUrl';
import PublicNav from './PublicNav';

export default function CountdownPageClient({ content }: { content: PublicContent }) {
  const [isUnlocked, setIsUnlocked] = useState(content.unlocked);
  const hasFiredConfetti = useRef(false);

  const hubHref = previewPath('/hub', content.preview);

  // Trigger restrained confetti ONCE upon entering Birthday Mode (DEC-003 & Section 4)
  useEffect(() => {
    if (isUnlocked && !hasFiredConfetti.current) {
      hasFiredConfetti.current = true;
      burstConfetti();
    }
  }, [isUnlocked]);

  return (
    <main className="min-h-dvh pt-16 sm:pt-20 pb-36 sm:pb-28 px-2.5 sm:px-6">
      <PublicNav preview={content.preview} />
      {content.preview && (
        <div className="mx-auto max-w-2xl mb-4 px-1">
          <p className="rounded-xl border-2 border-[#8C4E28] bg-[#FFE8A3] px-3 py-1.5 text-xs font-black text-[#663300] text-center">
            Mode preview admin sedang aktif.
          </p>
        </div>
      )}

      <section className="relative z-10 mx-auto flex w-full max-w-2xl flex-col items-center justify-center text-center">
        {isUnlocked ? (
          /* Birthday Mode (DEC-002: Editorial Paper Card, no glassmorphism) */
          <div className="card world-frame-enter w-full px-4 py-8 sm:px-12 sm:py-16 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-paper text-burgundy shadow-subtle soft-pulse">
              <Gift size={26} className="text-dustyrose" />
            </div>

            <p className="eyebrow">Birthday Mode</p>
            <h1 className="mt-2 font-nunito text-3xl sm:text-5xl md:text-6xl font-black leading-tight text-[#663300]">
              Hari ini akhirnya datang.
            </h1>
            <p className="mt-2 font-nunito text-lg sm:text-2xl font-bold italic text-[#B53000]">
              Selamat ulang tahun, sayang.
            </p>

            <div className="mx-auto my-4 sm:my-6 h-px w-14 bg-burgundy/15" />

            <p className="mx-auto max-w-md text-sm sm:text-base leading-relaxed text-[#3E2723]">
              {content.site_settings?.birthday_message ||
                'Sekarang kamu boleh membuka semua hal kecil yang aku siapin pelan-pelan untukmu.'}
            </p>

            {content.preview && (
              <p className="mx-auto mt-4 max-w-sm rounded-xl border border-burgundy/15 bg-paper px-3 py-1.5 text-xs font-semibold text-burgundy">
                Mode preview admin sedang aktif.
              </p>
            )}

            {/* CTAs per DESIGN.md section 4: Hub intro CTA + restrained celebration */}
            <div className="mt-6 sm:mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href={hubHref} className="btn-primary group gap-2 w-full sm:w-auto">
                <span>Buka Hadiahnya</span>
                <ArrowRight size={16} className="text-[#F9EC88] transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <ConfettiButton label="Rayakan" className="btn-secondary w-full sm:w-auto" />
            </div>

            <div className="mt-6 sm:mt-8 border-t border-[#8C4E28]/20 pt-4 sm:pt-6">
              <AudioPlayer src={content.site_settings?.music_url} />
            </div>
          </div>
        ) : (
          /* Pre-unlock Countdown State */
          <div className="w-full world-frame-enter space-y-6 sm:space-y-10">
            <header>
              <p className="eyebrow text-[#B53000]">Menghitung Hari</p>
              <h1 className="mt-1 sm:mt-2 font-nunito text-3xl sm:text-5xl md:text-6xl font-black text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
                Menuju Hari Spesialmu
              </h1>
              <p className="mt-1.5 text-xs sm:text-base font-bold text-[#FFF3CC] drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                10 Desember 2026 · Bersiap untuk kejutan kecilmu
              </p>
            </header>

            <Countdown
              unlockIso={content.unlockIso}
              onComplete={() => setIsUnlocked(true)}
            />

            <blockquote className="card mx-auto max-w-lg p-4 sm:p-6 text-center font-nunito text-base sm:text-xl font-bold leading-relaxed text-[#663300]">
              &ldquo;Aku siapin sesuatu yang mungkin sederhana, tapi aku buat pelan-pelan dengan hati.&rdquo;
            </blockquote>

            <div className="card mx-auto max-w-lg p-5 sm:p-8 text-center">
              <div className="mx-auto mb-3 flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full border-2 border-[#8C4E28] bg-[#FFE8A3] text-[#B53000] shadow-sm">
                <Lock size={18} className="text-[#B53000]" />
              </div>
              <p className="font-nunito text-xs sm:text-base font-bold leading-relaxed text-[#5A3E2D]">
                Semua bagian masih terkunci. Nanti, pada 10 Desember 2026, semua akan terbuka untukmu.
              </p>
              <div className="mt-4 sm:mt-5 border-t-2 border-[#8C4E28]/25 pt-4 sm:pt-5">
                <AudioPlayer src={content.site_settings?.music_url} />
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

'use client';

import { useEffect, useRef } from 'react';
import { Scene, useReducedMotion } from '@/components/scene';
import ConfettiButton, { burstConfetti } from '@/components/ConfettiButton';
import { Heart, Sparkles, BookOpen, RotateCcw } from 'lucide-react';
import Link from 'next/link';
import { previewPath } from '@/lib/publicUrl';

export default function FinalSurprise({
  finalMessage,
  preview = false
}: {
  finalMessage: string;
  preview?: boolean;
}) {
  const hasTriggeredConfettiRef = useRef(false);
  const reducedMotion = useReducedMotion();

  // Trigger restrained confetti ONCE when chapter 07 mounts/appears in viewport (DEC-003, section 9.3)
  useEffect(() => {
    if (reducedMotion || hasTriggeredConfettiRef.current) return;
    const timer = setTimeout(() => {
      if (!hasTriggeredConfettiRef.current) {
        hasTriggeredConfettiRef.current = true;
        burstConfetti();
      }
    }, 600);
    return () => clearTimeout(timer);
  }, [reducedMotion]);

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* 1 Scene Tunggal Pacing Paling Lambat (DESIGN.md section 13: 1 scene tunggal, pacing paling lambat) */}
      <Scene
        id="chapter-07-final"
        eyebrow="Chapter 07 · Puncak Cerita"
        title="Untuk Hari Ini"
        align="center"
        tone="burgundy"
        worldFrame={true}
      >
        <div className="mx-auto w-full max-w-3xl py-4 sm:py-16">
          <div className="card mx-auto max-w-2xl px-4 py-8 sm:px-12 sm:py-14 text-center">
            {/* Ambient center emblem */}
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border-2 border-[#8C4E28] bg-[#FFE8A3] text-[#D4A325] shadow-md soft-pulse">
              <Sparkles size={32} className="text-[#D4A325]" />
            </div>

            <p className="font-nunito text-2xl sm:text-3xl font-extrabold text-[#663300]">
              Selamat ulang tahun, sayang.
            </p>

            <div className="stardew-divider my-6" />

            {/* Emotional Pinnacle: site_settings.final_message */}
            <div className="mx-auto max-w-xl text-left sm:text-center">
              <p className="font-nunito text-base sm:text-lg font-bold leading-relaxed text-[#3E2723] whitespace-pre-line">
                {finalMessage}
              </p>
            </div>

            {/* Personal Closing Signature */}
            <div className="mt-8 sm:mt-10 text-center">
              <div className="inline-flex items-center gap-2 font-nunito text-base sm:text-lg font-black text-[#B53000]">
                <Heart size={20} className="fill-[#B53000]/30 text-[#B53000]" />
                <span>Dari seseorang yang selalu mendoakan dan menyayangimu.</span>
              </div>
            </div>

            {/* Restrained Confetti Button for voluntary replay */}
            <div className="mt-8 flex items-center justify-center">
              <ConfettiButton
                label="Rayakan Lagi"
                className="btn-accent px-8 py-3 text-sm font-extrabold"
              />
            </div>
          </div>

          {/* Journey Completion / Navigation options */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-center">
            <Link
              href={previewPath('/hub', preview)}
              className="btn-primary gap-2 text-sm font-extrabold"
            >
              <BookOpen size={16} className="text-[#F9EC88]" />
              <span>Kembali ke Halaman Pembuka</span>
            </Link>

            <Link
              href={previewPath('/timeline', preview)}
              className="btn-secondary gap-2 text-sm font-bold"
            >
              <RotateCcw size={16} className="text-[#663300]" />
              <span>Ulangi dari Chapter 01</span>
            </Link>
          </div>
        </div>
      </Scene>
    </div>
  );
}

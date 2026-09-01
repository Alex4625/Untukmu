'use client';

import Link from 'next/link';
import { ArrowRight, Heart } from 'lucide-react';
import { previewPath } from '@/lib/publicUrl';

export default function HomeClient({ preview = false }: { preview?: boolean }) {
  const countdownHref = previewPath('/countdown', preview);

  return (
    <main className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-4 py-12 text-center sm:px-6">
      {/* Stardew Valley Wooden Plaque Main Card */}
      <section className="card world-frame-enter relative z-10 w-full max-w-xl px-6 py-10 sm:px-12 sm:py-14">
        {/* Cozy Heart Emblem */}
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border-2 border-[#8C4E28] bg-[#FFE8A3] text-[#B53000] shadow-sm">
          <Heart size={22} className="fill-[#B53000]/30 text-[#B53000]" />
        </div>

        {/* Date & Title */}
        <p className="font-nunito text-xs sm:text-sm font-extrabold uppercase tracking-[0.18em] text-[#B53000]">
          10 Desember 2026
        </p>

        <h1 className="mt-2 font-nunito text-4xl sm:text-5xl md:text-6xl font-black text-[#663300] drop-shadow-sm">
          Untuk Nona
        </h1>

        {/* Stardew Valley Spike Divider */}
        <div className="stardew-divider my-4" />

        <p className="mx-auto max-w-md font-nunito text-base sm:text-[17px] font-semibold leading-relaxed text-[#5A3E2D]">
          Sebuah tempat kecil di internet untuk menyimpan hal-hal indah tentang kamu dan kita.
        </p>

        <div className="mt-8 flex justify-center">
          <Link
            href={countdownHref}
            className="btn-primary group w-full gap-2 text-base font-extrabold tracking-wide sm:w-auto"
          >
            <span>Masuk ke Cerita Kita</span>
            <ArrowRight size={18} className="text-[#F9EC88] transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>
      </section>

      <footer className="relative z-10 mt-8 font-nunito text-xs font-bold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
        10 Desember 2026 · Dibuat dengan hati oleh Alex
      </footer>
    </main>
  );
}

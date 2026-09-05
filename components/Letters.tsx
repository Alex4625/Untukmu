'use client';

import { useState } from 'react';
import type { Letter } from '@/lib/types';
import { Scene, useReducedMotion } from '@/components/scene';
import { Mail, MailOpen, Feather } from 'lucide-react';

export function getActiveLetters(letters: Letter[]): Letter[] {
  return letters.filter((l) => l.status === 'active');
}

function SingleLetterScene({ letter, index }: { letter: Letter; index: number }) {
  const reducedMotion = useReducedMotion();
  const [isManuallyOpened, setIsManuallyOpened] = useState(false);
  const isOpened = isManuallyOpened || reducedMotion;

  // Alternate tones across scenes for visual warmth
  const tone = index % 3 === 0 ? 'paper' : index % 3 === 1 ? 'base' : 'ivory';

  return (
    <Scene
      id={`letter-${letter.id}`}
      eyebrow={`Chapter 03 · Surat ${String(index + 1).padStart(2, '0')}${
        letter.unlock_label ? ` · ${letter.unlock_label}` : ''
      }`}
      title={letter.title}
      align="center"
      tone={tone}
    >
      <div className="mx-auto mt-6 w-full max-w-2xl">
        {!isOpened ? (
          /* State 1: Amplop Tertutup (Tactile Closed Envelope Experience) */
          <div
            role="region"
            aria-label={`Amplop tertutup: ${letter.title}`}
            className="card-inner group relative mx-auto w-full max-w-lg cursor-pointer p-5 sm:p-8 text-center shadow-md transition-all duration-200 hover:-translate-y-1 hover:brightness-105 active:scale-[0.99]"
            onClick={() => setIsManuallyOpened(true)}
          >
            {/* Tactile Wax Seal Stamp */}
            <div className="mx-auto mb-3 sm:mb-4 flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full border-2 border-[#4A2411] bg-gradient-to-b from-[#A05A2C] to-[#7A3C18] text-[#F9EC88] shadow-md transition-transform duration-200 group-hover:scale-105">
              <Mail size={22} className="text-[#F9EC88]" />
            </div>

            <p className="font-nunito text-xs font-extrabold uppercase tracking-wider text-[#B53000]">
              {letter.unlock_label || 'Surat Tertutup'}
            </p>

            <h3 className="mt-1 font-nunito text-xl sm:text-3xl font-black text-[#663300]">
              {letter.title}
            </h3>

            <p className="mt-1 font-nunito text-xs sm:text-sm font-bold italic text-[#8C4E28]">
              Ditulis khusus untuk Nona
            </p>

            <div className="stardew-divider my-3 sm:my-4" />

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsManuallyOpened(true);
              }}
              className="btn-primary group/btn gap-2 px-5 py-2 sm:px-6 sm:py-2.5 text-xs sm:text-sm font-extrabold"
            >
              <span>Buka Surat</span>
              <MailOpen size={16} className="text-[#F9EC88] transition-transform group-hover/btn:scale-110" />
            </button>
          </div>
        ) : (
          /* State 2: Surat Terbuka (Unfolded Parchment Letter View) */
          <article
            role="region"
            aria-label={`Surat terbuka: ${letter.title}`}
            className={`card-inner relative w-full overflow-hidden bg-[#FFFDF4] p-4 sm:p-8 md:p-10 text-left shadow-lg transition-all ${
              reducedMotion ? '' : 'animate-in fade-in zoom-in-95 duration-400'
            }`}
          >
            {/* Subtle Watermark Feather */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute right-4 top-4 text-[#8C4E28]/10 sm:right-8 sm:top-8"
            >
              <Feather size={48} className="sm:w-16 sm:h-16" />
            </div>

            {/* Header of the letter */}
            <div className="flex items-center justify-between border-b-2 border-[#8C4E28]/25 pb-2.5 text-xs">
              <span className="font-nunito font-extrabold uppercase tracking-wider text-[#B53000]">
                {letter.unlock_label || 'Surat'}
              </span>
              <span className="font-nunito text-xs font-bold text-[#8C4E28]">
                Untuk Nona
              </span>
            </div>

            {/* Letter Title */}
            <h3 className="mt-3 sm:mt-4 font-nunito text-xl sm:text-3xl font-black text-[#663300]">
              {letter.title}
            </h3>

            <div className="stardew-divider my-3 sm:my-4" />

            {/* Body of the letter */}
            <div className="font-nunito text-sm sm:text-base md:text-lg font-bold leading-relaxed text-[#3E2723] whitespace-pre-line">
              {letter.body}
            </div>

            {/* Signature */}
            <div className="mt-6 sm:mt-8 border-t-2 border-[#8C4E28]/25 pt-3 sm:pt-4 text-right">
              <p className="font-nunito text-sm sm:text-base font-black italic text-[#8C4E28]">
                Dengan segenap hati,
              </p>
              <p className="font-nunito text-base sm:text-lg font-black text-[#663300]">
                Alex
              </p>
            </div>
          </article>
        )}
      </div>
    </Scene>
  );
}

export default function Letters({ letters }: { letters: Letter[] }) {
  const activeLetters = getActiveLetters(letters);

  if (!activeLetters.length) {
    return (
      <div className="card mx-auto max-w-lg p-10 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-paper text-burgundy shadow-subtle">
          <Mail size={20} className="text-dustyrose" />
        </div>
        <p className="font-display text-2xl italic text-burgundy">
          Belum ada surat yang disimpan di sini.
        </p>
        <p className="mt-2 text-xs text-ink-muted leading-relaxed">
          Admin bisa menuliskan surat-surat baru melalui panel kelola.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Dynamic Scenes: Exactly 1 <Scene> per active letter (DESIGN.md section 13) */}
      {activeLetters.map((letter, index) => (
        <SingleLetterScene key={letter.id} letter={letter} index={index} />
      ))}
    </div>
  );
}

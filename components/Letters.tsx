'use client';

import type { Letter } from '@/lib/types';
import { useState } from 'react';
import { Mail, MailOpen, Feather } from 'lucide-react';

export default function Letters({ letters }: { letters: Letter[] }) {
  const [openId, setOpenId] = useState<string | null>(letters[0]?.id ?? null);
  const selected = letters.find((letter) => letter.id === openId);

  if (!letters.length) {
    return (
      <div className="card mx-auto max-w-lg p-10 text-center">
        <p className="font-display text-xl italic text-ink-muted">
          Belum ada surat yang disimpan di sini.
        </p>
        <p className="mt-2 text-xs text-ink-muted">
          Admin bisa menuliskan surat-surat baru melalui panel kelola.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-5xl gap-6 sm:gap-8 lg:grid-cols-[280px_1fr] items-start">
      {/* Letter Selectors / Envelopes */}
      <div className="space-y-2.5">
        <p className="text-xs uppercase tracking-wider text-dustyrose font-semibold px-1 mb-2">
          Daftar Surat ({letters.length})
        </p>
        {letters.map((letter) => {
          const isOpen = openId === letter.id;
          return (
            <button
              key={letter.id}
              type="button"
              onClick={() => setOpenId(letter.id)}
              className={`group w-full rounded-2xl border p-4 sm:p-5 text-left transition-all duration-300 ${
                isOpen
                  ? 'border-burgundy/40 bg-paper/80 shadow-card'
                  : 'border-[rgba(90,40,52,0.08)] bg-[#FDFBF7] hover:border-dustyrose/40 hover:bg-paper-light'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition ${
                    isOpen ? 'bg-burgundy text-white' : 'bg-paper text-dustyrose group-hover:bg-burgundy group-hover:text-white'
                  }`}
                >
                  {isOpen ? <MailOpen size={16} /> : <Mail size={16} />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.10em] text-dustyrose">
                    {letter.unlock_label || 'Surat'}
                  </p>
                  <h3 className="mt-0.5 line-clamp-1 font-display text-lg sm:text-xl font-normal leading-tight text-burgundy">
                    {letter.title}
                  </h3>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Parchment Letter Paper View */}
      <article className="card relative min-h-[380px] p-6 sm:p-10 md:p-14 shadow-elevated">
        {/* Subtle Watermark Ornament */}
        <div className="absolute right-6 top-6 sm:right-8 sm:top-8 opacity-10 pointer-events-none text-burgundy">
          <Feather size={56} />
        </div>

        {selected ? (
          <div className="fade-in max-w-prose">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-dustyrose">
              <span>{selected.unlock_label || 'Surat'}</span>
            </div>

            <h2 className="mt-3 font-display text-3xl font-normal leading-tight text-burgundy sm:text-4xl md:text-5xl">
              {selected.title}
            </h2>

            <div className="my-6 sm:my-8 h-px w-14 bg-burgundy/15" />

            <div className="prose-letter font-sans text-[15px] sm:text-[16px] md:text-[17px] leading-relaxed text-ink whitespace-pre-line">
              {selected.body}
            </div>

            <div className="mt-10 sm:mt-12 border-t border-[rgba(90,40,52,0.10)] pt-5 sm:pt-6 text-right font-display text-lg sm:text-xl italic text-dustyrose">
              Dari seseorang yang selalu mendoakanmu.
            </div>
          </div>
        ) : (
          <div className="flex min-h-[260px] items-center justify-center text-center text-sm text-ink-muted">
            Pilih surat dari daftar di sebelah kiri untuk membacanya.
          </div>
        )}
      </article>
    </div>
  );
}

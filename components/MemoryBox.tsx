'use client';

import type { MemoryCard } from '@/lib/types';
import { Heart, Sparkles, X } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function MemoryBox({ cards }: { cards: MemoryCard[] }) {
  const [selected, setSelected] = useState<MemoryCard | null>(null);

  // Manage body scroll when modal is open
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setSelected(null);
    }
    if (selected) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [selected]);

  if (!cards.length) {
    return (
      <div className="card mx-auto max-w-lg p-10 text-center">
        <p className="font-display text-xl italic text-ink-muted">
          Belum ada kartu kenangan yang disimpan.
        </p>
        <p className="mt-2 text-xs text-ink-muted">
          Admin bisa menambahkan kartu alasan dan doa melalui panel kelola.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Cards Grid */}
      <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-4 sm:gap-5">
        {cards.map((card, index) => (
          <button
            key={card.id}
            type="button"
            onClick={() => setSelected(card)}
            className="card group flex min-h-[160px] sm:min-h-[180px] flex-col justify-between p-4 sm:p-5 text-left transition-all duration-300 hover:-translate-y-1.5 hover:border-dustyrose/50 hover:shadow-elevated active:scale-[0.98]"
          >
            <div className="flex items-center justify-between">
              <span className="font-display text-sm sm:text-base italic text-gold">
                #{String(index + 1).padStart(2, '0')}
              </span>
              <span className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-paper text-dustyrose transition group-hover:bg-burgundy group-hover:text-white">
                <Heart size={13} fill="currentColor" />
              </span>
            </div>

            <div className="my-auto py-2">
              <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.10em] text-dustyrose">
                {card.card_type || 'Kartu'}
              </span>
              <h3 className="mt-1 font-display text-xl sm:text-2xl font-normal leading-tight text-burgundy group-hover:text-burgundy-dark">
                {card.title}
              </h3>
            </div>

            <p className="text-[10px] sm:text-[11px] text-ink-muted italic">
              Buka kartu →
            </p>
          </button>
        ))}
      </div>

      {/* Card Reveal Modal */}
      {selected && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={selected.title}
          onClick={() => setSelected(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-burgundy-dark/60 p-4 backdrop-blur-sm sm:p-6"
        >
          <article
            onClick={(e) => e.stopPropagation()}
            className="card fade-in relative w-full max-w-lg p-7 sm:p-10 text-center shadow-2xl"
          >
            <button
              type="button"
              onClick={() => setSelected(null)}
              aria-label="Tutup kartu"
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-paper text-ink-muted transition hover:bg-burgundy hover:text-white"
            >
              <X size={18} />
            </button>

            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-paper text-dustyrose">
              <Sparkles size={22} className="text-gold" />
            </div>

            <p className="eyebrow">{selected.card_type || 'Yang Tak Terucap'}</p>
            <h2 className="mt-3 font-display text-3xl font-normal leading-tight text-burgundy sm:text-4xl">
              {selected.title}
            </h2>

            <div className="mx-auto my-5 h-px w-12 bg-burgundy/15" />

            <p className="font-sans text-[15px] sm:text-[16px] leading-relaxed text-ink whitespace-pre-line text-left">
              {selected.body}
            </p>

            <div className="mt-8 border-t border-[rgba(90,40,52,0.10)] pt-6">
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="btn-primary w-full sm:w-auto"
              >
                Tutup Kartu
              </button>
            </div>
          </article>
        </div>
      )}
    </div>
  );
}

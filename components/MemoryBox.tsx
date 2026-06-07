'use client';

import type { MemoryCard } from '@/lib/types';
import { Heart } from 'lucide-react';
import { useState } from 'react';

export default function MemoryBox({ cards }: { cards: MemoryCard[] }) {
  const [selected, setSelected] = useState<MemoryCard | null>(null);
  if (!cards.length) return <div className="card p-8 text-center text-muted">Belum ada kartu kenangan aktif.</div>;

  return (
    <div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {cards.map((card, index) => (
          <button key={card.id} onClick={() => setSelected(card)} className="group min-h-36 rounded-2xl border border-[rgba(196,138,106,0.22)] bg-white p-5 text-center shadow-romantic transition duration-300 hover:-translate-y-1 hover:border-softpink hover:shadow-soft active:scale-[0.97]">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-cream text-rose transition duration-300 group-hover:scale-110">
              <Heart size={22} fill="currentColor" />
            </div>
            <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-rosegold">#{index + 1}</p>
            <p className="mt-2 line-clamp-2 font-display text-2xl font-normal leading-tight text-maroon">{card.title}</p>
          </button>
        ))}
      </div>
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-cocoa/70 p-4 backdrop-blur-sm" onClick={() => setSelected(null)}>
          <article onClick={(e) => e.stopPropagation()} className="w-full max-w-lg rounded-[20px] bg-white p-8 text-center shadow-soft">
            <p className="eyebrow">{selected.card_type || 'Kartu Kenangan'}</p>
            <h3 className="mt-3 font-display text-4xl font-normal leading-tight text-maroon">{selected.title}</h3>
            <p className="mt-5 whitespace-pre-line text-[17px] leading-8 text-cocoa">{selected.body}</p>
            <button onClick={() => setSelected(null)} className="btn-primary mt-7">Tutup</button>
          </article>
        </div>
      )}
    </div>
  );
}

'use client';

import type { MemoryCard } from '@/lib/types';
import { Heart } from 'lucide-react';
import { useState } from 'react';

export default function MemoryBox({ cards }: { cards: MemoryCard[] }) {
  const [selected, setSelected] = useState<MemoryCard | null>(null);
  if (!cards.length) return <div className="card p-8 text-center text-cocoa/60">Belum ada kartu kenangan aktif.</div>;

  return (
    <div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {cards.map((card, index) => (
          <button key={card.id} onClick={() => setSelected(card)} className="group min-h-36 rounded-[2rem] border border-white/70 bg-white/75 p-5 text-center shadow-lg shadow-rose/10 transition hover:-translate-y-1 hover:bg-white">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-cream text-rose transition group-hover:scale-110">
              <Heart size={22} fill="currentColor" />
            </div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-rosegold">#{index + 1}</p>
            <p className="mt-2 font-bold text-cocoa line-clamp-2">{card.title}</p>
          </button>
        ))}
      </div>
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-cocoa/40 p-4 backdrop-blur-sm" onClick={() => setSelected(null)}>
          <article onClick={(e) => e.stopPropagation()} className="w-full max-w-lg rounded-[2.5rem] bg-white p-8 text-center shadow-romantic">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-rosegold">{selected.card_type || 'Kartu Kenangan'}</p>
            <h3 className="mt-3 font-display text-3xl font-bold text-cocoa">{selected.title}</h3>
            <p className="mt-5 whitespace-pre-line leading-8 text-cocoa/75">{selected.body}</p>
            <button onClick={() => setSelected(null)} className="btn-primary mt-7">Tutup</button>
          </article>
        </div>
      )}
    </div>
  );
}

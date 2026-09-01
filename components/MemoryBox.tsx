'use client';

import { useState } from 'react';
import type { MemoryCard } from '@/lib/types';
import { Scene, useReducedMotion } from '@/components/scene';
import { Heart, Sparkles, RotateCw } from 'lucide-react';

export type MemoryCardGroup = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  tone: 'paper' | 'base' | 'sage';
  cards: MemoryCard[];
};

export function groupMemoryCardsIntoScenes(cards: MemoryCard[]): MemoryCardGroup[] {
  const activeCards = cards.filter((c) => c.status === 'active' || !c.status);
  if (!activeCards.length) return [];

  // If 6 or fewer cards, keep in 1 unified scene (DESIGN.md section 13: 1-2 scenes)
  if (activeCards.length <= 6) {
    return [
      {
        id: 'cards-group-1',
        eyebrow: 'Chapter 04 · Yang Tak Terucap',
        title: 'Kartu-Kartu yang Tersimpan',
        description:
          'Setiap kartu menyimpan satu rasa, alasan, atau doa kecil. Ketuk kartu mana pun untuk membalik dan membaca isinya.',
        tone: 'paper',
        cards: activeCards
      }
    ];
  }

  // If more than 6 cards, group into exactly 2 scenes
  const types = Array.from(
    new Set(activeCards.map((c) => c.card_type?.trim()).filter(Boolean) as string[])
  );

  if (types.length >= 2) {
    const group1Cards = activeCards.filter((c) => c.card_type?.trim() === types[0]);
    const group2Cards = activeCards.filter((c) => c.card_type?.trim() !== types[0]);

    return [
      {
        id: 'cards-group-1',
        eyebrow: `Chapter 04 · ${types[0]}`,
        title: `Kumpulan ${types[0]}`,
        description: `Deretan kartu ${types[0].toLowerCase()} yang ditulis pelan-pelan untukmu. Ketuk untuk membalik.`,
        tone: 'paper',
        cards: group1Cards
      },
      {
        id: 'cards-group-2',
        eyebrow: `Chapter 04 · ${types[1]}`,
        title: `Doa & Rasa yang Tersimpan`,
        description: 'Hal-hal yang selalu ada di dalam hati dan tak pernah pudar oleh waktu.',
        tone: 'base',
        cards: group2Cards
      }
    ];
  }

  // Uniform category split evenly into exactly 2 scenes
  const mid = Math.ceil(activeCards.length / 2);
  return [
    {
      id: 'cards-group-1',
      eyebrow: 'Chapter 04 · Bagian Pertama',
      title: 'Alasan-Alasan Kecil',
      description:
        'Hal-hal sederhana tentang kamu yang diam-diam selalu membuatku bersyukur. Ketuk kartu untuk membalik.',
      tone: 'paper',
      cards: activeCards.slice(0, mid)
    },
    {
      id: 'cards-group-2',
      eyebrow: 'Chapter 04 · Bagian Kedua',
      title: 'Rasa yang Selalu Ada',
      description: 'Kelanjutan doa dan ketulusan yang mungkin jarang terucap dalam keseharian.',
      tone: 'base',
      cards: activeCards.slice(mid)
    }
  ];
}

function FlipCard({ card, index }: { card: MemoryCard; index: number }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const reducedMotion = useReducedMotion();

  // Subtle deterministic rotation per card for handcrafted physical card feel (DESIGN.md section 10.1 & 10.5)
  const rotations = [-1.2, 0.9, -0.7, 1.3, -1.0, 0.8, -1.4, 1.1];
  const rotation = reducedMotion ? 0 : rotations[index % rotations.length];

  const handleToggle = () => setIsFlipped((prev) => !prev);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleToggle();
    }
  };

  // Fallback for prefers-reduced-motion: Instant state switch without 3D rotation
  if (reducedMotion) {
    return (
      <div
        role="button"
        tabIndex={0}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        aria-label={`${card.title}. ${
          isFlipped ? 'Sisi belakang terbuka. Ketuk untuk membalik ke depan.' : 'Ketuk untuk membaca pesan.'
        }`}
        className="card relative flex min-h-[220px] w-full cursor-pointer flex-col justify-between border border-[rgba(90,40,52,0.12)] bg-[#FDFBF7] p-5 text-left shadow-card transition-all hover:border-dustyrose/50 hover:shadow-elevated active:scale-[0.99] sm:p-6"
      >
        {isFlipped ? (
          <div className="flex h-full flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-dustyrose">
                <span className="font-semibold uppercase tracking-wider">
                  {card.card_type || 'Pesan'}
                </span>
                <span className="text-gold font-display italic">#{String(index + 1).padStart(2, '0')}</span>
              </div>
              <p className="mt-3 font-sans text-sm leading-relaxed text-ink whitespace-pre-line sm:text-[15px]">
                {card.body}
              </p>
            </div>
            <p className="mt-4 text-right text-[11px] italic text-dustyrose">
              ← Ketuk untuk membalik ke depan
            </p>
          </div>
        ) : (
          <div className="flex h-full flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="font-display text-sm italic text-gold">
                #{String(index + 1).padStart(2, '0')}
              </span>
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-paper text-dustyrose">
                <Heart size={13} fill="currentColor" />
              </span>
            </div>

            <div className="my-auto py-3">
              <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-dustyrose">
                {card.card_type || 'Alasan'}
              </span>
              <h4 className="mt-1.5 font-display text-xl font-normal leading-snug text-burgundy sm:text-2xl">
                {card.title}
              </h4>
            </div>

            <p className="flex items-center gap-1 text-[11px] italic text-ink-muted">
              <span>Ketuk untuk membalik</span>
              <RotateCw size={11} className="text-dustyrose" />
            </p>
          </div>
        )}
      </div>
    );
  }

  // Standard 3D tactile card flip for touch (mobile) and click (desktop)
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleToggle}
      onKeyDown={handleKeyDown}
      aria-label={`${card.title}. ${
        isFlipped ? 'Sisi belakang terbuka. Ketuk untuk membalik ke depan.' : 'Ketuk untuk membaca pesan.'
      }`}
      className="group relative h-[230px] w-full cursor-pointer select-none sm:h-[260px]"
      style={{
        perspective: '1000px',
        transform: `rotate(${rotation}deg)`
      }}
    >
      <div
        className="relative h-full w-full rounded-2xl transition-transform duration-500 [transform-style:preserve-3d]"
        style={{
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
        }}
      >
        {/* SISI DEPAN (Front Side) */}
        <div className="card absolute inset-0 flex flex-col justify-between overflow-hidden p-5 text-left transition-all duration-200 group-hover:brightness-105 group-hover:shadow-elevated [backface-visibility:hidden] sm:p-6">
          <div className="flex items-center justify-between">
            <span className="font-nunito text-xs font-extrabold text-[#D4A325] sm:text-sm">
              #{String(index + 1).padStart(2, '0')}
            </span>
            <span className="flex h-7 w-7 items-center justify-center rounded-full border border-[#8C4E28] bg-[#FFE8A3] text-[#B53000] sm:h-8 sm:w-8">
              <Heart size={14} fill="currentColor" />
            </span>
          </div>

          <div className="my-auto py-2">
            <span className="font-nunito text-[11px] font-extrabold uppercase tracking-wider text-[#B53000]">
              {card.card_type || 'Alasan'}
            </span>
            <h4 className="mt-1 font-nunito text-xl sm:text-2xl font-black leading-snug text-[#663300]">
              {card.title}
            </h4>
          </div>

          <div className="flex items-center justify-between font-nunito text-[11px] font-bold text-[#8C4E28]">
            <span>Ketuk untuk membalik</span>
            <RotateCw size={13} className="text-[#B53000] transition-transform group-hover:rotate-45" />
          </div>
        </div>

        {/* SISI BELAKANG (Back Side - Revealed Message) */}
        <div className="card absolute inset-0 flex flex-col justify-between overflow-y-auto p-5 text-left [backface-visibility:hidden] [transform:rotateY(180deg)] sm:p-6">
          <div>
            <div className="flex items-center justify-between border-b-2 border-[#8C4E28]/30 pb-2 font-nunito text-xs font-black uppercase text-[#B53000]">
              <span>{card.card_type || 'Yang Tak Terucap'}</span>
              <span className="text-[#663300]">#{String(index + 1).padStart(2, '0')}</span>
            </div>
            <p className="mt-3 font-nunito text-sm sm:text-base font-bold leading-relaxed text-[#3E2723] whitespace-pre-line">
              {card.body}
            </p>
          </div>

          <div className="mt-3 pt-2 text-right">
            <span className="inline-flex items-center gap-1 font-nunito text-xs font-black text-[#B53000]">
              <span>← Ketuk untuk balik</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MemoryBox({ cards }: { cards: MemoryCard[] }) {
  const groups = groupMemoryCardsIntoScenes(cards);

  if (!groups.length) {
    return (
      <div className="card mx-auto max-w-lg p-10 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-paper text-burgundy shadow-subtle">
          <Sparkles size={20} className="text-dustyrose" />
        </div>
        <p className="font-display text-2xl italic text-burgundy">
          Belum ada kartu kenangan yang disimpan.
        </p>
        <p className="mt-2 text-xs text-ink-muted leading-relaxed">
          Admin bisa menambahkan kartu alasan dan doa melalui panel kelola.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Renders 1-2 scenes strictly per DESIGN.md section 13 */}
      {groups.map((group) => (
        <Scene
          key={group.id}
          id={group.id}
          eyebrow={group.eyebrow}
          title={group.title}
          body={group.description}
          align="center"
          tone={group.tone}
        >
          {/* Handcrafted Physical Cards arranged on Invisible Grid (Section 10.5) */}
          <div className="mx-auto mt-8 grid max-w-4xl grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 sm:gap-6">
            {group.cards.map((card, idx) => (
              <FlipCard key={card.id} card={card} index={idx} />
            ))}
          </div>
        </Scene>
      ))}
    </div>
  );
}

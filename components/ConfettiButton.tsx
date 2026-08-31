'use client';

import { Sparkles } from 'lucide-react';

export function burstConfetti() {
  if (typeof window === 'undefined') return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const colors = ['#5A2834', '#B47F84', '#B39A6B', '#8F9983', '#EEE6DB', '#B94F68'];
  const count = 40; // restrained count per DEC-003

  for (let i = 0; i < count; i += 1) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    piece.style.left = `${Math.random() * 96 + 2}vw`;
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.animationDelay = `${Math.random() * 0.5}s`;
    piece.style.transform = `rotate(${Math.random() * 360}deg)`;
    document.body.appendChild(piece);
    setTimeout(() => piece.remove(), 3200);
  }
}

export default function ConfettiButton({
  label = 'Buka Kejutan',
  className = 'btn-primary'
}: {
  label?: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={burstConfetti}
      className={`inline-flex items-center gap-2 ${className}`}
    >
      <Sparkles size={16} className="text-gold" />
      <span>{label}</span>
    </button>
  );
}

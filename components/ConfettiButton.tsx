'use client';

import { Heart } from 'lucide-react';

export function burstConfetti() {
  if (typeof window === 'undefined') return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // Restrained palette per DEC-001 & DEC-003
  const colors = ['#5A2834', '#B47F84', '#B39A6B', '#8F9983', '#EEE6DB', '#B94F68'];
  const count = 36; // restrained count per DEC-003

  for (let i = 0; i < count; i += 1) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    piece.style.left = `${Math.random() * 96 + 2}vw`;
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.animationDelay = `${Math.random() * 0.4}s`;
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
      <Heart size={15} className="text-dustyrose fill-dustyrose/20" />
      <span>{label}</span>
    </button>
  );
}

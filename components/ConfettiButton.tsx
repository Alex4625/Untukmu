'use client';

import { Heart } from 'lucide-react';

export function burstPetals() {
  if (typeof window === 'undefined') return;
  const count = 40;
  const petalColors = [
    { fill: '#F2A0B5', stroke: '#DB7093' }, // Soft Rose
    { fill: '#FBC4D0', stroke: '#E891A8' }, // Sakura
    { fill: '#E65C7B', stroke: '#C23B5A' }, // Deep Crimson Rose
    { fill: '#FAD2B8', stroke: '#E0A885' }, // Peach Blossom
    { fill: '#F9EC88', stroke: '#D4A325' }  // Golden Leaf Sparkle
  ];

  for (let i = 0; i < count; i += 1) {
    const petal = document.createElement('div');
    petal.className = 'burst-petal';
    petal.style.left = `${Math.random() * 92 + 4}vw`;
    petal.style.setProperty('--duration', `${5.5 + Math.random() * 3.5}s`);
    petal.style.setProperty('--drift-x', `${(Math.random() - 0.5) * 220}px`);
    petal.style.setProperty('--spin-deg', `${200 + Math.random() * 400}deg`);
    petal.style.animationDelay = `${Math.random() * 0.45}s`;

    const color = petalColors[i % petalColors.length];
    const size = 18 + Math.floor(Math.random() * 8);

    petal.innerHTML = `
      <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" class="drop-shadow-sm">
        <path d="M12 2C9 7 4 9 4 14C4 18.5 7.5 22 12 22C16.5 22 20 18.5 20 14C20 9 15 7 12 2Z" fill="${color.fill}" opacity="0.92" />
        <path d="M12 4C10.5 7.5 7.5 9 7.5 13C7.5 16 9.5 18.5 12 19" stroke="${color.stroke}" stroke-width="0.8" stroke-linecap="round" />
      </svg>
    `;
    document.body.appendChild(petal);
    setTimeout(() => petal.remove(), 9500);
  }
}

export function burstConfetti() {
  if (typeof window === 'undefined') return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const colors = ['#ECA0B2', '#F6C1CB', '#D4A325', '#F9EC88', '#B53000', '#8C4E28', '#FFFFFF', '#663300'];
  const count = 50;

  for (let i = 0; i < count; i += 1) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    piece.style.left = `${Math.random() * 96 + 2}vw`;
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.animationDelay = `${Math.random() * 0.35}s`;
    piece.style.setProperty('--random-x', String(Math.random()));
    document.body.appendChild(piece);
    setTimeout(() => piece.remove(), 3400);
  }
}

export function celebrateLove() {
  burstConfetti();
  burstPetals();
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
      onClick={celebrateLove}
      className={`inline-flex items-center gap-2 ${className}`}
    >
      <Heart size={15} className="text-dustyrose fill-dustyrose/20" />
      <span>{label}</span>
    </button>
  );
}

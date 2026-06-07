'use client';

import { Gift } from 'lucide-react';

function burstConfetti() {
  const colors = ['#E98DA3', '#F5B7C6', '#C48A6A', '#FFF1E6', '#6D3B47'];
  for (let i = 0; i < 80; i += 1) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    piece.style.left = `${Math.random() * 100}vw`;
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.animationDelay = `${Math.random() * 0.8}s`;
    piece.style.transform = `rotate(${Math.random() * 360}deg)`;
    document.body.appendChild(piece);
    setTimeout(() => piece.remove(), 4200);
  }
}

export default function ConfettiButton({ label = 'Buka Kejutan' }: { label?: string }) {
  return (
    <button onClick={burstConfetti} className="btn-primary gap-2">
      <Gift size={18} /> {label}
    </button>
  );
}

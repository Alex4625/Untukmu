'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Heart, RotateCcw } from 'lucide-react';

export default function Error({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Unhandled app error:', error);
  }, [error]);

  return (
    <main className="flex min-h-dvh items-center justify-center px-4 py-16">
      <div className="card max-w-md w-full p-8 text-center shadow-2xl">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border-2 border-[#8C4E28] bg-[#FFE8A3] text-[#B53000]">
          <Heart size={24} className="fill-[#B53000]/30 text-[#B53000]" />
        </div>
        <h2 className="font-nunito text-2xl font-black text-[#663300]">
          Oops, ada kendala kecil!
        </h2>
        <div className="stardew-divider my-4" />
        <p className="font-nunito text-sm font-bold text-[#5A3E2D] mb-6">
          Jangan khawatir, halaman bisa dimuat ulang atau kamu bisa kembali ke beranda.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            type="button"
            onClick={() => reset()}
            className="btn-primary gap-2"
          >
            <RotateCcw size={16} />
            <span>Coba Lagi</span>
          </button>
          <Link href="/" className="btn-secondary">
            Ke Beranda
          </Link>
        </div>
      </div>
    </main>
  );
}

'use client';

import Link from 'next/link';
import type { PublicContent } from '@/lib/types';
import { Flower2 } from 'lucide-react';

export default function HomeClient({ content }: { content: PublicContent }) {
  const href = content.preview ? '/hub?preview=unlocked' : content.unlocked ? '/hub' : '/countdown';
  const label = content.preview ? 'Preview Hadiahnya' : content.unlocked ? 'Buka Hadiahnya' : 'Masuk ke Cerita Kita';

  return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-hidden px-5 py-12">
      <span className="sparkle left-[16%] top-[18%]" />
      <span className="sparkle right-[18%] top-[26%]" style={{ animationDelay: '1.4s' }} />
      <span className="sparkle bottom-[22%] left-[22%]" style={{ animationDelay: '2.6s' }} />
      <span className="sparkle bottom-[18%] right-[24%]" style={{ animationDelay: '3.8s' }} />

      <section className="glass-card fade-in w-full max-w-[480px] px-6 py-10 text-center sm:px-10 sm:py-12">
        <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-cream text-rosegold">
          <Flower2 size={25} />
        </div>
        <p className="eyebrow">Untuk Nona</p>
        <h1 className="mt-4 font-display text-5xl font-light leading-none text-maroon sm:text-6xl">Untuk Nona</h1>
        <p className="mt-3 font-display text-2xl italic text-muted">Untuk 10 Desember</p>
        <div className="mx-auto my-7 h-px w-12 bg-[rgba(196,138,106,0.28)]" />
        <p className="text-base leading-7 text-cocoa">Untuk seseorang yang lahir pada 10 Desember.</p>
        <p className="mx-auto mt-3 max-w-xs text-sm leading-6 text-muted">
          Sebuah tempat kecil di internet untuk menyimpan hal-hal indah tentang kamu dan kita.
        </p>
        {content.preview && (
          <p className="mx-auto mt-5 max-w-xs rounded-xl bg-cream px-4 py-3 text-xs font-semibold text-maroon">
            Mode preview admin sedang aktif.
          </p>
        )}
        <Link href={href} className="btn-primary mt-8 w-full sm:w-auto">
          {label}
        </Link>
      </section>
    </main>
  );
}

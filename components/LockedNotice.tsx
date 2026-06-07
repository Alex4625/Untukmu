import Link from 'next/link';
import { LockKeyhole } from 'lucide-react';

export default function LockedNotice({ title = 'Belum saatnya.' }: { title?: string }) {
  return (
    <main className="container-page flex min-h-dvh items-center justify-center py-16">
      <section className="glass-card fade-in relative w-full max-w-[460px] overflow-hidden px-6 py-10 text-center sm:px-10">
        <span className="sparkle left-8 top-8" />
        <span className="sparkle bottom-12 right-10" style={{ animationDelay: '1.4s' }} />
        <div className="soft-pulse mx-auto mb-7 flex h-20 w-20 items-center justify-center rounded-full bg-cream text-rose">
          <LockKeyhole size={34} />
        </div>
        <p className="eyebrow">Terkunci dulu</p>
        <h1 className="mt-3 font-display text-5xl font-light leading-tight text-maroon">{title}</h1>
        <p className="mx-auto mt-5 max-w-sm text-base leading-7 text-muted">
          Bagian ini sedang aku siapkan pelan-pelan. Nanti, 10 Desember 2026, kamu bisa melihat semua hal kecil yang aku kumpulkan untukmu.
        </p>
        <Link href="/countdown" className="btn-primary mt-8 w-full sm:w-auto">Kembali ke Countdown</Link>
      </section>
    </main>
  );
}

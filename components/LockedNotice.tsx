import Link from 'next/link';
import { LockKeyhole, Heart } from 'lucide-react';

export default function LockedNotice({ title = 'Belum waktunya dibuka' }: { title?: string }) {
  return (
    <main className="container-page flex min-h-screen items-center justify-center py-16">
      <section className="card relative max-w-2xl overflow-hidden p-8 text-center sm:p-12">
        <span className="sparkle left-8 top-8" />
        <span className="sparkle bottom-12 right-10" style={{ animationDelay: '1.4s' }} />
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-cream text-maroon shadow-inner">
          <LockKeyhole size={34} />
        </div>
        <p className="mb-2 inline-flex items-center gap-2 rounded-full bg-rose/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.25em] text-rosegold">
          <Heart size={14} /> Terkunci dulu
        </p>
        <h1 className="font-display text-4xl font-bold text-cocoa sm:text-5xl">{title}</h1>
        <p className="mx-auto mt-5 max-w-xl text-base leading-8 text-cocoa/70">
          Bagian ini sedang aku siapkan pelan-pelan. Nanti, 10 Desember 2026, kamu bisa melihat semua hal kecil yang aku kumpulkan untukmu.
        </p>
        <Link href="/" className="btn-primary mt-8">Kembali ke Countdown</Link>
      </section>
    </main>
  );
}

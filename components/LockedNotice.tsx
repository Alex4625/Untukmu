import Link from 'next/link';
import { Lock } from 'lucide-react';

export default function LockedNotice({ title = 'Belum saatnya.' }: { title?: string }) {
  return (
    <main className="container-page flex min-h-dvh items-center justify-center pt-8 pb-28 sm:py-16">
      <section className="card fade-in relative w-full max-w-md px-6 py-10 text-center sm:px-10 sm:py-12">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-paper text-burgundy">
          <Lock size={24} className="text-dustyrose" />
        </div>

        <p className="eyebrow">Terkunci Dulu</p>
        <h1 className="mt-3 font-display text-3xl sm:text-4xl font-light leading-tight text-burgundy">
          {title}
        </h1>

        <div className="mx-auto my-5 h-px w-12 bg-burgundy/15" />

        <p className="mx-auto max-w-sm text-xs sm:text-sm leading-relaxed text-ink-muted">
          Bagian ini sedang disiapkan pelan-pelan. Nanti, pada 10 Desember 2026, semua hal kecil yang aku simpan akan terbuka untukmu.
        </p>

        <div className="mt-7 sm:mt-8">
          <Link href="/countdown" className="btn-primary w-full sm:w-auto">
            Kembali ke Countdown
          </Link>
        </div>
      </section>
    </main>
  );
}

import Link from 'next/link';
import { Sparkles, ArrowRight } from 'lucide-react';

export default function HomeClient() {
  return (
    <main className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-4 py-12 text-center sm:px-6">
      {/* Background ambient warmth */}
      <div className="pointer-events-none absolute -top-24 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-dustyrose/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 left-1/3 h-96 w-96 rounded-full bg-paper/60 blur-3xl" />

      <section className="card fade-in relative z-10 w-full max-w-lg px-6 py-12 sm:px-12 sm:py-16">
        <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-paper text-burgundy">
          <Sparkles size={20} className="text-dustyrose" />
        </div>

        <p className="eyebrow">Sebuah Hadiah Kecil</p>
        <h1 className="mt-3.5 font-display text-5xl font-light leading-none text-burgundy sm:text-6xl">
          Untuk Nona
        </h1>
        <p className="mt-2.5 font-display text-xl sm:text-2xl italic text-ink-muted">
          Untuk 10 Desember
        </p>

        <div className="mx-auto my-6 sm:my-7 h-px w-14 bg-burgundy/15" />

        <p className="text-[15px] sm:text-base leading-relaxed text-ink">
          Untuk seseorang yang lahir pada 10 Desember.
        </p>
        <p className="mx-auto mt-2 max-w-sm text-xs sm:text-sm leading-relaxed text-ink-muted">
          Sebuah tempat kecil di internet untuk menyimpan hal-hal indah tentang kamu dan kita.
        </p>

        <div className="mt-9 sm:mt-10">
          <Link
            href="/countdown"
            className="btn-primary group w-full gap-2.5 sm:w-auto"
          >
            <span>Masuk ke Cerita Kita</span>
            <ArrowRight size={16} className="text-dustyrose-light transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </section>

      <footer className="relative z-10 mt-8 text-center text-xs text-ink-muted">
        10 Desember 2026 · Dibuat oleh Alex
      </footer>
    </main>
  );
}

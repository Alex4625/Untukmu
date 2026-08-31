import Link from 'next/link';
import { Gift, Lock, ArrowRight, ArrowLeft } from 'lucide-react';
import AudioPlayer from './AudioPlayer';
import ConfettiButton from './ConfettiButton';
import Countdown from './Countdown';
import type { PublicContent } from '@/lib/types';
import { previewPath } from '@/lib/publicUrl';

export default function CountdownPageClient({ content }: { content: PublicContent }) {
  const hubHref = previewPath('/hub', content.preview);
  const homeHref = previewPath('/', content.preview);

  return (
    <main className="container-page relative min-h-dvh flex flex-col justify-center pt-8 pb-28 sm:py-16">
      <nav className="mb-6">
        <Link
          href={homeHref}
          className="inline-flex items-center gap-2 text-sm font-medium text-ink-muted transition hover:text-burgundy"
        >
          <ArrowLeft size={16} className="text-dustyrose" />
          <span>Kembali</span>
        </Link>
      </nav>

      <section className="mx-auto flex w-full max-w-2xl flex-col items-center justify-center text-center">
        {content.unlocked ? (
          <div className="card fade-in w-full px-6 py-10 text-center sm:px-12 sm:py-16">
            <div className="mx-auto mb-5 flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-paper text-burgundy soft-pulse">
              <Gift size={26} className="text-dustyrose" />
            </div>

            <p className="eyebrow">Birthday Mode</p>
            <h1 className="mt-3.5 font-display text-4xl font-light leading-tight text-burgundy sm:text-5xl md:text-6xl">
              Hari ini akhirnya datang.
            </h1>
            <p className="mt-2.5 font-display text-xl sm:text-2xl italic text-dustyrose">
              Selamat ulang tahun, sayang.
            </p>

            <div className="mx-auto my-5 sm:my-6 h-px w-14 bg-burgundy/15" />

            <p className="mx-auto max-w-md text-[15px] sm:text-base leading-relaxed text-ink">
              {content.site_settings?.birthday_message ||
                'Sekarang kamu boleh membuka semua hal kecil yang aku siapin pelan-pelan untukmu.'}
            </p>

            {content.preview && (
              <p className="mx-auto mt-6 max-w-sm rounded-xl bg-paper px-4 py-2 text-xs font-semibold text-burgundy">
                Mode preview admin sedang aktif.
              </p>
            )}

            <div className="mt-8 sm:mt-10 flex flex-col items-center justify-center gap-3.5 sm:flex-row">
              <Link href={hubHref} className="btn-primary group gap-2 w-full sm:w-auto">
                <span>Buka Hadiahnya</span>
                <ArrowRight size={16} className="text-dustyrose-light transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <ConfettiButton label="Rayakan" className="btn-secondary w-full sm:w-auto" />
            </div>

            <div className="mt-8 border-t border-[rgba(90,40,52,0.10)] pt-6">
              <AudioPlayer src={content.site_settings?.music_url} />
            </div>
          </div>
        ) : (
          <div className="w-full fade-in space-y-8 sm:space-y-10">
            <header>
              <p className="eyebrow">Menghitung Hari</p>
              <h1 className="mt-2.5 font-display text-4xl font-light text-burgundy sm:text-5xl md:text-6xl italic">
                Menuju hari spesialmu
              </h1>
              <p className="mt-2.5 text-xs sm:text-sm text-ink-muted">
                10 Desember 2026 · Bersiap untuk kejutan kecilmu
              </p>
            </header>

            <Countdown unlockIso={content.unlockIso} />

            <blockquote className="mx-auto max-w-lg rounded-2xl border-l-4 border-dustyrose bg-paper/60 px-5 py-4 sm:px-6 sm:py-5 text-left font-display text-lg sm:text-xl italic leading-relaxed text-burgundy shadow-subtle">
              &ldquo;Aku siapin sesuatu yang mungkin sederhana, tapi aku buat pelan-pelan dengan hati.&rdquo;
            </blockquote>

            <div className="card mx-auto max-w-lg p-6 sm:p-8 text-center">
              <div className="mx-auto mb-3.5 flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full bg-paper text-ink-muted">
                <Lock size={18} className="text-dustyrose" />
              </div>
              <p className="text-xs sm:text-sm leading-relaxed text-ink-muted">
                Semua bagian masih terkunci. Nanti, pada 10 Desember 2026, semua akan terbuka untukmu.
              </p>
              <div className="mt-5 sm:mt-6 border-t border-[rgba(90,40,52,0.10)] pt-5">
                <AudioPlayer src={content.site_settings?.music_url} />
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

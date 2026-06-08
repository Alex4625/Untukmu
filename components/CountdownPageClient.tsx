import Link from 'next/link';
import { Gift, LockKeyhole } from 'lucide-react';
import AudioPlayer from './AudioPlayer';
import ConfettiButton from './ConfettiButton';
import Countdown from './Countdown';
import type { PublicContent } from '@/lib/types';

export default function CountdownPageClient({ content }: { content: PublicContent }) {
  const hubHref = content.preview ? '/hub?preview=unlocked' : '/hub';

  return (
    <main className="relative min-h-dvh overflow-hidden px-5 py-12 sm:py-16">
      <span className="sparkle left-[12%] top-[18%]" />
      <span className="sparkle right-[12%] top-[24%]" style={{ animationDelay: '1.5s' }} />
      <span className="sparkle bottom-[20%] left-[18%]" style={{ animationDelay: '3s' }} />

      <section className="mx-auto flex min-h-[calc(100dvh-6rem)] w-full max-w-3xl flex-col items-center justify-center text-center">
        <Link href={content.preview ? '/?preview=unlocked' : '/'} className="btn-ghost mb-8">Kembali</Link>

        {content.unlocked ? (
          <div className="glass-card fade-in w-full max-w-[520px] px-6 py-10 sm:px-10">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-cream text-rose soft-pulse">
              <Gift size={30} />
            </div>
            <p className="eyebrow">Birthday mode</p>
            <h1 className="mt-4 font-display text-5xl font-light leading-tight text-maroon">Hari ini akhirnya datang.</h1>
            <p className="mt-3 font-display text-2xl italic text-rose">Selamat ulang tahun, sayang.</p>
            <p className="mx-auto mt-5 max-w-sm text-base leading-7 text-cocoa">
              Sekarang kamu boleh membuka semua hal kecil yang aku siapin untuk kamu.
            </p>
            {content.preview && (
              <p className="mx-auto mt-5 max-w-sm rounded-xl bg-cream px-4 py-3 text-xs font-semibold text-maroon">
                Mode preview admin sedang aktif.
              </p>
            )}
            <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row">
              <Link href={hubHref} className="btn-primary">Buka Hadiahnya</Link>
              <ConfettiButton label="Rayakan" />
            </div>
          </div>
        ) : (
          <div className="w-full fade-in">
            <p className="font-display text-2xl italic text-muted">Menuju hari spesialmu</p>
            <div className="mt-10">
              <Countdown unlockIso={content.unlockIso} />
            </div>

            <blockquote className="mx-auto mt-10 max-w-[480px] rounded-r-xl border-l-4 border-softpink bg-cream px-6 py-5 text-left font-display text-xl italic leading-8 text-maroon">
              Aku siapin sesuatu yang mungkin sederhana, tapi aku buat dengan hati.
            </blockquote>

            <div className="mx-auto mt-8 max-w-[480px] rounded-2xl border border-[rgba(196,138,106,0.22)] bg-white px-6 py-6 text-center shadow-romantic">
              <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-cream text-muted">
                <LockKeyhole size={22} />
              </div>
              <p className="text-sm leading-6 text-muted">
                Semua bagian masih terkunci. Nanti, 10 Desember 2026, semua akan terbuka untukmu.
              </p>
              <div className="mt-5">
                <AudioPlayer src={content.site_settings?.music_url} />
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

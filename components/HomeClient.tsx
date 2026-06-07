'use client';

import Countdown from './Countdown';
import AudioPlayer from './AudioPlayer';
import ConfettiButton from './ConfettiButton';
import Link from 'next/link';
import type { PublicContent } from '@/lib/types';
import { CalendarHeart, Gift, LockKeyhole, Sparkles } from 'lucide-react';

export default function HomeClient({ content }: { content: PublicContent }) {
  return (
    <main>
      <section className="container-page flex min-h-screen items-center py-12">
        <div className="grid w-full gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="fade-in">
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-rose/20 bg-white/60 px-4 py-2 text-xs font-bold uppercase tracking-[0.25em] text-rosegold shadow-sm backdrop-blur">
              <Sparkles size={14} /> Untuk 10 Desember
            </p>
            <h1 className="font-display text-5xl font-extrabold leading-tight text-cocoa sm:text-7xl lg:text-8xl">
              Untuk<br />Nona
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-cocoa/70 sm:text-xl">
              Sebuah tempat kecil di internet untuk menyimpan hal-hal indah tentang kamu dan kita.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {content.unlocked ? (
                <Link href="/timeline" className="btn-primary gap-2"><Gift size={18} /> Buka Hadiahnya</Link>
              ) : (
                <a href="#countdown" className="btn-primary gap-2"><CalendarHeart size={18} /> Lihat Countdown</a>
              )}
              <Link href="/admin" className="btn-secondary">Admin</Link>
            </div>
          </div>

          <div className="card relative overflow-hidden p-6 sm:p-8 lg:p-10">
            <span className="sparkle right-12 top-10" />
            <span className="sparkle bottom-16 left-10" style={{ animationDelay: '1.5s' }} />
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-rosegold">Untuk seseorang yang lahir</p>
            <p className="mt-2 font-display text-5xl font-bold text-maroon sm:text-6xl">10 Desember</p>
            <p className="mt-5 leading-8 text-cocoa/70">
              {content.unlocked
                ? 'Hari ini akhirnya datang. Sekarang kamu boleh membuka semua hal kecil yang aku siapin untuk kamu.'
                : 'Aku siapin sesuatu yang mungkin sederhana, tapi aku buat dengan hati.'}
            </p>
            <div className="mt-8">
              <AudioPlayer src={content.site_settings?.music_url} />
            </div>
          </div>
        </div>
      </section>

      <section id="countdown" className="container-page pb-20">
        <div className="card p-6 sm:p-10">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.25em] text-rosegold">{content.unlocked ? 'Birthday mode' : 'Countdown'}</p>
              <h2 className="mt-3 section-title">{content.unlocked ? 'Hari ini akhirnya datang.' : 'Menuju hari spesialmu'}</h2>
              <p className="mt-4 leading-8 text-cocoa/70">
                {content.unlocked
                  ? 'Selamat ulang tahun, sayang. Sekarang semua bagian yang aku siapkan sudah bisa dibuka.'
                  : 'Timeline, Galeri, Surat, Kotak Kenangan, Quiz, Rencana Kita, dan Final Surprise baru terbuka pada 10 Desember 2026.'}
              </p>
              {content.unlocked && <div className="mt-6"><ConfettiButton label="Rayakan Sekarang" /></div>}
            </div>
            <Countdown unlockIso={content.unlockIso} />
          </div>
        </div>
      </section>

      {!content.unlocked ? <LockedSummary /> : <UnlockedSummary />}
    </main>
  );
}

function LockedSummary() {
  const locked = ['Timeline', 'Galeri', 'Surat', 'Kotak Kenangan', 'Quiz', 'Rencana Kita', 'Final Surprise'];
  return (
    <section className="container-page pb-24">
      <div className="rounded-[2rem] border border-rose/20 bg-white/70 p-6 text-center shadow-romantic backdrop-blur sm:p-10">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-cream text-maroon">
          <LockKeyhole size={28} />
        </div>
        <h2 className="font-display text-3xl font-bold text-cocoa sm:text-4xl">Masih Terkunci</h2>
        <p className="mx-auto mt-4 max-w-2xl leading-8 text-cocoa/70">
          Bagian ini sedang aku siapkan pelan-pelan. Nanti, 10 Desember 2026, kamu bisa melihat semua hal kecil yang aku kumpulkan untukmu.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-2">
          {locked.map((item) => <span key={item} className="rounded-full bg-cream px-4 py-2 text-sm font-bold text-maroon">{item}</span>)}
        </div>
      </div>
    </section>
  );
}

function UnlockedSummary() {
  const links = [
    ['Timeline', '/timeline'],
    ['Galeri', '/gallery'],
    ['Surat', '/letters'],
    ['Kotak Kenangan', '/memory-box'],
    ['Quiz', '/quiz'],
    ['Rencana Kita', '/plans'],
    ['Kejutan Terakhir', '/final']
  ];
  return (
    <section className="container-page pb-24">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {links.map(([label, href]) => (
          <Link key={href} href={href} className="rounded-[2rem] border border-white/70 bg-white/75 p-6 shadow-lg shadow-rose/10 transition hover:-translate-y-1 hover:bg-white">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-rosegold">Terbuka</p>
            <h3 className="mt-3 font-display text-3xl font-bold text-cocoa">{label}</h3>
          </Link>
        ))}
      </div>
    </section>
  );
}

import LockedNotice from '@/components/LockedNotice';
import PreviewBanner from '@/components/PreviewBanner';
import { getPublicContent } from '@/lib/publicContent';
import { isPreviewRequest, previewPath, type PageSearchParams } from '@/lib/publicPreview';
import { CHAPTERS } from '@/components/chapters';
import { ArrowRight, BookOpen, Sparkles } from 'lucide-react';
import Link from 'next/link';

import PublicNav from '@/components/PublicNav';

export const dynamic = 'force-dynamic';

export default async function HubPage({ searchParams }: { searchParams?: PageSearchParams }) {
  const content = await getPublicContent(await isPreviewRequest(searchParams));
  if (!content.unlocked) return <LockedNotice />;

  const firstChapterHref = previewPath('/timeline', content.preview);

  return (
    <main className="min-h-dvh pt-20 pb-28 px-4 sm:px-6">
      <PublicNav preview={content.preview} />
      {content.preview && (
        <div className="mx-auto max-w-4xl mb-4">
          <PreviewBanner />
        </div>
      )}

      {/* Intro Hero Card */}
      <section className="card mx-auto max-w-3xl px-6 py-8 sm:px-12 sm:py-12 text-center fade-in">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border-2 border-[#8C4E28] bg-[#FFE8A3] text-[#B53000]">
          <BookOpen size={24} className="text-[#B53000]" />
        </div>

        <p className="eyebrow text-[#B53000]">Pengantar Cerita</p>
        <h1 className="mt-2 font-nunito text-4xl sm:text-5xl md:text-6xl font-black text-[#663300]">
          Untuk Nona
        </h1>
        <p className="mt-1 font-nunito text-lg sm:text-xl font-bold text-[#8C4E28]">
          Sebuah perjalanan kecil dalam 7 chapter
        </p>

        <div className="stardew-divider my-5" />

        <p className="mx-auto max-w-lg font-nunito text-base font-bold leading-relaxed text-[#3E2723]">
          Selamat datang di tempat kecil ini. Semua tulisan, foto, dan kenangan di sini ditulis dan dikumpulkan pelan-pelan untuk hari ulang tahunmu.
        </p>
        <p className="mx-auto mt-2 max-w-md font-nunito text-sm font-semibold leading-relaxed text-[#5A3E2D]">
          Kamu bisa mulai membaca secara berurutan dari chapter pertama, atau membuka chapter mana pun yang ingin kamu lihat lebih dulu.
        </p>

        {/* Primary CTA leading to Chapter 01 */}
        <div className="mt-8 flex justify-center">
          <Link
            href={firstChapterHref}
            className="btn-primary group gap-2.5 px-8 py-3.5 text-base font-extrabold"
          >
            <span>Mulai Membaca</span>
            <span className="text-[#F9EC88]">01. Sebuah Awal</span>
            <ArrowRight size={18} className="text-[#F9EC88] transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>
      </section>

      {/* Chapter Table of Contents Overview */}
      <section className="mx-auto mt-10 max-w-3xl">
        <div className="mb-4 flex items-center justify-between px-2">
          <h2 className="font-nunito text-2xl sm:text-3xl font-black text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
            Daftar Isi Cerita
          </h2>
          <span className="rounded-lg border border-[#F9EC88] bg-[#154794]/85 px-3 py-1 font-nunito text-xs font-black text-[#F9EC88] shadow-sm">
            7 Chapter Lengkap
          </span>
        </div>

        <div className="grid gap-3.5 sm:grid-cols-2">
          {CHAPTERS.map((ch) => (
            <Link
              key={ch.number}
              href={previewPath(ch.href, content.preview)}
              className="card group flex items-start gap-3.5 p-4 sm:p-5 transition hover:brightness-105 active:scale-[0.99]"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border-2 border-[#4A2411] bg-gradient-to-b from-[#A05A2C] to-[#7A3C18] font-nunito text-lg font-black text-[#F9EC88] shadow-md transition group-hover:scale-105">
                {ch.number}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-nunito text-lg sm:text-xl font-black text-[#663300] leading-tight">
                    {ch.publicTitle}
                  </h3>
                  {ch.number === '07' && <Sparkles size={16} className="text-[#D4A325] shrink-0" />}
                </div>
                <p className="mt-1 font-nunito text-xs font-bold text-[#5A3E2D] leading-relaxed line-clamp-1">
                  {ch.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}

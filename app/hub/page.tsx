import LockedNotice from '@/components/LockedNotice';
import PreviewBanner from '@/components/PreviewBanner';
import { getPublicContent } from '@/lib/publicContent';
import { isPreviewRequest, previewPath, type PageSearchParams } from '@/lib/publicPreview';
import { CHAPTERS } from '@/components/chapters';
import { ArrowRight, BookOpen, Sparkles } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function HubPage({ searchParams }: { searchParams?: PageSearchParams }) {
  const content = await getPublicContent(await isPreviewRequest(searchParams));
  if (!content.unlocked) return <LockedNotice />;

  const firstChapterHref = previewPath('/timeline', content.preview);

  return (
    <main className="container-page min-h-dvh pt-8 sm:pt-14">
      {content.preview && <PreviewBanner />}

      {/* Intro Hero Section */}
      <section className="mx-auto max-w-2xl text-center fade-in">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-paper text-burgundy">
          <BookOpen size={22} className="text-dustyrose" />
        </div>

        <p className="eyebrow">Pengantar Cerita</p>
        <h1 className="mt-3 font-display text-5xl font-light leading-tight text-burgundy sm:text-6xl md:text-7xl">
          Untuk Nona
        </h1>
        <p className="mt-2.5 font-display text-xl sm:text-2xl italic text-dustyrose">
          Sebuah perjalanan kecil dalam 7 chapter
        </p>

        <div className="mx-auto my-6 sm:my-7 h-px w-14 bg-burgundy/15" />

        <p className="mx-auto max-w-lg text-[15px] sm:text-base leading-relaxed text-ink">
          Selamat datang di tempat kecil ini. Semua tulisan, foto, dan kenangan di sini ditulis dan dikumpulkan pelan-pelan untuk hari ulang tahunmu.
        </p>
        <p className="mx-auto mt-2.5 max-w-md text-xs sm:text-sm leading-relaxed text-ink-muted">
          Kamu bisa mulai membaca secara berurutan dari chapter pertama, atau membuka chapter mana pun yang ingin kamu lihat lebih dulu.
        </p>

        {/* Primary CTA leading to Chapter 01 */}
        <div className="mt-8 sm:mt-10">
          <Link
            href={firstChapterHref}
            className="btn-primary group gap-2.5 px-8 py-3.5 text-base"
          >
            <span>Mulai Membaca</span>
            <span className="font-display italic text-dustyrose-light font-normal">01. Sebuah Awal</span>
            <ArrowRight size={17} className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </section>

      {/* Chapter Table of Contents Overview */}
      <section className="mx-auto mt-14 sm:mt-18 max-w-3xl border-t border-[rgba(90,40,52,0.10)] pt-10 sm:pt-12">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-display text-2xl font-normal text-burgundy">Daftar Isi Cerita</h2>
          <span className="text-xs uppercase tracking-wider text-dustyrose font-medium">7 Chapter Lengkap</span>
        </div>

        <div className="grid gap-3.5 sm:grid-cols-2">
          {CHAPTERS.map((ch) => (
            <Link
              key={ch.number}
              href={previewPath(ch.href, content.preview)}
              className="card group flex items-start gap-3.5 p-4 sm:p-5 hover:border-dustyrose/40 hover:bg-[#FAF6F0] active:scale-[0.99]"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-paper font-display text-lg text-burgundy transition group-hover:bg-burgundy group-hover:text-white">
                {ch.number}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-xl text-burgundy leading-tight group-hover:text-burgundy-dark">
                    {ch.publicTitle}
                  </h3>
                  {ch.number === '07' && <Sparkles size={14} className="text-gold shrink-0" />}
                </div>
                <p className="mt-1 text-xs text-ink-muted leading-relaxed line-clamp-1">
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

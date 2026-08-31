import ConfettiButton from '@/components/ConfettiButton';
import LockedNotice from '@/components/LockedNotice';
import PreviewBanner from '@/components/PreviewBanner';
import PublicNav from '@/components/PublicNav';
import { getPublicContent } from '@/lib/publicContent';
import { isPreviewRequest, previewPath, type PageSearchParams } from '@/lib/publicPreview';
import { Sparkles, BookOpen } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function FinalPage({ searchParams }: { searchParams?: PageSearchParams }) {
  const content = await getPublicContent(await isPreviewRequest(searchParams));
  if (!content.unlocked) return <LockedNotice title="Chapter penutup belum saatnya dibuka" />;

  const defaultFinalMessage =
    'Selamat ulang tahun, sayang.\n\nAku tidak tahu semua hal yang akan terjadi ke depan, tapi aku tahu satu hal: aku sangat bersyukur karena kamu ada di hidupku.\n\nSemoga hari ini dan seterusnya, kamu selalu bahagia, selalu sehat, dan selalu merasa dicintai.\n\nDari Alex.';

  return (
    <main className="container-page min-h-dvh pt-6 sm:pt-10">
      <PublicNav preview={content.preview} currentChapterNumber="07" />
      {content.preview && <PreviewBanner />}

      {/* Chapter 07 Emotional Centerpiece */}
      <section className="fade-in mx-auto max-w-3xl my-6">
        <div className="relative overflow-hidden rounded-3xl bg-burgundy px-6 py-12 text-center text-white shadow-2xl sm:px-14 sm:py-18">
          {/* Ambient Glow */}
          <div className="pointer-events-none absolute -top-24 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-dustyrose/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 right-1/4 h-80 w-80 rounded-full bg-gold/15 blur-3xl" />

          <div className="relative z-10">
            <div className="mx-auto mb-5 flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-burgundy-dark/60 text-gold shadow-card soft-pulse">
              <Sparkles size={26} />
            </div>

            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-dustyrose-light">
              Chapter 07 · Penutup Cerita
            </p>

            <h1 className="mt-3 font-display text-4xl font-light leading-tight text-[#FDFBF7] sm:text-5xl md:text-6xl">
              Untuk Hari Ini
            </h1>
            <p className="mt-2 font-display text-xl sm:text-2xl italic text-gold-light">
              Selamat ulang tahun, sayang.
            </p>

            <div className="mx-auto my-6 sm:my-8 h-px w-16 bg-dustyrose/30" />

            <div className="mx-auto max-w-xl text-left sm:text-center">
              <p className="font-sans text-[15px] sm:text-[16px] md:text-[17px] leading-relaxed text-[#F7F2EA]/95 whitespace-pre-line">
                {content.site_settings?.final_message || defaultFinalMessage}
              </p>
            </div>

            <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <ConfettiButton
                label="Rayakan dengan Konfeti"
                className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-gold px-7 py-3 text-sm font-semibold text-burgundy-dark shadow-card transition hover:bg-gold-light active:scale-[0.98]"
              />
            </div>
          </div>
        </div>

        {/* Journey Summary / Return */}
        <div className="mt-12 text-center">
          <p className="text-xs uppercase tracking-widest text-dustyrose mb-3 font-medium">Selesai Membaca</p>
          <Link
            href={previewPath('/hub', content.preview)}
            className="group inline-flex items-center gap-2.5 rounded-full border border-burgundy/20 bg-[#FDFBF7] px-6 py-3 text-sm font-medium text-burgundy shadow-card transition hover:border-burgundy/40 hover:shadow-elevated active:scale-[0.99]"
          >
            <BookOpen size={16} className="text-dustyrose" />
            <span>Kembali ke Halaman Pembuka</span>
          </Link>
        </div>
      </section>
    </main>
  );
}

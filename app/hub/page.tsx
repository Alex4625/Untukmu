import LockedNotice from '@/components/LockedNotice';
import PreviewBanner from '@/components/PreviewBanner';
import { getPublicContent } from '@/lib/publicContent';
import { isPreviewRequest, previewPath, type PageSearchParams } from '@/lib/publicPreview';
import { BookOpen } from 'lucide-react';
import HubChapterCards from '@/components/HubChapterCards';
import PublicNav from '@/components/PublicNav';

export const dynamic = 'force-dynamic';

export default async function HubPage({ searchParams }: { searchParams?: PageSearchParams }) {
  const content = await getPublicContent(await isPreviewRequest(searchParams));
  if (!content.unlocked) return <LockedNotice />;

  const firstChapterHref = previewPath('/timeline', content.preview);

  return (
    <main className="min-h-dvh pt-16 sm:pt-20 pb-36 sm:pb-32 px-2.5 sm:px-6">
      <PublicNav preview={content.preview} />
      {content.preview && (
        <div className="mx-auto max-w-4xl mb-4 px-1">
          <PreviewBanner />
        </div>
      )}

      {/* Intro Hero Card */}
      <section className="card mx-auto max-w-3xl px-4 py-7 sm:px-12 sm:py-12 text-center fade-in">
        <div className="mx-auto mb-3 sm:mb-4 flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full border-2 border-[#8C4E28] bg-[#FFE8A3] text-[#B53000]">
          <BookOpen size={22} className="text-[#B53000]" />
        </div>

        <p className="eyebrow text-[#B53000]">Pengantar Cerita</p>
        <h1 className="mt-1 sm:mt-2 font-nunito text-3xl sm:text-5xl md:text-6xl font-black text-[#663300]">
          Untuk Nona
        </h1>
        <p className="mt-1 font-nunito text-base sm:text-xl font-bold text-[#8C4E28]">
          Sebuah perjalanan kecil dalam 7 chapter
        </p>

        <div className="stardew-divider my-4 sm:my-5" />

        <p className="mx-auto max-w-lg font-nunito text-sm sm:text-base font-bold leading-relaxed text-[#3E2723]">
          Selamat datang di tempat kecil ini. Semua tulisan, foto, dan kenangan di sini ditulis dan dikumpulkan pelan-pelan untuk hari ulang tahunmu.
        </p>
        <p className="mx-auto mt-2 max-w-md font-nunito text-xs sm:text-sm font-semibold leading-relaxed text-[#5A3E2D]">
          Kamu bisa mulai membaca secara berurutan dari chapter pertama, atau membuka chapter mana pun yang ingin kamu lihat lebih dulu.
        </p>

        <HubChapterCards
          firstChapterHref={firstChapterHref}
          preview={content.preview}
        />
      </section>
    </main>
  );
}

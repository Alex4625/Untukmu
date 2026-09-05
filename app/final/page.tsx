import LockedNotice from '@/components/LockedNotice';
import PreviewBanner from '@/components/PreviewBanner';
import PublicNav from '@/components/PublicNav';
import FinalSurprise from '@/components/FinalSurprise';
import { getPublicContent } from '@/lib/publicContent';
import { isPreviewRequest, type PageSearchParams } from '@/lib/publicPreview';

export const dynamic = 'force-dynamic';

export default async function FinalPage({ searchParams }: { searchParams?: PageSearchParams }) {
  const content = await getPublicContent(await isPreviewRequest(searchParams));
  if (!content.unlocked) return <LockedNotice title="Chapter penutup belum saatnya dibuka" />;

  const defaultFinalMessage =
    'Selamat ulang tahun, sayang.\n\nAku tidak tahu semua hal yang akan terjadi ke depan, tapi aku tahu satu hal: aku sangat bersyukur karena kamu ada di hidupku.\n\nSemoga hari ini dan seterusnya, kamu selalu bahagia, selalu sehat, dan selalu merasa dicintai.\n\nDari Alex.';

  const finalMessage = content.site_settings?.final_message || defaultFinalMessage;

  return (
    <main className="container-page relative min-h-dvh pt-16 sm:pt-20 pb-36 sm:pb-32 px-2 sm:px-6">
      {/* World Frame corner anchors */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-2 top-4 h-6 w-6 border-l border-t border-burgundy/15 sm:left-6 sm:top-6 sm:h-8 sm:w-8"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-2 top-4 h-6 w-6 border-r border-t border-burgundy/15 sm:right-6 sm:top-6 sm:h-8 sm:w-8"
      />

      <PublicNav preview={content.preview} currentChapterNumber="07" />
      {content.preview && <PreviewBanner />}

      <FinalSurprise
        finalMessage={finalMessage}
        preview={content.preview}
      />
    </main>
  );
}

import LockedNotice from '@/components/LockedNotice';
import SectionShell from '@/components/SectionShell';
import Timeline from '@/components/Timeline';
import { getPublicContent } from '@/lib/publicContent';
import { isPreviewRequest, type PageSearchParams } from '@/lib/publicPreview';

export const dynamic = 'force-dynamic';

export default async function TimelinePage({ searchParams }: { searchParams?: PageSearchParams }) {
  const content = await getPublicContent(await isPreviewRequest(searchParams));
  if (!content.unlocked) return <LockedNotice title="Chapter ini belum saatnya dibuka" />;

  return (
    <SectionShell
      chapterNumber="01"
      eyebrow="Chapter 01"
      title="Sebuah Awal"
      description="Kenangan-kenangan kecil yang berjalan pelan, membuka kembali bagaimana semua cerita indah ini bermula."
      preview={content.preview}
    >
      <Timeline memories={content.memories} />
    </SectionShell>
  );
}

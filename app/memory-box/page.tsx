import LockedNotice from '@/components/LockedNotice';
import MemoryBox from '@/components/MemoryBox';
import SectionShell from '@/components/SectionShell';
import { getPublicContent } from '@/lib/publicContent';
import { isPreviewRequest, type PageSearchParams } from '@/lib/publicPreview';

export const dynamic = 'force-dynamic';

export default async function MemoryBoxPage({ searchParams }: { searchParams?: PageSearchParams }) {
  const content = await getPublicContent(await isPreviewRequest(searchParams));
  if (!content.unlocked) return <LockedNotice title="Chapter ini belum saatnya dibuka" />;

  return (
    <SectionShell
      chapterNumber="04"
      eyebrow="Chapter 04"
      title="Yang Tak Terucap"
      description="Pilih satu kartu kecil. Setiap kartu menyimpan alasan, doa, dan rasa yang mungkin jarang terucap."
      preview={content.preview}
    >
      <MemoryBox cards={content.memory_cards} />
    </SectionShell>
  );
}

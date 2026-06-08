import LockedNotice from '@/components/LockedNotice';
import MemoryBox from '@/components/MemoryBox';
import SectionShell from '@/components/SectionShell';
import { getPublicContent } from '@/lib/publicContent';
import { isPreviewRequest, type PageSearchParams } from '@/lib/publicPreview';

export const dynamic = 'force-dynamic';

export default async function MemoryBoxPage({ searchParams }: { searchParams?: PageSearchParams }) {
  const content = await getPublicContent(await isPreviewRequest(searchParams));
  if (!content.unlocked) return <LockedNotice />;
  return (
    <SectionShell eyebrow="Kotak Kenangan" title="Kotak Kenangan" description="Pilih satu kartu kecil. Setiap kartu menyimpan satu hal tentang kamu." preview={content.preview}>
      <MemoryBox cards={content.memory_cards} />
    </SectionShell>
  );
}

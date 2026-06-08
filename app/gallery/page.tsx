import LockedNotice from '@/components/LockedNotice';
import MemoryGrid from '@/components/MemoryGrid';
import SectionShell from '@/components/SectionShell';
import { getPublicContent } from '@/lib/publicContent';
import { isPreviewRequest, type PageSearchParams } from '@/lib/publicPreview';

export const dynamic = 'force-dynamic';

export default async function GalleryPage({ searchParams }: { searchParams?: PageSearchParams }) {
  const content = await getPublicContent(await isPreviewRequest(searchParams));
  if (!content.unlocked) return <LockedNotice />;
  return (
    <SectionShell eyebrow="Galeri" title="Potongan Momen" description="Foto-foto kecil yang menyimpan banyak cerita." preview={content.preview}>
      <MemoryGrid memories={content.memories} />
    </SectionShell>
  );
}

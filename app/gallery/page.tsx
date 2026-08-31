import LockedNotice from '@/components/LockedNotice';
import MemoryGrid from '@/components/MemoryGrid';
import SectionShell from '@/components/SectionShell';
import { getPublicContent } from '@/lib/publicContent';
import { isPreviewRequest, type PageSearchParams } from '@/lib/publicPreview';

export const dynamic = 'force-dynamic';

export default async function GalleryPage({ searchParams }: { searchParams?: PageSearchParams }) {
  const content = await getPublicContent(await isPreviewRequest(searchParams));
  if (!content.unlocked) return <LockedNotice title="Chapter ini belum saatnya dibuka" />;

  return (
    <SectionShell
      chapterNumber="02"
      eyebrow="Chapter 02"
      title="Momen Kecil"
      description="Koleksi potret dan potongan senyuman yang tersimpan rapi sepanjang perjalanan kita."
      preview={content.preview}
    >
      <MemoryGrid memories={content.memories} />
    </SectionShell>
  );
}

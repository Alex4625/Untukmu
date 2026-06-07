import LockedNotice from '@/components/LockedNotice';
import MemoryGrid from '@/components/MemoryGrid';
import SectionShell from '@/components/SectionShell';
import { isAdminRequest } from '@/lib/adminAuth';
import { getPublicContent } from '@/lib/publicContent';

export const dynamic = 'force-dynamic';

export default async function GalleryPage({ searchParams }: { searchParams: { preview?: string } }) {
  const content = await getPublicContent(searchParams.preview === 'unlocked' && isAdminRequest());
  if (!content.unlocked) return <LockedNotice />;
  return (
    <SectionShell eyebrow="Galeri" title="Galeri Kenangan" description="Foto-foto kecil yang menyimpan banyak cerita.">
      <MemoryGrid memories={content.memories} />
    </SectionShell>
  );
}

import LockedNotice from '@/components/LockedNotice';
import MemoryBox from '@/components/MemoryBox';
import SectionShell from '@/components/SectionShell';
import { isAdminRequest } from '@/lib/adminAuth';
import { getPublicContent } from '@/lib/publicContent';

export const dynamic = 'force-dynamic';

export default async function MemoryBoxPage({ searchParams }: { searchParams: { preview?: string } }) {
  const content = await getPublicContent(searchParams.preview === 'unlocked' && isAdminRequest());
  if (!content.unlocked) return <LockedNotice />;
  return (
    <SectionShell eyebrow="Kotak Kenangan" title="Kotak Kenangan" description="Pilih satu kartu kecil. Setiap kartu menyimpan satu hal tentang kamu.">
      <MemoryBox cards={content.memory_cards} />
    </SectionShell>
  );
}

import LockedNotice from '@/components/LockedNotice';
import SectionShell from '@/components/SectionShell';
import Timeline from '@/components/Timeline';
import { isAdminRequest } from '@/lib/adminAuth';
import { getPublicContent } from '@/lib/publicContent';

export const dynamic = 'force-dynamic';

export default async function TimelinePage({ searchParams }: { searchParams: { preview?: string } }) {
  const content = await getPublicContent(searchParams.preview === 'unlocked' && isAdminRequest());
  if (!content.unlocked) return <LockedNotice />;
  return (
    <SectionShell eyebrow="Timeline" title="Timeline Kisah Kita" description="Setiap tanggal punya cerita. Beberapa sederhana, tapi tetap berarti.">
      <Timeline memories={content.memories} />
    </SectionShell>
  );
}

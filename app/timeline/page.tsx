import LockedNotice from '@/components/LockedNotice';
import SectionShell from '@/components/SectionShell';
import Timeline from '@/components/Timeline';
import { isAdminRequest } from '@/lib/adminAuth';
import { getPublicContent } from '@/lib/publicContent';

export const dynamic = 'force-dynamic';

export default async function TimelinePage() {
  const content = await getPublicContent(await isAdminRequest());
  if (!content.unlocked) return <LockedNotice />;
  return (
    <SectionShell eyebrow="Timeline" title="Perjalanan Kita" description="Kenangan-kenangan kecil yang aku ingat.">
      <Timeline memories={content.memories} />
    </SectionShell>
  );
}

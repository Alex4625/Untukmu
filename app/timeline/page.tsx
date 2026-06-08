import LockedNotice from '@/components/LockedNotice';
import SectionShell from '@/components/SectionShell';
import Timeline from '@/components/Timeline';
import { getPublicContent } from '@/lib/publicContent';
import { isPreviewRequest, type PageSearchParams } from '@/lib/publicPreview';

export const dynamic = 'force-dynamic';

export default async function TimelinePage({ searchParams }: { searchParams?: PageSearchParams }) {
  const content = await getPublicContent(await isPreviewRequest(searchParams));
  if (!content.unlocked) return <LockedNotice />;
  return (
    <SectionShell eyebrow="Timeline" title="Perjalanan Kita" description="Kenangan-kenangan kecil yang aku ingat." preview={content.preview}>
      <Timeline memories={content.memories} />
    </SectionShell>
  );
}

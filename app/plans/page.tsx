import LockedNotice from '@/components/LockedNotice';
import Plans from '@/components/Plans';
import SectionShell from '@/components/SectionShell';
import { getPublicContent } from '@/lib/publicContent';
import { isPreviewRequest, type PageSearchParams } from '@/lib/publicPreview';

export const dynamic = 'force-dynamic';

export default async function PlansPage({ searchParams }: { searchParams?: PageSearchParams }) {
  const content = await getPublicContent(await isPreviewRequest(searchParams));
  if (!content.unlocked) return <LockedNotice />;
  return (
    <SectionShell eyebrow="Rencana Kita" title="Rencana Kita" description="Hal-hal kecil yang semoga bisa kita lakukan bersama." preview={content.preview}>
      <Plans plans={content.plans} />
    </SectionShell>
  );
}

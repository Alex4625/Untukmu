import LockedNotice from '@/components/LockedNotice';
import Plans from '@/components/Plans';
import SectionShell from '@/components/SectionShell';
import { isAdminRequest } from '@/lib/adminAuth';
import { getPublicContent } from '@/lib/publicContent';

export const dynamic = 'force-dynamic';

export default async function PlansPage({ searchParams }: { searchParams: { preview?: string } }) {
  const content = await getPublicContent(searchParams.preview === 'unlocked' && isAdminRequest());
  if (!content.unlocked) return <LockedNotice />;
  return (
    <SectionShell eyebrow="Rencana Kita" title="Rencana Kita" description="Hal-hal kecil yang semoga bisa kita lakukan bersama.">
      <Plans plans={content.plans} />
    </SectionShell>
  );
}

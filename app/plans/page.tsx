import LockedNotice from '@/components/LockedNotice';
import Plans from '@/components/Plans';
import SectionShell from '@/components/SectionShell';
import { getPublicContent } from '@/lib/publicContent';
import { isPreviewRequest, type PageSearchParams } from '@/lib/publicPreview';

export const dynamic = 'force-dynamic';

export default async function PlansPage({ searchParams }: { searchParams?: PageSearchParams }) {
  const content = await getPublicContent(await isPreviewRequest(searchParams));
  if (!content.unlocked) return <LockedNotice title="Chapter ini belum saatnya dibuka" />;

  return (
    <SectionShell
      chapterNumber="06"
      eyebrow="Chapter 06"
      title="Mungkin Nanti"
      description="Harapan-harapan kecil dan rencana masa depan yang semoga bisa kita lalui bersama."
      preview={content.preview}
    >
      <Plans plans={content.plans} />
    </SectionShell>
  );
}

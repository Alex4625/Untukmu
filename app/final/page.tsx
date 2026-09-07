import LockedNotice from '@/components/LockedNotice';
import UnifiedBookExperience from '@/components/book/UnifiedBookExperience';
import { getPublicContent } from '@/lib/publicContent';
import { isPreviewRequest, type PageSearchParams } from '@/lib/publicPreview';

export const dynamic = 'force-dynamic';

export default async function FinalPage({ searchParams }: { searchParams?: PageSearchParams }) {
  const content = await getPublicContent(await isPreviewRequest(searchParams));
  if (!content.unlocked) return <LockedNotice title="Chapter penutup belum saatnya dibuka" />;

  return <UnifiedBookExperience content={content} targetChapterNumber="07" isInitiallyOpen={true} />;
}

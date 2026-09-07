import LockedNotice from '@/components/LockedNotice';
import UnifiedBookExperience from '@/components/book/UnifiedBookExperience';
import { getPublicContent } from '@/lib/publicContent';
import { isPreviewRequest, type PageSearchParams } from '@/lib/publicPreview';

export const dynamic = 'force-dynamic';

export default async function HubPage({ searchParams }: { searchParams?: PageSearchParams }) {
  const content = await getPublicContent(await isPreviewRequest(searchParams));
  if (!content.unlocked) return <LockedNotice />;

  return <UnifiedBookExperience content={content} isInitiallyOpen={false} />;
}

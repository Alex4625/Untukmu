import UnifiedBookExperience from '@/components/book/UnifiedBookExperience';
import { getPublicContent } from '@/lib/publicContent';
import { isPreviewRequest, type PageSearchParams } from '@/lib/publicPreview';

export const dynamic = 'force-dynamic';

export default async function HomePage({ searchParams }: { searchParams?: PageSearchParams }) {
  const isPreview = await isPreviewRequest(searchParams);
  const content = await getPublicContent(isPreview);
  return <UnifiedBookExperience content={content} isInitiallyOpen={Boolean(content.unlocked || content.preview)} />;
}

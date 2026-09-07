import UnifiedBookExperience from '@/components/book/UnifiedBookExperience';
import { getPublicContent } from '@/lib/publicContent';
import { isPreviewRequest, type PageSearchParams } from '@/lib/publicPreview';

export const dynamic = 'force-dynamic';

export default async function CountdownPage({ searchParams }: { searchParams?: PageSearchParams }) {
  const content = await getPublicContent(await isPreviewRequest(searchParams));
  return <UnifiedBookExperience content={content} isInitiallyOpen={Boolean(content.unlocked || content.preview)} />;
}

import HomeClient from '@/components/HomeClient';
import { getPublicContent } from '@/lib/publicContent';
import { isAdminRequest } from '@/lib/adminAuth';

export const dynamic = 'force-dynamic';

export default async function HomePage({ searchParams }: { searchParams: { preview?: string } }) {
  const preview = searchParams.preview === 'unlocked' && isAdminRequest();
  const content = await getPublicContent(preview);
  return <HomeClient content={content} />;
}

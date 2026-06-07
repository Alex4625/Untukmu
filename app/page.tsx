import HomeClient from '@/components/HomeClient';
import { getPublicContent } from '@/lib/publicContent';
import { isAdminRequest } from '@/lib/adminAuth';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const content = await getPublicContent(await isAdminRequest());
  return <HomeClient content={content} />;
}

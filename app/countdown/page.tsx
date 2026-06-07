import CountdownPageClient from '@/components/CountdownPageClient';
import { isAdminRequest } from '@/lib/adminAuth';
import { getPublicContent } from '@/lib/publicContent';

export const dynamic = 'force-dynamic';

export default async function CountdownPage() {
  const content = await getPublicContent(await isAdminRequest());
  return <CountdownPageClient content={content} />;
}

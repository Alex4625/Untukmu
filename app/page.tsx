import HomeClient from '@/components/HomeClient';
import { isPreviewRequest, type PageSearchParams } from '@/lib/publicPreview';

export default async function HomePage({ searchParams }: { searchParams?: PageSearchParams }) {
  const isPreview = await isPreviewRequest(searchParams);
  return <HomeClient preview={isPreview} />;
}

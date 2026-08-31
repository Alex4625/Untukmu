import Letters from '@/components/Letters';
import LockedNotice from '@/components/LockedNotice';
import SectionShell from '@/components/SectionShell';
import { getPublicContent } from '@/lib/publicContent';
import { isPreviewRequest, type PageSearchParams } from '@/lib/publicPreview';

export const dynamic = 'force-dynamic';

export default async function LettersPage({ searchParams }: { searchParams?: PageSearchParams }) {
  const content = await getPublicContent(await isPreviewRequest(searchParams));
  if (!content.unlocked) return <LockedNotice title="Chapter ini belum saatnya dibuka" />;

  return (
    <SectionShell
      chapterNumber="03"
      eyebrow="Chapter 03"
      title="Yang Aku Ingat"
      description="Ada beberapa hal yang lebih jujur dan lembut saat ditulis pelan di atas kertas."
      preview={content.preview}
    >
      <Letters letters={content.letters} />
    </SectionShell>
  );
}

import Letters from '@/components/Letters';
import LockedNotice from '@/components/LockedNotice';
import SectionShell from '@/components/SectionShell';
import { getPublicContent } from '@/lib/publicContent';
import { isPreviewRequest, type PageSearchParams } from '@/lib/publicPreview';

export const dynamic = 'force-dynamic';

export default async function LettersPage({ searchParams }: { searchParams?: PageSearchParams }) {
  const content = await getPublicContent(await isPreviewRequest(searchParams));
  if (!content.unlocked) return <LockedNotice />;
  return (
    <SectionShell eyebrow="Surat" title="Surat Untukmu" description="Ada beberapa hal yang lebih mudah aku tulis daripada aku ucapkan langsung." preview={content.preview}>
      <Letters letters={content.letters} />
    </SectionShell>
  );
}

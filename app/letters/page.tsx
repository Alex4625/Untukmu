import Letters from '@/components/Letters';
import LockedNotice from '@/components/LockedNotice';
import SectionShell from '@/components/SectionShell';
import { isAdminRequest } from '@/lib/adminAuth';
import { getPublicContent } from '@/lib/publicContent';

export const dynamic = 'force-dynamic';

export default async function LettersPage() {
  const content = await getPublicContent(await isAdminRequest());
  if (!content.unlocked) return <LockedNotice />;
  return (
    <SectionShell eyebrow="Surat" title="Surat Untukmu" description="Ada beberapa hal yang lebih mudah aku tulis daripada aku ucapkan langsung.">
      <Letters letters={content.letters} />
    </SectionShell>
  );
}

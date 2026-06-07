import LockedNotice from '@/components/LockedNotice';
import Quiz from '@/components/Quiz';
import SectionShell from '@/components/SectionShell';
import { isAdminRequest } from '@/lib/adminAuth';
import { getPublicContent } from '@/lib/publicContent';

export const dynamic = 'force-dynamic';

export default async function QuizPage({ searchParams }: { searchParams: { preview?: string } }) {
  const content = await getPublicContent(searchParams.preview === 'unlocked' && isAdminRequest());
  if (!content.unlocked) return <LockedNotice />;
  return (
    <SectionShell eyebrow="Quiz" title="Quiz Tentang Kita" description="Pertanyaan kecil untuk membuat hadiah ini terasa lebih hidup.">
      <Quiz questions={content.quiz_questions} />
    </SectionShell>
  );
}

import LockedNotice from '@/components/LockedNotice';
import Quiz from '@/components/Quiz';
import SectionShell from '@/components/SectionShell';
import { getPublicContent } from '@/lib/publicContent';
import { isPreviewRequest, type PageSearchParams } from '@/lib/publicPreview';

export const dynamic = 'force-dynamic';

export default async function QuizPage({ searchParams }: { searchParams?: PageSearchParams }) {
  const content = await getPublicContent(await isPreviewRequest(searchParams));
  if (!content.unlocked) return <LockedNotice />;
  return (
    <SectionShell eyebrow="Quiz" title="Quiz Tentang Kita" description="Pertanyaan kecil untuk membuat hadiah ini terasa lebih hidup." preview={content.preview}>
      <Quiz questions={content.quiz_questions} />
    </SectionShell>
  );
}

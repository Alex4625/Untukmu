import LockedNotice from '@/components/LockedNotice';
import Quiz from '@/components/Quiz';
import SectionShell from '@/components/SectionShell';
import { getPublicContent } from '@/lib/publicContent';
import { isPreviewRequest, type PageSearchParams } from '@/lib/publicPreview';

export const dynamic = 'force-dynamic';

export default async function QuizPage({ searchParams }: { searchParams?: PageSearchParams }) {
  const content = await getPublicContent(await isPreviewRequest(searchParams));
  if (!content.unlocked) return <LockedNotice title="Chapter ini belum saatnya dibuka" />;

  return (
    <SectionShell
      chapterNumber="05"
      eyebrow="Chapter 05"
      title="Tentang Kamu"
      description="Pertanyaan-pertanyaan ringan dan hangat tentang kita, untuk tersenyum sebentar."
      preview={content.preview}
    >
      <Quiz questions={content.quiz_questions} />
    </SectionShell>
  );
}

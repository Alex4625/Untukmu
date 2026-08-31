import PublicNav from './PublicNav';
import PreviewBanner from './PreviewBanner';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getNextChapter } from './chapters';
import { previewPath } from '@/lib/publicUrl';

export default function SectionShell({
  chapterNumber,
  eyebrow,
  title,
  description,
  preview = false,
  children
}: {
  chapterNumber?: string;
  eyebrow: string;
  title: string;
  description: string;
  preview?: boolean;
  children: React.ReactNode;
}) {
  const nextChapter = chapterNumber ? getNextChapter(chapterNumber) : null;

  return (
    <main className="container-page min-h-dvh pt-6 sm:pt-10">
      <PublicNav preview={preview} currentChapterNumber={chapterNumber} />
      {preview && <PreviewBanner />}

      {/* Chapter Editorial Header */}
      <header className="mb-10 text-center sm:mb-14 fade-in">
        {chapterNumber && (
          <p className="font-display text-sm sm:text-base italic text-gold tracking-widest mb-1.5">
            Chapter {chapterNumber}
          </p>
        )}
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="mt-2.5 section-title">{title}</h1>
        <div className="mx-auto my-4 sm:my-5 h-px w-12 bg-burgundy/15" />
        <p className="mx-auto max-w-xl text-sm sm:text-base leading-relaxed text-ink-muted px-2">
          {description}
        </p>
      </header>

      {/* Main Content Area */}
      <section className="fade-in">{children}</section>

      {/* Next Chapter Footer Navigation */}
      {nextChapter && (
        <footer className="mt-16 sm:mt-20 border-t border-[rgba(90,40,52,0.10)] pt-8 sm:pt-10 text-center">
          <p className="text-xs uppercase tracking-widest text-dustyrose mb-2 font-medium">Lanjut ke Babak Berikutnya</p>
          <Link
            href={previewPath(nextChapter.href, preview)}
            className="group inline-flex items-center gap-3 font-display text-2xl sm:text-3xl text-burgundy transition hover:text-burgundy-dark active:scale-[0.99]"
          >
            <span>
              <span className="italic text-gold">{nextChapter.number}</span>. {nextChapter.publicTitle}
            </span>
            <ArrowRight size={20} className="text-dustyrose transition-transform duration-300 group-hover:translate-x-1.5" />
          </Link>
        </footer>
      )}
    </main>
  );
}

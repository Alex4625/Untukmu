import PublicNav from './PublicNav';
import PreviewBanner from './PreviewBanner';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, BookOpen } from 'lucide-react';
import { getNextChapter, getPrevChapter } from './chapters';
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
  const prevChapter = chapterNumber ? getPrevChapter(chapterNumber) : null;

  return (
    <main className="min-h-dvh pt-20 pb-28 px-3 sm:px-6">
      <PublicNav preview={preview} currentChapterNumber={chapterNumber} />
      {preview && (
        <div className="mx-auto max-w-4xl mb-4">
          <PreviewBanner />
        </div>
      )}

      {/* Main Central Stardew Valley Parchment Container */}
      <div className="mx-auto max-w-4xl">
        <div className="card p-6 sm:p-10 md:p-12 shadow-2xl">
          {/* Chapter Editorial Header with smooth entrance */}
          <header className="mb-6 text-center chapter-header-enter">
            {chapterNumber && (
              <p className="font-nunito text-xs sm:text-sm font-black uppercase tracking-widest text-[#B53000]">
                {eyebrow}
              </p>
            )}
            <h1 className="mt-1 font-nunito text-3xl sm:text-4xl md:text-5xl font-black text-[#663300]">
              {title}
            </h1>
            <div className="stardew-divider my-4" />
            <p className="mx-auto max-w-xl font-nunito text-sm sm:text-base font-bold text-[#5A3E2D] leading-relaxed">
              {description}
            </p>
          </header>

          {/* Main Content Area */}
          <section className="my-6">{children}</section>

          {/* Bidirectional Chapter Footer Navigation */}
          {chapterNumber && (
            <footer className="mt-10 border-t-2 border-[#8C4E28]/25 pt-8">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                {/* Previous Navigation */}
                {prevChapter ? (
                  <Link
                    href={previewPath(prevChapter.href, preview)}
                    className="btn-secondary group w-full sm:w-auto justify-center gap-2 text-sm sm:text-base font-extrabold"
                  >
                    <ArrowLeft size={18} className="text-[#8C4E28] transition-transform duration-200 group-hover:-translate-x-1" />
                    <span>Ch. {prevChapter.number}: {prevChapter.publicTitle}</span>
                  </Link>
                ) : (
                  <Link
                    href={previewPath('/hub', preview)}
                    className="btn-secondary group w-full sm:w-auto justify-center gap-2 text-sm sm:text-base font-extrabold"
                  >
                    <BookOpen size={16} className="text-[#8C4E28]" />
                    <span>Daftar Cerita</span>
                  </Link>
                )}

                {/* Next Navigation */}
                {nextChapter ? (
                  <Link
                    href={previewPath(nextChapter.href, preview)}
                    className="btn-primary group w-full sm:w-auto justify-center gap-2 text-sm sm:text-base font-extrabold"
                  >
                    <span>Ch. {nextChapter.number}: {nextChapter.publicTitle}</span>
                    <ArrowRight size={18} className="text-[#F9EC88] transition-transform duration-200 group-hover:translate-x-1" />
                  </Link>
                ) : (
                  <Link
                    href={previewPath('/hub', preview)}
                    className="btn-primary group w-full sm:w-auto justify-center gap-2 text-sm sm:text-base font-extrabold"
                  >
                    <BookOpen size={16} className="text-[#F9EC88]" />
                    <span>Selesai Membaca</span>
                  </Link>
                )}
              </div>
            </footer>
          )}
        </div>
      </div>
    </main>
  );
}

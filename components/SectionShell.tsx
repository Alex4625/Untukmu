import PublicNav from './PublicNav';
import PreviewBanner from './PreviewBanner';
import ChapterTransitionPortal from './ChapterTransitionPortal';

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
  return (
    <main className="min-h-dvh pt-16 sm:pt-20 pb-36 sm:pb-32 px-2 sm:px-6">
      <PublicNav preview={preview} currentChapterNumber={chapterNumber} />
      {preview && (
        <div className="mx-auto max-w-4xl mb-4 px-1">
          <PreviewBanner />
        </div>
      )}

      {/* Main Central Stardew Valley Parchment Container */}
      <div className="mx-auto max-w-4xl">
        <div className="card p-3.5 sm:p-8 md:p-12 shadow-2xl">
          {/* Chapter Editorial Header with smooth entrance */}
          <header className="mb-6 text-center chapter-header-enter">
            {chapterNumber && (
              <p className="font-nunito text-xs sm:text-sm font-black uppercase tracking-widest text-[#B53000]">
                {eyebrow}
              </p>
            )}
            <h1 className="mt-1 font-nunito text-2xl sm:text-4xl md:text-5xl font-black text-[#663300] tracking-tight">
              {title}
            </h1>
            <div className="stardew-divider my-3.5 sm:my-4" />
            <p className="mx-auto max-w-xl font-nunito text-xs sm:text-base font-bold text-[#5A3E2D] leading-relaxed">
              {description}
            </p>
          </header>

          {/* Main Content Area */}
          <section className="my-4 sm:my-6">{children}</section>

          {/* Interactive Chapter Transition Gateway */}
          {chapterNumber && (
            <ChapterTransitionPortal
              currentChapterNumber={chapterNumber}
              preview={preview}
            />
          )}
        </div>
      </div>
    </main>
  );
}


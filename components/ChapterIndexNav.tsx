'use client';

import { Suspense, useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { CHAPTERS, ChapterInfo, getChapterByPath, getChapterTransitionDirection } from './chapters';
import { previewPath } from '@/lib/publicUrl';
import { useChapterTransition } from './StorybookTransition';
import { Compass, X } from 'lucide-react';

const JOURNEY_PATHS = new Set([
  '/hub',
  ...CHAPTERS.map((chapter) => chapter.href)
]);

function ChapterIndexNavInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isPreview = searchParams.get('preview') === 'unlocked';
  const currentChapter = getChapterByPath(pathname);
  const { transitionTo, isTransitioning } = useChapterTransition();
  const [mobileExpanded, setMobileExpanded] = useState(false);
  const [prevPath, setPrevPath] = useState(pathname);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const handleNavigate = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
    targetChapter?: ChapterInfo
  ) => {
    e.preventDefault();
    if (isTransitioning) return;
    setMobileExpanded(false);
    const direction = targetChapter
      ? getChapterTransitionDirection(currentChapter?.number, targetChapter.number)
      : 'hub';
    transitionTo(href, targetChapter, direction);
  };

  // Reset mobile expanded state when pathname changes (canonical React state adjustment pattern)
  if (prevPath !== pathname) {
    setPrevPath(pathname);
    setMobileExpanded(false);
  }

  const isJourney =
    pathname === '/hub' ||
    CHAPTERS.some((chapter) => pathname === chapter.href || pathname.startsWith(`${chapter.href}/`));

  // Close mobile popup when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setMobileExpanded(false);
      }
    }
    if (mobileExpanded) {
      document.addEventListener('pointerdown', handleClickOutside);
    }
    return () => document.removeEventListener('pointerdown', handleClickOutside);
  }, [mobileExpanded]);

  // Hide on admin routes or outside story journey (AFTER all hooks)
  if (pathname.startsWith('/admin') || pathname.startsWith('/api') || !isJourney) {
    return null;
  }

  return (
    <aside ref={containerRef} aria-label="Indeks chapter cerita" className="z-40">
      {/* DESKTOP / TABLET RAIL: Stardew Valley Wooden Navigation Rail */}
      <nav
        className="fixed right-3 top-1/2 hidden -translate-y-1/2 sm:flex sm:right-5"
        aria-label="Indeks cerita desktop"
      >
        <div className="flex flex-col items-center gap-1.5 rounded-2xl border-2 border-[#8C4E28] bg-[#FFF3CC]/95 p-1.5 shadow-[0_8px_24px_rgba(0,0,0,0.45)] backdrop-blur-md">
          {/* Hub / Intro link */}
          <Link
            href={previewPath('/hub', isPreview)}
            onClick={(e) => handleNavigate(e, previewPath('/hub', isPreview))}
            aria-label="Halaman pembuka (Hub)"
            aria-current={pathname === '/hub' ? 'page' : undefined}
            title="Pengantar Cerita"
            className={`flex h-8 w-8 items-center justify-center rounded-full font-nunito text-xs font-black transition duration-150 ${
              pathname === '/hub'
                ? 'bg-[#8C4E28] text-[#F9EC88] shadow-inner border border-[#4A2411]'
                : 'text-[#663300] hover:bg-[#FFE8A3]'
            }`}
          >
            In
          </Link>

          <div className="my-0.5 h-0.5 w-5 bg-[#8C4E28]/40" />

          {/* Chapters 01 to 07 */}
          {CHAPTERS.map((chapter) => {
            const isActive = currentChapter?.number === chapter.number;
            const isKnown = JOURNEY_PATHS.has(pathname);
            const targetUrl = previewPath(chapter.href, isPreview);

            return (
              <Link
                key={chapter.number}
                href={targetUrl}
                onClick={(e) => handleNavigate(e, targetUrl, chapter)}
                aria-label={`Chapter ${chapter.number}: ${chapter.publicTitle}`}
                aria-current={isActive ? 'page' : undefined}
                title={`${chapter.number}. ${chapter.publicTitle}`}
                className={`group relative flex h-8 w-8 items-center justify-center rounded-full font-nunito text-xs font-black leading-none transition duration-150 ${
                  isActive
                    ? 'bg-[#8C4E28] text-[#F9EC88] shadow-inner border border-[#4A2411] scale-105 chapter-badge-glow'
                    : isKnown
                      ? 'text-[#663300] hover:bg-[#FFE8A3]'
                      : 'text-[#8C4E28]/70 hover:bg-[#FFE8A3]'
                }`}
              >
                {chapter.number}

                {/* Desktop hover label tooltip */}
                <span className="pointer-events-none absolute right-full mr-3 hidden whitespace-nowrap rounded-lg border-2 border-[#8C4E28] bg-[#FFF3CC] px-3 py-1.5 text-xs font-extrabold text-[#663300] opacity-0 shadow-[0_4px_12px_rgba(0,0,0,0.3)] transition-opacity duration-150 group-hover:opacity-100 md:inline-block">
                  <span className="text-[#B53000] mr-1.5">{chapter.number}</span>
                  {chapter.publicTitle}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* MOBILE COMPACT TOGGLE: Unobtrusive, does not cover content by default (DESIGN.md section 16) */}
      <div className="fixed bottom-4 right-3 z-40 sm:hidden">
        {/* Expanded mobile navigation tray */}
        {mobileExpanded && (
          <div
            role="menu"
            aria-label="Pilih chapter"
            className="mb-2 flex flex-col items-center gap-1.5 rounded-2xl border-2 border-[#8C4E28] bg-[#FFF3CC] p-1.5 shadow-[0_8px_24px_rgba(0,0,0,0.5)] backdrop-blur-md animate-in fade-in slide-in-from-bottom-2 duration-150"
          >
            <Link
              href={previewPath('/hub', isPreview)}
              onClick={(e) => handleNavigate(e, previewPath('/hub', isPreview))}
              className={`flex h-8 w-8 items-center justify-center rounded-lg font-nunito text-xs font-black ${
                pathname === '/hub' ? 'bg-[#8C4E28] text-[#F9EC88] border border-[#4A2411] chapter-badge-glow' : 'text-[#663300] hover:bg-[#FFE8A3]'
              }`}
            >
              In
            </Link>

            {CHAPTERS.map((ch) => {
              const isActive = currentChapter?.number === ch.number;
              const targetUrl = previewPath(ch.href, isPreview);
              return (
                <Link
                  key={ch.number}
                  href={targetUrl}
                  onClick={(e) => handleNavigate(e, targetUrl, ch)}
                  className={`flex h-8 w-8 items-center justify-center rounded-lg font-nunito text-xs font-black ${
                    isActive ? 'bg-[#8C4E28] text-[#F9EC88] border border-[#4A2411] shadow-inner chapter-badge-glow' : 'text-[#663300] hover:bg-[#FFE8A3]'
                  }`}
                >
                  {ch.number}
                </Link>
              );
            })}
          </div>
        )}

        {/* Floating compact trigger pill */}
        <button
          type="button"
          onClick={() => setMobileExpanded(!mobileExpanded)}
          aria-expanded={mobileExpanded}
          aria-label={mobileExpanded ? 'Tutup navigasi chapter' : 'Buka navigasi chapter'}
          className="flex h-9 sm:h-10 items-center gap-1.5 rounded-xl border-2 border-[#4A2411] bg-gradient-to-b from-[#A05A2C] to-[#7A3C18] px-3 text-xs font-black text-[#FFF3CC] shadow-[0_4px_12px_rgba(0,0,0,0.4)] transition-transform active:scale-95"
        >
          {mobileExpanded ? (
            <X size={15} className="text-[#F9EC88]" />
          ) : (
            <Compass size={15} className="text-[#F9EC88]" />
          )}
          <span>
            {currentChapter ? (
              <span>
                <span className="text-[#F9EC88]">{currentChapter.number}</span>
                <span className="text-[#FFF3CC]/70">/07</span>
              </span>
            ) : (
              '01-07'
            )}
          </span>
        </button>
      </div>
    </aside>
  );
}

export default function ChapterIndexNav() {
  return (
    <Suspense fallback={null}>
      <ChapterIndexNavInner />
    </Suspense>
  );
}

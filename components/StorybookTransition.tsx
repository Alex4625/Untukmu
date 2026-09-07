'use client';

import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { CHAPTERS, ChapterInfo, getChapterByPath, getNextChapter, getPrevChapter, getChapterTransitionDirection } from './chapters';
import { Sparkles, BookOpen, ArrowRight, ArrowLeft } from 'lucide-react';
import { playPageFlipSound } from '@/lib/pageFlipAudio';
import { previewPath } from '@/lib/publicUrl';

export type TransitionDirection = 'forward' | 'backward' | 'hub' | 'shuffle';

interface TransitionState {
  targetHref: string;
  sourceChapter?: ChapterInfo;
  targetChapter?: ChapterInfo;
  direction: TransitionDirection;
  isShuffle: boolean;
}

interface ChapterTransitionContextType {
  transitionTo: (
    href: string,
    targetChapter?: ChapterInfo,
    direction?: TransitionDirection
  ) => void;
  isTransitioning: boolean;
  currentTransition: TransitionState | null;
}

const ChapterTransitionContext = createContext<ChapterTransitionContextType>({
  transitionTo: () => {},
  isTransitioning: false,
  currentTransition: null
});

export function useChapterTransition() {
  return useContext(ChapterTransitionContext);
}

export function StorybookTransitionProvider({
  children
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isPreview = searchParams.get('preview') === 'unlocked';

  const [transitionState, setTransitionState] = useState<TransitionState | null>(null);
  const activeTimersRef = useRef<NodeJS.Timeout[]>([]);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  const clearAllTimers = () => {
    activeTimersRef.current.forEach(clearTimeout);
    activeTimersRef.current = [];
  };

  useEffect(() => {
    return () => clearAllTimers();
  }, []);

  const transitionTo = useCallback(
    (
      href: string,
      targetChapter?: ChapterInfo,
      directionOverride?: TransitionDirection
    ) => {
      if (transitionState !== null || pathname === href) {
        return;
      }

      const sourceChapter = getChapterByPath(pathname);
      const resolvedTarget = targetChapter || getChapterByPath(href);

      let direction: TransitionDirection = directionOverride || 'forward';
      const isShuffle = directionOverride === 'shuffle' || (!sourceChapter && Boolean(resolvedTarget));

      if (!directionOverride) {
        if (!resolvedTarget) {
          direction = 'hub';
        } else if (isShuffle) {
          direction = 'shuffle';
        } else {
          direction = getChapterTransitionDirection(sourceChapter?.number, resolvedTarget.number);
        }
      }

      clearAllTimers();

      // Play authentic Web Audio paper rustle sound
      if (direction === 'shuffle') {
        playPageFlipSound('shuffle');
      } else if (direction === 'backward') {
        playPageFlipSound('backward');
      } else {
        playPageFlipSound('forward');
      }

      // Check reduced motion preference
      const prefersReducedMotion =
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      setTransitionState({
        targetHref: href,
        sourceChapter,
        targetChapter: resolvedTarget,
        direction,
        isShuffle
      });

      if (prefersReducedMotion) {
        const t = setTimeout(() => {
          router.push(href);
          window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
          setTransitionState(null);
        }, 120);
        activeTimersRef.current.push(t);
        return;
      }

      // Phase 2: Page reaches 90° / midpoint (around 400ms) - push route behind the turning leaf
      const t1 = setTimeout(() => {
        router.push(href);
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      }, 400);

      // Phase 3: Page completes 180° rotation & settles
      const t2 = setTimeout(() => {
        setTransitionState(null);
      }, 920);

      activeTimersRef.current.push(t1, t2);
    },
    [pathname, router, transitionState]
  );

  // Global Keyboard Navigation (Left / Right Arrows to flip chapters)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in form inputs
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)
      ) {
        return;
      }

      const currentChapter = getChapterByPath(pathname);
      if (!currentChapter || transitionState !== null) return;

      if (e.key === 'ArrowRight') {
        const next = getNextChapter(currentChapter.number);
        if (next) {
          e.preventDefault();
          transitionTo(previewPath(next.href, isPreview), next, 'forward');
        }
      } else if (e.key === 'ArrowLeft') {
        const prev = getPrevChapter(currentChapter.number);
        if (prev) {
          e.preventDefault();
          transitionTo(previewPath(prev.href, isPreview), prev, 'backward');
        } else {
          // Flip back to table of contents (hub)
          e.preventDefault();
          transitionTo(previewPath('/hub', isPreview), undefined, 'backward');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [pathname, isPreview, transitionState, transitionTo]);

  // Mobile Touch Swipe Gesture Detection (Swipe left for next page, swipe right for previous page)
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!touchStartRef.current || e.changedTouches.length === 0) return;
      const currentChapter = getChapterByPath(pathname);
      if (!currentChapter || transitionState !== null) {
        touchStartRef.current = null;
        return;
      }

      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;
      const deltaX = touchEndX - touchStartRef.current.x;
      const deltaY = touchEndY - touchStartRef.current.y;
      touchStartRef.current = null;

      // Ensure horizontal swipe is intentional: > 60px distance & more horizontal than vertical
      if (Math.abs(deltaX) > 65 && Math.abs(deltaX) > Math.abs(deltaY) * 1.6) {
        if (deltaX < 0) {
          // Swiped left -> flip forward
          const next = getNextChapter(currentChapter.number);
          if (next) {
            transitionTo(previewPath(next.href, isPreview), next, 'forward');
          }
        } else {
          // Swiped right -> flip backward
          const prev = getPrevChapter(currentChapter.number);
          if (prev) {
            transitionTo(previewPath(prev.href, isPreview), prev, 'backward');
          } else {
            transitionTo(previewPath('/hub', isPreview), undefined, 'backward');
          }
        }
      }
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [pathname, isPreview, transitionState, transitionTo]);

  return (
    <ChapterTransitionContext.Provider
      value={{
        transitionTo,
        isTransitioning: transitionState !== null,
        currentTransition: transitionState
      }}
    >
      {children}
      {transitionState && <BookPageFlipOverlay state={transitionState} />}
    </ChapterTransitionContext.Provider>
  );
}

/**
 * 3D Physical Book Page Turn Overlay
 * Renders an authentic paper spread with center spine, dynamic paper shadows,
 * and double-sided flipping parchment leaf.
 */
function BookPageFlipOverlay({ state }: { state: TransitionState }) {
  const { sourceChapter, targetChapter, direction, isShuffle } = state;

  return (
    <div
      role="status"
      aria-live="assertive"
      aria-label="Membalik lembaran buku cerita"
      className="fixed inset-0 z-[9999] flex items-center justify-center select-none pointer-events-auto overflow-hidden bg-[#1D100A]/70 backdrop-blur-md"
    >
      {/* 3D Book Stage Container */}
      <div className="book-stage relative w-full max-w-4xl h-[75vh] max-h-[640px] px-3 sm:px-6">
        {/* Book Hardcover Frame / Stardew Valley Wooden Book Binder */}
        <div className="relative w-full h-full rounded-2xl border-4 border-[#4A2411] bg-[#3B1E10] p-2.5 sm:p-4 shadow-[0_30px_90px_rgba(0,0,0,0.8),_inset_0_2px_10px_rgba(255,255,255,0.15)] flex">
          
          {/* Subtle Golden Book Edging Accent */}
          <div className="absolute inset-1.5 rounded-xl border border-[#D4A325]/40 pointer-events-none" />

          {/* Book Interior Spread (Left Page & Right Page) */}
          <div className="relative w-full h-full flex rounded-lg overflow-hidden border border-[#8C4E28] bg-[#FDF7E5] shadow-inner">

            {/* Left Page (Stationary) */}
            <div className="relative w-1/2 h-full bg-gradient-to-r from-[#F7ECD0] via-[#FFF9EA] to-[#FFFDF5] p-4 sm:p-8 flex flex-col justify-between border-r border-[#8C4E28]/30">
              {/* Header / Heraldry */}
              <div className="flex items-center justify-between border-b border-[#8C4E28]/20 pb-2">
                <span className="font-nunito text-[10px] sm:text-xs font-black uppercase tracking-wider text-[#8C4E28]">
                  {sourceChapter ? `Babak ${sourceChapter.number}` : 'Buku Catatan'}
                </span>
                <span className="font-nunito text-[10px] sm:text-xs font-bold text-[#A05A2C]">
                  Untuk Nona
                </span>
              </div>

              {/* Center Content for Left Page */}
              <div className="my-auto text-center space-y-3 px-2">
                <div className="mx-auto flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full border border-[#8C4E28] bg-[#FFE8A3] text-[#B53000] shadow-sm">
                  {targetChapter ? (
                    <span className="font-nunito text-xs sm:text-sm font-black">
                      {targetChapter.romanNumeral}
                    </span>
                  ) : (
                    <BookOpen size={18} />
                  )}
                </div>
                <p className="font-display text-base sm:text-2xl font-bold italic text-[#663300]">
                  {direction === 'backward' && targetChapter
                    ? targetChapter.publicTitle
                    : sourceChapter
                      ? sourceChapter.publicTitle
                      : 'Daftar Cerita'}
                </p>
                <div className="h-0.5 w-12 mx-auto bg-[#8C4E28]/30" />
                <p className="font-nunito text-xs sm:text-sm italic text-[#5A3E2D] line-clamp-3">
                  &ldquo;
                  {direction === 'backward' && targetChapter
                    ? targetChapter.prologueQuote
                    : sourceChapter
                      ? sourceChapter.prologueQuote
                      : 'Kumpulan jejak waktu dan harapan yang dirajut bersama.'}
                  &rdquo;
                </p>
              </div>

              {/* Page Number Footer */}
              <div className="text-left font-nunito text-[10px] sm:text-xs font-black text-[#8C4E28]/70 border-t border-[#8C4E28]/20 pt-2">
                {sourceChapter ? `Hal. ${sourceChapter.index * 2 - 1}` : 'Pengantar'}
              </div>
            </div>

            {/* Right Page (Stationary) */}
            <div className="relative w-1/2 h-full bg-gradient-to-l from-[#F7ECD0] via-[#FFF9EA] to-[#FFFDF5] p-4 sm:p-8 flex flex-col justify-between">
              {/* Header / Heraldry */}
              <div className="flex items-center justify-between border-b border-[#8C4E28]/20 pb-2">
                <span className="font-nunito text-[10px] sm:text-xs font-bold text-[#A05A2C]">
                  10 Desember 2026
                </span>
                <span className="font-nunito text-[10px] sm:text-xs font-black uppercase tracking-wider text-[#8C4E28]">
                  {targetChapter ? `Babak ${targetChapter.number}` : 'Daftar Isi'}
                </span>
              </div>

              {/* Center Content for Right Page */}
              <div className="my-auto text-center space-y-3 px-2">
                <div className="mx-auto flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full border border-[#8C4E28] bg-[#FFE8A3] text-[#B53000] shadow-sm">
                  <Sparkles size={18} className="text-[#D4A325]" />
                </div>
                <h3 className="font-display text-lg sm:text-3xl font-black italic text-[#663300] tracking-tight">
                  {targetChapter ? targetChapter.publicTitle : 'Daftar Cerita'}
                </h3>
                <div className="h-0.5 w-12 mx-auto bg-[#8C4E28]/30" />
                <p className="font-nunito text-xs sm:text-sm font-semibold italic text-[#5A3E2D] line-clamp-3">
                  &ldquo;
                  {targetChapter
                    ? targetChapter.prologueQuote
                    : 'Setiap lembaran menyimpan kenangan yang dirangkai pelan-pelan.'}
                  &rdquo;
                </p>
                {targetChapter && (
                  <p className="font-nunito text-[11px] sm:text-xs font-black uppercase tracking-widest text-[#B53000]">
                    Babak {targetChapter.index} dari {CHAPTERS.length}
                  </p>
                )}
              </div>

              {/* Page Number Footer */}
              <div className="text-right font-nunito text-[10px] sm:text-xs font-black text-[#8C4E28]/70 border-t border-[#8C4E28]/20 pt-2">
                {targetChapter ? `Hal. ${targetChapter.index * 2}` : 'Daftar'}
              </div>
            </div>

            {/* Central Book Spine & Binding Crease */}
            <div className="absolute left-1/2 top-0 bottom-0 w-3 -translate-x-1/2 z-30 pointer-events-none bg-gradient-to-r from-[#4A2411]/25 via-[#2C1810]/40 to-[#4A2411]/25 shadow-[0_0_10px_rgba(0,0,0,0.25)]" />

            {/* The Flipping 3D Paper Sheet (Turns across the center spine) */}
            {isShuffle ? (
              /* Rapid multi-page shuffle opening flourish */
              <div className="animate-page-shuffle absolute inset-0 z-40 flex items-center justify-center pointer-events-none p-4">
                <div className="relative w-3/4 max-w-md rounded-2xl border-4 border-[#8C4E28] bg-gradient-to-br from-[#FFFDF5] via-[#FFF9EA] to-[#FBE8BA] p-6 text-center shadow-[0_25px_60px_rgba(44,24,16,0.65)]">
                  <div className="flex items-center justify-center gap-2 mb-2 text-[#D4A325]">
                    <Sparkles size={20} />
                  </div>
                  <p className="font-nunito text-xs font-black uppercase tracking-widest text-[#B53000]">
                    Membuka Lembaran Buku
                  </p>
                  <h4 className="mt-1 font-display text-2xl sm:text-4xl font-black italic text-[#663300]">
                    {targetChapter ? targetChapter.publicTitle : 'Daftar Cerita'}
                  </h4>
                  <p className="mt-2 font-nunito text-xs font-bold text-[#8C4E28]">
                    {targetChapter
                      ? `Menuju Babak ${targetChapter.number} (Halaman ${targetChapter.index} dari ${CHAPTERS.length})`
                      : 'Membuka Daftar Cerita'}
                  </p>
                </div>
              </div>
            ) : (
              /* True 3D Page Curl & Turn Sheet */
              <div
                className={`absolute top-0 bottom-0 z-40 preserve-3d pointer-events-none ${
                  direction === 'backward'
                    ? 'left-0 w-1/2 animate-page-flip-backward'
                    : 'left-1/2 w-1/2 animate-page-flip-forward'
                }`}
              >
                {/* Front Side of Turning Page (0° to 90°) */}
                <div className="backface-hidden absolute inset-0 rounded-r-lg border border-[#8C4E28]/40 bg-gradient-to-br from-[#FFFDF5] via-[#FFF8E6] to-[#F5E6BF] p-4 sm:p-8 flex flex-col justify-between shadow-[0_15px_35px_rgba(44,24,16,0.4)]">
                  <div className="flex items-center justify-between border-b border-[#8C4E28]/20 pb-2">
                    <span className="font-nunito text-[10px] sm:text-xs font-black uppercase tracking-wider text-[#8C4E28]">
                      {sourceChapter ? `Babak ${sourceChapter.number}` : 'Untuk Nona'}
                    </span>
                    <span className="font-nunito text-[10px] sm:text-xs font-bold text-[#B53000]">
                      Membalik...
                    </span>
                  </div>

                  <div className="my-auto text-center space-y-2">
                    <p className="font-display text-base sm:text-xl font-bold italic text-[#663300]">
                      {sourceChapter ? sourceChapter.publicTitle : 'Cerita Kita'}
                    </p>
                    <div className="h-0.5 w-10 mx-auto bg-[#8C4E28]/30" />
                  </div>

                  <div className="text-right font-nunito text-[10px] sm:text-xs font-black text-[#8C4E28]/70 border-t border-[#8C4E28]/20 pt-2">
                    {sourceChapter ? `Hal. ${sourceChapter.index}` : '1'}
                  </div>
                </div>

                {/* Back Side of Turning Page (90° to 180°) */}
                <div
                  className="backface-hidden absolute inset-0 rounded-l-lg border border-[#8C4E28]/40 bg-gradient-to-bl from-[#FFFDF5] via-[#FFF8E6] to-[#F5E6BF] p-4 sm:p-8 flex flex-col justify-between shadow-[0_15px_35px_rgba(44,24,16,0.4)]"
                  style={{ transform: 'rotateY(180deg)' }}
                >
                  <div className="flex items-center justify-between border-b border-[#8C4E28]/20 pb-2">
                    <span className="font-nunito text-[10px] sm:text-xs font-bold text-[#B53000]">
                      Membuka...
                    </span>
                    <span className="font-nunito text-[10px] sm:text-xs font-black uppercase tracking-wider text-[#8C4E28]">
                      {targetChapter ? `Babak ${targetChapter.number}` : 'Daftar Cerita'}
                    </span>
                  </div>

                  <div className="my-auto text-center space-y-2">
                    <p className="font-display text-base sm:text-xl font-bold italic text-[#663300]">
                      {targetChapter ? targetChapter.publicTitle : 'Daftar Cerita'}
                    </p>
                    <div className="h-0.5 w-10 mx-auto bg-[#8C4E28]/30" />
                  </div>

                  <div className="text-left font-nunito text-[10px] sm:text-xs font-black text-[#8C4E28]/70 border-t border-[#8C4E28]/20 pt-2">
                    {targetChapter ? `Hal. ${targetChapter.index}` : 'Hal'}
                  </div>
                </div>
              </div>
            )}

            {/* Dynamic Shadow underneath turning sheet */}
            <div className="animate-page-shadow-under absolute inset-0 z-20 pointer-events-none bg-gradient-to-r from-transparent via-black/35 to-transparent" />
          </div>
        </div>

        {/* Ambient Reading Prompt below Book */}
        <div className="mt-3 text-center">
          <p className="font-nunito text-xs sm:text-sm font-bold text-[#F9EC88] drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
            Membalik ke {targetChapter ? `Babak ${targetChapter.number}: ${targetChapter.publicTitle}` : 'Daftar Cerita'}...
          </p>
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { CHAPTERS, ChapterInfo, getChapterByPath, getChapterTransitionDirection } from './chapters';
import { Sparkles, BookOpen } from 'lucide-react';

type TransitionDirection = 'forward' | 'backward' | 'hub';
type TransitionPhase = 'entering' | 'holding' | 'leaving';

interface TransitionState {
  targetHref: string;
  targetChapter?: ChapterInfo;
  direction: TransitionDirection;
  phase: TransitionPhase;
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
  const [transitionState, setTransitionState] = useState<TransitionState | null>(null);
  const activeTimerRef = useRef<NodeJS.Timeout[]>([]);

  // Clear timers on unmount
  useEffect(() => {
    return () => {
      activeTimerRef.current.forEach(clearTimeout);
    };
  }, []);

  const transitionTo = useCallback(
    (
      href: string,
      targetChapter?: ChapterInfo,
      directionOverride?: TransitionDirection
    ) => {
      // Don't trigger if already in transition or navigating to exact same path
      if (transitionState !== null || pathname === href) {
        return;
      }

      // Identify destination chapter if not passed
      const resolvedTarget = targetChapter || getChapterByPath(href);
      const currentChapter = getChapterByPath(pathname);

      // Determine direction: forward, backward, or hub
      let direction: TransitionDirection = directionOverride || 'forward';
      if (!directionOverride) {
        if (!resolvedTarget) {
          direction = 'hub';
        } else {
          direction = getChapterTransitionDirection(
            currentChapter?.number,
            resolvedTarget.number
          );
        }
      }

      // Check for reduced motion preference
      const prefersReducedMotion =
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      // Clear any pending timers
      activeTimerRef.current.forEach(clearTimeout);
      activeTimerRef.current = [];

      // Phase 1: Begin page turn / lift
      setTransitionState({
        targetHref: href,
        targetChapter: resolvedTarget,
        direction,
        phase: 'entering'
      });

      if (prefersReducedMotion) {
        // Fast instant route for users who prefer reduced motion
        const t1 = setTimeout(() => {
          router.push(href);
          window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
          setTransitionState(null);
        }, 150);
        activeTimerRef.current.push(t1);
        return;
      }

      // Phase 2: Page completely covers screen, execute route push in background
      const t1 = setTimeout(() => {
        setTransitionState((prev) => (prev ? { ...prev, phase: 'holding' } : null));
        router.push(href);
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      }, 340);

      // Phase 3: Page unfurls/turns away, unveiling new chapter
      const t2 = setTimeout(() => {
        setTransitionState((prev) => (prev ? { ...prev, phase: 'leaving' } : null));
      }, 720);

      // Phase 4: Complete transition & remove overlay
      const t3 = setTimeout(() => {
        setTransitionState(null);
      }, 1050);

      activeTimerRef.current.push(t1, t2, t3);
    },
    [pathname, router, transitionState]
  );

  return (
    <ChapterTransitionContext.Provider
      value={{
        transitionTo,
        isTransitioning: transitionState !== null,
        currentTransition: transitionState
      }}
    >
      {children}
      {transitionState && <StorybookTransitionOverlay state={transitionState} />}
    </ChapterTransitionContext.Provider>
  );
}

function StorybookTransitionOverlay({ state }: { state: TransitionState }) {
  const { targetChapter, direction, phase } = state;

  return (
    <div
      role="status"
      aria-live="assertive"
      className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-auto select-none overflow-hidden"
      style={{ perspective: '1600px' }}
    >
      {/* Background Dimming Backdrop */}
      <div
        className={`absolute inset-0 bg-[#2C1810]/40 transition-opacity duration-300 ${
          phase === 'leaving' ? 'opacity-0' : 'opacity-100'
        }`}
      />

      {/* The 3D Storybook Turning Parchment Leaf */}
      <div
        className={`relative w-full h-full flex items-center justify-center p-4 sm:p-8 transition-all duration-400 ease-out ${
          direction === 'forward'
            ? phase === 'entering'
              ? 'animate-storybook-enter-forward'
              : phase === 'leaving'
                ? 'animate-storybook-leave-forward'
                : 'translate-x-0 opacity-100 rotate-0'
            : direction === 'backward'
              ? phase === 'entering'
                ? 'animate-storybook-enter-backward'
                : phase === 'leaving'
                  ? 'animate-storybook-leave-backward'
                  : 'translate-x-0 opacity-100 rotate-0'
              : phase === 'entering'
                ? 'animate-storybook-fade-in'
                : phase === 'leaving'
                  ? 'animate-storybook-fade-out'
                  : 'opacity-100'
        }`}
      >
        {/* Parchment Page Surface with Warm Handcrafted Texture & Border */}
        <div
          className="relative w-full max-w-xl rounded-3xl border-4 border-[#8C4E28] bg-gradient-to-br from-[#FFFDF4] via-[#FFF9EA] to-[#FBE8BA] p-6 sm:p-10 text-center shadow-[0_25px_60px_-15px_rgba(44,24,16,0.6)]"
          style={{
            boxShadow:
              direction === 'forward'
                ? '-18px 0 45px -10px rgba(74,36,17,0.45), 0 25px 50px -12px rgba(44,24,16,0.5)'
                : '18px 0 45px -10px rgba(74,36,17,0.45), 0 25px 50px -12px rgba(44,24,16,0.5)'
          }}
        >
          {/* Subtle Vintage Page Spine & Paper Lines Accent */}
          <div
            className={`absolute top-0 bottom-0 w-4 pointer-events-none opacity-25 ${
              direction === 'forward'
                ? 'right-0 bg-gradient-to-l from-[#8C4E28] to-transparent rounded-r-2xl'
                : 'left-0 bg-gradient-to-r from-[#8C4E28] to-transparent rounded-l-2xl'
            }`}
          />

          {/* Inner Golden Border Inset */}
          <div className="rounded-2xl border-2 border-[#D4A325]/50 bg-[#FFFDF4]/80 p-5 sm:p-8 backdrop-blur-sm">
            {targetChapter ? (
              <div className="space-y-4 animate-storybook-content-bloom">
                {/* Chapter Heraldry & Roman Numeral */}
                <div className="flex items-center justify-center gap-2">
                  <span className="h-px w-8 sm:w-12 bg-gradient-to-r from-transparent to-[#D4A325]" />
                  <span className="font-display text-xs sm:text-sm font-bold tracking-[0.25em] uppercase text-[#8C4E28]">
                    Babak {targetChapter.romanNumeral}
                  </span>
                  <span className="h-px w-8 sm:w-12 bg-gradient-to-l from-transparent to-[#D4A325]" />
                </div>

                {/* Chapter Title */}
                <h2 className="font-display text-3xl sm:text-5xl font-semibold italic text-[#3D1E0B] tracking-tight">
                  {targetChapter.publicTitle}
                </h2>

                {/* Delicate Botanical / Flourish Ornament */}
                <div className="flex items-center justify-center gap-3 py-1 text-[#D4A325]">
                  <span className="h-px w-10 sm:w-16 bg-[#D4A325]/40" />
                  <Sparkles size={16} className="text-[#D4A325]" />
                  <span className="h-px w-10 sm:w-16 bg-[#D4A325]/40" />
                </div>

                {/* Heartfelt Poetic Prologue Quote */}
                <blockquote className="mx-auto max-w-md font-display text-base sm:text-xl font-normal italic text-[#5C3317] leading-relaxed px-2">
                  &ldquo;{targetChapter.prologueQuote}&rdquo;
                </blockquote>

                {/* Storybook 7-Lantern Milestone Progress Bar */}
                <div className="pt-3">
                  <div className="flex items-center justify-center gap-2 sm:gap-3">
                    {CHAPTERS.map((ch) => {
                      const isTarget = ch.number === targetChapter.number;
                      const isPast = ch.index < targetChapter.index;

                      return (
                        <div
                          key={ch.number}
                          className="flex flex-col items-center gap-1"
                        >
                          <div
                            className={`h-2.5 rounded-full transition-all duration-300 ${
                              isTarget
                                ? 'w-6 sm:w-7 bg-gradient-to-r from-[#B53000] to-[#D4A325] shadow-sm ring-2 ring-[#8C4E28]'
                                : isPast
                                  ? 'w-2.5 bg-[#4E7C38]'
                                  : 'w-2.5 bg-[#8C4E28]/25'
                            }`}
                          />
                        </div>
                      );
                    })}
                  </div>
                  <p className="mt-2 font-nunito text-[11px] sm:text-xs font-bold text-[#8C4E28]/80">
                    Membuka Halaman {targetChapter.index} dari {CHAPTERS.length}
                  </p>
                </div>
              </div>
            ) : (
              /* Interlude when navigating back to Hub / Story Index */
              <div className="space-y-4 animate-storybook-content-bloom">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#8C4E28] text-[#F9EC88] shadow-sm">
                  <BookOpen size={22} />
                </div>
                <h2 className="font-display text-2xl sm:text-4xl font-semibold italic text-[#3D1E0B]">
                  Daftar Isi Cerita
                </h2>
                <p className="font-display text-sm sm:text-base italic text-[#5C3317]">
                  &ldquo;Setiap babak menyimpan sepotong waktu yang berharga.&rdquo;
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { getChapterByPath } from './chapters';
import { Sparkles } from 'lucide-react';

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const currentChapter = getChapterByPath(pathname);

  useEffect(() => {
    // Instant scroll to top on page transition for seamless navigation
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  return (
    <>
      {/* Top Gold Shimmer Progress Indicator across page transitions */}
      <div key={`progress-${pathname}`} className="route-transition-bar" aria-hidden="true" />

      {/* Floating Ambient Chapter Transition Toast */}
      {currentChapter && (
        <aside
          key={`toast-${pathname}`}
          aria-live="polite"
          className="pointer-events-none fixed top-16 right-3 z-40 animate-chapter-toast sm:top-18 sm:right-6"
        >
          <div className="flex items-center gap-2 rounded-full border-2 border-[#8C4E28] bg-[#FFF3CC]/95 px-3 py-1 sm:px-4 sm:py-1.5 shadow-[0_6px_20px_rgba(0,0,0,0.35)] backdrop-blur-md">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#8C4E28] text-[#F9EC88] text-[10px] font-black">
              {currentChapter.number}
            </span>
            <span className="font-nunito text-[11px] sm:text-xs font-black text-[#663300]">
              {currentChapter.publicTitle}
            </span>
            <Sparkles size={11} className="text-[#D4A325]" />
          </div>
        </aside>
      )}

      {/* Animated Page Container — no key prop; template.tsx already
          re-instantiates on navigation. Adding key here would force
          React to destroy server-component subtrees that can't be
          re-created client-side, breaking client navigation. */}
      <div className="stardew-page-enter min-h-dvh">
        {children}
      </div>
    </>
  );
}

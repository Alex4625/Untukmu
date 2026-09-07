'use client';

import React, { useState, useRef, useCallback, useMemo } from 'react';
import type { PublicContent } from '@/lib/types';
import { buildSpreads } from './BookSpreads';
import { CHAPTERS } from '@/components/chapters';
import { playPageFlipSound } from '@/lib/pageFlipAudio';
import { ChevronLeft, ChevronRight, Bookmark, BookOpen } from 'lucide-react';
import { celebrateLove } from '@/components/ConfettiButton';

export default function MobilePocketBook({
  content,
  initialSpread = 0,
  onChapterChange
}: {
  content: PublicContent;
  initialSpread?: number;
  onChapterChange?: (chapterNumber?: string) => void;
}) {
  const [pageIndex, setPageIndex] = useState(initialSpread * 2);
  const [showChapterMenu, setShowChapterMenu] = useState(false);
  const [quizScores, setQuizScores] = useState<Record<string, string>>({});
  const touchStartX = useRef<number | null>(null);

  const spreads = useMemo(() => buildSpreads(content), [content]);

  // Flatten spreads into individual single page metadata for mobile
  const pageMeta = useMemo(() => {
    return spreads.flatMap((spread, spreadIdx) => [
      {
        id: `${spread.id}-left`,
        chapterNumber: spread.chapterNumber,
        title: spread.title,
        pageNumber: spreadIdx * 2 + 1,
        spreadIdx,
        isLeft: true
      },
      {
        id: `${spread.id}-right`,
        chapterNumber: spread.chapterNumber,
        title: spread.title,
        pageNumber: spreadIdx * 2 + 2,
        spreadIdx,
        isLeft: false
      }
    ]);
  }, [spreads]);

  const totalPages = pageMeta.length;

  const jumpToPage = useCallback(
    (index: number) => {
      const validIdx = Math.max(0, Math.min(pageMeta.length - 1, index));
      setPageIndex(validIdx);
      playPageFlipSound('forward');
      setShowChapterMenu(false);
      onChapterChange?.(pageMeta[validIdx]?.chapterNumber);
    },
    [pageMeta, onChapterChange]
  );

  const jumpToChapter = useCallback(
    (chapterNumber: string) => {
      const targetIdx = pageMeta.findIndex((p) => p.chapterNumber === chapterNumber);
      if (targetIdx !== -1) {
        jumpToPage(targetIdx);
      }
    },
    [pageMeta, jumpToPage]
  );

  const jumpToSpread = useCallback(
    (spreadIdx: number) => {
      jumpToPage(spreadIdx * 2);
    },
    [jumpToPage]
  );

  const nextPage = () => {
    if (pageIndex < totalPages - 1) {
      jumpToPage(pageIndex + 1);
    }
  };

  const prevPage = () => {
    if (pageIndex > 0) {
      jumpToPage(pageIndex - 1);
    }
  };

  const currentPageMeta = pageMeta[pageIndex] || pageMeta[0];
  const currentSpread = spreads[currentPageMeta.spreadIdx] || spreads[0];

  const spreadRenderProps = useMemo(
    () => ({
      content,
      onJumpToChapter: jumpToChapter,
      onJumpToSpread: jumpToSpread,
      triggerPetals: celebrateLove,
      quizScores,
      onAnswerQuiz: (qId: string, ans: 'A' | 'B' | 'C' | 'D') =>
        setQuizScores((p) => ({ ...p, [qId]: ans }))
    }),
    [content, jumpToChapter, jumpToSpread, quizScores]
  );

  const renderedPageContent = currentPageMeta.isLeft
    ? currentSpread.renderLeft(spreadRenderProps)
    : currentSpread.renderRight(spreadRenderProps);

  // Touch Swipe Handlers for smooth thumb slide
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 45) {
      // Swiped Left -> Go Next Page
      nextPage();
    } else if (diff < -45) {
      // Swiped Right -> Go Prev Page
      prevPage();
    }
    touchStartX.current = null;
  };

  return (
    <div className="w-full flex flex-col items-center px-1">
      {/* Quick Chapter Selector Modal */}
      {showChapterMenu && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setShowChapterMenu(false)}
        >
          <div
            className="card w-full max-w-sm p-5 bg-[#FDF8EE] border-2 border-[#8C4E28] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-3 border-b border-[#8C4E28]/20 pb-2">
              <div className="flex items-center gap-1.5 text-[#663300]">
                <Bookmark size={16} className="text-[#B53000]" />
                <h3 className="font-display text-lg font-bold">Daftar Bab</h3>
              </div>
              <button
                onClick={() => setShowChapterMenu(false)}
                className="text-xs font-bold text-[#8C4E28]"
              >
                Tutup ✕
              </button>
            </div>

            <div className="space-y-1 max-h-72 overflow-y-auto pr-1">
              <button
                onClick={() => jumpToPage(0)}
                className="w-full text-left p-2 rounded text-xs font-bold text-[#663300] hover:bg-[#8C4E28]/10"
              >
                📖 Pengantar Cerita
              </button>
              {CHAPTERS.map((ch) => (
                <button
                  key={ch.number}
                  onClick={() => jumpToChapter(ch.number)}
                  className="w-full text-left p-2 rounded text-xs font-bold text-[#663300] hover:bg-[#8C4E28]/10 flex items-center justify-between"
                >
                  <span>Bab {ch.romanNumeral} · {ch.publicTitle}</span>
                  <span className="text-[10px] text-[#8C4E28]">{ch.number}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Pocketbook Frame with Leather Border */}
      <div
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="antique-book-leather relative w-full max-w-md rounded-xl p-2.5 sm:p-3 shadow-2xl transition-all duration-200"
      >
        {/* Leather Stitching Border */}
        <div className="leather-stitch-border absolute inset-1.5 pointer-events-none" />

        {/* Single Page Parchment Container */}
        <div className="antique-parchment-paper relative min-h-[500px] sm:min-h-[540px] w-full rounded-lg p-4 sm:p-6 flex flex-col justify-between overflow-hidden shadow-inner select-none">
          {/* Page Content */}
          <div className="relative z-10 w-full h-full">
            {renderedPageContent}
          </div>
        </div>
      </div>

      {/* Pocketbook Bottom Thumb Navigation */}
      <div className="mt-4 flex w-full max-w-md items-center justify-between px-2 text-xs font-bold text-[#FBF6EB]">
        <button
          onClick={prevPage}
          disabled={pageIndex === 0}
          className="flex items-center gap-1 rounded-full border border-[#D4A325]/40 bg-[#2C1408]/90 px-3 py-1.5 disabled:opacity-20 active:scale-95 transition-all shadow-md"
        >
          <ChevronLeft size={16} />
          <span>Kembali</span>
        </button>

        {/* Chapter & Page Badge */}
        <button
          onClick={() => setShowChapterMenu(true)}
          className="flex items-center gap-1.5 rounded-full border border-[#8C4E28]/60 bg-[#241006]/90 px-3 py-1.5 text-[11px] text-[#F9EC88] shadow-sm hover:border-[#D4A325]"
        >
          <BookOpen size={12} />
          <span>Hal. {currentPageMeta?.pageNumber || pageIndex + 1} / {totalPages}</span>
        </button>

        <button
          onClick={nextPage}
          disabled={pageIndex === totalPages - 1}
          className="flex items-center gap-1 rounded-full border border-[#D4A325]/40 bg-[#2C1408]/90 px-3 py-1.5 disabled:opacity-20 active:scale-95 transition-all shadow-md"
        >
          <span>Lanjut</span>
          <ChevronRight size={16} />
        </button>
      </div>

      <p className="mt-2 text-[10px] text-[#D9C4A5]/70 text-center font-medium">
        Geser layar ke kiri atau kanan untuk membalik halaman
      </p>
    </div>
  );
}

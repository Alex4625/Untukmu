'use client';

import React, { useState } from 'react';
import type { PublicContent } from '@/lib/types';
import DeskSurface from './DeskSurface';
import AntiqueBook from './AntiqueBook';
import MobilePocketBook from './MobilePocketBook';
import PreviewBanner from '@/components/PreviewBanner';
import { buildSpreads } from './BookSpreads';

const emptySubscribe = () => () => {};

function useIsMounted() {
  return React.useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

function useIsMobile() {
  return React.useSyncExternalStore(
    (callback) => {
      window.addEventListener('resize', callback);
      return () => window.removeEventListener('resize', callback);
    },
    () => window.innerWidth < 768,
    () => false
  );
}

export default function UnifiedBookExperience({
  content,
  targetChapterNumber,
  isInitiallyOpen = false
}: {
  content: PublicContent;
  targetChapterNumber?: string;
  isInitiallyOpen?: boolean;
}) {
  const isMobile = useIsMobile();
  const mounted = useIsMounted();
  const [activeChapter, setActiveChapter] = useState<string | undefined>(targetChapterNumber);
  const [showPetals, setShowPetals] = useState(targetChapterNumber === '07');

  // Detect initial target spread index if targetChapterNumber is provided
  const spreads = React.useMemo(() => buildSpreads(content), [content]);
  let initialSpread = 0;
  if (targetChapterNumber) {
    const foundIdx = spreads.findIndex((s) => s.chapterNumber === targetChapterNumber);
    if (foundIdx !== -1) {
      initialSpread = foundIdx;
    }
  }

  const handleChapterChange = (chapterNumber?: string) => {
    setActiveChapter(chapterNumber);
    if (chapterNumber === '07') {
      setShowPetals(true);
    }
  };

  if (!mounted) {
    return (
      <div className="antique-desk-surface min-h-screen w-full flex items-center justify-center text-[#FBF6EB]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#D4A325] border-t-transparent" />
          <p className="font-display text-base italic text-[#E8D4B4]">Mempersiapkan buku kenangan...</p>
        </div>
      </div>
    );
  }

  return (
    <DeskSurface
      polaroids={content.desk_polaroids}
      showPetals={showPetals || activeChapter === '07'}
    >
      {content.preview && (
        <div className="mx-auto max-w-2xl mb-4 px-2 w-full">
          <PreviewBanner />
        </div>
      )}

      {/* Responsive View Switch: Desktop 3D Spread vs Mobile Pocketbook */}
      {isMobile ? (
        <MobilePocketBook
          content={content}
          initialSpread={initialSpread}
          onChapterChange={handleChapterChange}
        />
      ) : (
        <AntiqueBook
          content={content}
          initialSpread={initialSpread}
          isInitiallyOpen={Boolean(targetChapterNumber) || isInitiallyOpen}
          onChapterChange={handleChapterChange}
        />
      )}
    </DeskSurface>
  );
}

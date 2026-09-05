'use client';

import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { CHAPTERS, ChapterInfo } from './chapters';
import { previewPath } from '@/lib/publicUrl';
import { useChapterTransition } from './StorybookTransition';

export default function HubChapterCards({
  firstChapterHref,
  preview = false
}: {
  firstChapterHref: string;
  preview?: boolean;
}) {
  const { transitionTo, isTransitioning } = useChapterTransition();

  const handleNavigate = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
    targetChapter?: ChapterInfo
  ) => {
    e.preventDefault();
    if (isTransitioning) return;
    transitionTo(href, targetChapter, 'forward');
  };

  return (
    <>
      {/* Primary CTA leading to Chapter 01 */}
      <div className="mt-6 sm:mt-8 flex justify-center">
        <Link
          href={firstChapterHref}
          onClick={(e) => handleNavigate(e, firstChapterHref, CHAPTERS[0])}
          className="btn-primary group w-full sm:w-auto gap-2 px-6 py-3 sm:px-8 sm:py-3.5 text-sm sm:text-base font-extrabold"
        >
          <span>Mulai Membaca</span>
          <span className="text-[#F9EC88]">01. Sebuah Awal</span>
          <ArrowRight
            size={18}
            className="text-[#F9EC88] transition-transform duration-200 group-hover:translate-x-1"
          />
        </Link>
      </div>

      {/* Chapter Table of Contents Cards */}
      <div className="grid gap-3 sm:grid-cols-2 mt-6">
        {CHAPTERS.map((ch) => {
          const targetUrl = previewPath(ch.href, preview);
          return (
            <Link
              key={ch.number}
              href={targetUrl}
              onClick={(e) => handleNavigate(e, targetUrl, ch)}
              className="card-inner group flex items-start gap-3 p-3.5 sm:p-5 transition hover:brightness-105 active:scale-[0.99]"
            >
              <div className="flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-lg border-2 border-[#4A2411] bg-gradient-to-b from-[#A05A2C] to-[#7A3C18] font-nunito text-base sm:text-lg font-black text-[#F9EC88] shadow-md transition group-hover:scale-105">
                {ch.number}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-nunito text-base sm:text-xl font-black text-[#663300] leading-tight group-hover:text-[#B53000]">
                    {ch.publicTitle}
                  </h3>
                  {ch.number === '07' && (
                    <Sparkles size={15} className="text-[#D4A325] shrink-0" />
                  )}
                </div>
                <p className="mt-1 font-nunito text-xs font-bold text-[#5A3E2D] leading-relaxed line-clamp-2">
                  {ch.description}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
}

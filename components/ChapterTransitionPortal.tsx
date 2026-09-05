'use client';

import Link from 'next/link';
import { ArrowLeft, ArrowRight, BookOpen, Sparkles, Heart, CheckCircle2 } from 'lucide-react';
import { CHAPTERS, getNextChapter, getPrevChapter } from './chapters';
import { previewPath } from '@/lib/publicUrl';

export default function ChapterTransitionPortal({
  currentChapterNumber,
  preview = false
}: {
  currentChapterNumber: string;
  preview?: boolean;
}) {
  const nextChapter = getNextChapter(currentChapterNumber);
  const prevChapter = getPrevChapter(currentChapterNumber);
  const currentChapterIndex = CHAPTERS.findIndex((ch) => ch.number === currentChapterNumber);
  const currentChapter = CHAPTERS[currentChapterIndex];

  return (
    <nav
      aria-label="Transisi babak cerita"
      className="mt-10 pt-6 border-t-2 border-[#8C4E28]/25"
    >
      {/* Chapter Journey Progress Milestone Bar */}
      <div className="mb-6 rounded-xl border border-[#8C4E28]/30 bg-[#FFE8A3]/60 p-3 sm:p-4 text-center">
        <div className="flex items-center justify-between gap-2 mb-2 text-xs font-black uppercase tracking-wider text-[#B53000]">
          <span className="flex items-center gap-1.5">
            <Heart size={13} className="fill-[#B53000] text-[#B53000]" />
            <span>Perjalanan Cerita</span>
          </span>
          <span className="text-[#663300]">
            Babak {currentChapter ? currentChapter.index : 1} dari {CHAPTERS.length}
          </span>
        </div>

        {/* 7-Chapter Interactive Progress Stepper */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2">
          {CHAPTERS.map((ch, idx) => {
            const isCompleted = idx < currentChapterIndex;
            const isCurrent = idx === currentChapterIndex;

            return (
              <Link
                key={ch.number}
                href={previewPath(ch.href, preview)}
                title={`Babak ${ch.number}: ${ch.publicTitle}`}
                className={`group relative flex flex-col items-center py-1 rounded transition-all duration-150 ${
                  isCurrent
                    ? 'scale-105'
                    : 'hover:opacity-100 opacity-85'
                }`}
              >
                <div
                  className={`h-2 sm:h-2.5 w-full rounded-full transition-all duration-200 ${
                    isCurrent
                      ? 'bg-gradient-to-r from-[#B53000] to-[#D4A325] shadow-sm ring-2 ring-[#8C4E28]/50'
                      : isCompleted
                        ? 'bg-[#4E7C38]'
                        : 'bg-[#8C4E28]/20'
                  }`}
                />
                <span
                  className={`mt-1 font-nunito text-[10px] sm:text-xs font-black transition-colors ${
                    isCurrent
                      ? 'text-[#B53000]'
                      : isCompleted
                        ? 'text-[#4E7C38]'
                        : 'text-[#8C4E28]/70'
                  }`}
                >
                  {ch.number}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Main Interactive Transition Gate */}
      {nextChapter ? (
        <div className="space-y-4">
          {/* Large Interactive Gateway Card to Next Chapter */}
          <Link
            href={previewPath(nextChapter.href, preview)}
            className="group relative block overflow-hidden rounded-2xl border-2 border-[#8C4E28] bg-gradient-to-br from-[#FFFDF4] via-[#FFF3CC] to-[#FFE8A3] p-5 sm:p-7 text-left shadow-[0_6px_20px_rgba(0,0,0,0.15)] transition-all duration-200 hover:-translate-y-1 hover:border-[#4A2411] hover:shadow-[0_12px_28px_rgba(0,0,0,0.25)] active:scale-[0.99]"
          >
            {/* Ambient gold glow highlight on hover */}
            <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-gradient-to-br from-[#F9EC88]/50 to-transparent blur-2xl transition-all duration-300 group-hover:scale-125" />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full border border-[#8C4E28] bg-[#8C4E28] px-2.5 py-0.5 font-nunito text-[11px] font-black uppercase text-[#F9EC88]">
                    <Sparkles size={11} className="text-[#F9EC88]" />
                    <span>Lanjut ke Babak {nextChapter.number}</span>
                  </span>
                  <span className="font-nunito text-xs font-bold text-[#8C4E28]">
                    Babak Selanjutnya
                  </span>
                </div>

                <h3 className="font-nunito text-2xl sm:text-3xl font-black text-[#663300] transition-colors group-hover:text-[#B53000]">
                  {nextChapter.publicTitle}
                </h3>

                <p className="font-nunito text-xs sm:text-sm font-bold text-[#5A3E2D] leading-relaxed line-clamp-2 max-w-xl">
                  {nextChapter.description}
                </p>
              </div>

              {/* Interactive Forward Button Arrow */}
              <div className="shrink-0 flex items-center justify-end sm:justify-center">
                <span className="inline-flex items-center gap-2 rounded-xl border-2 border-[#4A2411] bg-gradient-to-b from-[#A05A2C] to-[#7A3C18] px-4 py-2.5 sm:px-5 sm:py-3 font-nunito text-sm sm:text-base font-black text-[#FFF3CC] shadow-md transition-transform duration-200 group-hover:scale-105 group-hover:brightness-110">
                  <span>Buka Babak</span>
                  <ArrowRight size={18} className="text-[#F9EC88] transition-transform duration-200 group-hover:translate-x-1.5" />
                </span>
              </div>
            </div>
          </Link>

          {/* Secondary Previous Navigation */}
          <div className="flex items-center justify-between pt-1">
            {prevChapter ? (
              <Link
                href={previewPath(prevChapter.href, preview)}
                className="btn-secondary group gap-2 text-xs sm:text-sm font-black text-[#663300]"
              >
                <ArrowLeft size={16} className="text-[#8C4E28] transition-transform duration-200 group-hover:-translate-x-1" />
                <span>Babak {prevChapter.number}: {prevChapter.publicTitle}</span>
              </Link>
            ) : (
              <Link
                href={previewPath('/hub', preview)}
                className="btn-secondary group gap-2 text-xs sm:text-sm font-black text-[#663300]"
              >
                <BookOpen size={15} className="text-[#8C4E28]" />
                <span>Daftar Cerita</span>
              </Link>
            )}

            <Link
              href={previewPath('/hub', preview)}
              className="text-xs font-black text-[#8C4E28] hover:text-[#B53000] underline underline-offset-4"
            >
              Lihat Semua Babak
            </Link>
          </div>
        </div>
      ) : (
        /* Finale Completion Gate (End of 7 Chapters) */
        <div className="rounded-2xl border-2 border-[#4E7C38] bg-[#EAF2DE] p-6 sm:p-8 text-center shadow-md">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#4E7C38] text-white shadow-sm">
            <CheckCircle2 size={24} />
          </div>
          <h3 className="font-nunito text-xl sm:text-2xl font-black text-[#2D5A1E]">
            Kamu Telah Menyelesaikan Seluruh 7 Babak
          </h3>
          <p className="mx-auto mt-2 max-w-md font-nunito text-xs sm:text-sm font-bold text-[#3E662A] leading-relaxed">
            Terima kasih telah membaca setiap lembaran cerita kecil ini dengan hangat.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              href={previewPath('/hub', preview)}
              className="btn-primary gap-2 text-xs sm:text-sm font-extrabold"
            >
              <BookOpen size={16} className="text-[#F9EC88]" />
              <span>Halaman Pengantar & Daftar Isi</span>
            </Link>
            <Link
              href={previewPath('/timeline', preview)}
              className="btn-secondary gap-2 text-xs sm:text-sm font-extrabold"
            >
              <ArrowLeft size={16} />
              <span>Ulangi dari Babak 01</span>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}

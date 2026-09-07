'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import type { PublicContent } from '@/lib/types';
import { buildSpreads, type SpreadData } from './BookSpreads';
import { CHAPTERS } from '@/components/chapters';
import { playPageFlipSound, playBookOpenSound, playBookCloseSound } from '@/lib/pageFlipAudio';
import { ChevronLeft, ChevronRight, Bookmark, Heart, Lock, BookOpen } from 'lucide-react';
import Countdown from '@/components/Countdown';
import { celebrateLove } from '@/components/ConfettiButton';

// Reusable Symmetrical Victorian Gilded Corner Fleuron SVG
function GildedCorner({ className = '' }: { className?: string }) {
  return (
    <svg
      width="44"
      height="44"
      viewBox="0 0 44 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`pointer-events-none drop-shadow-sm ${className}`}
    >
      <path
        d="M3 3H36C36 3 24 6 18 18C12 30 3 36 3 36V3Z"
        fill="url(#goldGradShimmer)"
        opacity="0.18"
      />
      <path
        d="M4 4H34C26 8 18 16 16 34H4V4Z"
        stroke="url(#goldGradShimmer)"
        strokeWidth="1.2"
      />
      <path
        d="M4 4V34M4 4H34"
        stroke="url(#goldGradShimmer)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <circle cx="9" cy="9" r="2.5" fill="url(#goldGradShimmer)" />
      <circle cx="16" cy="6" r="1.5" fill="url(#goldGradShimmer)" />
      <circle cx="6" cy="16" r="1.5" fill="url(#goldGradShimmer)" />
      <path
        d="M16 16C16 12 12 8 8 8"
        stroke="url(#goldGradShimmer)"
        strokeWidth="1"
      />
    </svg>
  );
}

export default function AntiqueBook({
  content,
  initialSpread = 0,
  isInitiallyOpen = false,
  onChapterChange,
  triggerPetals
}: {
  content: PublicContent;
  initialSpread?: number;
  isInitiallyOpen?: boolean;
  onChapterChange?: (chapterNumber?: string) => void;
  triggerPetals?: () => void;
}) {
  // Book states: 'closed' | 'opening' | 'open' | 'closing'
  const [bookState, setBookState] = useState<'closed' | 'opening' | 'open' | 'closing'>(
    isInitiallyOpen ? 'open' : 'closed'
  );

  const [currentSpreadIndex, setCurrentSpreadIndex] = useState(initialSpread);
  const [turningDirection, setTurningDirection] = useState<'forward' | 'backward' | null>(null);
  const [showRibbonMenu, setShowRibbonMenu] = useState(false);
  const [quizScores, setQuizScores] = useState<Record<string, string>>({});
  const isTurningRef = useRef(false);

  const spreads = buildSpreads(content);
  const totalSpreads = spreads.length;
  const currentSpread: SpreadData = spreads[currentSpreadIndex] || spreads[0];

  const isCoverClosed = bookState === 'closed' || bookState === 'closing';

  // Notify parent of active chapter changes
  useEffect(() => {
    if (bookState === 'open' || bookState === 'opening') {
      onChapterChange?.(currentSpread?.chapterNumber);
    } else {
      onChapterChange?.(undefined);
    }
  }, [bookState, currentSpread, onChapterChange]);

  // Open Book with smooth natural 3D cover swing (NO width expansion)
  const handleOpenBook = () => {
    if (bookState !== 'closed') return;
    setBookState('opening');
    playBookOpenSound();
    setTimeout(() => {
      setBookState('open');
    }, 680);
  };

  // Close Book with smooth natural 3D cover shut
  const handleCloseBook = () => {
    if (bookState !== 'open') return;
    setBookState('closing');
    playBookCloseSound();
    setTimeout(() => {
      setBookState('closed');
      setCurrentSpreadIndex(0);
    }, 680);
  };

  // Turn Page forward or backward with realistic dual-sided leaf animation (natural & lightweight)
  const turnPage = useCallback((direction: 'forward' | 'backward') => {
    if (isTurningRef.current || bookState !== 'open') return;

    if (direction === 'forward' && currentSpreadIndex < totalSpreads - 1) {
      isTurningRef.current = true;
      setTurningDirection('forward');
      playPageFlipSound('forward');

      setTimeout(() => {
        setCurrentSpreadIndex((prev) => prev + 1);
        setTurningDirection(null);
        isTurningRef.current = false;
      }, 460);
    } else if (direction === 'backward' && currentSpreadIndex > 0) {
      isTurningRef.current = true;
      setTurningDirection('backward');
      playPageFlipSound('backward');

      setTimeout(() => {
        setCurrentSpreadIndex((prev) => prev - 1);
        setTurningDirection(null);
        isTurningRef.current = false;
      }, 460);
    }
  }, [bookState, currentSpreadIndex, totalSpreads]);

  const jumpToSpread = useCallback((index: number) => {
    if (index === currentSpreadIndex || bookState !== 'open') return;
    isTurningRef.current = true;
    playPageFlipSound('shuffle');
    setTimeout(() => {
      setCurrentSpreadIndex(Math.max(0, Math.min(totalSpreads - 1, index)));
      setShowRibbonMenu(false);
      isTurningRef.current = false;
    }, 350);
  }, [bookState, currentSpreadIndex, totalSpreads]);

  const jumpToChapter = useCallback((chapterNumber: string) => {
    const targetIdx = spreads.findIndex((s) => s.chapterNumber === chapterNumber);
    if (targetIdx !== -1) {
      jumpToSpread(targetIdx);
    }
  }, [spreads, jumpToSpread]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        turnPage('forward');
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        turnPage('backward');
      } else if (e.key === 'Escape') {
        setShowRibbonMenu(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [turnPage]);

  // Dynamic stack depth calculations
  const leftStackPx = Math.max(3, Math.round((currentSpreadIndex / (totalSpreads - 1)) * 18));
  const rightStackPx = Math.max(3, Math.round(((totalSpreads - 1 - currentSpreadIndex) / (totalSpreads - 1)) * 18));

  const spreadRenderProps = {
    content,
    onJumpToChapter: jumpToChapter,
    onJumpToSpread: jumpToSpread,
    quizScores,
    onAnswerQuiz: (qId: string, ans: 'A' | 'B' | 'C' | 'D') => setQuizScores((p) => ({ ...p, [qId]: ans })),
    triggerPetals: triggerPetals || celebrateLove
  };

  // Next and Prev Spreads for dual-sided rendering
  const nextSpread = spreads[currentSpreadIndex + 1];
  const prevSpread = spreads[currentSpreadIndex - 1];

  return (
    <div className="book-stage relative flex flex-col items-center justify-center w-full my-auto overflow-hidden py-4">
      {/* Hidden SVG defs for shared gold foil gradient */}
      <svg className="absolute w-0 h-0 pointer-events-none" aria-hidden="true">
        <defs>
          <linearGradient id="goldGradShimmer" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF2C6" />
            <stop offset="35%" stopColor="#F9EC88" />
            <stop offset="70%" stopColor="#D4A325" />
            <stop offset="100%" stopColor="#8C4E28" />
          </linearGradient>
        </defs>
      </svg>

      {/* Quick Jump Ribbon Bookmark Menu Modal */}
      {showRibbonMenu && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-xs"
          onClick={() => setShowRibbonMenu(false)}
        >
          <div
            className="card relative w-full max-w-md p-6 bg-[#FDF8EE] border-2 border-[#8C4E28] shadow-2xl animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4 border-b border-[#8C4E28]/20 pb-2">
              <div className="flex items-center gap-2 text-[#663300]">
                <Bookmark size={18} className="text-[#B53000]" />
                <h3 className="font-display text-xl font-bold">Pita Pembatas Buku</h3>
              </div>
              <button
                onClick={() => setShowRibbonMenu(false)}
                className="text-xs font-bold text-[#8C4E28] hover:text-[#B53000]"
              >
                Tutup ✕
              </button>
            </div>

            <p className="text-xs text-[#5A3E2D] mb-3">
              Lompat langsung ke lembaran bab yang ingin kamu baca:
            </p>

            <div className="space-y-1.5 max-h-80 overflow-y-auto pr-1">
              <button
                onClick={() => jumpToSpread(0)}
                className="w-full flex items-center justify-between p-2 rounded text-left text-xs font-bold hover:bg-[#8C4E28]/10 text-[#663300]"
              >
                <span>📖 Pengantar & Daftar Isi</span>
                <span className="text-[10px] text-[#8C4E28]">Hal. 1 - 2</span>
              </button>
              {CHAPTERS.map((ch) => {
                const spIdx = spreads.findIndex((s) => s.chapterNumber === ch.number);
                return (
                  <button
                    key={ch.number}
                    onClick={() => jumpToChapter(ch.number)}
                    className="w-full flex items-center justify-between p-2 rounded text-left text-xs font-bold hover:bg-[#8C4E28]/10 text-[#663300]"
                  >
                    <span>Bab {ch.romanNumeral} · {ch.publicTitle}</span>
                    <span className="text-[10px] text-[#8C4E28]">
                      {spIdx !== -1 ? `Hal. ${spIdx * 2 + 1}` : ''}
                    </span>
                  </button>
                );
              })}
              <button
                onClick={() => jumpToSpread(totalSpreads - 1)}
                className="w-full flex items-center justify-between p-2 rounded text-left text-xs font-bold hover:bg-[#8C4E28]/10 text-[#663300]"
              >
                <span>📕 Sampul Belakang</span>
                <span className="text-[10px] text-[#8C4E28]">Penutup</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* PERSISTENT 3D BOOK SHELL (NO WIDTH RESIZE, PURE 3D COVER ROTATION)   */}
      {/* =================================================================== */}
      <div className="relative flex items-center justify-center">
        {/* Previous Spread Arrow Button (Left Desk Side) */}
        {bookState === 'open' && (
          <button
            onClick={() => turnPage('backward')}
            disabled={currentSpreadIndex === 0 || Boolean(turningDirection)}
            className="absolute -left-14 sm:-left-16 z-30 flex h-12 w-12 items-center justify-center rounded-full border border-[#D4A325]/40 bg-[#281308]/95 text-[#F9EC88] shadow-2xl backdrop-blur-sm transition-all duration-200 hover:scale-110 hover:border-[#D4A325] active:scale-95 disabled:opacity-15 disabled:pointer-events-none"
            title="Halaman Sebelumnya (Panah Kiri)"
          >
            <ChevronLeft size={26} />
          </button>
        )}

        {/* Unified 3D Book Stage Container: Exactly fixed width at all times */}
        <div
          className="preserve-3d relative w-[780px] sm:w-[880px] md:w-[960px] lg:w-[1040px] h-[540px] sm:h-[590px] md:h-[630px] rounded-xl select-none"
          style={{
            perspective: '2200px',
            transform: isCoverClosed ? 'translateX(-25%)' : 'translateX(0%)',
            transition: 'transform 0.68s cubic-bezier(0.22, 1, 0.36, 1)'
          }}
        >
          {/* =============================================================== */}
          {/* LEFT HALF (Revealed only as cover swings open to the left)      */}
          {/* =============================================================== */}
          <div
            className={`absolute top-0 bottom-0 left-0 w-1/2 z-10 transition-opacity duration-300 ${
              isCoverClosed ? 'opacity-0 pointer-events-none' : 'opacity-100'
            }`}
          >
            {/* Hardcover Outer Leather Base (Left) */}
            <div className="antique-book-leather absolute -inset-3 rounded-l-2xl pointer-events-none border-l-2 border-y-2 border-[#D4A325]/50">
              <GildedCorner className="absolute top-2 left-2" />
              <GildedCorner className="absolute bottom-2 left-2 scale-y-[-1]" />
            </div>

            {/* Dynamic Left Paper Edge Stack */}
            <div
              className="page-stack-edge-left absolute top-1 bottom-1 -left-2.5 rounded-l-xs transition-all duration-300"
              style={{ width: `${leftStackPx}px` }}
            />

            {/* Left Page Parchment Body */}
            <div className="antique-parchment-paper relative h-full w-full p-7 sm:p-9 flex flex-col justify-between border-r border-[#8C4E28]/15 rounded-l-lg shadow-inner overflow-hidden">
              <div className="absolute top-3.5 left-3.5 w-4 h-4 border-t border-l border-[#8C4E28]/25" />
              <div className="absolute bottom-3.5 left-3.5 w-4 h-4 border-b border-l border-[#8C4E28]/25" />

              {/* Left Page Content */}
              <div className="relative z-10 h-full w-full">
                {turningDirection === 'backward' && prevSpread
                  ? prevSpread.renderLeft(spreadRenderProps)
                  : currentSpread.renderLeft(spreadRenderProps)}
              </div>
            </div>
          </div>

          {/* =============================================================== */}
          {/* RIGHT HALF (The main book block: Right page + bottom stack)     */}
          {/* =============================================================== */}
          <div className="absolute top-0 bottom-0 right-0 w-1/2">
            {/* Hardcover Outer Leather Base (Right) */}
            <div
              className="antique-book-leather absolute -inset-3 rounded-r-2xl pointer-events-none border-r-2 border-y-2 border-[#D4A325]/50"
              style={{
                boxShadow: '0 40px 90px -15px rgba(0,0,0,0.95), 0 20px 45px rgba(0,0,0,0.75)'
              }}
            >
              <GildedCorner className="absolute top-2 right-2 scale-x-[-1]" />
              <GildedCorner className="absolute bottom-2 right-2 scale-[-1]" />
            </div>

            {/* Dynamic Right Paper Edge Stack */}
            <div
              className="page-stack-edge-right absolute top-1 bottom-1 -right-2.5 rounded-r-xs transition-all duration-300"
              style={{ width: `${rightStackPx}px` }}
            />

            {/* Bottom Paper Stack */}
            <div className="page-stack-edge-bottom absolute -bottom-2.5 left-2 right-2 h-2.5 rounded-b-xs" />

            {/* Right Page Parchment Body */}
            <div className="antique-parchment-paper relative h-full w-full p-7 sm:p-9 flex flex-col justify-between rounded-r-lg shadow-inner overflow-hidden">
              <div className="absolute top-3.5 right-3.5 w-4 h-4 border-t border-r border-[#8C4E28]/25" />
              <div className="absolute bottom-3.5 right-3.5 w-4 h-4 border-b border-r border-[#8C4E28]/25" />

              {/* Right Page Content */}
              <div className="relative z-10 h-full w-full">
                {turningDirection === 'forward' && nextSpread
                  ? nextSpread.renderRight(spreadRenderProps)
                  : currentSpread.renderRight(spreadRenderProps)}
              </div>
            </div>
          </div>

          {/* =============================================================== */}
          {/* CENTER SPINE CREASE & BINDING GUTTER                             */}
          {/* =============================================================== */}
          <div className="spine-gutter-crease absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-12 pointer-events-none z-30" />

          {/* Silk Ribbon Bookmark */}
          {!isCoverClosed && (
            <div
              onClick={() => setShowRibbonMenu(!showRibbonMenu)}
              className="silk-ribbon-bookmark absolute -top-3 left-1/2 -translate-x-1/2 w-4 sm:w-5 h-20 sm:h-24 z-35 cursor-pointer rounded-b-sm flex flex-col items-center justify-end pb-1.5 transition-transform duration-200 hover:translate-y-2 group shadow-lg"
              title="Klik Pita Pembatas Buku untuk Lompat ke Bab Lain"
            >
              <div className="h-2 w-2 rounded-full bg-[#D4A325] shadow-xs group-hover:scale-125 transition-transform" />
            </div>
          )}

          {/* =============================================================== */}
          {/* DUAL-SIDED 3D PAGE TURN OVERLAY (DURING PAGE FLIP)              */}
          {/* =============================================================== */}
          {bookState === 'open' && turningDirection === 'forward' && nextSpread && (
            <div
              className="preserve-3d absolute top-0 bottom-0 right-0 w-1/2 animate-turn-forward z-40 pointer-events-none"
              style={{ transformOrigin: 'left center' }}
            >
              {/* Front Face: Outgoing Right Page */}
              <div className="backface-hidden antique-parchment-paper absolute inset-0 p-7 sm:p-9 overflow-hidden shadow-md border-l border-[#8C4E28]/30 rounded-r-lg">
                {currentSpread.renderRight(spreadRenderProps)}
                {/* Natural Paper Turn Glint Overlay */}
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-transparent via-white/10 to-black/5" />
              </div>
              {/* Back Face: Incoming Left Page */}
              <div
                className="backface-hidden antique-parchment-paper absolute inset-0 p-7 sm:p-9 overflow-hidden shadow-md border-r border-[#8C4E28]/30 rounded-l-lg"
                style={{ transform: 'rotateY(180deg)' }}
              >
                {nextSpread.renderLeft(spreadRenderProps)}
                {/* Natural Paper Turn Glint Overlay */}
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-l from-transparent via-white/10 to-black/5" />
              </div>
            </div>
          )}

          {bookState === 'open' && turningDirection === 'backward' && prevSpread && (
            <div
              className="preserve-3d absolute top-0 bottom-0 left-0 w-1/2 animate-turn-backward z-40 pointer-events-none"
              style={{ transformOrigin: 'right center' }}
            >
              {/* Front Face: Outgoing Left Page */}
              <div className="backface-hidden antique-parchment-paper absolute inset-0 p-7 sm:p-9 overflow-hidden shadow-md border-r border-[#8C4E28]/30 rounded-l-lg">
                {currentSpread.renderLeft(spreadRenderProps)}
                {/* Natural Paper Turn Glint Overlay */}
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-l from-transparent via-white/10 to-black/5" />
              </div>
              {/* Back Face: Incoming Right Page */}
              <div
                className="backface-hidden antique-parchment-paper absolute inset-0 p-7 sm:p-9 overflow-hidden shadow-md border-l border-[#8C4E28]/30 rounded-r-lg"
                style={{ transform: 'rotateY(180deg)' }}
              >
                {prevSpread.renderRight(spreadRenderProps)}
                {/* Natural Paper Turn Glint Overlay */}
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-transparent via-white/10 to-black/5" />
              </div>
            </div>
          )}

          {/* =============================================================== */}
          {/* THE 3D FRONT COVER (Hinged at Spine, Swings 0deg to -180deg)     */}
          {/* =============================================================== */}
          <div
            className={`preserve-3d absolute top-0 bottom-0 right-0 w-1/2 ${
              bookState === 'open' ? 'pointer-events-none -z-10 opacity-0' : 'z-50 opacity-100'
            }`}
            style={{
              transformOrigin: 'left center',
              transform: isCoverClosed ? 'rotateY(0deg)' : 'rotateY(-180deg)',
              transition: 'transform 0.68s cubic-bezier(0.22, 1, 0.36, 1)'
            }}
          >
            {/* FRONT FACE: The Gilded Antique Leather Cover (0deg) */}
            <div
              onClick={() => {
                if (bookState === 'closed') handleOpenBook();
              }}
              className="backface-hidden antique-book-leather absolute inset-0 rounded-r-xl p-8 sm:p-10 flex flex-col items-center justify-between text-center overflow-hidden border border-[#D4A325]/70 shadow-2xl cursor-pointer"
            >
              {/* Gilded Border Frames */}
              <div className="absolute inset-3 rounded-lg border border-[#D4A325]/75 pointer-events-none" />
              <div className="absolute inset-5 rounded-md border border-[#D4A325]/30 pointer-events-none" />

              {/* 4 Victorian Corner Fleurons */}
              <GildedCorner className="absolute top-3.5 left-3.5" />
              <GildedCorner className="absolute top-3.5 right-3.5 scale-x-[-1]" />
              <GildedCorner className="absolute bottom-3.5 left-3.5 scale-y-[-1]" />
              <GildedCorner className="absolute bottom-3.5 right-3.5 scale-[-1]" />

              {/* Top Medallion */}
              <div className="mt-2 flex h-14 w-14 items-center justify-center rounded-full border-2 border-[#D4A325]/70 bg-gradient-to-b from-[#2C1308] to-[#160803] text-[#F9EC88] shadow-lg">
                <Heart size={24} className="fill-[#D4A325]/40 text-[#F9EC88]" />
              </div>

              {/* Gold Letterpress Typography */}
              <div className="my-auto px-4 z-10">
                <p className="font-nunito text-xs font-black tracking-[0.32em] text-[#D4A325] uppercase drop-shadow-sm">
                  BUKU KENANGAN
                </p>
                <h2
                  className="mt-2 font-display text-4xl sm:text-5xl font-black text-[#FFF8E7] tracking-wider"
                  style={{
                    textShadow: '0 3px 6px rgba(0,0,0,0.9), 0 0 25px rgba(212,163,37,0.4)'
                  }}
                >
                  Untuk Nona
                </h2>
                <div className="mx-auto my-3 h-0.5 w-24 bg-gradient-to-r from-transparent via-[#D4A325] to-transparent" />
                <p className="font-display text-sm sm:text-base italic text-[#E5D2B5] leading-relaxed">
                  Sebuah perjalanan kecil dalam 7 bab kenangan
                </p>
              </div>

              {/* Vintage Parchment Bookband (Belly Band) */}
              <div className="relative z-20 w-full rounded-sm py-2.5 px-4 bg-[#FAF4E6] border-y border-[#D4A325]/60 shadow-xl text-center">
                {content.unlocked || content.preview ? (
                  <div>
                    <p className="font-display text-sm sm:text-base font-bold italic text-[#663300]">
                      &ldquo;Waktunya telah tiba... Buku ini siap dibuka untukmu.&rdquo;
                    </p>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenBook();
                      }}
                      className="mt-2 mx-auto flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#8C4E28] via-[#A8582C] to-[#663300] py-1.5 px-6 text-xs font-black text-[#F9EC88] shadow-md border border-[#F9EC88]/50 hover:brightness-115 hover:scale-[1.03] active:scale-95 transition-all"
                    >
                      <BookOpen size={14} />
                      <span>Buka Buku Sekarang</span>
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center justify-center gap-1.5 text-xs font-black uppercase tracking-wider text-[#B53000] mb-1">
                      <Lock size={13} />
                      <span>Terkunci Sampai 10 Desember 2026</span>
                    </div>
                    <div className="my-1">
                      <Countdown unlockIso={content.unlockIso} />
                    </div>
                    <p className="text-[11px] font-nunito font-semibold text-[#5A3E2D]">
                      Buku ini tersegel rapat hingga hari ulang tahunmu tiba.
                    </p>
                  </div>
                )}
              </div>

              <div className="mb-0 text-[10px] font-bold tracking-[0.25em] text-[#D4A325]/80 uppercase">
                ALEX · 10 DESEMBER 2026
              </div>
            </div>

            {/* BACK FACE: Inside Front Cover (Visible when opened at -180deg) */}
            <div
              className="backface-hidden antique-parchment-paper absolute inset-0 rounded-l-xl p-7 sm:p-9 flex flex-col justify-between overflow-hidden border-r border-[#8C4E28]/15"
              style={{ transform: 'rotateY(180deg)' }}
            >
              {currentSpread.renderLeft(spreadRenderProps)}
            </div>
          </div>
        </div>

        {/* Next Spread Arrow Button (Right Desk Side) */}
        {bookState === 'open' && (
          <button
            onClick={() => turnPage('forward')}
            disabled={currentSpreadIndex === totalSpreads - 1 || Boolean(turningDirection)}
            className="absolute -right-14 sm:-right-16 z-30 flex h-12 w-12 items-center justify-center rounded-full border border-[#D4A325]/40 bg-[#281308]/95 text-[#F9EC88] shadow-2xl backdrop-blur-sm transition-all duration-200 hover:scale-110 hover:border-[#D4A325] active:scale-95 disabled:opacity-15 disabled:pointer-events-none"
            title="Halaman Berikutnya (Panah Kanan)"
          >
            <ChevronRight size={26} />
          </button>
        )}
      </div>

      {/* Bottom Desk Reading Navigation Bar */}
      {bookState === 'open' && (
        <footer className="relative z-20 mt-6 flex flex-wrap items-center justify-center gap-4 text-xs font-bold text-[#E8D4B4]">
          <button
            onClick={() => setShowRibbonMenu(true)}
            className="flex items-center gap-1.5 rounded-full border border-[#D4A325]/40 bg-[#261208]/90 px-3.5 py-1.5 hover:border-[#D4A325] hover:bg-[#381B0C] transition-colors shadow-md"
          >
            <Bookmark size={13} className="text-[#F9EC88]" />
            <span>Daftar Bab</span>
          </button>

          {/* Reading Progress Badge */}
          <div className="flex items-center gap-2 rounded-full border border-[#8C4E28]/50 bg-[#1E0C05]/95 px-4 py-1.5 shadow-md">
            <span className="text-[#F9EC88]">
              {currentSpread?.title || `Lembar ${currentSpreadIndex + 1}`}
            </span>
            <span className="text-[#8C4E28]">·</span>
            <span className="text-[#D9C4A5]">
              Lembar {currentSpreadIndex + 1} dari {totalSpreads}
            </span>
          </div>

          {/* Close Book Button */}
          <button
            onClick={handleCloseBook}
            className="rounded-full border border-[#8C4E28]/40 bg-[#261208]/90 px-3.5 py-1.5 text-xs text-[#BBA388] hover:text-[#F9EC88] hover:border-[#D4A325] transition-colors shadow-md"
          >
            Tutup Sampul Buku
          </button>
        </footer>
      )}
    </div>
  );
}

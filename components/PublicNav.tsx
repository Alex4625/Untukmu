'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Heart, Play, Pause, Menu, X, Home, Clock, BookOpen, ChevronRight } from 'lucide-react';
import { previewPath } from '@/lib/publicUrl';
import { useAudio } from './PersistentAudioPlayer';
import { CHAPTERS } from './chapters';

export default function PublicNav({
  preview = false,
  currentChapterNumber
}: {
  preview?: boolean;
  currentChapterNumber?: string;
}) {
  const pathname = usePathname();
  const { isPlaying, togglePlay } = useAudio();
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { label: 'Beranda', href: '/', icon: Home },
    { label: 'Countdown', href: '/countdown', icon: Clock },
    { label: 'Daftar Cerita', href: '/hub', icon: BookOpen }
  ];

  // Close mobile menu whenever the route changes
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setIsOpen(false);
  }

  // Close mobile menu on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Prevent background scrolling when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 h-14 border-b-2 border-[#F9EC88] bg-[#154794]/95 shadow-[0_4px_16px_rgba(0,0,0,0.4)] backdrop-blur-md">
        <div className="mx-auto flex h-full max-w-5xl items-center justify-between px-4 sm:px-6">
          {/* Brand / Logo */}
          <Link
            href={previewPath('/', preview)}
            className="group flex items-center gap-2 font-nunito text-base sm:text-lg font-black text-white transition hover:text-[#F9EC88]"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full border border-[#8C4E28] bg-[#FFE8A3] text-[#B53000] shadow-sm">
              <Heart size={14} fill="currentColor" />
            </span>
            <span className="tracking-wide">Untuk Nona</span>
          </Link>

          {/* Center Links (Desktop / Tablet) */}
          <nav className="hidden items-center gap-1 sm:flex" aria-label="Navigasi utama">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={previewPath(link.href, preview)}
                  className={`rounded-lg px-3 py-1.5 font-nunito text-xs sm:text-sm font-extrabold uppercase tracking-wider transition ${
                    isActive
                      ? 'border-b-2 border-[#F9EC88] text-[#F9EC88]'
                      : 'text-white/90 hover:bg-white/10 hover:text-[#F9EC88]'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Controls: Chapter indicator, Music toggle, and Mobile hamburger button */}
          <div className="flex items-center gap-2 sm:gap-3">
            {currentChapterNumber && (
              <Link
                href={previewPath('/hub', preview)}
                className="rounded-lg border border-[#4A2411] bg-gradient-to-b from-[#A05A2C] to-[#7A3C18] px-2.5 py-1 font-nunito text-xs font-black text-[#F9EC88] shadow-sm transition hover:brightness-110"
                title="Klik untuk lihat daftar chapter"
              >
                Ch. {currentChapterNumber}/07
              </Link>
            )}

            {/* Integrated Header Audio Button */}
            <button
              type="button"
              onClick={togglePlay}
              aria-label={isPlaying ? 'Jeda musik cerita' : 'Putar musik cerita'}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#F9EC88] bg-[#FFE8A3] text-[#663300] shadow-sm transition hover:scale-105 active:scale-95"
              title={isPlaying ? 'Jeda musik' : 'Putar musik'}
            >
              {isPlaying ? (
                <Pause size={15} className="text-[#663300]" />
              ) : (
                <Play size={15} className="ml-0.5 text-[#663300]" />
              )}
            </button>

            {/* Mobile Hamburger Toggle Button */}
            <button
              type="button"
              onClick={() => setIsOpen((prev) => !prev)}
              aria-expanded={isOpen}
              aria-controls="mobile-nav-menu"
              aria-label={isOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi'}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#F9EC88] bg-[#FFE8A3] text-[#663300] shadow-sm transition hover:scale-105 active:scale-95 sm:hidden"
            >
              {isOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm sm:hidden"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Navigation Dropdown Drawer */}
      {isOpen && (
        <div
          id="mobile-nav-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Menu navigasi mobile"
          className="fixed top-14 left-0 right-0 z-50 max-h-[calc(100dvh-3.5rem)] overflow-y-auto border-b-2 border-[#F9EC88] bg-[#154794]/98 px-4 py-4 shadow-2xl backdrop-blur-md sm:hidden animate-in slide-in-from-top-2 duration-200"
        >
          <div className="mx-auto max-w-lg space-y-4">
            {/* Primary Page Navigation */}
            <div>
              <p className="px-1 mb-2 font-nunito text-[11px] font-black uppercase tracking-widest text-[#F9EC88]">
                Navigasi Halaman
              </p>
              <nav className="flex flex-col gap-2" aria-label="Navigasi mobile">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.href}
                      href={previewPath(link.href, preview)}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 font-nunito text-sm font-extrabold transition duration-150 ${
                        isActive
                          ? 'border-2 border-[#8C4E28] bg-[#FFE8A3] text-[#663300] shadow-md'
                          : 'border border-white/15 bg-white/5 text-white hover:bg-white/15 hover:text-[#F9EC88]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`flex h-8 w-8 items-center justify-center rounded-lg border text-xs ${
                            isActive
                              ? 'border-[#8C4E28] bg-[#FFF3CC] text-[#B53000]'
                              : 'border-white/20 bg-white/10 text-[#F9EC88]'
                          }`}
                        >
                          <Icon size={16} />
                        </span>
                        <span className="tracking-wide">{link.label}</span>
                      </div>
                      {isActive ? (
                        <span className="rounded-full bg-[#8C4E28] px-2 py-0.5 text-[10px] font-black text-[#F9EC88]">
                          Aktif
                        </span>
                      ) : (
                        <ChevronRight size={16} className="text-white/40" />
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Quick 7 Chapters Navigation Shortcuts */}
            <div className="border-t border-[#F9EC88]/20 pt-3">
              <div className="flex items-center justify-between px-1 mb-2">
                <p className="font-nunito text-[11px] font-black uppercase tracking-widest text-[#F9EC88]">
                  Pintas Chapter (01–07)
                </p>
                <Link
                  href={previewPath('/hub', preview)}
                  onClick={() => setIsOpen(false)}
                  className="font-nunito text-xs font-bold text-[#F9EC88] underline underline-offset-2 hover:text-white"
                >
                  Buka Daftar Cerita
                </Link>
              </div>
              <div className="grid grid-cols-4 gap-1.5 sm:grid-cols-7">
                {CHAPTERS.map((ch) => {
                  const isChActive = pathname.startsWith(ch.href);
                  return (
                    <Link
                      key={ch.number}
                      href={previewPath(ch.href, preview)}
                      onClick={() => setIsOpen(false)}
                      title={`Chapter ${ch.number}: ${ch.publicTitle}`}
                      className={`flex flex-col items-center justify-center rounded-lg py-2 px-1 text-center transition ${
                        isChActive
                          ? 'border-2 border-[#8C4E28] bg-[#FFE8A3] text-[#663300] font-black shadow-sm'
                          : 'border border-white/15 bg-white/5 text-white/90 hover:bg-white/15 hover:text-[#F9EC88]'
                      }`}
                    >
                      <span className="font-nunito text-xs font-black leading-none">
                        {ch.number}
                      </span>
                      <span className="mt-1 line-clamp-1 w-full font-nunito text-[9px] font-bold opacity-85">
                        {ch.publicTitle}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

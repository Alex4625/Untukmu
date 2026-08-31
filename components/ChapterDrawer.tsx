'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, X, ChevronRight, Sparkles } from 'lucide-react';
import { CHAPTERS, getChapterByPath } from './chapters';
import { previewPath } from '@/lib/publicUrl';

export default function ChapterDrawer({ preview = false }: { preview?: boolean }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const currentChapter = getChapterByPath(pathname);

  // Close on Escape key and manage body scroll
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setIsOpen(false);
    }
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Don't show drawer on admin pages
  if (pathname.startsWith('/admin') || pathname.startsWith('/api')) {
    return null;
  }

  return (
    <>
      {/* Floating Trigger Button */}
      <aside className="fixed bottom-5 right-4 z-40 sm:bottom-6 sm:right-6" aria-label="Navigasi cepat chapter">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label="Buka daftar chapter cerita"
          aria-expanded={isOpen}
          className="group flex h-11 items-center gap-2 rounded-full border border-burgundy/20 bg-[#FDFBF7]/95 px-3.5 sm:px-4 text-xs sm:text-sm font-medium text-burgundy shadow-card backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-burgundy/40 hover:shadow-elevated active:scale-95"
        >
          <BookOpen size={15} className="text-dustyrose transition group-hover:text-burgundy shrink-0" />
          <span>
            {currentChapter ? (
              <span className="font-sans">
                <span className="font-display italic text-gold font-semibold">{currentChapter.number}</span> / 07{' '}
                <span className="hidden sm:inline font-normal text-ink-muted">· {currentChapter.publicTitle}</span>
              </span>
            ) : (
              'Daftar Cerita'
            )}
          </span>
        </button>
      </aside>

      {/* Drawer Overlay & Panel */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Navigasi Chapter"
          className="fixed inset-0 z-50 flex justify-end bg-burgundy-dark/50 backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        >
          <aside
            onClick={(e) => e.stopPropagation()}
            className="flex h-full w-full max-w-md flex-col bg-[#FDFBF7] p-6 shadow-2xl transition-transform duration-300 sm:p-8"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[rgba(90,40,52,0.10)] pb-5">
              <div>
                <p className="eyebrow">Daftar Cerita</p>
                <h2 className="mt-1 font-display text-3xl font-normal text-burgundy">Untuk Nona</h2>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Tutup daftar chapter"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-paper text-ink-muted transition hover:bg-burgundy hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            {/* Hub Shortcut */}
            <div className="mt-4">
              <Link
                href={previewPath('/hub', preview)}
                onClick={() => setIsOpen(false)}
                className={`flex items-center justify-between rounded-xl p-3.5 text-sm transition ${
                  pathname === '/hub'
                    ? 'bg-paper text-burgundy font-medium'
                    : 'text-ink-muted hover:bg-paper/60 hover:text-burgundy'
                }`}
              >
                <span className="flex items-center gap-2">
                  <span className="text-dustyrose">📖</span>
                  <span>Halaman Pembuka (Intro)</span>
                </span>
                <ChevronRight size={16} className="text-dustyrose" />
              </Link>
            </div>

            {/* Chapters List */}
            <nav className="mt-2 flex-1 space-y-2.5 overflow-y-auto pr-1">
              {CHAPTERS.map((ch) => {
                const isActive = pathname.startsWith(ch.href);
                return (
                  <Link
                    key={ch.number}
                    href={previewPath(ch.href, preview)}
                    onClick={() => setIsOpen(false)}
                    className={`group flex items-start gap-3.5 rounded-2xl border p-4 transition-all duration-200 ${
                      isActive
                        ? 'border-burgundy/30 bg-paper/80 shadow-subtle'
                        : 'border-[rgba(90,40,52,0.06)] bg-white hover:border-dustyrose/40 hover:bg-paper-light'
                    }`}
                  >
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-display text-lg font-light transition ${
                        isActive
                          ? 'bg-burgundy text-white'
                          : 'bg-paper text-burgundy group-hover:bg-dustyrose group-hover:text-white'
                      }`}
                    >
                      {ch.number}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3
                          className={`font-display text-xl leading-tight ${
                            isActive ? 'font-medium text-burgundy' : 'text-ink group-hover:text-burgundy'
                          }`}
                        >
                          {ch.publicTitle}
                        </h3>
                        {isActive && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-burgundy/10 px-2 py-0.5 text-[11px] font-medium text-burgundy">
                            Aktif
                          </span>
                        )}
                        {ch.number === '07' && !isActive && (
                          <Sparkles size={14} className="text-gold" />
                        )}
                      </div>
                      <p className="mt-1 line-clamp-1 text-xs text-ink-muted leading-relaxed">
                        {ch.description}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </nav>

            {/* Footer */}
            <div className="border-t border-[rgba(90,40,52,0.10)] pt-4 text-center">
              <p className="text-xs text-ink-muted">
                10 Desember 2026 · Dibuat dengan hati
              </p>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}

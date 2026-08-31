'use client';

import { useState, useEffect } from 'react';
import { getMediaUrl } from '@/lib/media';
import { formatDateID } from '@/lib/date';
import type { Memory } from '@/lib/types';
import Image from 'next/image';
import { Heart, X, ZoomIn } from 'lucide-react';

export default function MemoryGrid({ memories }: { memories: Memory[] }) {
  const [selectedPhoto, setSelectedPhoto] = useState<Memory | null>(null);

  // Manage body scroll when lightbox is active
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setSelectedPhoto(null);
    }
    if (selectedPhoto) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [selectedPhoto]);

  if (!memories.length) {
    return (
      <div className="card mx-auto max-w-lg p-10 text-center">
        <p className="font-display text-xl italic text-ink-muted">
          Belum ada foto yang ditambahkan di galeri.
        </p>
        <p className="mt-2 text-xs text-ink-muted">
          Admin bisa menambahkan foto-foto kenangan melalui panel kelola.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 sm:gap-6">
        {memories.map((item, index) => {
          const imageUrl = getMediaUrl(item.media_key || item.image_url, 900);
          const isSpan = index % 5 === 0 && memories.length > 3;

          return (
            <article
              key={item.id}
              onClick={() => imageUrl && setSelectedPhoto(item)}
              className={`card group cursor-pointer overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-elevated active:scale-[0.99] ${
                isSpan ? 'sm:col-span-2 lg:col-span-2' : ''
              }`}
            >
              {/* Photo Frame Area */}
              <div
                className={`relative bg-paper overflow-hidden ${
                  isSpan ? 'aspect-[16/9]' : 'aspect-[4/3] sm:aspect-[4/5]'
                }`}
              >
                {imageUrl ? (
                  <>
                    <Image
                      src={imageUrl}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes={
                        isSpan
                          ? '(max-width: 768px) 100vw, 66vw'
                          : '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
                      }
                    />
                    <div className="absolute inset-0 bg-burgundy/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex items-center justify-center">
                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-burgundy shadow-card">
                        <ZoomIn size={18} />
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="flex h-full items-center justify-center p-6 text-center text-sm font-medium text-ink-muted">
                    Foto tersimpan dalam ingatan
                  </div>
                )}

                {Boolean(item.is_favorite) && (
                  <div className="absolute right-3.5 top-3.5 rounded-full bg-[#FDFBF7]/90 p-2 text-rose-accent shadow-subtle backdrop-blur-sm">
                    <Heart size={15} fill="currentColor" aria-hidden="true" />
                  </div>
                )}
              </div>

              {/* Caption & Metadata */}
              <div className="p-5">
                <div className="flex items-center justify-between text-xs text-dustyrose">
                  <span className="font-semibold uppercase tracking-wider">
                    {item.category || 'Momen Kecil'}
                  </span>
                  {item.memory_date && (
                    <span className="text-ink-muted">{formatDateID(item.memory_date)}</span>
                  )}
                </div>

                <h3 className="mt-2 font-display text-2xl font-normal leading-tight text-burgundy group-hover:text-burgundy-dark">
                  {item.title}
                </h3>

                {item.story && (
                  <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-ink-muted">
                    {item.story}
                  </p>
                )}
              </div>
            </article>
          );
        })}
      </div>

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={selectedPhoto.title}
          onClick={() => setSelectedPhoto(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-burgundy-dark/70 p-4 backdrop-blur-sm sm:p-6"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="card relative max-h-[90vh] w-full max-w-2xl overflow-y-auto p-6 sm:p-8"
          >
            <button
              type="button"
              onClick={() => setSelectedPhoto(null)}
              aria-label="Tutup pratinjau foto"
              className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-paper text-ink-muted transition hover:bg-burgundy hover:text-white"
            >
              <X size={18} />
            </button>

            {selectedPhoto.image_url && (
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-paper">
                <Image
                  src={selectedPhoto.image_url}
                  alt={selectedPhoto.title}
                  fill
                  className="object-contain"
                  sizes="(max-width: 1024px) 95vw, 750px"
                />
              </div>
            )}

            <div className="mt-5 text-left">
              <div className="flex items-center justify-between text-xs text-dustyrose">
                <span className="font-semibold uppercase tracking-wider">
                  {selectedPhoto.category || 'Momen Kecil'}
                </span>
                {selectedPhoto.memory_date && <span>{formatDateID(selectedPhoto.memory_date)}</span>}
              </div>
              <h2 className="mt-2 font-display text-3xl text-burgundy">{selectedPhoto.title}</h2>
              {selectedPhoto.story && (
                <p className="mt-3 text-sm leading-relaxed text-ink whitespace-pre-line">
                  {selectedPhoto.story}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

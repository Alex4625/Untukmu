'use client';

import { useState, useEffect } from 'react';
import { getMediaUrl } from '@/lib/media';
import { formatDateID } from '@/lib/date';
import type { Memory } from '@/lib/types';
import { Scene } from '@/components/scene';
import Image from 'next/image';
import { Heart, X, ZoomIn, Camera } from 'lucide-react';

export type ThematicCluster = {
  id: string;
  title: string;
  eyebrow: string;
  description: string;
  items: Memory[];
};

export function groupThematicClusters(memories: Memory[]): ThematicCluster[] {
  if (!memories.length) return [];

  // Check if memories have distinct categories
  const categories = Array.from(
    new Set(memories.map((m) => m.category?.trim()).filter(Boolean) as string[])
  );

  // If multiple categories exist, group by category
  if (categories.length > 1) {
    return categories.map((cat, idx) => ({
      id: `cat-${idx}`,
      title: cat,
      eyebrow: `Tema ${String(idx + 1).padStart(2, '0')}`,
      description: `Koleksi potret yang terangkum dalam tema "${cat}". Setiap momen menyimpan rasa dan ceritanya sendiri.`,
      items: memories.filter((m) => m.category?.trim() === cat)
    }));
  }

  // Fallback: If categories are single or identical, group by Favorites vs Other, or clusters of 2-3 photos
  const favorites = memories.filter((m) => Boolean(m.is_favorite));
  const others = memories.filter((m) => !m.is_favorite);

  if (favorites.length > 0 && others.length > 0) {
    return [
      {
        id: 'favorites',
        title: 'Sorotan Paling Manis',
        eyebrow: 'Pilihan Khusus',
        description: 'Foto-foto yang selalu berhasil membawa kembali senyum dan kehangatan saat pertama kali dilihat.',
        items: favorites
      },
      {
        id: 'moments',
        title: 'Detil & Keseharian',
        eyebrow: 'Momen Berharga',
        description: 'Potret-potret kecil yang sederhana, namun menjadi bagian tak terpisahkan dari cerita kita.',
        items: others
      }
    ];
  }

  // If all items are similar, chunk dynamically into clusters of 2-3 items per scene
  const chunkSize = memories.length <= 4 ? 2 : 3;
  const clusters: ThematicCluster[] = [];
  const titles = [
    'Sudut Pandang Hangat',
    'Senyuman yang Tersimpan',
    'Detil Hari yang Berharga',
    'Kisah di Balik Kamera',
    'Langkah-Langkah Kecil'
  ];

  for (let i = 0; i < memories.length; i += chunkSize) {
    const clusterIdx = Math.floor(i / chunkSize);
    const chunk = memories.slice(i, i + chunkSize);
    clusters.push({
      id: `cluster-${clusterIdx}`,
      title: titles[clusterIdx % titles.length],
      eyebrow: `Koleksi ${String(clusterIdx + 1).padStart(2, '0')}`,
      description: 'Potongan momen yang tertangkap pelan, menjadi saksi bisu hari-hari yang kita lalui bersama.',
      items: chunk
    });
  }

  return clusters;
}

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

  // 2. Thematic grouping (DESIGN.md section 13: Foto dikelompokkan tematik/visual, bukan kronologis)
  const thematicClusters = groupThematicClusters(memories);

  if (!memories.length) {
    return (
      <div className="card mx-auto max-w-lg p-10 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-paper text-burgundy shadow-subtle">
          <Camera size={20} className="text-dustyrose" />
        </div>
        <p className="font-display text-2xl italic text-burgundy">
          Belum ada foto yang ditambahkan di galeri.
        </p>
        <p className="mt-2 text-xs text-ink-muted leading-relaxed">
          Admin bisa menambahkan foto-foto kenangan melalui panel kelola.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6 sm:space-y-8">
        {/* Render each thematic cluster as a reusable <Scene> (DEC-013, section 11 & 13) */}
        {thematicClusters.map((cluster, clusterIndex) => {
          const tone = clusterIndex % 3 === 0 ? 'paper' : clusterIndex % 3 === 1 ? 'base' : 'sage';

          return (
            <Scene
              key={cluster.id}
              id={`gallery-${cluster.id}`}
              eyebrow={cluster.eyebrow}
              title={cluster.title}
              body={cluster.description}
              align="center"
              tone={tone}
            >
              {/* Asymmetric Curated Photo Layout inside Scene */}
              <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 sm:gap-6">
                {cluster.items.map((item, itemIdx) => {
                  const imageUrl = getMediaUrl(item.media_key || item.image_url, 950);
                  const isFeatured = itemIdx === 0 && cluster.items.length >= 3;

                  return (
                    <article
                      key={item.id}
                      onClick={() => imageUrl && setSelectedPhoto(item)}
                      className={`group cursor-pointer overflow-hidden rounded-xl border-2 border-[#8C4E28] bg-[#FFF3CC] shadow-md transition-all duration-200 hover:-translate-y-1 hover:shadow-lg active:scale-[0.99] ${
                        isFeatured ? 'sm:col-span-2 lg:col-span-2' : ''
                      }`}
                    >
                      {/* Photo Container */}
                      <div
                        className={`relative overflow-hidden bg-paper ${
                          isFeatured ? 'aspect-[16/10]' : 'aspect-[4/3] sm:aspect-[4/5]'
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
                                isFeatured
                                  ? '(max-width: 768px) 100vw, 66vw'
                                  : '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
                              }
                            />
                            {/* Hover zoom overlay */}
                            <div className="absolute inset-0 bg-burgundy/15 opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex items-center justify-center">
                              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/95 text-burgundy shadow-card transition-transform duration-300 group-hover:scale-110">
                                <ZoomIn size={18} />
                              </span>
                            </div>
                          </>
                        ) : (
                          <div className="flex h-full items-center justify-center p-6 text-center text-sm font-medium text-ink-muted">
                            Foto tersimpan dalam ingatan
                          </div>
                        )}

                        {/* Favorite Badge */}
                        {Boolean(item.is_favorite) && (
                          <div className="absolute right-3.5 top-3.5 rounded-full bg-[#FDFBF7]/90 p-2 text-rose-accent shadow-subtle backdrop-blur-sm">
                            <Heart size={14} fill="currentColor" aria-hidden="true" />
                          </div>
                        )}
                      </div>

                      {/* Photo Caption & Info */}
                      <div className="p-4 sm:p-5 text-left">
                        <div className="flex items-center justify-between text-xs text-dustyrose">
                          <span className="font-semibold uppercase tracking-wider">
                            {item.category || 'Momen Kecil'}
                          </span>
                          {item.memory_date && (
                            <span className="text-ink-muted">{formatDateID(item.memory_date)}</span>
                          )}
                        </div>
                        <h3 className="mt-1.5 font-nunito text-lg sm:text-2xl font-black leading-snug text-[#663300] group-hover:text-[#B53000]">
                          {item.title}
                        </h3>
                        {item.story && (
                          <p className="mt-1.5 text-xs sm:text-sm leading-relaxed text-[#5A3E2D] line-clamp-2">
                            {item.story}
                          </p>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            </Scene>
          );
        })}
      </div>

      {/* Lightbox Zoom Dialog Modal */}
      {selectedPhoto && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={selectedPhoto.title}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-2 sm:p-6 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="card relative flex max-h-[86dvh] w-full max-w-3xl flex-col overflow-hidden bg-[#FFFDF4] shadow-2xl"
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setSelectedPhoto(null)}
              aria-label="Tutup pratinjau foto"
              className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-[#8C4E28] bg-[#FFE8A3] text-[#663300] shadow-md transition hover:bg-[#8C4E28] hover:text-[#FFF3CC]"
            >
              <X size={18} />
            </button>

            {/* Large Image View with DEC-009 high quality resolution */}
            <div className="relative aspect-[4/3] w-full bg-[#FFE8A3]/40 sm:aspect-[16/10] shrink-0">
              {selectedPhoto.media_key || selectedPhoto.image_url ? (
                <Image
                  src={getMediaUrl(selectedPhoto.media_key || selectedPhoto.image_url, 1400)}
                  alt={selectedPhoto.title}
                  fill
                  className="object-contain"
                  sizes="(max-width: 1024px) 96vw, 1200px"
                  priority
                />
              ) : null}
            </div>

            {/* Lightbox Caption & Details */}
            <div className="p-5 sm:p-7 overflow-y-auto">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-dustyrose">
                <span className="font-semibold uppercase tracking-wider">
                  {selectedPhoto.category || 'Momen Kecil'}
                </span>
                {selectedPhoto.memory_date && (
                  <span className="text-ink-muted font-medium">
                    {formatDateID(selectedPhoto.memory_date)}
                  </span>
                )}
              </div>
              <h2 className="mt-2 font-display text-2xl sm:text-3xl font-normal text-burgundy">
                {selectedPhoto.title}
              </h2>
              {selectedPhoto.story && (
                <p className="mt-3 text-sm sm:text-base leading-relaxed text-ink whitespace-pre-line">
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

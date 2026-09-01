'use client';

import { getMediaUrl } from '@/lib/media';
import { formatDateID } from '@/lib/date';
import type { Memory } from '@/lib/types';
import { Scene, SceneMedia } from '@/components/scene';
import { Calendar, Compass } from 'lucide-react';

export function sortMemoriesChronologically(memories: Memory[]): Memory[] {
  return [...memories].sort((a, b) => {
    const dateA = a.memory_date ? new Date(a.memory_date).getTime() : 0;
    const dateB = b.memory_date ? new Date(b.memory_date).getTime() : 0;
    return dateA - dateB;
  });
}

export default function Timeline({ memories }: { memories: Memory[] }) {
  const sortedMemories = sortMemoriesChronologically(memories);

  if (!sortedMemories.length) {
    return (
      <div className="card mx-auto max-w-lg p-10 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-paper text-burgundy shadow-subtle">
          <Compass size={20} className="text-dustyrose" />
        </div>
        <p className="font-display text-2xl italic text-burgundy">
          Belum ada cerita yang ditambahkan di sini.
        </p>
        <p className="mt-2 text-xs text-ink-muted leading-relaxed">
          Admin bisa menambahkan momen-momen awal melalui panel kelola.
        </p>
      </div>
    );
  }

  // Choose opening photo from favorite or first memory if available
  const introMemory = sortedMemories.find((m) => Boolean(m.is_favorite)) || sortedMemories[0];
  const introImageUrl = introMemory ? getMediaUrl(introMemory.media_key || introMemory.image_url, 1200) : null;

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Scene 1: Chapter 01 Intro Scene (DESIGN.md section 13: 1 scene intro) */}
      <Scene
        id="timeline-intro"
        eyebrow="Prolog Cerita"
        title="Bagaimana Semua Ini Bermula"
        body="Setiap cerita yang indah tidak pernah terburu-buru. Di babak ini, mari berjalan kembali melewati jejak-jejak waktu pertama yang mengawali perjalanan kita."
        align="center"
        tone="base"
        media={
          introImageUrl ? (
            <SceneMedia
              src={introImageUrl}
              alt={introMemory.title}
              priority
              aspectRatio="16/11"
              sizes="(max-width: 1024px) 92vw, 55vw"
            />
          ) : null
        }
      />

      {/* Dynamic Chronological Scenes: 1 scene per memory/chronological point (DESIGN.md section 13) */}
      {sortedMemories.map((memory, index) => {
        const imageUrl = getMediaUrl(memory.media_key || memory.image_url, 1100);
        // Alternate alignment left / right for rhythmic scrollytelling feel
        const align = index % 2 === 0 ? 'left' : 'right';
        // Alternate tones between paper, base, and sage for visual variety
        const tone = index % 3 === 1 ? 'paper' : index % 3 === 2 ? 'sage' : 'base';

        return (
          <Scene
            key={memory.id}
            id={`memory-${memory.id}`}
            eyebrow={`Jejak ${String(index + 1).padStart(2, '0')} · ${formatDateID(memory.memory_date)}`}
            title={memory.title}
            body={memory.story}
            align={align}
            tone={tone}
            media={
              imageUrl ? (
                <SceneMedia
                  src={imageUrl}
                  alt={memory.title}
                  priority={index === 0}
                  sizes="(max-width: 1024px) 92vw, 48vw"
                />
              ) : null
            }
            meta={
              <span className="inline-flex items-center gap-1.5 text-xs text-dustyrose">
                <Calendar size={13} />
                <span>{formatDateID(memory.memory_date)}</span>
                {memory.category && <span className="text-ink-muted">· {memory.category}</span>}
              </span>
            }
          />
        );
      })}
    </div>
  );
}

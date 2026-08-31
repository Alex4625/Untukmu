import { getMediaUrl } from '@/lib/media';
import { formatDateID } from '@/lib/date';
import type { Memory } from '@/lib/types';
import Image from 'next/image';
import { Calendar } from 'lucide-react';

export default function Timeline({ memories }: { memories: Memory[] }) {
  if (!memories.length) {
    return (
      <div className="card mx-auto max-w-lg p-10 text-center">
        <p className="font-display text-xl italic text-ink-muted">
          Belum ada cerita yang ditambahkan di sini.
        </p>
        <p className="mt-2 text-xs text-ink-muted">
          Admin bisa menambahkan momen-momen awal melalui panel kelola.
        </p>
      </div>
    );
  }

  return (
    <div className="relative mx-auto max-w-4xl py-6">
      {/* Central Timeline Spine */}
      <div className="absolute left-4 top-0 h-full w-px bg-[rgba(90,40,52,0.15)] md:left-1/2" />

      <div className="space-y-12 sm:space-y-16">
        {memories.map((memory, index) => {
          const isEven = index % 2 === 1;
          const imageUrl = getMediaUrl(memory.media_key || memory.image_url, 900);

          return (
            <article
              key={memory.id}
              className={`relative md:flex ${isEven ? 'md:justify-end' : 'md:justify-start'}`}
            >
              {/* Spine Node Marker */}
              <div className="absolute left-[9px] top-6 h-3.5 w-3.5 rounded-full border-2 border-base bg-burgundy shadow-subtle md:left-1/2 md:-ml-[7px]" />

              {/* Memory Card */}
              <div
                className={`ml-10 w-[calc(100%-2.5rem)] rounded-2xl border border-[rgba(90,40,52,0.10)] bg-[#FDFBF7] p-6 shadow-card transition-all duration-300 hover:shadow-elevated md:ml-0 md:w-[46%] sm:p-7 ${
                  isEven ? 'md:mr-0' : 'md:ml-0'
                }`}
              >
                <div className="flex items-center justify-between gap-2 border-b border-[rgba(90,40,52,0.08)] pb-3">
                  <span className="flex items-center gap-1.5 text-xs font-medium text-dustyrose">
                    <Calendar size={13} />
                    {formatDateID(memory.memory_date)}
                  </span>
                  {memory.category && (
                    <span className="rounded-full bg-paper px-2.5 py-0.5 text-[11px] font-medium text-ink-muted">
                      {memory.category}
                    </span>
                  )}
                </div>

                <h3 className="mt-4 font-display text-3xl font-normal leading-tight text-burgundy">
                  {memory.title}
                </h3>

                {memory.story && (
                  <p className="mt-3.5 text-[15px] leading-relaxed text-ink whitespace-pre-line">
                    {memory.story}
                  </p>
                )}

                {imageUrl && (
                  <div className="relative mt-5 aspect-[16/10] overflow-hidden rounded-xl bg-paper">
                    <Image
                      src={imageUrl}
                      alt={memory.title}
                      fill
                      className="object-cover transition-transform duration-500 hover:scale-105"
                      sizes="(max-width: 768px) 90vw, 42vw"
                    />
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

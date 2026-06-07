import { cloudinaryOptimized } from '@/lib/cloudinary';
import { formatDateID } from '@/lib/date';
import type { Memory } from '@/lib/types';
import Image from 'next/image';

export default function Timeline({ memories }: { memories: Memory[] }) {
  if (!memories.length) return <div className="card p-8 text-center text-muted">Belum ada timeline aktif. Nanti admin bisa menambahkan momen-momen kecilnya.</div>;
  return (
    <div className="relative mx-auto max-w-4xl">
      <div className="absolute left-4 top-0 h-full w-px bg-[rgba(196,138,106,0.22)] md:left-1/2" />
      <div className="space-y-8">
        {memories.map((memory, index) => (
          <article key={memory.id} className={`relative md:flex ${index % 2 ? 'md:justify-end' : 'md:justify-start'}`}>
            <div className="absolute left-[9px] top-8 h-4 w-4 rounded-full border-4 border-blush bg-rose md:left-1/2 md:-ml-2" />
            <div className="ml-12 w-[calc(100%-3rem)] rounded-2xl border border-[rgba(196,138,106,0.22)] bg-white p-5 shadow-romantic md:ml-0 md:w-[45%]">
              <p className="text-xs font-medium text-rosegold">{formatDateID(memory.memory_date)}</p>
              <h3 className="mt-2 font-display text-3xl font-normal leading-tight text-maroon">{memory.title}</h3>
              {memory.category && <span className="mt-3 inline-flex rounded-full bg-cream px-3 py-1 text-[11px] font-medium text-muted">{memory.category}</span>}
              {memory.story && <p className="mt-4 text-[15px] leading-7 text-cocoa">{memory.story}</p>}
              {memory.image_url && (
                <div className="relative mt-4 aspect-video overflow-hidden rounded-xl bg-cream">
                  <Image src={cloudinaryOptimized(memory.image_url, 900)} alt={memory.title} fill className="object-cover" sizes="(max-width: 768px) 90vw, 45vw" />
                </div>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

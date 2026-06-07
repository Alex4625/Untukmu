import { cloudinaryOptimized } from '@/lib/cloudinary';
import { formatDateID } from '@/lib/date';
import type { Memory } from '@/lib/types';
import Image from 'next/image';

export default function Timeline({ memories }: { memories: Memory[] }) {
  if (!memories.length) return <div className="card p-8 text-center text-cocoa/60">Belum ada timeline aktif. Nanti admin bisa menambahkan momen-momen kecilnya.</div>;
  return (
    <div className="relative mx-auto max-w-4xl">
      <div className="absolute left-4 top-0 h-full w-px bg-rose/30 md:left-1/2" />
      <div className="space-y-8">
        {memories.map((memory, index) => (
          <article key={memory.id} className={`relative md:flex ${index % 2 ? 'md:justify-end' : 'md:justify-start'}`}>
            <div className="absolute left-2 top-8 h-5 w-5 rounded-full border-4 border-blush bg-rose md:left-1/2 md:-ml-2.5" />
            <div className="ml-12 w-[calc(100%-3rem)] rounded-[2rem] border border-white/70 bg-white/80 p-5 shadow-lg shadow-rose/10 backdrop-blur md:ml-0 md:w-[45%]">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-rosegold">{formatDateID(memory.memory_date)}</p>
              <h3 className="mt-2 font-display text-2xl font-bold text-cocoa">{memory.title}</h3>
              {memory.story && <p className="mt-3 leading-7 text-cocoa/70">{memory.story}</p>}
              {memory.image_url && (
                <div className="relative mt-4 aspect-video overflow-hidden rounded-3xl bg-cream">
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

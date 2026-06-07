import { cloudinaryOptimized } from '@/lib/cloudinary';
import { formatDateID } from '@/lib/date';
import type { Memory } from '@/lib/types';
import Image from 'next/image';
import { Heart } from 'lucide-react';

export default function MemoryGrid({ memories }: { memories: Memory[] }) {
  if (!memories.length) return <Empty text="Belum ada galeri yang aktif. Admin bisa menambahkannya kapan saja." />;
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 lg:gap-5">
      {memories.map((item) => (
        <article key={item.id} className="group overflow-hidden rounded-[1.6rem] border border-white/70 bg-white/80 shadow-lg shadow-rose/10 transition hover:-translate-y-1 hover:shadow-romantic">
          <div className="relative aspect-[4/5] bg-cream">
            {item.image_url ? (
              <Image src={cloudinaryOptimized(item.image_url, 900)} alt={item.title} fill className="object-cover transition duration-500 group-hover:scale-105" sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw" />
            ) : (
              <div className="flex h-full items-center justify-center px-4 text-center text-sm font-semibold text-cocoa/50">Foto menyusul</div>
            )}
            {item.is_favorite && (
              <div className="absolute right-3 top-3 rounded-full bg-white/80 p-2 text-rose backdrop-blur">
                <Heart size={16} fill="currentColor" />
              </div>
            )}
          </div>
          <div className="p-4">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-rosegold">{item.category || 'Kenangan'}</p>
            <h3 className="mt-1 line-clamp-2 font-bold text-cocoa">{item.title}</h3>
            <p className="mt-1 text-xs text-cocoa/60">{formatDateID(item.memory_date)}</p>
          </div>
        </article>
      ))}
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return <div className="rounded-3xl border border-rose/20 bg-white/70 p-8 text-center text-cocoa/60">{text}</div>;
}

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
        <article key={item.id} className="group overflow-hidden rounded-2xl border border-[rgba(196,138,106,0.22)] bg-white shadow-romantic transition duration-300 hover:-translate-y-1 hover:border-softpink hover:shadow-soft">
          <div className="relative aspect-[4/5] bg-cream">
            {item.image_url ? (
              <Image src={cloudinaryOptimized(item.image_url, 900)} alt={item.title} fill className="object-cover transition duration-500 group-hover:scale-105" sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw" />
            ) : (
              <div className="flex h-full items-center justify-center px-4 text-center text-sm font-semibold text-cocoa/50">Foto menyusul</div>
            )}
            {item.is_favorite && (
              <div className="absolute right-3 top-3 rounded-full bg-white/80 p-2 text-rose backdrop-blur">
                <Heart size={16} fill="currentColor" aria-hidden="true" />
              </div>
            )}
          </div>
          <div className="p-4">
            <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-rosegold">{item.category || 'Kenangan'}</p>
            <h3 className="mt-1 line-clamp-2 font-display text-2xl font-normal leading-tight text-maroon">{item.title}</h3>
            <p className="mt-2 text-xs text-muted">{formatDateID(item.memory_date)}</p>
          </div>
        </article>
      ))}
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return <div className="rounded-2xl border border-[rgba(196,138,106,0.22)] bg-white p-8 text-center text-muted shadow-romantic">{text}</div>;
}

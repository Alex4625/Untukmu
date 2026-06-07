'use client';

import type { Letter } from '@/lib/types';
import { useState } from 'react';
import { MailOpen } from 'lucide-react';

export default function Letters({ letters }: { letters: Letter[] }) {
  const [openId, setOpenId] = useState<string | null>(letters[0]?.id ?? null);
  const selected = letters.find((letter) => letter.id === openId);

  if (!letters.length) return <div className="card p-8 text-center text-muted">Belum ada surat aktif. Admin bisa menulisnya nanti.</div>;

  return (
    <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[300px_1fr]">
      <div className="space-y-3">
        {letters.map((letter) => (
          <button key={letter.id} onClick={() => setOpenId(letter.id)} className={`w-full rounded-2xl border p-5 text-left transition duration-300 ${openId === letter.id ? 'border-rose bg-white shadow-soft' : 'border-[rgba(196,138,106,0.22)] bg-white/70 hover:bg-white'}`}>
            <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-rosegold">{letter.unlock_label || 'Surat kecil'}</p>
            <h3 className="mt-2 font-display text-2xl font-normal leading-tight text-maroon">{letter.title}</h3>
          </button>
        ))}
      </div>
      <article className="rounded-2xl border border-[rgba(196,138,106,0.22)] bg-[#fffdf9] p-6 shadow-soft sm:p-10">
        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-cream text-rose">
          <MailOpen size={28} />
        </div>
        {selected && (
          <>
            <h2 className="font-display text-4xl font-normal leading-tight text-maroon sm:text-5xl">{selected.title}</h2>
            <div className="prose-letter mt-6 whitespace-pre-line text-[17px] leading-8 text-cocoa">{selected.body}</div>
          </>
        )}
      </article>
    </div>
  );
}

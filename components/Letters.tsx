'use client';

import type { Letter } from '@/lib/types';
import { useState } from 'react';
import { MailOpen } from 'lucide-react';

export default function Letters({ letters }: { letters: Letter[] }) {
  const [openId, setOpenId] = useState<string | null>(letters[0]?.id ?? null);
  const selected = letters.find((letter) => letter.id === openId);

  if (!letters.length) return <div className="card p-8 text-center text-cocoa/60">Belum ada surat aktif. Admin bisa menulisnya nanti.</div>;

  return (
    <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
      <div className="space-y-3">
        {letters.map((letter) => (
          <button key={letter.id} onClick={() => setOpenId(letter.id)} className={`w-full rounded-3xl border p-5 text-left transition ${openId === letter.id ? 'border-rose bg-white shadow-lg shadow-rose/10' : 'border-white/70 bg-white/60 hover:bg-white'}`}>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-rosegold">{letter.unlock_label || 'Surat kecil'}</p>
            <h3 className="mt-2 font-bold text-cocoa">{letter.title}</h3>
          </button>
        ))}
      </div>
      <article className="rounded-[2.5rem] border border-rose/20 bg-[#fffdf9] p-6 shadow-romantic sm:p-10">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-cream text-maroon">
          <MailOpen size={28} />
        </div>
        {selected && (
          <>
            <h2 className="font-display text-3xl font-bold text-cocoa sm:text-4xl">{selected.title}</h2>
            <div className="prose-letter mt-6 whitespace-pre-line text-base leading-8 text-cocoa/75">{selected.body}</div>
          </>
        )}
      </article>
    </div>
  );
}

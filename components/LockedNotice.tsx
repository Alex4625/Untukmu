import Link from 'next/link';
import { Lock } from 'lucide-react';

export default function LockedNotice({ 
  title = 'Sabaar yahh nunggu duluu sayanggkuu cintakuuu 💕' 
}: { 
  title?: string 
}) {
  return (
    <main className="antique-desk-surface min-h-screen w-full flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-lg">
        <section className="card fade-in relative w-full px-6 py-10 text-center sm:px-10 sm:py-14 shadow-2xl">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-[#D4A325]/50 bg-[#FFFDF4] shadow-sm">
            <Lock size={26} className="text-[#B05364]" />
          </div>

          <p className="eyebrow text-[#B05364] tracking-widest text-xs font-bold uppercase">
            Belum Waktunya Dibuka 💛
          </p>
          <h1 className="mt-3 font-display text-2xl sm:text-3xl font-semibold leading-tight text-[#4A1A24]">
            {title}
          </h1>

          <div className="stardew-divider my-5" />

          <p className="mx-auto max-w-sm text-base sm:text-lg leading-relaxed text-[#4A3326] font-display italic font-medium">
            Looppp yuuu sooo muchhh! 🥺💖
          </p>
          <p className="mx-auto max-w-sm mt-3 text-sm leading-relaxed text-[#6B4E3D] font-sans">
            Semua cerita, foto, dan kenangan indah di dalam buku ini baru akan terbuka otomatis pas tanggal{' '}
            <strong className="text-[#4A1A24] font-bold">10 Desember 2026</strong> nanti yaa manisss ✨
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/" className="btn-primary">
              Buka Meja Kenangan 📖
            </Link>
            <Link href="/countdown" className="btn-secondary">
              Hitung Mundur 💫
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}

import Link from 'next/link';
import { Heart } from 'lucide-react';
import PublicNav from './PublicNav';

export default function LockedNotice({ 
  title = 'Sabaar yahh nunggu duluu sayanggkuu cintakuuu 💕' 
}: { 
  title?: string 
}) {
  return (
    <main className="min-h-dvh pt-20 pb-28 px-4 sm:px-6">
      <PublicNav />
      <div className="mx-auto max-w-lg mt-8">
        <section className="card fade-in relative w-full px-6 py-10 text-center sm:px-10 sm:py-14">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full border-2 border-[#8C4E28] bg-[#FFE8A3]">
            <Heart size={28} className="fill-[#B53000]/40 text-[#B53000] soft-pulse" />
          </div>

          <p className="eyebrow text-[#8C4E28] tracking-widest text-xs font-bold uppercase">Belum Waktunya Dibuka 💛</p>
          <h1 className="mt-3 font-nunito text-2xl sm:text-3xl font-black leading-tight text-[#663300]">
            {title}
          </h1>

          <div className="stardew-divider my-5" />

          <p className="mx-auto max-w-sm text-base sm:text-lg leading-relaxed text-[#5A3E2D] font-nunito font-bold">
            Looppp yuuu sooo muchhh! 🥺💖
          </p>
          <p className="mx-auto max-w-sm mt-3 text-sm leading-relaxed text-[#5A3E2D] font-nunito">
            Semua cerita, foto, dan kenangan indah di sini baru akan terbuka otomatis pas tanggal{' '}
            <strong className="text-[#B53000] font-bold">10 Desember 2026</strong> nanti yaa manisss ✨
          </p>

          <div className="mt-8">
            <Link href="/countdown" className="btn-primary">
              Lihat Countdown Menuju Harinya 💫
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}

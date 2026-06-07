import ConfettiButton from '@/components/ConfettiButton';
import LockedNotice from '@/components/LockedNotice';
import PublicNav from '@/components/PublicNav';
import { isAdminRequest } from '@/lib/adminAuth';
import { getPublicContent } from '@/lib/publicContent';
import { Sparkles } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function FinalPage({ searchParams }: { searchParams: { preview?: string } }) {
  const content = await getPublicContent(searchParams.preview === 'unlocked' && isAdminRequest());
  if (!content.unlocked) return <LockedNotice title="Kejutan terakhir belum bisa dibuka" />;
  return (
    <main className="container-page py-6 sm:py-10">
      <PublicNav />
      <section className="card mx-auto max-w-3xl p-8 text-center sm:p-12">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-cream text-maroon">
          <Sparkles size={34} />
        </div>
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-rosegold">Kejutan Terakhir</p>
        <h1 className="mt-3 font-display text-4xl font-bold text-cocoa sm:text-6xl">Selamat ulang tahun, sayang.</h1>
        <p className="mx-auto mt-6 max-w-2xl whitespace-pre-line text-lg leading-9 text-cocoa/75">
          {content.site_settings?.final_message || 'Aku tidak tahu semua hal yang akan terjadi sampai hari ini, tapi aku tahu satu hal: aku bersyukur karena kamu ada di hidupku.\n\nDari Alex.'}
        </p>
        <div className="mt-8"><ConfettiButton label="Buka Konfeti" /></div>
      </section>
    </main>
  );
}

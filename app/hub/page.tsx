import LockedNotice from '@/components/LockedNotice';
import PreviewBanner from '@/components/PreviewBanner';
import { getPublicContent } from '@/lib/publicContent';
import { isPreviewRequest, previewPath, type PageSearchParams } from '@/lib/publicPreview';
import { CalendarDays, Gift, Heart, Image, Mail, Sparkles, Star, ListChecks } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

const menuItems = [
  { href: '/timeline', title: 'Timeline', description: 'Kenangan kecil yang berjalan pelan.', Icon: CalendarDays },
  { href: '/gallery', title: 'Galeri', description: 'Foto-foto yang menyimpan cerita.', Icon: Image },
  { href: '/letters', title: 'Surat', description: 'Hal yang lebih mudah aku tulis.', Icon: Mail },
  { href: '/memory-box', title: 'Kotak Kenangan', description: 'Kartu kecil berisi rasa.', Icon: Gift },
  { href: '/quiz', title: 'Quiz', description: 'Pertanyaan ringan tentang kita.', Icon: Heart },
  { href: '/plans', title: 'Rencana Kita', description: 'Hal yang semoga kita lakukan.', Icon: ListChecks },
  { href: '/final', title: 'Kejutan Terakhir', description: 'Penutup yang paling pelan.', Icon: Sparkles, special: true }
];

export default async function HubPage({ searchParams }: { searchParams?: PageSearchParams }) {
  const content = await getPublicContent(await isPreviewRequest(searchParams));
  if (!content.unlocked) return <LockedNotice />;

  const filledSections = [
    content.memories.length,
    content.letters.length,
    content.memory_cards.length,
    content.quiz_questions.length,
    content.plans.length,
    content.site_settings?.final_message ? 1 : 0
  ].filter(Boolean).length;

  return (
    <main className="container-page min-h-dvh py-12 sm:py-16">
      {content.preview && <PreviewBanner />}
      <section className="mx-auto max-w-3xl text-center">
        <p className="eyebrow">Selamat Ulang Tahun</p>
        <h1 className="mt-3 font-display text-5xl font-light leading-tight text-maroon sm:text-6xl">Untuk Nona</h1>
        <p className="mx-auto mt-4 max-w-md text-base leading-7 text-muted">Pilih dari mana kamu ingin memulai.</p>
        <div className="mx-auto mt-6 inline-flex items-center gap-2 rounded-full border border-[rgba(196,138,106,0.22)] bg-white px-4 py-2 text-sm text-muted shadow-xs">
          <Star size={15} className="text-rosegold" />
          {filledSections} bagian sudah berisi cerita
        </div>
      </section>

      <section className="mx-auto mt-10 grid max-w-[720px] grid-cols-2 gap-4 md:grid-cols-3">
        {menuItems.map(({ href, title, description, Icon, special }, index) => (
          <Link
            key={href}
            href={previewPath(href, content.preview)}
            className={`group rounded-2xl border p-5 text-left shadow-romantic transition duration-300 hover:-translate-y-1 hover:border-softpink hover:shadow-soft active:scale-[0.97] ${
              special ? 'border-rose/35 bg-cream' : 'border-[rgba(196,138,106,0.22)] bg-white'
            }`}
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cream text-rose transition duration-300 group-hover:scale-105">
              <Icon size={23} />
            </div>
            <p className="mt-5 text-xs font-medium tracking-[0.08em] text-rosegold">{String(index + 1).padStart(2, '0')}</p>
            <h2 className="mt-1 font-display text-2xl font-normal leading-tight text-maroon">{title}</h2>
            <p className="mt-2 text-xs leading-5 text-muted">{description}</p>
          </Link>
        ))}
      </section>
    </main>
  );
}

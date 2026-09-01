'use client';

import type { Plan } from '@/lib/types';
import { Scene, useReducedMotion } from '@/components/scene';
import { BookmarkCheck, Compass, Sparkles, Feather } from 'lucide-react';

export type PlanSceneGroup = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  tone: 'paper' | 'base' | 'sage';
  plans: Plan[];
};

export function filterActivePlans(plans: Plan[]): Plan[] {
  return [...plans]
    .filter((p) => p.status === 'active' || !p.status)
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
}

export function groupPlansIntoScenes(plans: Plan[]): PlanSceneGroup[] {
  const activePlans = filterActivePlans(plans);
  if (!activePlans.length) return [];

  const achieved = activePlans.filter((p) => p.plan_status === 'tercapai');
  const planned = activePlans.filter((p) => p.plan_status === 'direncanakan');
  const wishlist = activePlans.filter((p) => p.plan_status === 'ingin_dilakukan');

  const futurePlans = [...planned, ...wishlist];

  // Case 1: Both future plans and achieved plans exist -> exactly 2 scenes
  if (futurePlans.length > 0 && achieved.length > 0) {
    return [
      {
        id: 'plans-future',
        eyebrow: 'Chapter 06 · Lembaran Masa Depan',
        title: 'Rencana & Angan-Angan Kita',
        description:
          'Jurnal perjalanan ke depan: hal-hal yang ingin kita coba bersama, tempat yang ingin kita tuju, dan langkah yang sedang dipersiapkan.',
        tone: 'paper',
        plans: futurePlans
      },
      {
        id: 'plans-achieved',
        eyebrow: 'Chapter 06 · Jejak yang Terwujud',
        title: 'Cerita yang Telah Berhasil Kita Lewati',
        description:
          'Doa dan angan yang perlahan menjadi kenyataan. Setiap impian yang terwujud adalah bukti manis kebersamaan kita.',
        tone: 'sage',
        plans: achieved
      }
    ];
  }

  // Case 2: Only achieved plans exist -> 1 scene
  if (futurePlans.length === 0 && achieved.length > 0) {
    return [
      {
        id: 'plans-achieved',
        eyebrow: 'Chapter 06 · Jejak Perjalanan',
        title: 'Semua yang Telah Kita Lalui Bersama',
        description:
          'Kumpulan rencana yang kini telah menjadi kenangan manis tak terganti. Terima kasih sudah mewujudkannya bersamaku.',
        tone: 'sage',
        plans: achieved
      }
    ];
  }

  // Case 3: Only future plans exist
  // If > 5 plans and distinct statuses exist, split into 2 scenes; otherwise keep 1 scene
  if (futurePlans.length > 5 && planned.length > 0 && wishlist.length > 0) {
    return [
      {
        id: 'plans-planned',
        eyebrow: 'Chapter 06 · Sedang Dipersiapkan',
        title: 'Langkah yang Semakin Dekat',
        description:
          'Rencana-rencana yang sudah mulai kita rancang dan bicarakan. Semoga setiap detailnya berjalan indah.',
        tone: 'paper',
        plans: planned
      },
      {
        id: 'plans-wishlist',
        eyebrow: 'Chapter 06 · Impian Bersama',
        title: 'Angan-Angan di Hari Nanti',
        description:
          'Keinginan-keinginan kecil yang tersimpan di dalam hati, menunggu waktu yang tepat untuk kita jalani.',
        tone: 'base',
        plans: wishlist
      }
    ];
  }

  // Unified single scene (DESIGN.md section 13: 1-2 scenes)
  return [
    {
      id: 'plans-future',
      eyebrow: 'Chapter 06 · Jurnal Harapan',
      title: 'Rencana & Angan-Angan Kita',
      description:
        'Lembaran catatan perjalanan: hal-hal yang ingin kita coba dan langkah yang sedang kita persiapkan bersama.',
      tone: 'paper',
      plans: futurePlans
    }
  ];
}

function JournalCard({ plan, index }: { plan: Plan; index: number }) {
  const reducedMotion = useReducedMotion();
  const status = plan.plan_status;

  if (status === 'tercapai') {
    return (
      <article
        className={`card group relative flex flex-col justify-between p-6 text-left transition-all duration-150 hover:-translate-y-0.5 sm:p-7 ${
          reducedMotion ? '' : 'hover:brightness-105'
        }`}
      >
        <div>
          <div className="flex items-center justify-between gap-3 border-b-2 border-[#8C4E28]/30 pb-3">
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#4E7C38] px-3 py-1 font-nunito text-xs font-black uppercase tracking-wider text-white shadow-sm">
              <BookmarkCheck size={14} />
              <span>Telah Terwujud</span>
            </span>
            <span className="font-nunito text-xs font-bold text-[#8C4E28]">
              Jejak #{String(index + 1).padStart(2, '0')}
            </span>
          </div>

          <h4 className="mt-4 font-nunito text-2xl sm:text-3xl font-black text-[#663300]">
            {plan.title}
          </h4>

          {plan.note && (
            <p className="mt-3 font-nunito text-sm sm:text-base font-bold leading-relaxed text-[#3E2723] whitespace-pre-line">
              {plan.note}
            </p>
          )}
        </div>

        <div className="mt-6 flex items-center gap-1.5 border-t-2 border-[#8C4E28]/20 pt-3 text-xs font-bold text-[#4E7C38]">
          <BookmarkCheck size={14} />
          <span>Alhamdulillah, telah menjadi kenangan indah</span>
        </div>
      </article>
    );
  }

  if (status === 'direncanakan') {
    return (
      <article
        className={`card group relative flex flex-col justify-between p-6 text-left transition-all duration-150 hover:-translate-y-0.5 sm:p-7 ${
          reducedMotion ? '' : 'hover:brightness-105'
        }`}
      >
        <div>
          <div className="flex items-center justify-between gap-3 border-b-2 border-[#8C4E28]/30 pb-3">
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#0066CC] px-3 py-1 font-nunito text-xs font-black uppercase tracking-wider text-white shadow-sm">
              <Compass size={14} />
              <span>Sedang Direncanakan</span>
            </span>
            <span className="font-nunito text-xs font-bold text-[#8C4E28]">
              Rencana #{String(index + 1).padStart(2, '0')}
            </span>
          </div>

          <h4 className="mt-4 font-nunito text-2xl sm:text-3xl font-black text-[#663300]">
            {plan.title}
          </h4>

          {plan.note && (
            <p className="mt-3 font-nunito text-sm sm:text-base font-bold leading-relaxed text-[#3E2723] whitespace-pre-line">
              {plan.note}
            </p>
          )}
        </div>

        <div className="mt-6 flex items-center gap-1.5 border-t-2 border-[#8C4E28]/20 pt-3 text-xs font-bold text-[#0066CC]">
          <Compass size={14} />
          <span>Langkah kecil yang sedang kita persiapkan bersama</span>
        </div>
      </article>
    );
  }

  // Fallback: 'ingin_dilakukan'
  return (
    <article
      className={`card group relative flex flex-col justify-between p-6 text-left transition-all duration-150 hover:-translate-y-0.5 sm:p-7 ${
        reducedMotion ? '' : 'hover:brightness-105'
      }`}
    >
      <div>
        <div className="flex items-center justify-between gap-3 border-b-2 border-[#8C4E28]/30 pb-3">
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#D4A325] px-3 py-1 font-nunito text-xs font-black uppercase tracking-wider text-white shadow-sm">
            <Sparkles size={14} />
            <span>Angan & Impian</span>
          </span>
          <span className="font-nunito text-xs font-bold text-[#8C4E28]">
            Harapan #{String(index + 1).padStart(2, '0')}
          </span>
        </div>

        <h4 className="mt-4 font-nunito text-2xl sm:text-3xl font-black text-[#663300]">
          {plan.title}
        </h4>

        {plan.note && (
          <p className="mt-3 font-nunito text-sm sm:text-base font-bold leading-relaxed text-[#3E2723] whitespace-pre-line">
            {plan.note}
          </p>
        )}
      </div>

      <div className="mt-6 flex items-center gap-1.5 border-t-2 border-[#8C4E28]/20 pt-3 text-xs font-bold text-[#D4A325]">
        <Sparkles size={14} />
        <span>Suatu saat nanti, mari kita wujudkan</span>
      </div>
    </article>
  );
}

export default function Plans({ plans }: { plans: Plan[] }) {
  const groups = groupPlansIntoScenes(plans);

  if (!groups.length) {
    return (
      <div className="card mx-auto max-w-lg p-10 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-paper text-burgundy shadow-subtle">
          <Feather size={20} className="text-dustyrose" />
        </div>
        <p className="font-display text-2xl italic text-burgundy">
          Belum ada rencana yang dicatat di sini.
        </p>
        <p className="mt-2 text-xs text-ink-muted leading-relaxed">
          Admin bisa menambahkan rencana masa depan melalui panel kelola.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Strictly 1 to 2 Scenes per DESIGN.md section 13 */}
      {groups.map((group) => (
        <Scene
          key={group.id}
          id={group.id}
          eyebrow={group.eyebrow}
          title={group.title}
          body={group.description}
          align="center"
          tone={group.tone}
        >
          {/* Responsive 2-column Future Journal Editorial Grid */}
          <div className="mx-auto mt-8 grid max-w-4xl grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6">
            {group.plans.map((plan, idx) => (
              <JournalCard key={plan.id} plan={plan} index={idx} />
            ))}
          </div>
        </Scene>
      ))}
    </div>
  );
}

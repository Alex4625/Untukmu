import type { Plan } from '@/lib/types';
import { CheckCircle2, Clock, Bookmark, Sparkles } from 'lucide-react';

export default function Plans({ plans }: { plans: Plan[] }) {
  if (!plans.length) {
    return (
      <div className="card mx-auto max-w-lg p-10 text-center">
        <p className="font-display text-xl italic text-ink-muted">
          Belum ada rencana yang dicatat di sini.
        </p>
        <p className="mt-2 text-xs text-ink-muted">
          Admin bisa menambahkan rencana masa depan melalui panel kelola.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-5 md:grid-cols-2 sm:gap-6">
      {plans.map((plan) => {
        const isAchieved = plan.plan_status === 'tercapai';
        const isPlanned = plan.plan_status === 'direncanakan';

        const Icon = isAchieved ? CheckCircle2 : isPlanned ? Clock : Bookmark;
        const badgeClass = isAchieved
          ? 'bg-sage/15 text-[#3D5C45]'
          : isPlanned
          ? 'bg-gold/15 text-[#735520]'
          : 'bg-dustyrose/15 text-burgundy';

        return (
          <article
            key={plan.id}
            className="card group flex flex-col justify-between p-6 sm:p-7 transition-all duration-300 hover:shadow-elevated"
          >
            <div>
              <div className="flex items-center justify-between gap-3 border-b border-[rgba(90,40,52,0.08)] pb-3.5">
                <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wider ${badgeClass}`}>
                  <Icon size={12} />
                  {statusLabel(plan.plan_status)}
                </span>
                <span className="font-display text-sm italic text-gold">Journal</span>
              </div>

              <h3 className="mt-4 font-display text-2xl sm:text-3xl font-normal leading-tight text-burgundy group-hover:text-burgundy-dark">
                {plan.title}
              </h3>

              {plan.note && (
                <p className="mt-2.5 text-[14px] sm:text-[15px] leading-relaxed text-ink-muted whitespace-pre-line">
                  {plan.note}
                </p>
              )}
            </div>

            <div className="mt-6 flex items-center gap-1.5 text-xs text-dustyrose/80">
              <Sparkles size={12} />
              <span>Semoga terlaksana bersama</span>
            </div>
          </article>
        );
      })}
    </div>
  );
}

function statusLabel(value: Plan['plan_status']) {
  if (value === 'tercapai') return 'Sudah Tercapai';
  if (value === 'direncanakan') return 'Sedang Direncanakan';
  return 'Ingin Dilakukan';
}

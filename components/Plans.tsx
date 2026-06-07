import type { Plan } from '@/lib/types';
import { CheckCircle2, Circle, Clock3 } from 'lucide-react';

export default function Plans({ plans }: { plans: Plan[] }) {
  if (!plans.length) return <div className="card p-8 text-center text-cocoa/60">Belum ada rencana aktif.</div>;
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {plans.map((plan) => {
        const achieved = plan.plan_status === 'tercapai';
        const Icon = achieved ? CheckCircle2 : plan.plan_status === 'direncanakan' ? Clock3 : Circle;
        return (
          <article key={plan.id} className="rounded-[2rem] border border-white/70 bg-white/75 p-6 shadow-lg shadow-rose/10">
            <div className="flex gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-cream text-maroon">
                <Icon size={24} />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-rosegold">{statusLabel(plan.plan_status)}</p>
                <h3 className="mt-1 text-lg font-bold text-cocoa">{plan.title}</h3>
                {plan.note && <p className="mt-2 leading-7 text-cocoa/65">{plan.note}</p>}
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}

function statusLabel(value: Plan['plan_status']) {
  if (value === 'tercapai') return 'Sudah tercapai';
  if (value === 'direncanakan') return 'Sedang direncanakan';
  return 'Ingin dilakukan';
}

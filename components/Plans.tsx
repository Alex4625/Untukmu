import type { Plan } from '@/lib/types';
import { CheckCircle2, Circle, Clock3 } from 'lucide-react';

export default function Plans({ plans }: { plans: Plan[] }) {
  if (!plans.length) return <div className="card p-8 text-center text-muted">Belum ada rencana aktif.</div>;
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {plans.map((plan) => {
        const achieved = plan.plan_status === 'tercapai';
        const Icon = achieved ? CheckCircle2 : plan.plan_status === 'direncanakan' ? Clock3 : Circle;
        const color = achieved ? 'text-sage' : plan.plan_status === 'direncanakan' ? 'text-amber' : 'text-rose';
        return (
          <article key={plan.id} className="rounded-2xl border border-[rgba(196,138,106,0.22)] bg-white p-6 shadow-romantic">
            <div className="flex gap-4">
              <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-cream ${color}`}>
                <Icon size={24} />
              </div>
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-rosegold">{statusLabel(plan.plan_status)}</p>
                <h3 className="mt-1 font-display text-3xl font-normal leading-tight text-maroon">{plan.title}</h3>
                {plan.note && <p className="mt-2 text-[15px] leading-7 text-muted">{plan.note}</p>}
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

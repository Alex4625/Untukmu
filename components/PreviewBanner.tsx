import Link from 'next/link';
import { Eye, Settings } from 'lucide-react';

export default function PreviewBanner() {
  return (
    <div className="mb-6 rounded-2xl border border-dustyrose/30 bg-[#FDFBF7] px-4 py-3 text-sm text-ink shadow-subtle">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Eye size={16} className="text-dustyrose" />
          <span className="font-semibold text-burgundy">Mode Preview Admin</span>
          <span className="text-xs text-ink-muted">· Tanggal unlock dilewati untuk pengecekan.</span>
        </div>
        <Link
          href="/admin"
          className="inline-flex items-center gap-1.5 font-medium text-xs text-burgundy hover:text-burgundy-dark underline underline-offset-2"
        >
          <Settings size={14} className="text-dustyrose" />
          <span>Kembali ke Admin</span>
        </Link>
      </div>
    </div>
  );
}

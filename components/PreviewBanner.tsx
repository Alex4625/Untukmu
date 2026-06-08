import Link from 'next/link';
import { Eye, Settings } from 'lucide-react';

export default function PreviewBanner() {
  return (
    <div className="mb-6 rounded-xl border border-rose/30 bg-white/80 px-4 py-3 text-sm text-cocoa shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Eye size={16} className="text-rose" />
          <span className="font-semibold text-maroon">Mode preview admin</span>
          <span className="text-muted">Tanggal unlock dilewati untuk pengecekan.</span>
        </div>
        <Link href="/admin" className="inline-flex items-center gap-2 font-semibold text-rose hover:text-rose-dark">
          <Settings size={15} />
          Kembali ke admin
        </Link>
      </div>
    </div>
  );
}

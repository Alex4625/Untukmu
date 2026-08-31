import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { previewPath } from '@/lib/publicUrl';

export default function PublicNav({
  preview = false,
  currentChapterNumber
}: {
  preview?: boolean;
  currentChapterNumber?: string;
}) {
  return (
    <nav className="mb-8 flex items-center justify-between">
      <Link
        href={previewPath('/hub', preview)}
        className="inline-flex items-center gap-2 text-sm font-medium text-ink-muted transition hover:text-burgundy"
      >
        <ArrowLeft size={16} className="text-dustyrose" />
        <span>Halaman Pembuka</span>
      </Link>

      {currentChapterNumber && (
        <span className="font-display text-sm italic text-gold">
          Chapter {currentChapterNumber} / 07
        </span>
      )}
    </nav>
  );
}

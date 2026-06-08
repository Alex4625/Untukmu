import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { previewPath } from '@/lib/publicPreview';

export default function PublicNav({ preview = false }: { preview?: boolean }) {
  return (
    <nav className="mb-8">
      <Link href={previewPath('/hub', preview)} className="btn-ghost gap-2">
        <ArrowLeft size={16} />
        Kembali ke Hub
      </Link>
    </nav>
  );
}

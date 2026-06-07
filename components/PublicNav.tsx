import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function PublicNav() {
  return (
    <nav className="mb-8">
      <Link href="/hub" className="btn-ghost gap-2">
        <ArrowLeft size={16} />
        Kembali ke Hub
      </Link>
    </nav>
  );
}

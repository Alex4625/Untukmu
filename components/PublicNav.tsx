import Link from 'next/link';

const links = [
  ['Timeline', '/timeline'],
  ['Galeri', '/gallery'],
  ['Surat', '/letters'],
  ['Kotak Kenangan', '/memory-box'],
  ['Quiz', '/quiz'],
  ['Rencana Kita', '/plans'],
  ['Kejutan', '/final']
];

export default function PublicNav() {
  return (
    <nav className="sticky top-3 z-40 mx-auto mb-8 flex max-w-5xl flex-wrap justify-center gap-2 rounded-full border border-white/70 bg-white/75 p-2 shadow-romantic backdrop-blur-xl">
      <Link href="/" className="rounded-full px-4 py-2 text-sm font-bold text-maroon hover:bg-cream">Home</Link>
      {links.map(([label, href]) => (
        <Link key={href} href={href} className="rounded-full px-4 py-2 text-sm font-bold text-cocoa/70 transition hover:bg-cream hover:text-maroon">
          {label}
        </Link>
      ))}
    </nav>
  );
}

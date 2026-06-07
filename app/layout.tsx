import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Untuk Nona - Untuk 10 Desember',
  description: 'Sebuah tempat kecil di internet untuk menyimpan hal-hal indah tentang kamu dan kita.'
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className="font-sans romantic-bg antialiased">{children}</body>
    </html>
  );
}

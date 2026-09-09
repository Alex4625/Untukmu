import type { Metadata, Viewport } from 'next';
import { Cormorant_Garamond, DM_Sans } from 'next/font/google';
import './globals.css';
import { AudioProvider } from '@/components/PersistentAudioPlayer';

const displayFont = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap'
});

const sansFont = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap'
});

export const metadata: Metadata = {
  metadataBase: new URL('https://untukmu.pages.dev'),
  applicationName: 'Untuk Nona',
  title: 'Untuk Nona - Untuk 10 Desember',
  description: 'Sebuah tempat kecil di internet untuk menyimpan hal-hal indah tentang kamu dan kita.',
  alternates: {
    canonical: '/'
  },
  openGraph: {
    title: 'Untuk Nona - Untuk 10 Desember',
    description: 'Sebuah tempat kecil di internet untuk menyimpan hal-hal indah tentang kamu dan kita.',
    url: '/',
    siteName: 'Untuk Nona',
    locale: 'id_ID',
    type: 'website'
  },
  twitter: {
    card: 'summary',
    title: 'Untuk Nona - Untuk 10 Desember',
    description: 'Sebuah tempat kecil di internet untuk menyimpan hal-hal indah tentang kamu dan kita.'
  },
  robots: {
    index: true,
    follow: true
  }
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#120804'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className="bg-[#120804]">
      <body className={`${sansFont.variable} ${displayFont.variable} font-sans bg-[#120804] text-[#FBF5E8] antialiased selection:bg-[#D4A325] selection:text-[#120804]`}>
        <AudioProvider>
          {children}
        </AudioProvider>
      </body>
    </html>
  );
}

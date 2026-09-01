import type { Metadata, Viewport } from 'next';
import { Cormorant_Garamond, DM_Sans, Nunito } from 'next/font/google';
import './globals.css';
import { AudioProvider, PersistentAudioWidget } from '@/components/PersistentAudioPlayer';
import ChapterIndexNav from '@/components/ChapterIndexNav';

const nunitoFont = Nunito({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800', '900'],
  variable: '--font-nunito',
  display: 'swap'
});

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
  themeColor: '#5ca6e8'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className={`${nunitoFont.variable} ${sansFont.variable} ${displayFont.variable} font-nunito bg-stardew-sky text-stardew-ink antialiased selection:bg-stardew-gold selection:text-stardew-wood-dark`}>
        <AudioProvider>
          {children}
          <PersistentAudioWidget />
          <ChapterIndexNav />
        </AudioProvider>
      </body>
    </html>
  );
}

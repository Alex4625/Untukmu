export type ChapterInfo = {
  index: number;
  number: string;
  slug: string;
  href: string;
  technicalName: string;
  publicTitle: string;
  description: string;
};

export const CHAPTERS: ChapterInfo[] = [
  {
    index: 1,
    number: '01',
    slug: 'timeline',
    href: '/timeline',
    technicalName: 'Timeline',
    publicTitle: 'Sebuah Awal',
    description: 'Jejak waktu dan momen-momen awal cerita kita.'
  },
  {
    index: 2,
    number: '02',
    slug: 'gallery',
    href: '/gallery',
    technicalName: 'Gallery',
    publicTitle: 'Momen Kecil',
    description: 'Koleksi potret dan senyuman yang tersimpan rapi.'
  },
  {
    index: 3,
    number: '03',
    slug: 'letters',
    href: '/letters',
    technicalName: 'Letters',
    publicTitle: 'Yang Aku Ingat',
    description: 'Surat dan tulisan yang ditulis pelan dari hati.'
  },
  {
    index: 4,
    number: '04',
    slug: 'memory-box',
    href: '/memory-box',
    technicalName: 'Memory Box',
    publicTitle: 'Yang Tak Terucap',
    description: 'Kartu-kartu kecil berisi alasan dan doa terbaik.'
  },
  {
    index: 5,
    number: '05',
    slug: 'quiz',
    href: '/quiz',
    technicalName: 'Quiz',
    publicTitle: 'Tentang Kamu',
    description: 'Pertanyaan ringan dan hangat tentang cerita kita.'
  },
  {
    index: 6,
    number: '06',
    slug: 'plans',
    href: '/plans',
    technicalName: 'Plans',
    publicTitle: 'Mungkin Nanti',
    description: 'Harapan dan hal-hal yang ingin kita lalui bersama.'
  },
  {
    index: 7,
    number: '07',
    slug: 'final',
    href: '/final',
    technicalName: 'Final Surprise',
    publicTitle: 'Untuk Hari Ini',
    description: 'Pesan penutup yang paling tulus untukmu.'
  }
];

export function getChapterByPath(pathname: string): ChapterInfo | undefined {
  return CHAPTERS.find((ch) => pathname.startsWith(ch.href));
}

export function getNextChapter(currentNumber: string): ChapterInfo | null {
  const currentIndex = CHAPTERS.findIndex((ch) => ch.number === currentNumber);
  if (currentIndex >= 0 && currentIndex < CHAPTERS.length - 1) {
    return CHAPTERS[currentIndex + 1];
  }
  return null;
}

export function getPrevChapter(currentNumber: string): ChapterInfo | null {
  const currentIndex = CHAPTERS.findIndex((ch) => ch.number === currentNumber);
  if (currentIndex > 0) {
    return CHAPTERS[currentIndex - 1];
  }
  return null;
}

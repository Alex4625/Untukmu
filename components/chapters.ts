export type ChapterInfo = {
  index: number;
  number: string;
  romanNumeral: string;
  slug: string;
  href: string;
  technicalName: string;
  publicTitle: string;
  description: string;
  prologueQuote: string;
};

export const CHAPTERS: ChapterInfo[] = [
  {
    index: 1,
    number: '01',
    romanNumeral: 'I',
    slug: 'timeline',
    href: '/timeline',
    technicalName: 'Timeline',
    publicTitle: 'Sebuah Awal',
    description: 'Jejak waktu dan momen-momen awal cerita kita.',
    prologueQuote: 'Setiap kisah yang hangat selalu bermula dari sebuah langkah yang sederhana.'
  },
  {
    index: 2,
    number: '02',
    romanNumeral: 'II',
    slug: 'gallery',
    href: '/gallery',
    technicalName: 'Gallery',
    publicTitle: 'Momen Kecil',
    description: 'Koleksi potret dan senyuman yang tersimpan rapi.',
    prologueQuote: 'Di antara detik yang berlalu, ada senyum yang diam-diam tersimpan abadi.'
  },
  {
    index: 3,
    number: '03',
    romanNumeral: 'III',
    slug: 'letters',
    href: '/letters',
    technicalName: 'Letters',
    publicTitle: 'Yang Aku Ingat',
    description: 'Surat dan tulisan yang ditulis pelan dari hati.',
    prologueQuote: 'Tertulis dalam hening, tersimpan dalam kata-kata yang paling jujur.'
  },
  {
    index: 4,
    number: '04',
    romanNumeral: 'IV',
    slug: 'memory-box',
    href: '/memory-box',
    technicalName: 'Memory Box',
    publicTitle: 'Yang Tak Terucap',
    description: 'Kartu-kartu kecil berisi alasan dan doa terbaik.',
    prologueQuote: 'Hal-hal yang mungkin jarang terucap, namun selalu ada di dalam doa.'
  },
  {
    index: 5,
    number: '05',
    romanNumeral: 'V',
    slug: 'quiz',
    href: '/quiz',
    technicalName: 'Quiz',
    publicTitle: 'Tentang Kamu',
    description: 'Pertanyaan ringan dan hangat tentang cerita kita.',
    prologueQuote: 'Seberapa dalam aku mengingat binar tawamu dan caramu memandang dunia?'
  },
  {
    index: 6,
    number: '06',
    romanNumeral: 'VI',
    slug: 'plans',
    href: '/plans',
    technicalName: 'Plans',
    publicTitle: 'Mungkin Nanti',
    description: 'Harapan dan hal-hal yang ingin kita lalui bersama.',
    prologueQuote: 'Mimpi-mimpi kecil dan jejak langkah yang ingin kita susuri bersama.'
  },
  {
    index: 7,
    number: '07',
    romanNumeral: 'VII',
    slug: 'final',
    href: '/final',
    technicalName: 'Final Surprise',
    publicTitle: 'Untuk Hari Ini',
    description: 'Pesan penutup yang paling tulus untukmu.',
    prologueQuote: 'Sebuah perayaan tulus untuk hari ini, dan semua hari esok yang menanti.'
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

export function getChapterTransitionDirection(
  fromNumber?: string,
  toNumber?: string
): 'forward' | 'backward' | 'hub' {
  if (!fromNumber || !toNumber) return 'forward';
  const fromIndex = CHAPTERS.findIndex((ch) => ch.number === fromNumber);
  const toIndex = CHAPTERS.findIndex((ch) => ch.number === toNumber);
  if (fromIndex === -1 || toIndex === -1) return 'hub';
  return toIndex >= fromIndex ? 'forward' : 'backward';
}

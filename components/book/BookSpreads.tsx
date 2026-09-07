'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import type { PublicContent, Memory, Letter, MemoryCard, QuizQuestion, Plan } from '@/lib/types';
import { CHAPTERS } from '@/components/chapters';
import { Heart, Calendar, Sparkles, CheckCircle2, Bookmark, ArrowRight, RotateCcw } from 'lucide-react';
import { celebrateLove } from '@/components/ConfettiButton';

export type SpreadData = {
  id: string;
  chapterNumber?: string;
  title: string;
  pageLeftNum?: number;
  pageRightNum?: number;
  renderLeft: (props: SpreadRenderProps) => React.ReactNode;
  renderRight: (props: SpreadRenderProps) => React.ReactNode;
};

export type SpreadRenderProps = {
  content: PublicContent;
  onJumpToChapter: (chapterNumber: string) => void;
  onJumpToSpread: (spreadIndex: number) => void;
  triggerPetals?: () => void;
  quizScores: Record<string, string>;
  onAnswerQuiz: (questionId: string, answer: 'A' | 'B' | 'C' | 'D') => void;
  pageNum?: number;
};

export function buildSpreads(content: PublicContent): SpreadData[] {
  const spreads: SpreadData[] = [];

  const addSpread = (spread: {
    id: string;
    chapterNumber?: string;
    title: string;
    renderLeft: (props: SpreadRenderProps & { pageNum: number }) => React.ReactNode;
    renderRight: (props: SpreadRenderProps & { pageNum: number }) => React.ReactNode;
  }) => {
    const sIndex = spreads.length;
    const pageLeft = sIndex * 2 + 1;
    const pageRight = sIndex * 2 + 2;
    spreads.push({
      id: spread.id,
      chapterNumber: spread.chapterNumber,
      title: spread.title,
      pageLeftNum: pageLeft,
      pageRightNum: pageRight,
      renderLeft: (props) => spread.renderLeft({ ...props, pageNum: pageLeft }),
      renderRight: (props) => spread.renderRight({ ...props, pageNum: pageRight })
    });
  };

  // =========================================================================
  // Spread 1: Prolog & Daftar Isi (Table of Contents)
  // =========================================================================
  addSpread({
    id: 'prologue-toc',
    title: 'Pengantar & Daftar Bab',
    renderLeft: ({ pageNum }) => (
      <div className="h-full flex flex-col justify-between py-2 px-1 sm:px-3 text-[#3E2723]">
        <div>
          <div className="flex items-center gap-2 mb-2 text-[#B53000]">
            <Heart size={16} className="fill-[#B53000]" />
            <span className="font-nunito text-xs font-black tracking-widest uppercase">
              Sebuah Pengantar
            </span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#663300] leading-tight">
            Untuk Nona
          </h2>
          <div className="my-3 h-0.5 w-12 bg-[#8C4E28]/30" />
          <p className="font-display text-base sm:text-lg italic font-semibold text-[#8C4E28] mb-3">
            &ldquo;Setiap kisah yang hangat selalu bermula dari sebuah langkah yang sederhana.&rdquo;
          </p>
          <p className="font-nunito text-xs sm:text-sm font-semibold leading-relaxed text-[#5A3E2D]">
            Selamat datang di buku kenangan kecil ini. Semua foto, tulisan, dan rahasia yang tersimpan di sini dikumpulkan pelan-pelan untuk hari ulang tahunmu.
          </p>
          <p className="mt-2 font-nunito text-xs sm:text-sm font-semibold leading-relaxed text-[#5A3E2D]">
            Buka lembar demi lembar, dan mari mengingat kembali semua tawa, mimpi, dan doa yang kita bagi bersama.
          </p>
        </div>
        <div className="mt-4 pt-3 border-t border-[#8C4E28]/20 flex items-center justify-between text-xs font-bold text-[#8C4E28]">
          <span className="font-display italic text-[#B53000]">10 Desember 2026</span>
          <span>Hal. {pageNum}</span>
        </div>
      </div>
    ),
    renderRight: ({ onJumpToChapter, pageNum }) => (
      <div className="h-full flex flex-col justify-between py-2 px-1 sm:px-3 text-[#3E2723]">
        <div>
          <div className="flex items-center gap-2 mb-2 text-[#B53000]">
            <Bookmark size={15} />
            <span className="font-nunito text-xs font-black tracking-widest uppercase">
              Daftar Bab
            </span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#663300] leading-tight mb-3">
            Isi Buku
          </h2>

          <div className="space-y-2">
            {CHAPTERS.map((ch) => (
              <button
                key={ch.number}
                onClick={() => onJumpToChapter(ch.number)}
                className="w-full group flex items-center justify-between text-left p-1.5 rounded hover:bg-[#8C4E28]/10 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="font-display font-bold text-[#B53000] text-sm w-6">
                    {ch.romanNumeral}.
                  </span>
                  <div>
                    <p className="font-nunito text-xs sm:text-sm font-bold text-[#663300] group-hover:text-[#B53000] transition-colors">
                      {ch.publicTitle}
                    </p>
                    <p className="text-[10px] text-[#8C4E28] line-clamp-1">
                      {ch.description}
                    </p>
                  </div>
                </div>
                <ArrowRight size={13} className="text-[#8C4E28] opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            ))}
          </div>
        </div>
        <div className="mt-4 pt-3 border-t border-[#8C4E28]/20 flex items-center justify-between text-xs font-bold text-[#8C4E28]">
          <span>Daftar Isi</span>
          <span>Hal. {pageNum}</span>
        </div>
      </div>
    )
  });

  // =========================================================================
  // Bab 1: Sebuah Awal (Timeline)
  // =========================================================================
  const memories = content.memories || [];
  if (memories.length === 0) {
    addSpread({
      id: 'ch-01-empty',
      chapterNumber: '01',
      title: 'Bab I · Sebuah Awal',
      renderLeft: ({ pageNum }) => (
        <ChapterOpenerLeft
          roman="I"
          number="01"
          title="Sebuah Awal"
          quote="Setiap kisah yang hangat selalu bermula dari sebuah langkah yang sederhana."
          desc="Kenangan-kenangan kecil yang berjalan pelan, membuka kembali bagaimana semua cerita indah ini bermula."
          pageNum={pageNum}
        />
      ),
      renderRight: ({ pageNum }) => (
        <div className="h-full flex flex-col justify-center items-center text-center p-6 text-[#8C4E28]">
          <p className="font-display text-lg italic">Belum ada kenangan yang dimasukkan.</p>
          <span className="mt-auto text-xs text-[#8C4E28] self-end">Hal. {pageNum}</span>
        </div>
      )
    });
  } else {
    // Opener Spread: Left Opener + Memory 0 on Right
    addSpread({
      id: 'ch-01-opener',
      chapterNumber: '01',
      title: 'Bab I · Sebuah Awal',
      renderLeft: ({ pageNum }) => (
        <ChapterOpenerLeft
          roman="I"
          number="01"
          title="Sebuah Awal"
          quote="Setiap kisah yang hangat selalu bermula dari sebuah langkah yang sederhana."
          desc="Kenangan-kenangan kecil yang berjalan pelan, membuka kembali bagaimana semua cerita indah ini bermula."
          pageNum={pageNum}
        />
      ),
      renderRight: ({ pageNum }) => <MemorySingleCard memory={memories[0]} pageNum={pageNum} />
    });

    // Subsequent memories (2 per spread: Left and Right)
    for (let i = 1; i < memories.length; i += 2) {
      const leftMem = memories[i];
      const rightMem = memories[i + 1];
      addSpread({
        id: `ch-01-mem-${i}`,
        chapterNumber: '01',
        title: 'Bab I · Sebuah Awal',
        renderLeft: ({ pageNum }) => <MemorySingleCard memory={leftMem} pageNum={pageNum} />,
        renderRight: ({ pageNum }) => (
          rightMem ? (
            <MemorySingleCard memory={rightMem} pageNum={pageNum} />
          ) : (
            <ChapterClosingCard
              title="Bab I Selesai"
              note="Semua langkah awal ini yang membawa kita ke hari ini."
              pageNum={pageNum}
            />
          )
        )
      });
    }
  }

  // =========================================================================
  // Bab 2: Momen Kecil (Gallery)
  // =========================================================================
  const galleryMemories = memories.filter((m) => Boolean(m.image_url));
  const galleryItems = galleryMemories.length > 0 ? galleryMemories : memories;

  addSpread({
    id: 'ch-02-opener',
    chapterNumber: '02',
    title: 'Bab II · Momen Kecil',
    renderLeft: ({ pageNum }) => (
      <ChapterOpenerLeft
        roman="II"
        number="02"
        title="Momen Kecil"
        quote="Di antara detik yang berlalu, ada senyum yang diam-diam tersimpan abadi."
        desc="Koleksi potret dan senyuman yang tersimpan rapi dalam album kenangan kita."
        pageNum={pageNum}
      />
    ),
    renderRight: ({ pageNum }) => (
      galleryItems[0] ? (
        <GallerySingleCard memory={galleryItems[0]} pageNum={pageNum} />
      ) : (
        <ChapterClosingCard title="Album Foto" note="Potret senyummu di setiap waktu." pageNum={pageNum} />
      )
    )
  });

  for (let i = 1; i < galleryItems.length; i += 2) {
    const leftItem = galleryItems[i];
    const rightItem = galleryItems[i + 1];
    addSpread({
      id: `ch-02-gal-${i}`,
      chapterNumber: '02',
      title: 'Bab II · Momen Kecil',
      renderLeft: ({ pageNum }) => <GallerySingleCard memory={leftItem} pageNum={pageNum} />,
      renderRight: ({ pageNum }) => (
        rightItem ? (
          <GallerySingleCard memory={rightItem} pageNum={pageNum} />
        ) : (
          <ChapterClosingCard title="Akhir Album Bab II" note="Masih banyak senyuman yang ingin kuabadikan." pageNum={pageNum} />
        )
      )
    });
  }

  // =========================================================================
  // Bab 3: Yang Aku Ingat (Letters)
  // =========================================================================
  const letters = content.letters || [];
  addSpread({
    id: 'ch-03-opener',
    chapterNumber: '03',
    title: 'Bab III · Yang Aku Ingat',
    renderLeft: ({ pageNum }) => (
      <ChapterOpenerLeft
        roman="III"
        number="03"
        title="Yang Aku Ingat"
        quote="Tertulis dalam hening, tersimpan dalam kata-kata yang paling jujur."
        desc="Surat dan tulisan yang ditulis pelan dari hati untuk kamu baca kapan pun."
        pageNum={pageNum}
      />
    ),
    renderRight: ({ pageNum }) => (
      letters[0] ? (
        <LetterSingleCard letter={letters[0]} pageNum={pageNum} />
      ) : (
        <ChapterClosingCard title="Kotak Surat" note="Kata-kata tulus yang selalu ada untukmu." pageNum={pageNum} />
      )
    )
  });

  for (let i = 1; i < letters.length; i += 2) {
    const leftLetter = letters[i];
    const rightLetter = letters[i + 1];
    addSpread({
      id: `ch-03-let-${i}`,
      chapterNumber: '03',
      title: 'Bab III · Yang Aku Ingat',
      renderLeft: ({ pageNum }) => <LetterSingleCard letter={leftLetter} pageNum={pageNum} />,
      renderRight: ({ pageNum }) => (
        rightLetter ? (
          <LetterSingleCard letter={rightLetter} pageNum={pageNum} />
        ) : (
          <ChapterClosingCard title="Akhir Bab III" note="Setiap kalimat ditulis dengan segenap rasa." pageNum={pageNum} />
        )
      )
    });
  }

  // =========================================================================
  // Bab 4: Yang Tak Terucap (Memory Box Cards)
  // =========================================================================
  const cards = content.memory_cards || [];
  addSpread({
    id: 'ch-04-opener',
    chapterNumber: '04',
    title: 'Bab IV · Yang Tak Terucap',
    renderLeft: ({ pageNum }) => (
      <ChapterOpenerLeft
        roman="IV"
        number="04"
        title="Yang Tak Terucap"
        quote="Hal-hal yang mungkin jarang terucap, namun selalu ada di dalam doa."
        desc="Kartu-kartu kecil berisi alasan, rasa terima kasih, dan hal manis tentangmu."
        pageNum={pageNum}
      />
    ),
    renderRight: ({ pageNum }) => (
      <CardsSpreadHalf cards={cards.slice(0, 2)} pageNum={pageNum} />
    )
  });

  for (let i = 2; i < cards.length; i += 4) {
    const leftCards = cards.slice(i, i + 2);
    const rightCards = cards.slice(i + 2, i + 4);
    addSpread({
      id: `ch-04-cards-${i}`,
      chapterNumber: '04',
      title: 'Bab IV · Yang Tak Terucap',
      renderLeft: ({ pageNum }) => <CardsSpreadHalf cards={leftCards} pageNum={pageNum} />,
      renderRight: ({ pageNum }) => (
        rightCards.length > 0 ? (
          <CardsSpreadHalf cards={rightCards} pageNum={pageNum} />
        ) : (
          <ChapterClosingCard title="Kartu Tersimpan" note="Semua hal baik ini adalah kamu." pageNum={pageNum} />
        )
      )
    });
  }

  // =========================================================================
  // Bab 5: Tentang Kamu (Quiz)
  // =========================================================================
  const questions = content.quiz_questions || [];
  addSpread({
    id: 'ch-05-opener',
    chapterNumber: '05',
    title: 'Bab V · Tentang Kamu',
    renderLeft: ({ pageNum }) => (
      <ChapterOpenerLeft
        roman="V"
        number="05"
        title="Tentang Kamu"
        quote="Seberapa dalam aku mengingat binar tawamu dan caramu memandang dunia?"
        desc="Teka-teki harian ringan dan hangat tentang hal-hal kecil di antara kita."
        pageNum={pageNum}
      />
    ),
    renderRight: (props) => (
      questions[0] ? (
        <QuizQuestionCard {...props} question={questions[0]} index={0} />
      ) : (
        <ChapterClosingCard title="Kuis Ringan" note="Mengingat kembali detail kecil yang manis." pageNum={props.pageNum} />
      )
    )
  });

  for (let i = 1; i < questions.length; i += 2) {
    const qLeft = questions[i];
    const qRight = questions[i + 1];
    addSpread({
      id: `ch-05-q-${i}`,
      chapterNumber: '05',
      title: 'Bab V · Tentang Kamu',
      renderLeft: (props) => <QuizQuestionCard {...props} question={qLeft} index={i} />,
      renderRight: (props) => (
        qRight ? (
          <QuizQuestionCard {...props} question={qRight} index={i + 1} />
        ) : (
          <ChapterClosingCard title="Skor Kuis Cinta" note="Semua jawaban selalu berujung pada sayang." pageNum={props.pageNum} />
        )
      )
    });
  }

  // =========================================================================
  // Bab 6: Mungkin Nanti (Plans)
  // =========================================================================
  const plans = content.plans || [];
  addSpread({
    id: 'ch-06-opener',
    chapterNumber: '06',
    title: 'Bab VI · Mungkin Nanti',
    renderLeft: ({ pageNum }) => (
      <ChapterOpenerLeft
        roman="VI"
        number="06"
        title="Mungkin Nanti"
        quote="Mimpi-mimpi kecil dan jejak langkah yang ingin kita susuri bersama."
        desc="Wishlist dan hal-hal sederhana yang ingin kita wujudkan satu per satu."
        pageNum={pageNum}
      />
    ),
    renderRight: ({ pageNum }) => (
      <PlansSpreadHalf plans={plans.slice(0, 3)} pageNum={pageNum} />
    )
  });

  for (let i = 3; i < plans.length; i += 6) {
    const leftPlans = plans.slice(i, i + 3);
    const rightPlans = plans.slice(i + 3, i + 6);
    addSpread({
      id: `ch-06-plans-${i}`,
      chapterNumber: '06',
      title: 'Bab VI · Mungkin Nanti',
      renderLeft: ({ pageNum }) => <PlansSpreadHalf plans={leftPlans} pageNum={pageNum} />,
      renderRight: ({ pageNum }) => (
        rightPlans.length > 0 ? (
          <PlansSpreadHalf plans={rightPlans} pageNum={pageNum} />
        ) : (
          <ChapterClosingCard title="Masa Depan Menanti" note="Mari wujudkan setiap mimpi ini bersama-sama." pageNum={pageNum} />
        )
      )
    });
  }

  // =========================================================================
  // Bab 7: Untuk Hari Ini (Final Surprise & Emotional Climax)
  // =========================================================================
  addSpread({
    id: 'ch-07-final',
    chapterNumber: '07',
    title: 'Bab VII · Untuk Hari Ini',
    renderLeft: (props) => (
      <div className="h-full flex flex-col justify-between py-2 px-1 sm:px-3 text-[#3E2723]">
        <div>
          <div className="flex items-center gap-2 mb-2 text-[#B53000]">
            <Sparkles size={16} className="text-[#D4A325]" />
            <span className="font-nunito text-xs font-black tracking-widest uppercase">
              Bab VII · Penutup
            </span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#663300] leading-tight">
            Untuk Hari Ini
          </h2>
          <div className="my-2.5 h-0.5 w-12 bg-[#8C4E28]/30" />

          <p className="font-display text-sm sm:text-base italic font-semibold text-[#8C4E28] mb-3">
            &ldquo;Sebuah perayaan tulus untuk hari ini, dan semua hari esok yang menanti.&rdquo;
          </p>

          <div className="p-3 rounded-lg bg-[#FAF4E6] border border-[#D4A325]/30 shadow-inner">
            <p className="font-nunito text-xs sm:text-sm font-semibold leading-relaxed text-[#3E2723] whitespace-pre-line">
              {content.site_settings?.final_message ||
                'Selamat ulang tahun untuk seseorang yang kehadirannya selalu menghangatkan duniaku. Semoga hari ini membawakan senyum paling tulus, dan semoga langkah-langkah ke depan selalu dipenuhi kebaikan.'}
            </p>
          </div>
        </div>

        <div className="mt-4">
          <button
            onClick={() => {
              celebrateLove();
              props.triggerPetals?.();
            }}
            className="btn-primary w-full py-2 text-xs font-extrabold flex items-center justify-center gap-2 shadow-md"
          >
            <Sparkles size={14} className="text-[#F9EC88]" />
            <span>Rayakan & Taburkan Kelopak Bunga</span>
          </button>
          <div className="mt-3 pt-2 border-t border-[#8C4E28]/20 flex items-center justify-between text-xs font-bold text-[#8C4E28]">
            <span>Pesan Terakhir</span>
            <span>Hal. {props.pageNum}</span>
          </div>
        </div>
      </div>
    ),
    renderRight: ({ pageNum }) => (
      <div className="h-full flex flex-col justify-between py-2 px-1 sm:px-3 text-[#3E2723] text-center">
        <div className="my-auto">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full border-2 border-[#8C4E28] bg-[#FFE8A3] text-[#B53000] shadow-sm">
            <Heart size={24} className="fill-[#B53000]" />
          </div>
          <p className="font-nunito text-xs font-black tracking-widest uppercase text-[#B53000]">
            Terima Kasih Telah Membaca
          </p>
          <h3 className="mt-1 font-display text-2xl sm:text-4xl font-bold text-[#663300]">
            Selamat Ulang Tahun, Nona ♡
          </h3>
          <div className="mx-auto my-3 h-0.5 w-16 bg-[#8C4E28]/30" />
          <p className="font-display text-sm sm:text-base italic text-[#8C4E28] max-w-xs mx-auto leading-relaxed">
            Semua halaman ini adalah bukti betapa berharganya setiap detik yang kita lalui bersama.
          </p>
        </div>

        <div className="pt-3 border-t border-[#8C4E28]/20 flex items-center justify-between text-xs font-bold text-[#8C4E28]">
          <span className="font-display italic">Selamanya</span>
          <span>Hal. {pageNum}</span>
        </div>
      </div>
    )
  });

  // =========================================================================
  // Spread Akhir: Back Cover (Hardcover Belakang)
  // =========================================================================
  addSpread({
    id: 'back-cover',
    title: 'Sampul Belakang',
    renderLeft: ({ onJumpToSpread }) => (
      <div className="h-full flex flex-col justify-between py-4 px-3 text-[#3E2723] text-center">
        <div className="my-auto">
          <p className="font-display text-lg italic text-[#8C4E28]">
            &ldquo;Dan kisah ini akan terus bertambah lembarannya setiap hari.&rdquo;
          </p>
          <div className="mx-auto my-4 h-0.5 w-12 bg-[#8C4E28]/30" />
          <button
            onClick={() => onJumpToSpread(0)}
            className="btn-secondary text-xs px-4 py-2 font-bold inline-flex items-center gap-1.5"
          >
            <RotateCcw size={13} />
            <span>Baca Ulang dari Awal</span>
          </button>
        </div>
        <div className="pt-2 text-[10px] text-[#8C4E28]">
          Buku Kenangan Untuk Nona · 2026
        </div>
      </div>
    ),
    renderRight: () => (
      <div className="antique-book-leather h-full rounded-r-lg p-6 flex flex-col items-center justify-center text-center border-l-2 border-[#1E0D06] shadow-inner">
        <div className="leather-stitch-border h-full w-full p-4 flex flex-col items-center justify-center">
          <div className="h-10 w-10 rounded-full border border-[#D4A325]/40 flex items-center justify-center text-[#F9EC88] mb-3">
            <Heart size={18} className="fill-[#D4A325]/30 text-[#F9EC88]" />
          </div>
          <h2 className="font-display text-xl sm:text-2xl font-bold tracking-widest text-[#F9EC88] uppercase drop-shadow-sm">
            UNTUK NONA
          </h2>
          <div className="my-2 h-0.5 w-16 bg-[#D4A325]/40" />
          <p className="font-display text-xs sm:text-sm italic text-[#E8D4B4]/80">
            Dibuat dengan segenap rasa oleh Alex
          </p>
          <p className="mt-4 text-[10px] font-nunito font-semibold tracking-wider text-[#D4A325]/70">
            10 DESEMBER 2026
          </p>
        </div>
      </div>
    )
  });

  return spreads;
}

// ---------------------------------------------------------------------------
// Helper Subcomponents for Spreads
// ---------------------------------------------------------------------------

function ChapterOpenerLeft({
  roman,
  number,
  title,
  quote,
  desc,
  pageNum
}: {
  roman: string;
  number: string;
  title: string;
  quote: string;
  desc: string;
  pageNum: number;
}) {
  return (
    <div className="h-full flex flex-col justify-between py-2 px-1 sm:px-3 text-[#3E2723]">
      <div>
        <div className="flex items-center gap-2 mb-2 text-[#B53000]">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#FFE8A3] text-[10px] font-black border border-[#8C4E28]/40">
            {number}
          </span>
          <span className="font-nunito text-xs font-black tracking-widest uppercase">
            Bab {roman}
          </span>
        </div>
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#663300] leading-tight">
          {title}
        </h2>
        <div className="my-2.5 h-0.5 w-12 bg-[#8C4E28]/30" />

        <p className="font-display text-base sm:text-lg italic font-semibold text-[#8C4E28] mb-3">
          &ldquo;{quote}&rdquo;
        </p>

        <p className="font-nunito text-xs sm:text-sm font-semibold leading-relaxed text-[#5A3E2D]">
          {desc}
        </p>
      </div>

      <div className="mt-4 pt-3 border-t border-[#8C4E28]/20 flex items-center justify-between text-xs font-bold text-[#8C4E28]">
        <span>Bab {number}</span>
        <span>Hal. {pageNum}</span>
      </div>
    </div>
  );
}

function MemorySingleCard({ memory, pageNum }: { memory: Memory; pageNum: number }) {
  return (
    <div className="h-full flex flex-col justify-between py-2 px-1 sm:px-3 text-[#3E2723]">
      <div>
        {memory.memory_date && (
          <div className="inline-flex items-center gap-1.5 rounded bg-[#8C4E28]/10 px-2 py-0.5 text-[11px] font-bold text-[#8C4E28] mb-2">
            <Calendar size={11} />
            <span>{memory.memory_date}</span>
          </div>
        )}
        <h3 className="font-display text-lg sm:text-xl font-bold text-[#663300] leading-snug">
          {memory.title}
        </h3>

        {memory.image_url && (
          <div className="relative my-2.5 h-36 sm:h-44 w-full overflow-hidden rounded border border-[#8C4E28]/30 bg-[#EFE6D5] shadow-xs">
            <Image
              src={memory.image_url}
              alt={memory.title}
              fill
              sizes="(max-width: 768px) 300px, 400px"
              className="object-cover sepia-[0.08]"
            />
          </div>
        )}

        <p className="font-nunito text-xs sm:text-sm font-semibold leading-relaxed text-[#5A3E2D] line-clamp-4">
          {memory.story || 'Sebuah momen manis yang terukir di antara langkah kita.'}
        </p>
      </div>

      <div className="mt-3 pt-2 border-t border-[#8C4E28]/20 flex items-center justify-between text-xs font-bold text-[#8C4E28]">
        <span className="font-display italic text-[11px] text-[#B53000]">Jejak Cerita</span>
        <span>Hal. {pageNum}</span>
      </div>
    </div>
  );
}

function GallerySingleCard({ memory, pageNum }: { memory: Memory; pageNum: number }) {
  return (
    <div className="h-full flex flex-col justify-between py-2 px-1 sm:px-3 text-[#3E2723]">
      <div className="polaroid-frame p-2 pb-3 rounded-xs border border-[#8C4E28]/20 bg-[#FFFDF8]">
        <div className="relative h-44 sm:h-56 w-full overflow-hidden rounded-xs bg-[#EFE6D5]">
          {memory.image_url ? (
            <Image
              src={memory.image_url}
              alt={memory.title}
              fill
              sizes="(max-width: 768px) 300px, 450px"
              className="object-cover sepia-[0.08]"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center font-display text-sm text-[#8C4E28]">
              Foto Kenangan
            </div>
          )}
        </div>
        <div className="mt-2 text-center">
          <p className="font-display text-sm sm:text-base font-bold italic text-[#4A2614] line-clamp-1">
            {memory.title}
          </p>
          {memory.story && (
            <p className="text-[11px] font-nunito font-semibold text-[#8C4E28] line-clamp-2 mt-0.5">
              {memory.story}
            </p>
          )}
        </div>
      </div>

      <div className="mt-2 pt-2 border-t border-[#8C4E28]/20 flex items-center justify-between text-xs font-bold text-[#8C4E28]">
        <span>Album Potret</span>
        <span>Hal. {pageNum}</span>
      </div>
    </div>
  );
}

function LetterSingleCard({ letter, pageNum }: { letter: Letter; pageNum: number }) {
  return (
    <div className="h-full flex flex-col justify-between py-2 px-1 sm:px-3 text-[#3E2723]">
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="font-display italic text-xs text-[#B53000]">
            {letter.unlock_label || 'Tertulis untukmu'}
          </span>
          <span className="text-[10px] text-[#8C4E28]/80">
            {new Date(letter.created_at).toLocaleDateString('id-ID', { dateStyle: 'medium' })}
          </span>
        </div>

        <h3 className="font-display text-xl sm:text-2xl font-bold text-[#663300] mb-2">
          {letter.title}
        </h3>
        <div className="h-0.5 w-10 bg-[#8C4E28]/30 mb-3" />

        <div className="p-3 rounded-lg bg-[#FAF6EE] border border-[#8C4E28]/20 font-serif text-xs sm:text-sm leading-relaxed text-[#3E2723] whitespace-pre-line max-h-56 sm:max-h-64 overflow-y-auto">
          {letter.body}
        </div>
      </div>

      <div className="mt-3 pt-2 border-t border-[#8C4E28]/20 flex items-center justify-between text-xs font-bold text-[#8C4E28]">
        <span className="font-display italic text-[11px] text-[#B53000]">Surat Kenangan</span>
        <span>Hal. {pageNum}</span>
      </div>
    </div>
  );
}

function CardsSpreadHalf({ cards, pageNum }: { cards: MemoryCard[]; pageNum: number }) {
  const [flippedIds, setFlippedIds] = useState<Record<string, boolean>>({});

  const toggleFlip = (id: string) => {
    setFlippedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="h-full flex flex-col justify-between py-2 px-1 sm:px-3 text-[#3E2723]">
      <div className="space-y-3">
        {cards.map((card) => {
          const isFlipped = Boolean(flippedIds[card.id]);
          return (
            <div
              key={card.id}
              onClick={() => toggleFlip(card.id)}
              className="group cursor-pointer rounded-lg border border-[#D4A325]/40 bg-[#FAF4E6] p-3 shadow-xs transition-all duration-200 hover:border-[#B53000] hover:shadow-md"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#B53000]">
                  {card.card_type || 'Alasan Sayang'}
                </span>
                <span className="text-[10px] font-bold text-[#8C4E28] group-hover:underline">
                  {isFlipped ? 'Tutup ✕' : 'Buka Pesan ✍'}
                </span>
              </div>
              <h4 className="font-display text-base font-bold text-[#663300]">
                {card.title}
              </h4>
              {isFlipped ? (
                <p className="mt-1.5 text-xs font-nunito font-semibold text-[#5A3E2D] leading-relaxed animate-in fade-in">
                  {card.body}
                </p>
              ) : (
                <p className="mt-1 text-xs italic text-[#8C4E28]/70">
                  (Ketuk kartu untuk membaca tulisan rahasia)
                </p>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-3 pt-2 border-t border-[#8C4E28]/20 flex items-center justify-between text-xs font-bold text-[#8C4E28]">
        <span className="font-display italic text-[11px] text-[#B53000]">Kotak Kenangan</span>
        <span>Hal. {pageNum}</span>
      </div>
    </div>
  );
}

function QuizQuestionCard({
  question,
  index,
  pageNum,
  quizScores,
  onAnswerQuiz
}: {
  question: QuizQuestion;
  index: number;
  pageNum: number;
  quizScores: Record<string, string>;
  onAnswerQuiz: (qId: string, ans: 'A' | 'B' | 'C' | 'D') => void;
}) {
  const chosen = quizScores[question.id];
  const isCorrect = chosen === question.correct_option;

  return (
    <div className="h-full flex flex-col justify-between py-2 px-1 sm:px-3 text-[#3E2723]">
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-black uppercase tracking-wider text-[#B53000]">
            Pertanyaan #{index + 1}
          </span>
          {chosen && (
            <span className={`text-xs font-bold px-2 py-0.5 rounded ${isCorrect ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
              {isCorrect ? 'Benar! ♡' : 'Hampir Benar'}
            </span>
          )}
        </div>

        <h3 className="font-display text-lg sm:text-xl font-bold text-[#663300] leading-snug mb-3">
          {question.question}
        </h3>

        <div className="space-y-1.5">
          {(['A', 'B', 'C', 'D'] as const).map((opt) => {
            const key = `option_${opt.toLowerCase()}` as keyof QuizQuestion;
            const text = question[key] as string;
            if (!text) return null;
            const isSelected = chosen === opt;

            return (
              <button
                key={opt}
                onClick={() => onAnswerQuiz(question.id, opt)}
                className={`w-full flex items-center gap-2 p-2 rounded-lg border text-left text-xs sm:text-sm font-semibold transition-all ${
                  isSelected
                    ? isCorrect
                      ? 'border-green-600 bg-green-50 text-green-950 shadow-xs'
                      : 'border-amber-600 bg-amber-50 text-amber-950 shadow-xs'
                    : 'border-[#8C4E28]/25 bg-[#FAF4E6] text-[#3E2723] hover:border-[#8C4E28] hover:bg-[#FFF9EA]'
                }`}
              >
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#8C4E28]/15 text-[11px] font-black text-[#663300]">
                  {opt}
                </span>
                <span className="line-clamp-1">{text}</span>
              </button>
            );
          })}
        </div>

        {chosen && question.feedback && (
          <div className="animate-stamp mt-2.5 p-2 rounded bg-[#FFE8A3] border border-[#8C4E28]/30 text-xs font-bold text-[#663300]">
            <p className="line-clamp-2">✍ {question.feedback}</p>
          </div>
        )}
      </div>

      <div className="mt-3 pt-2 border-t border-[#8C4E28]/20 flex items-center justify-between text-xs font-bold text-[#8C4E28]">
        <span className="font-display italic text-[11px] text-[#B53000]">Teka-teki Cinta</span>
        <span>Hal. {pageNum}</span>
      </div>
    </div>
  );
}

function PlansSpreadHalf({ plans, pageNum }: { plans: Plan[]; pageNum: number }) {
  return (
    <div className="h-full flex flex-col justify-between py-2 px-1 sm:px-3 text-[#3E2723]">
      <div className="space-y-2.5">
        {plans.map((p) => {
          const isDone = p.plan_status === 'tercapai';
          return (
            <div
              key={p.id}
              className="p-2.5 rounded-lg border border-[#8C4E28]/25 bg-[#FAF6EE] flex items-start gap-2"
            >
              <CheckCircle2
                size={16}
                className={`shrink-0 mt-0.5 ${isDone ? 'text-green-600' : 'text-[#8C4E28]/40'}`}
              />
              <div className="min-w-0">
                <h4 className="font-display text-sm font-bold text-[#663300] line-clamp-1">
                  {p.title}
                </h4>
                {p.note && (
                  <p className="text-[11px] font-nunito font-semibold text-[#5A3E2D] line-clamp-2 mt-0.5">
                    {p.note}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-3 pt-2 border-t border-[#8C4E28]/20 flex items-center justify-between text-xs font-bold text-[#8C4E28]">
        <span className="font-display italic text-[11px] text-[#B53000]">Wishlist Bersama</span>
        <span>Hal. {pageNum}</span>
      </div>
    </div>
  );
}

function ChapterClosingCard({ title, note, pageNum }: { title: string; note: string; pageNum: number }) {
  return (
    <div className="h-full flex flex-col justify-between py-2 px-1 sm:px-3 text-[#3E2723] text-center">
      <div className="my-auto">
        <Heart size={20} className="mx-auto text-[#B53000]/60 mb-2" />
        <h4 className="font-display text-lg font-bold text-[#663300]">{title}</h4>
        <div className="mx-auto my-2 h-0.5 w-10 bg-[#8C4E28]/30" />
        <p className="font-display text-xs italic text-[#8C4E28] max-w-xs mx-auto">
          {note}
        </p>
      </div>
      <div className="pt-2 border-t border-[#8C4E28]/20 text-xs font-bold text-[#8C4E28] text-right">
        Hal. {pageNum}
      </div>
    </div>
  );
}

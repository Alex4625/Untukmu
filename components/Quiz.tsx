'use client';

import type { QuizQuestion } from '@/lib/types';
import { useMemo, useState } from 'react';
import { Sparkles, RotateCcw } from 'lucide-react';

export default function Quiz({ questions }: { questions: QuizQuestion[] }) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const current = questions[index];
  const done = questions.length > 0 && Object.keys(answers).length === questions.length;
  const score = useMemo(
    () => questions.filter((q) => answers[q.id] === q.correct_option).length,
    [questions, answers]
  );

  if (!questions.length) {
    return (
      <div className="card mx-auto max-w-lg p-10 text-center">
        <p className="font-display text-xl italic text-ink-muted">
          Belum ada pertanyaan quiz yang disimpan.
        </p>
        <p className="mt-2 text-xs text-ink-muted">
          Admin bisa menambahkan pertanyaan baru melalui panel kelola.
        </p>
      </div>
    );
  }

  if (done) {
    return (
      <div className="card fade-in mx-auto max-w-lg p-8 sm:p-12 text-center">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-paper text-burgundy">
          <Sparkles size={24} className="text-gold" />
        </div>

        <p className="eyebrow">Hasil Cerita</p>
        <h2 className="mt-3 font-display text-5xl sm:text-6xl font-light text-burgundy">
          {score} <span className="text-2xl sm:text-3xl text-ink-muted font-normal">/ {questions.length}</span>
        </h2>

        <div className="mx-auto my-5 sm:my-6 h-px w-14 bg-burgundy/15" />

        <p className="mt-3 font-display text-xl sm:text-2xl italic text-burgundy leading-relaxed">
          {score === questions.length
            ? 'Skormu sempurna. Tentu saja, kamu adalah pemeran utama di seluruh cerita ini.'
            : 'Tidak masalah berapa pun skormu. Yang paling penting, kamu tetap orang paling berharga bagiku.'}
        </p>

        <div className="mt-8">
          <button
            type="button"
            onClick={() => {
              setAnswers({});
              setIndex(0);
            }}
            className="btn-secondary gap-2"
          >
            <RotateCcw size={15} />
            <span>Ulangi Pertanyaan</span>
          </button>
        </div>
      </div>
    );
  }

  const options = [
    { key: 'A' as const, text: current.option_a },
    { key: 'B' as const, text: current.option_b },
    { key: 'C' as const, text: current.option_c },
    { key: 'D' as const, text: current.option_d }
  ];

  return (
    <div className="card fade-in mx-auto max-w-2xl p-6 sm:p-10">
      {/* Progress Header */}
      <div className="flex items-center justify-between border-b border-[rgba(90,40,52,0.10)] pb-4">
        <span className="eyebrow">
          Pertanyaan {index + 1} dari {questions.length}
        </span>
        <span className="font-display text-sm italic text-gold">
          {Math.round(((index + 1) / questions.length) * 100)}% Selesai
        </span>
      </div>

      {/* Question */}
      <h2 className="mt-6 font-display text-2xl sm:text-3xl md:text-4xl font-normal leading-tight text-burgundy">
        {current.question}
      </h2>

      {/* Options */}
      <div className="mt-7 sm:mt-8 grid gap-3">
        {options.map(({ key, text }) => (
          <button
            key={key}
            type="button"
            onClick={() => {
              setAnswers((prev) => ({ ...prev, [current.id]: key }));
              setTimeout(() => setIndex((prev) => Math.min(prev + 1, questions.length - 1)), 250);
            }}
            className="group flex items-center gap-3.5 sm:gap-4 rounded-2xl border border-[rgba(90,40,52,0.09)] bg-white p-3.5 sm:p-4 text-left font-medium text-ink transition-all duration-200 hover:border-dustyrose/50 hover:bg-paper/50 active:scale-[0.99]"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-paper font-display text-sm font-semibold text-burgundy transition group-hover:bg-burgundy group-hover:text-white">
              {key}
            </span>
            <span className="flex-1 text-sm sm:text-[15px] leading-snug">{text}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

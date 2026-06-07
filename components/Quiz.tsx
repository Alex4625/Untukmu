'use client';

import type { QuizQuestion } from '@/lib/types';
import { useMemo, useState } from 'react';

const keys = ['A', 'B', 'C', 'D'] as const;

export default function Quiz({ questions }: { questions: QuizQuestion[] }) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const current = questions[index];
  const done = questions.length > 0 && Object.keys(answers).length === questions.length;
  const score = useMemo(() => questions.filter((q) => answers[q.id] === q.correct_option).length, [questions, answers]);

  if (!questions.length) return <div className="card p-8 text-center text-muted">Belum ada quiz aktif.</div>;

  if (done) {
    return (
      <div className="card mx-auto max-w-2xl p-8 text-center sm:p-12">
        <p className="eyebrow">Hasil Quiz</p>
        <h2 className="mt-3 font-display text-6xl font-light text-maroon">{score}/{questions.length}</h2>
        <p className="mt-5 text-lg leading-8 text-muted">
          {score === questions.length ? 'Skormu sempurna. Tentu saja, kamu pemeran utama di cerita ini.' : 'Tidak apa-apa kalau ada yang salah. Yang penting kamu tetap orang favoritku.'}
        </p>
        <button onClick={() => { setAnswers({}); setIndex(0); }} className="btn-primary mt-7">Ulangi Quiz</button>
      </div>
    );
  }

  const options = [current.option_a, current.option_b, current.option_c, current.option_d];
  return (
    <div className="card mx-auto max-w-3xl p-6 sm:p-10">
      <p className="eyebrow">Pertanyaan {index + 1} dari {questions.length}</p>
      <h2 className="mt-4 font-display text-4xl font-normal leading-tight text-maroon sm:text-5xl">{current.question}</h2>
      <div className="mt-8 grid gap-3">
        {options.map((option, i) => (
          <button key={keys[i]} onClick={() => {
            setAnswers((prev) => ({ ...prev, [current.id]: keys[i] }));
            setTimeout(() => setIndex((prev) => Math.min(prev + 1, questions.length - 1)), 250);
          }} className="rounded-2xl border border-[rgba(196,138,106,0.22)] bg-white p-4 text-left font-medium text-cocoa transition duration-300 hover:border-rose hover:bg-cream/40 active:scale-[0.99]">
            <span className="mr-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-cream text-sm font-semibold text-rose">{keys[i]}</span>
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}

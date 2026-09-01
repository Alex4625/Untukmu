'use client';

import { useState } from 'react';
import type { QuizQuestion } from '@/lib/types';
import { Scene, useReducedMotion } from '@/components/scene';
import { Check, Heart, RotateCcw, HelpCircle } from 'lucide-react';

export function getActiveQuestions(questions: QuizQuestion[]): QuizQuestion[] {
  return [...questions]
    .filter((q) => q.status === 'active' || !q.status)
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
}

function QuestionScene({
  question,
  index,
  total,
  selectedAnswer,
  onSelectAnswer
}: {
  question: QuizQuestion;
  index: number;
  total: number;
  selectedAnswer?: string;
  onSelectAnswer: (key: string) => void;
}) {
  const reducedMotion = useReducedMotion();
  const hasAnswered = Boolean(selectedAnswer);
  const isCorrect = selectedAnswer === question.correct_option;

  const options = [
    { key: 'A', text: question.option_a },
    { key: 'B', text: question.option_b },
    { key: 'C', text: question.option_c },
    { key: 'D', text: question.option_d }
  ];

  // Alternate scene tones for visual rhythm
  const tone = index % 3 === 0 ? 'paper' : index % 3 === 1 ? 'base' : 'ivory';

  return (
    <Scene
      id={`quiz-${question.id}`}
      eyebrow={`Chapter 05 · Pertanyaan ${index + 1} dari ${total}`}
      title={question.question}
      align="center"
      tone={tone}
    >
      <div className="mx-auto mt-8 w-full max-w-2xl">
        {/* Tactile Options Grid (min-h-[54px], touch target >= 44px) */}
        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 sm:gap-4">
          {options.map(({ key, text }) => {
            const isThisSelected = selectedAnswer === key;
            const isThisCorrect = question.correct_option === key;

            // Visual state determination
            let stateClasses =
              'border-2 border-[#8C4E28] bg-[#FFF3CC] text-[#663300] hover:bg-[#FFE8A3] hover:border-[#4A2411]';
            let badgeClasses = 'border border-[#4A2411] bg-gradient-to-b from-[#A05A2C] to-[#7A3C18] text-[#F9EC88]';

            if (hasAnswered) {
              if (isThisCorrect) {
                stateClasses = 'border-2 border-[#4E7C38] bg-[#EAF2DE] text-[#2D5A1E] ring-2 ring-[#4E7C38]/40';
                badgeClasses = 'bg-[#4E7C38] text-white border-none';
              } else if (isThisSelected && !isCorrect) {
                stateClasses = 'border-2 border-[#B53000] bg-[#FCEBE6] text-[#8C2E10]';
                badgeClasses = 'bg-[#B53000] text-white border-none';
              } else {
                stateClasses = 'border border-[#8C4E28]/30 bg-[#FFF3CC]/60 text-[#663300]/60 opacity-60';
                badgeClasses = 'bg-[#8C4E28]/40 text-[#FFF3CC] border-none';
              }
            }

            return (
              <button
                key={key}
                type="button"
                onClick={() => onSelectAnswer(key)}
                className={`group relative flex min-h-[54px] items-center gap-3.5 rounded-xl p-4 text-left font-nunito font-bold transition-all duration-150 active:scale-[0.98] ${stateClasses}`}
                aria-pressed={isThisSelected}
                aria-label={`Pilihan ${key}: ${text}`}
              >
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg font-nunito text-sm font-black transition ${badgeClasses}`}
                >
                  {hasAnswered && isThisCorrect ? <Check size={16} /> : key}
                </span>

                <span className="flex-1 text-sm leading-snug sm:text-base">{text}</span>
              </button>
            );
          })}
        </div>

        {/* Emotional Personal Feedback (reveals upon answering, reduced-motion friendly) */}
        {hasAnswered && (
          <div
            className={`card mt-6 p-5 text-left ${
              reducedMotion ? '' : 'animate-in fade-in duration-200'
            }`}
          >
            <div className="flex items-center gap-2 font-nunito text-xs font-black uppercase tracking-wider text-[#B53000]">
              <Heart size={15} className="fill-[#B53000]/20" />
              <span>{isCorrect ? 'Catatan Hangat' : 'Cerita di Baliknya'}</span>
            </div>

            <p className="mt-2 font-nunito text-sm sm:text-base font-bold leading-relaxed text-[#3E2723]">
              {question.feedback
                ? question.feedback
                : isCorrect
                  ? 'Tepat sekali! Senang rasanya kamu masih mengingat momen kecil ini.'
                  : `Sebenarnya jawabannya adalah opsi ${question.correct_option}, tapi yang paling berharga adalah bagaimana kita melaluinya bersama.`}
            </p>
          </div>
        )}
      </div>
    </Scene>
  );
}

export default function Quiz({ questions }: { questions: QuizQuestion[] }) {
  const activeQuestions = getActiveQuestions(questions);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const total = activeQuestions.length;
  const answeredCount = Object.keys(answers).length;
  const isComplete = total > 0 && answeredCount === total;

  const correctCount = activeQuestions.filter(
    (q) => answers[q.id] === q.correct_option
  ).length;

  if (!total) {
    return (
      <div className="card mx-auto max-w-lg p-10 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-paper text-burgundy shadow-subtle">
          <HelpCircle size={20} className="text-dustyrose" />
        </div>
        <p className="font-display text-2xl italic text-burgundy">
          Belum ada pertanyaan quiz yang disimpan.
        </p>
        <p className="mt-2 text-xs text-ink-muted leading-relaxed">
          Admin bisa menambahkan pertanyaan baru melalui panel kelola.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* 1 Scene per active question, ordered by sort_order (DESIGN.md section 13) */}
      {activeQuestions.map((question, index) => (
        <QuestionScene
          key={question.id}
          question={question}
          index={index}
          total={total}
          selectedAnswer={answers[question.id]}
          onSelectAnswer={(key) => {
            setAnswers((prev) => ({ ...prev, [question.id]: key }));
          }}
        />
      ))}

      {/* Integrated Narrative Conclusion Scene (PDF blueprint: result masuk ke cerita, bukan arcade scorecard) */}
      {isComplete && (
        <Scene
          id="quiz-conclusion"
          eyebrow="Refleksi Akhir · Tentang Kamu"
          title="Bukan Soal Skor, Tapi Cerita Kita"
          align="center"
          tone="paper"
        >
          <div className="card mx-auto mt-6 w-full max-w-lg p-7 text-center shadow-elevated sm:p-10">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-paper text-burgundy shadow-subtle">
              <Heart size={20} className="text-dustyrose fill-dustyrose/20" />
            </div>

            <p className="font-display text-sm italic text-gold">
              {correctCount} dari {total} ingatan selaras
            </p>

            <h3 className="mt-2 font-display text-2xl font-normal text-burgundy sm:text-3xl">
              {correctCount === total
                ? 'Ingatanmu begitu indah dan teliti.'
                : 'Setiap jawabanmu adalah bagian terbaik dari cerita ini.'}
            </h3>

            <div className="mx-auto my-5 h-px w-12 bg-burgundy/15" />

            <p className="font-sans text-sm leading-relaxed text-ink-muted sm:text-base">
              {correctCount === total
                ? 'Kamu mengingat hampir setiap detail kecil dengan begitu rapi. Tentu saja, kamu adalah pemeran utama di seluruh perjalanan ini.'
                : 'Berapa pun ingatan yang persis sama, yang paling berharga adalah bagaimana kita tersenyum saat mengingatnya kembali bersama.'}
            </p>

            <div className="mt-8">
              <button
                type="button"
                onClick={() => setAnswers({})}
                className="btn-secondary gap-2 text-xs sm:text-sm"
              >
                <RotateCcw size={14} />
                <span>Ulangi Pertanyaan</span>
              </button>
            </div>
          </div>
        </Scene>
      )}
    </div>
  );
}

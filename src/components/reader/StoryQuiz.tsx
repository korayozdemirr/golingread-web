"use client";

import React, { useState } from "react";
import { QuizQuestion } from "@/types";

interface StoryQuizProps {
  quizQuestions: QuizQuestion[];
  onCompleteStory: () => void;
}

export const StoryQuiz: React.FC<StoryQuizProps> = ({
  quizQuestions,
  onCompleteStory,
}) => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState<boolean>(false);

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    if (showResults) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const handleCheckAnswers = () => {
    setShowResults(true);
    onCompleteStory();
  };

  const allAnswered = quizQuestions.every((q) => selectedAnswers[q.id] !== undefined);

  let score = 0;
  if (showResults) {
    quizQuestions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctIndex) {
        score++;
      }
    });
  }

  return (
    <section className="mt-12 pt-8 border-t-2 border-dashed border-[#E8E2D6] dark:border-[#2A2B32]">
      <div className="flex items-center gap-2 mb-6">
        <span className="text-xl">🎯</span>
        <h3 className="text-xl font-bold tracking-tight text-[#2A2723] dark:text-[#E6E4DF]">
          Okuduğunu Anlama Kontrolü (Comprehension Check)
        </h3>
      </div>

      <div className="space-y-6">
        {quizQuestions.map((q, qIndex) => {
          const userChoice = selectedAnswers[q.id];
          const isCorrect = userChoice === q.correctIndex;

          return (
            <div
              key={q.id}
              className="p-5 rounded-2xl bg-[#FFFFFF] dark:bg-[#1B1C20] border border-[#E8E2D6] dark:border-[#2A2B32]"
            >
              <h4 className="text-base font-semibold text-[#2A2723] dark:text-[#E6E4DF] mb-4">
                {qIndex + 1}. {q.question}
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-3">
                {q.options.map((option, optIndex) => {
                  const isSelected = userChoice === optIndex;
                  let buttonStyle = "bg-[#F7F4EE] dark:bg-[#25262C] text-[#2A2723] dark:text-[#E6E4DF] border-[#E8E2D6] dark:border-[#2A2B32]";

                  if (showResults) {
                    if (optIndex === q.correctIndex) {
                      buttonStyle = "bg-[#E8F5E9] text-[#1B5E20] border-[#A5D6A7] font-bold dark:bg-[#143820] dark:text-[#81C784] dark:border-[#2E7D32]";
                    } else if (isSelected) {
                      buttonStyle = "bg-[#FFEBEE] text-[#C62828] border-[#FFCDD2] dark:bg-[#3B161B] dark:text-[#E57373] dark:border-[#5E1E26]";
                    }
                  } else if (isSelected) {
                    buttonStyle = "bg-[#2D6A4F] text-white border-[#2D6A4F] dark:bg-[#52B788] dark:text-[#121316]";
                  }

                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => handleSelectOption(q.id, optIndex)}
                      className={`p-3 rounded-xl text-xs sm:text-sm text-left border transition-all cursor-pointer ${buttonStyle}`}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>

              {showResults && (
                <div
                  className={`p-3 rounded-xl text-xs mt-3 ${
                    isCorrect
                      ? "bg-[#E8F5E9] text-[#1B5E20] dark:bg-[#143820] dark:text-[#81C784]"
                      : "bg-[#FFF8E1] text-[#795548] dark:bg-[#3E3211] dark:text-[#FFE082]"
                  }`}
                >
                  <p className="font-semibold mb-0.5">
                    {isCorrect ? "✓ Doğru!" : "✗ Doğru Cevap: " + q.options[q.correctIndex]}
                  </p>
                  <p className="opacity-90">{q.explanation}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        {showResults ? (
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-[#2A2723] dark:text-[#E6E4DF]">
              Skor: {score} / {quizQuestions.length}
            </span>
            <span className="text-xs px-3 py-1 rounded-full bg-[#E8F5E9] text-[#1B5E20] font-bold dark:bg-[#143820] dark:text-[#81C784]">
              ✓ Hikaye Tamamlandı (+1 Okuma İstatistiği)
            </span>
          </div>
        ) : (
          <button
            type="button"
            disabled={!allAnswered}
            onClick={handleCheckAnswers}
            className={`w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-sm transition-all cursor-pointer ${
              allAnswered
                ? "bg-[#2D6A4F] text-white hover:bg-[#245640] dark:bg-[#52B788] dark:text-[#121316] shadow-sm"
                : "bg-[#E8E2D6] dark:bg-[#2A2B32] text-[#6E675F] cursor-not-allowed"
            }`}
          >
            Cevapları Kontrol Et ve Bitir
          </button>
        )}
      </div>
    </section>
  );
};

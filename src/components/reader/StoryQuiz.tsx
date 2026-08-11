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
    <section className="mt-12 pt-8 border-t-2 border-dashed border-[#E5E7EB] dark:border-[#2E2E2E]">
      <div className="flex items-center gap-2 mb-6">
        <span className="text-xl">🎯</span>
        <h3 className="text-xl font-bold tracking-tight text-[#1F2937] dark:text-[#E5E7EB]">
          Comprehension Check
        </h3>
      </div>

      <div className="space-y-6">
        {quizQuestions.map((q, qIndex) => {
          const userChoice = selectedAnswers[q.id];
          const isCorrect = userChoice === q.correctIndex;

          return (
            <div
              key={q.id}
              className="p-5 rounded-2xl bg-white dark:bg-[#1E1E1E] border border-[#E5E7EB] dark:border-[#2E2E2E]"
            >
              <h4 className="text-base font-semibold text-[#1F2937] dark:text-[#E5E7EB] mb-4">
                {qIndex + 1}. {q.question}
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-3">
                {q.options.map((option, optIndex) => {
                  const isSelected = userChoice === optIndex;
                  let buttonStyle = "bg-[#F7F4EE] dark:bg-[#252528] text-[#1F2937] dark:text-[#E5E7EB] border-[#E5E7EB] dark:border-[#2E2E2E]";

                  if (showResults) {
                    if (optIndex === q.correctIndex) {
                      buttonStyle = "bg-emerald-100 text-emerald-800 border-emerald-300 font-bold dark:bg-emerald-950/70 dark:text-emerald-300 dark:border-emerald-800";
                    } else if (isSelected) {
                      buttonStyle = "bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950/70 dark:text-rose-300 dark:border-rose-800";
                    }
                  } else if (isSelected) {
                    buttonStyle = "bg-indigo-600 text-white border-indigo-600 dark:bg-indigo-500";
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
                      ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300"
                      : "bg-amber-50 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300"
                  }`}
                >
                  <p className="font-semibold mb-0.5">
                    {isCorrect ? "✓ Correct!" : "✗ Correct Answer: " + q.options[q.correctIndex]}
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
            <span className="text-sm font-bold text-[#1F2937] dark:text-[#E5E7EB]">
              Score: {score} / {quizQuestions.length}
            </span>
            <span className="text-xs px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold dark:bg-emerald-950/70 dark:text-emerald-300">
              ✓ Story Completed (+1 Reading Stat)
            </span>
          </div>
        ) : (
          <button
            type="button"
            disabled={!allAnswered}
            onClick={handleCheckAnswers}
            className={`w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-sm transition-all cursor-pointer ${
              allAnswered
                ? "bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-500 shadow-xs"
                : "bg-[#E5E7EB] dark:bg-[#2E2E2E] text-[#6B7280] cursor-not-allowed"
            }`}
          >
            Check Answers & Complete
          </button>
        )}
      </div>
    </section>
  );
};

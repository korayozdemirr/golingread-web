"use client";

import React, { useState } from "react";
import { QuizQuestion, ReadingTheme } from "@/types";

interface StoryQuizProps {
  quizQuestions: QuizQuestion[];
  onCompleteStory: () => void;
  readingTheme?: ReadingTheme;
}

export const StoryQuiz: React.FC<StoryQuizProps> = ({
  quizQuestions,
  onCompleteStory,
  readingTheme = "cream",
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

  const quizThemeStyles: Record<
    ReadingTheme,
    {
      headerColor: string;
      cardBg: string;
      cardBorder: string;
      btnBg: string;
      btnText: string;
      btnBorder: string;
      dividerBorder: string;
    }
  > = {
    cream: {
      headerColor: "text-[#111827]",
      cardBg: "bg-white",
      cardBorder: "border-[#E5E7EB]",
      btnBg: "bg-[#FDFBF7] hover:bg-[#F3F4F6]",
      btnText: "text-[#1F2937]",
      btnBorder: "border-[#E5E7EB]",
      dividerBorder: "border-[#E5E7EB]",
    },
    white: {
      headerColor: "text-[#111827]",
      cardBg: "bg-[#FAFAFA]",
      cardBorder: "border-[#E5E7EB]",
      btnBg: "bg-white hover:bg-[#F3F4F6]",
      btnText: "text-[#1F2937]",
      btnBorder: "border-[#E5E7EB]",
      dividerBorder: "border-[#E5E7EB]",
    },
    sepia: {
      headerColor: "text-[#2B2118]",
      cardBg: "bg-[#EFE5CD]",
      cardBorder: "border-[#DECDB2]",
      btnBg: "bg-[#F4ECD8] hover:bg-[#E8DCC4]",
      btnText: "text-[#2B2118]",
      btnBorder: "border-[#DECDB2]",
      dividerBorder: "border-[#DECDB2]",
    },
    dark: {
      headerColor: "text-[#F9FAFB]",
      cardBg: "bg-[#1E1E1E]",
      cardBorder: "border-[#2E2E2E]",
      btnBg: "bg-[#252528] hover:bg-[#2E2E32]",
      btnText: "text-[#E5E7EB]",
      btnBorder: "border-[#2E2E2E]",
      dividerBorder: "border-[#2E2E2E]",
    },
  };

  const theme = quizThemeStyles[readingTheme];

  return (
    <section className={`mt-12 pt-8 border-t-2 border-dashed ${theme.dividerBorder}`}>
      <div className="flex items-center gap-2 mb-6">
        <span className="text-xl">🎯</span>
        <h3 className={`text-xl font-bold tracking-tight ${theme.headerColor}`}>
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
              className={`p-5 rounded-2xl ${theme.cardBg} border ${theme.cardBorder}`}
            >
              <h4 className={`text-base font-semibold ${theme.headerColor} mb-4`}>
                {qIndex + 1}. {q.question}
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-3">
                {q.options.map((option, optIndex) => {
                  const isSelected = userChoice === optIndex;
                  let buttonStyle = `${theme.btnBg} ${theme.btnText} ${theme.btnBorder}`;

                  if (showResults) {
                    if (optIndex === q.correctIndex) {
                      buttonStyle = "bg-emerald-100 text-emerald-900 border-emerald-300 font-bold dark:bg-emerald-950/70 dark:text-emerald-300 dark:border-emerald-800";
                    } else if (isSelected) {
                      buttonStyle = "bg-rose-100 text-rose-900 border-rose-300 dark:bg-rose-950/70 dark:text-rose-300 dark:border-rose-800";
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
                      ? "bg-emerald-50 text-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-300"
                      : "bg-amber-50 text-amber-900 dark:bg-amber-950/50 dark:text-amber-300"
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
            <span className={`text-sm font-bold ${theme.headerColor}`}>
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

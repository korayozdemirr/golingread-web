"use client";

import React, { useState } from "react";
import { CEFRLevel } from "@/types";

interface LevelTestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyLevel: (level: CEFRLevel) => void;
}

interface TestQuestion {
  id: number;
  level: CEFRLevel;
  sentence: string;
  targetWord: string;
  options: string[];
  correctIndex: number;
}

const TEST_QUESTIONS: TestQuestion[] = [
  {
    id: 1,
    level: "A1",
    sentence: "I would like a _____ of fresh water, please.",
    targetWord: "glass",
    options: ["glass", "cloud", "pencil", "clock"],
    correctIndex: 0,
  },
  {
    id: 2,
    level: "A2",
    sentence: "The weather was very _____ so we decided to take an umbrella.",
    targetWord: "rainy",
    options: ["delicious", "rainy", "empty", "friendly"],
    correctIndex: 1,
  },
  {
    id: 3,
    level: "B1",
    sentence: "She was _____ surprised when she heard about the unexpected prize.",
    targetWord: "pleasantly",
    options: ["angrily", "pleasantly", "heavily", "narrowly"],
    correctIndex: 1,
  },
  {
    id: 4,
    level: "B2",
    sentence: "The ancient clock had an _____ arrangement of brass gears.",
    targetWord: "intricate",
    options: ["intricate", "awkward", "shallow", "hostile"],
    correctIndex: 0,
  },
  {
    id: 5,
    level: "C1",
    sentence: "His philosophical essay had a _____ impact on contemporary thought.",
    targetWord: "profound",
    options: ["profound", "fragile", "careless", "shallow"],
    correctIndex: 0,
  },
];

export const LevelTestModal: React.FC<LevelTestModalProps> = ({
  isOpen,
  onClose,
  onApplyLevel,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [resultLevel, setResultLevel] = useState<CEFRLevel | null>(null);

  if (!isOpen) return null;

  const currentQ = TEST_QUESTIONS[currentStep];

  const handleSelectAnswer = (optionIdx: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQ.id]: optionIdx,
    }));
  };

  const handleNext = () => {
    if (currentStep < TEST_QUESTIONS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      // Calculate level
      let correctCount = 0;
      TEST_QUESTIONS.forEach((q) => {
        if (selectedAnswers[q.id] === q.correctIndex) {
          correctCount++;
        }
      });

      let calculatedLevel: CEFRLevel = "A1";
      if (correctCount >= 5) calculatedLevel = "C1";
      else if (correctCount === 4) calculatedLevel = "B2";
      else if (correctCount === 3) calculatedLevel = "B1";
      else if (correctCount === 2) calculatedLevel = "A2";
      else calculatedLevel = "A1";

      setResultLevel(calculatedLevel);
    }
  };

  const handleFinish = () => {
    if (resultLevel) {
      onApplyLevel(resultLevel);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-3xl bg-[#FDFBF7] dark:bg-[#16171B] border border-[#E5E7EB] dark:border-[#2E2E2E] shadow-2xl overflow-hidden p-6 sm:p-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#E5E7EB] dark:border-[#2E2E2E]">
          <div className="flex items-center gap-2">
            <span className="text-xl">🎯</span>
            <h3 className="text-lg font-bold text-[#1F2937] dark:text-[#E5E7EB]">
              Quick CEFR Level Diagnostic
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-bold text-[#6B7280] hover:text-[#1F2937] dark:hover:text-[#E5E7EB]"
          >
            ✕ Close
          </button>
        </div>

        {!resultLevel ? (
          <div>
            {/* Progress */}
            <div className="flex items-center justify-between text-xs text-[#6B7280] dark:text-[#9CA3AF] mb-2 font-semibold">
              <span>Question {currentStep + 1} of {TEST_QUESTIONS.length}</span>
              <span>Target: {currentQ.level} Level</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-[#E5E7EB] dark:bg-[#2E2E2E] mb-6 overflow-hidden">
              <div
                className="h-full bg-indigo-600 dark:bg-indigo-500 transition-all duration-300"
                style={{ width: `${((currentStep + 1) / TEST_QUESTIONS.length) * 100}%` }}
              />
            </div>

            {/* Question sentence */}
            <p className="text-lg font-semibold text-[#1F2937] dark:text-[#E5E7EB] mb-6 font-serif">
              &ldquo;{currentQ.sentence}&rdquo;
            </p>

            {/* Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              {currentQ.options.map((opt, idx) => {
                const isSelected = selectedAnswers[currentQ.id] === idx;
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => handleSelectAnswer(idx)}
                    className={`p-3.5 rounded-xl text-sm font-semibold border transition-all cursor-pointer text-left ${
                      isSelected
                        ? "bg-indigo-600 text-white border-indigo-600 dark:bg-indigo-500 shadow-2xs"
                        : "bg-white dark:bg-[#1E1E1E] text-[#1F2937] dark:text-[#E5E7EB] border-[#E5E7EB] dark:border-[#2E2E2E] hover:bg-[#F9FAFB] dark:hover:bg-[#252528]"
                    }`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              disabled={selectedAnswers[currentQ.id] === undefined}
              onClick={handleNext}
              className={`w-full py-3 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                selectedAnswers[currentQ.id] !== undefined
                  ? "bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-500"
                  : "bg-[#E5E7EB] dark:bg-[#2E2E2E] text-[#6B7280] cursor-not-allowed"
              }`}
            >
              {currentStep === TEST_QUESTIONS.length - 1 ? "Complete Assessment" : "Next Question →"}
            </button>
          </div>
        ) : (
          /* Test Result Screen */
          <div className="text-center py-4">
            <span className="text-5xl block mb-3">🎉</span>
            <span className="text-xs uppercase font-bold tracking-wider text-[#6B7280] dark:text-[#9CA3AF]">
              Your Recommended Level
            </span>
            <h2 className="text-4xl font-extrabold text-indigo-600 dark:text-indigo-400 my-2">
              Level {resultLevel}
            </h2>
            <p className="text-xs sm:text-sm text-[#6B7280] dark:text-[#9CA3AF] max-w-sm mx-auto mb-6">
              Based on the 95% input formula, your stories have been calibrated for <strong>Level {resultLevel}</strong>. Green 95%+ match stories are perfectly suited for your natural acquisition!
            </p>

            <button
              type="button"
              onClick={handleFinish}
              className="w-full py-3.5 rounded-xl bg-indigo-600 text-white dark:bg-indigo-500 font-bold text-sm shadow-md hover:bg-indigo-700 transition-colors cursor-pointer"
            >
              Apply Level & Start Reading
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

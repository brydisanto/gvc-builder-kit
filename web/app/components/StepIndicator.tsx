"use client";

import { motion } from "framer-motion";

const STEP_LABELS = [
  "Start",
  "Name",
  "Pick",
  "Describe",
  "Power-ups",
  "Build!",
];

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export default function StepIndicator({
  currentStep,
  totalSteps,
}: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center gap-2 sm:gap-3">
      {Array.from({ length: totalSteps }, (_, i) => {
        const stepIndex = i + 1;
        const isActive = stepIndex === currentStep;
        const isCompleted = stepIndex < currentStep;

        return (
          <div key={i} className="flex items-center gap-2 sm:gap-3">
            <div className="flex flex-col items-center gap-1.5">
              <motion.div
                className={`
                  relative w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center
                  text-xs font-semibold transition-colors duration-300
                  ${
                    isActive
                      ? "bg-gvc-gold text-gvc-black"
                      : isCompleted
                      ? "bg-gvc-gold/20 text-gvc-gold border border-gvc-gold/40"
                      : "bg-white/5 text-white/30 border border-white/10"
                  }
                `}
                animate={
                  isActive
                    ? {
                        boxShadow: [
                          "0 0 0px rgba(255, 224, 72, 0.3)",
                          "0 0 16px rgba(255, 224, 72, 0.4)",
                          "0 0 0px rgba(255, 224, 72, 0.3)",
                        ],
                      }
                    : {}
                }
                transition={
                  isActive
                    ? { duration: 2, repeat: Infinity, ease: "easeInOut" }
                    : {}
                }
              >
                {isCompleted ? (
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  stepIndex
                )}
              </motion.div>
              <span
                className={`
                  text-[10px] sm:text-xs font-body hidden sm:block
                  ${
                    isActive
                      ? "text-gvc-gold"
                      : isCompleted
                      ? "text-gvc-gold/60"
                      : "text-white/25"
                  }
                `}
              >
                {STEP_LABELS[i]}
              </span>
            </div>

            {i < totalSteps - 1 && (
              <div className="relative w-6 sm:w-10 h-px mb-5 sm:mb-4">
                {/* Background line */}
                <div className="absolute inset-0 bg-white/10" />
                {/* Gold fill that animates */}
                <motion.div
                  className="absolute inset-y-0 left-0 bg-gvc-gold/50"
                  initial={{ width: "0%" }}
                  animate={{ width: isCompleted ? "100%" : "0%" }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

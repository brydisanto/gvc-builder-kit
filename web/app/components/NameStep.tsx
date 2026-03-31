"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ArrowLeft } from "lucide-react";

interface NameStepProps {
  value: string;
  onChange: (value: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function NameStep({
  value,
  onChange,
  onNext,
  onBack,
}: NameStepProps) {
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Focus the input on mount
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  function sanitize(raw: string): string {
    return raw
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9\-_]/g, "");
  }

  function handleChange(raw: string) {
    const clean = sanitize(raw);
    onChange(clean);
    if (error) setError("");
  }

  function handleNext() {
    if (!value.trim()) {
      setError("Give your project a name!");
      return;
    }
    if (!/^[a-z0-9][a-z0-9\-_]*$/.test(value)) {
      setError("Must start with a letter or number");
      return;
    }
    onNext();
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      e.preventDefault();
      handleNext();
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col items-center justify-center min-h-[50vh] px-4 max-w-lg mx-auto w-full"
    >
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="text-3xl sm:text-4xl font-display font-black text-white mb-3 text-center"
      >
        Name your project
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="text-white/40 font-body mb-10 text-center"
      >
        What&apos;s your project called?
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="w-full"
      >
        <div
          className={`
            relative rounded-2xl border transition-all duration-300 gold-underline-focus
            ${
              error
                ? "border-red-500/50 bg-red-500/5"
                : value
                ? "border-gvc-gold/30 bg-gvc-gold/[0.03] border-b-gvc-gold"
                : "border-white/10 bg-white/[0.02]"
            }
          `}
        >
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => handleChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="my-gvc-project"
            className="
              w-full bg-transparent px-6 py-5
              text-xl font-body text-white
              placeholder:text-white/20
              outline-none
              rounded-2xl
            "
            spellCheck={false}
            autoComplete="off"
            autoCapitalize="off"
          />
          {value && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gvc-gold/60 font-mono bg-gvc-gold/10 px-2 py-1 rounded-lg"
            >
              {value.length} chars
            </motion.div>
          )}
        </div>

        {error && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-red-400 text-sm mt-3 ml-2 font-body"
          >
            {error}
          </motion.p>
        )}

        <p className="text-white/25 text-xs mt-3 ml-2 font-body">
          Lowercase, numbers, dashes, and underscores only. Spaces auto-convert
          to dashes.
        </p>
        <p className="text-white/20 text-xs mt-1 ml-2 font-body italic">
          This becomes your project folder name
        </p>
      </motion.div>

      {/* Navigation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.4 }}
        className="flex items-center gap-4 mt-10"
      >
        <button
          onClick={onBack}
          className="
            inline-flex items-center gap-2 px-5 py-3
            text-white/50 font-body text-sm
            rounded-xl border border-white/10
            hover:border-white/20 hover:text-white/70
            transition-all duration-200
          "
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <button
          onClick={handleNext}
          disabled={!value.trim()}
          className="
            inline-flex items-center gap-2 px-6 py-3
            bg-gvc-gold text-gvc-black font-display font-bold
            rounded-xl
            transition-all duration-300
            hover:shadow-[0_0_30px_rgba(255,224,72,0.3)]
            disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:shadow-none
          "
        >
          Continue
          <ArrowRight className="w-4 h-4" />
        </button>
      </motion.div>
    </motion.div>
  );
}

"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Lightbulb } from "lucide-react";

// Same keyword matching rules from the CLI
const SUGGESTION_RULES = [
  {
    keywords: ["nft", "collection", "floor", "listing", "opensea", "mint"],
    addon: "collection-data",
    label: "GVC collection info",
  },
  {
    keywords: ["price", "token", "vibestr", "eth", "pnkstr", "crypto"],
    addon: "token-prices",
    label: "Live token prices",
  },
  {
    keywords: ["wallet", "connect", "web3", "metamask", "ethereum"],
    addon: "web3-wallet",
    label: "Wallet connection",
  },
  {
    keywords: ["track", "stat", "dashboard", "counter", "analytics", "chart"],
    addon: "stats-panel",
    label: "Stats and charts",
  },
  {
    keywords: ["vote", "rank", "leaderboard", "elo", "bracket", "competition"],
    addon: "leaderboard",
    label: "Leaderboard",
  },
  {
    keywords: ["game", "score", "play", "level", "quest", "arcade"],
    addon: "game-engine",
    label: "Game starter kit",
  },
  {
    keywords: ["badge", "collect", "tier", "achievement", "unlock"],
    addon: "badge-collection",
    label: "Badge collection",
  },
  {
    keywords: ["chain", "contract", "balance", "onchain", "on-chain"],
    addon: "on-chain-reads",
    label: "Blockchain data",
  },
  {
    keywords: ["ipfs", "image", "metadata", "pinata"],
    addon: "ipfs-images",
    label: "NFT image loading",
  },
  {
    keywords: ["sound", "audio", "music", "beat", "mix"],
    addon: "audio-mixer",
    label: "Sound and music",
  },
  {
    keywords: ["login", "auth", "session", "sign in", "account"],
    addon: "auth",
    label: "User accounts",
  },
  {
    keywords: ["store", "save", "database", "cache", "persist", "redis"],
    addon: "vercel-kv",
    label: "Save and store data",
  },
];

const EXAMPLE_DESCRIPTIONS = [
  "A page that shows who has been buying the most GVCs lately",
  "A fun voting game where people pick their favorite GVC art",
  "A leaderboard that ranks holders by how many badges they have",
  "A live page showing floor prices and collection stats",
  "A community page where GVC holders share their stories",
];

function getSuggestions(text: string): { addon: string; label: string }[] {
  const lower = text.toLowerCase();
  const results: { addon: string; label: string }[] = [];

  for (const rule of SUGGESTION_RULES) {
    for (const keyword of rule.keywords) {
      if (lower.includes(keyword)) {
        results.push({ addon: rule.addon, label: rule.label });
        break;
      }
    }
  }

  return results;
}

interface DescribeStepProps {
  value: string;
  onChange: (value: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function DescribeStep({
  value,
  onChange,
  onNext,
  onBack,
}: DescribeStepProps) {
  const [error, setError] = useState("");
  const [suggestions, setSuggestions] = useState<
    { addon: string; label: string }[]
  >([]);
  const [exampleIndex, setExampleIndex] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      textareaRef.current?.focus();
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (value.length > 3) {
      setSuggestions(getSuggestions(value));
    } else {
      setSuggestions([]);
    }
  }, [value]);

  // Cycle through example descriptions
  useEffect(() => {
    const interval = setInterval(() => {
      setExampleIndex((prev) => (prev + 1) % EXAMPLE_DESCRIPTIONS.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  function handleNext() {
    if (!value.trim()) {
      setError("Even a short description helps! Just a sentence is fine.");
      return;
    }
    onNext();
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col items-center justify-center px-4 max-w-xl mx-auto w-full"
    >
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="text-3xl sm:text-4xl font-display font-black text-white mb-3 text-center"
      >
        Tell us about your idea
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="text-white/40 font-body mb-2 text-center"
      >
        Just describe it in your own words. A sentence or two is perfect.
      </motion.p>

      {/* Cycling example */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.25, duration: 0.4 }}
        className="mb-8 h-6 flex items-center justify-center"
      >
        <AnimatePresence mode="wait">
          <motion.p
            key={exampleIndex}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="text-white/20 text-sm font-body italic text-center"
          >
            e.g. &quot;{EXAMPLE_DESCRIPTIONS[exampleIndex]}&quot;
          </motion.p>
        </AnimatePresence>
      </motion.div>

      {/* Textarea */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="w-full"
      >
        <div
          className={`
            rounded-2xl border transition-all duration-300
            ${
              error
                ? "border-red-500/50 bg-red-500/5"
                : value
                ? "border-gvc-gold/20 bg-gvc-gold/[0.02]"
                : "border-white/10 bg-white/[0.02]"
            }
          `}
        >
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => {
              onChange(e.target.value);
              if (error) setError("");
            }}
            placeholder="A page that shows my GVC collection with big glowing cards and a leaderboard..."
            rows={4}
            className="
              w-full bg-transparent px-6 py-5
              text-base font-body text-white
              placeholder:text-white/20
              outline-none resize-none
              rounded-2xl leading-relaxed
            "
          />
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
          Don&apos;t overthink it. You can always update this later.
        </p>

        {/* Smart suggestions */}
        <AnimatePresence>
          {suggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-4 overflow-hidden"
            >
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb className="w-3.5 h-3.5 text-gvc-gold/70" />
                <span className="text-xs text-gvc-gold/70 font-body">
                  Based on what you wrote, we think you might want these
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {suggestions.map((s) => (
                  <motion.span
                    key={s.addon}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="inline-flex items-center px-3 py-1.5 rounded-lg bg-gvc-gold/10 border border-gvc-gold/20 text-gvc-gold text-xs font-body"
                  >
                    {s.label}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
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

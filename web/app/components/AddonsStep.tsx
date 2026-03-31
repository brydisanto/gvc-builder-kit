"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ArrowLeft, Sparkles } from "lucide-react";

// Same suggestion rules as CLI
const SUGGESTION_RULES = [
  { keywords: ["nft", "collection", "floor", "listing", "opensea", "mint"], addon: "collection-data" },
  { keywords: ["price", "token", "vibestr", "eth", "pnkstr", "crypto"], addon: "token-prices" },
  { keywords: ["wallet", "connect", "web3", "metamask", "ethereum"], addon: "web3-wallet" },
  { keywords: ["track", "stat", "dashboard", "counter", "analytics", "chart"], addon: "stats-panel" },
  { keywords: ["vote", "rank", "leaderboard", "elo", "bracket", "competition"], addon: "leaderboard" },
  { keywords: ["game", "score", "play", "level", "quest", "arcade"], addon: "game-engine" },
  { keywords: ["badge", "collect", "tier", "achievement", "unlock"], addon: "badge-collection" },
  { keywords: ["chain", "contract", "balance", "onchain", "on-chain"], addon: "on-chain-reads" },
  { keywords: ["ipfs", "image", "metadata", "pinata"], addon: "ipfs-images" },
  { keywords: ["sound", "audio", "music", "beat", "mix"], addon: "audio-mixer" },
  { keywords: ["login", "auth", "session", "sign in", "account"], addon: "auth" },
  { keywords: ["store", "save", "database", "cache", "persist", "redis"], addon: "vercel-kv" },
];

interface AddonDef {
  value: string;
  label: string;
  hint: string;
  category: string;
}

const ADDONS: AddonDef[] = [
  // Blockchain & Data
  { value: "collection-data", label: "GVC Collection data", hint: "Fetch NFT metadata, floor prices", category: "Blockchain & Data" },
  { value: "token-prices", label: "Token prices (ETH, VIBESTR, PNKSTR)", hint: "Live price feeds", category: "Blockchain & Data" },
  { value: "web3-wallet", label: "Web3 wallet connect", hint: "Connect wallet, read address", category: "Blockchain & Data" },
  { value: "on-chain-reads", label: "On-chain reads", hint: "Wallet balances, contract reads", category: "Blockchain & Data" },
  { value: "ipfs-images", label: "IPFS image loading", hint: "Load images from IPFS gateways", category: "Blockchain & Data" },
  // Game & Social
  { value: "game-engine", label: "Game engine scaffold", hint: "Canvas, game loop, sprites", category: "Game & Social" },
  { value: "audio-mixer", label: "Audio mixer (Web Audio API)", hint: "Sounds, music, mixing", category: "Game & Social" },
  { value: "leaderboard", label: "Leaderboard system", hint: "Daily/weekly/all-time rankings", category: "Game & Social" },
  { value: "badge-collection", label: "Badge collection (90 GVC badges)", hint: "Collect, display, tier up", category: "Game & Social" },
  { value: "auth", label: "Auth (edge-compatible sessions)", hint: "Login, sessions, protected pages", category: "Game & Social" },
  // UI Components
  { value: "stats-panel", label: "Animated stats panel", hint: "Counters, charts, dashboards", category: "UI Components" },
  { value: "toasts", label: "Toast notifications", hint: "Alerts, success/error messages", category: "UI Components" },
  { value: "vercel-kv", label: "Vercel KV (Redis) setup", hint: "Key-value storage, caching", category: "UI Components" },
];

function getSuggestedAddons(description: string): Set<string> {
  const lower = description.toLowerCase();
  const suggested = new Set<string>();
  for (const rule of SUGGESTION_RULES) {
    for (const keyword of rule.keywords) {
      if (lower.includes(keyword)) {
        suggested.add(rule.addon);
        break;
      }
    }
  }
  return suggested;
}

interface AddonsStepProps {
  selected: string[];
  onChange: (selected: string[]) => void;
  description: string;
  onNext: () => void;
  onBack: () => void;
}

export default function AddonsStep({
  selected,
  onChange,
  description,
  onNext,
  onBack,
}: AddonsStepProps) {
  const [recommended, setRecommended] = useState<Set<string>>(new Set());

  useEffect(() => {
    const suggestions = getSuggestedAddons(description);
    setRecommended(suggestions);

    // Auto-select recommended addons only on initial mount
    if (selected.length === 0 && suggestions.size > 0) {
      onChange(Array.from(suggestions));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function toggleAddon(addon: string) {
    if (selected.includes(addon)) {
      onChange(selected.filter((s) => s !== addon));
    } else {
      onChange([...selected, addon]);
    }
  }

  const categories = ["Blockchain & Data", "Game & Social", "UI Components"];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col items-center px-4 max-w-2xl mx-auto w-full"
    >
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="text-3xl sm:text-4xl font-display font-black text-white mb-3 text-center"
      >
        Add-ons
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="text-white/40 font-body mb-8 text-center"
      >
        Toggle the extras you want included in your project
      </motion.p>

      {/* Categories */}
      <div className="w-full space-y-6 mb-8">
        {categories.map((category, catIndex) => (
          <motion.div
            key={category}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + catIndex * 0.1, duration: 0.4 }}
          >
            <h3 className="text-sm font-display font-bold text-white/50 uppercase tracking-wider mb-3">
              {category}
            </h3>
            <div className="space-y-2">
              {ADDONS.filter((a) => a.category === category).map((addon) => {
                const isSelected = selected.includes(addon.value);
                const isRecommended = recommended.has(addon.value);

                return (
                  <motion.button
                    key={addon.value}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => toggleAddon(addon.value)}
                    className={`
                      w-full flex items-center gap-4 p-4 rounded-xl border text-left
                      transition-all duration-300
                      ${
                        isSelected
                          ? "border-gvc-gold/30 bg-gvc-gold/[0.05]"
                          : "border-white/[0.06] bg-white/[0.02] hover:border-white/10 hover:bg-white/[0.03]"
                      }
                    `}
                  >
                    {/* Toggle */}
                    <div
                      className={`toggle-track ${isSelected ? "active" : ""}`}
                    >
                      <div className="toggle-thumb" />
                    </div>

                    {/* Label + Hint */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-body font-semibold text-sm transition-colors ${
                            isSelected ? "text-white" : "text-white/70"
                          }`}
                        >
                          {addon.label}
                        </span>
                        {isRecommended && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-gvc-gold/15 text-gvc-gold text-[10px] font-bold uppercase tracking-wide">
                            <Sparkles className="w-2.5 h-2.5" />
                            Recommended
                          </span>
                        )}
                      </div>
                      <p className="text-white/30 text-xs font-body mt-0.5">
                        {addon.hint}
                      </p>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Selected count */}
      <div className="mb-6 text-sm text-white/40 font-body">
        {selected.length === 0
          ? "No add-ons selected (you can always add them later)"
          : `${selected.length} add-on${selected.length === 1 ? "" : "s"} selected`}
      </div>

      {/* Navigation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.4 }}
        className="flex items-center gap-4"
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
          onClick={onNext}
          className="
            inline-flex items-center gap-2 px-6 py-3
            bg-gvc-gold text-gvc-black font-display font-bold
            rounded-xl
            transition-all duration-300
            hover:shadow-[0_0_30px_rgba(255,224,72,0.3)]
          "
        >
          Continue
          <ArrowRight className="w-4 h-4" />
        </button>
      </motion.div>
    </motion.div>
  );
}

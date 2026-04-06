"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Copy,
  Check,
  ExternalLink,
} from "lucide-react";
import Image from "next/image";

// Template label map
const TEMPLATE_LABELS: Record<string, string> = {
  "project-site": "Website / Landing Page",
  dashboard: "Dashboard / Tracker",
  "mini-game": "Game",
  gallery: "Gallery",
  "vote-and-rank": "Vote & Rank",
  "lookup-tool": "Lookup Tool",
  "card-maker": "Card / Image Maker",
  "profile-page": "Profile Page",
  "blank-canvas": "Blank Canvas",
};

// Addon label map
const ADDON_LABELS: Record<string, string> = {
  "collection-data": "GVC Collection info",
  "token-prices": "Live token prices",
  "web3-wallet": "Wallet connection",
  "stats-panel": "Stats and charts",
  leaderboard: "Leaderboard",
  auth: "User accounts",
  "game-engine": "Game starter kit",
  "audio-mixer": "Sound and music",
  toasts: "Pop-up notifications",
  "ipfs-images": "NFT image loading",
  "on-chain-reads": "Blockchain lookups",
  "badge-collection": "Badge collection",
  "vercel-kv": "Save and store data",
};

interface ReadyStepProps {
  projectName: string;
  template: string;
  description: string;
  addons: string[];
  onBack: () => void;
}

export default function ReadyStep({
  projectName,
  template,
  description,
  addons,
  onBack,
}: ReadyStepProps) {
  const [copiedCommand, setCopiedCommand] = useState(false);

  // Build the CLI command
  const buildCommand = useCallback(() => {
    let cmd = `npx create-gvc-app --name ${projectName} --template ${template}`;
    if (addons.length > 0) {
      cmd += ` --addons ${addons.join(",")}`;
    }
    return cmd;
  }, [projectName, template, addons]);

  const command = buildCommand();

  // Build the Claude prompt
  async function copyCommand() {
    try {
      await navigator.clipboard.writeText(command);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = command;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopiedCommand(true);
    setTimeout(() => setCopiedCommand(false), 2500);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col items-center px-4 max-w-2xl mx-auto w-full"
    >
      {/* Shaka icon */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 12 }}
        className="flex items-center gap-4 mb-4"
      >
        <Image
          src="/shaka.png"
          alt="GVC Shaka"
          width={56}
          height={56}
          className="drop-shadow-[0_0_20px_rgba(255,224,72,0.3)]"
        />
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="text-3xl sm:text-4xl font-display font-black text-shimmer mb-3 text-center"
      >
        Your project is ready to build!
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.4 }}
        className="text-white/50 font-body mb-8 text-center text-lg"
      >
        Here is what you picked. Now choose how you want to get started.
      </motion.p>

      {/* Summary card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.4 }}
        className="w-full glass-card snake-border p-6 mb-8"
      >
        <div className="space-y-4 relative z-10">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-white/40 text-xs font-body uppercase tracking-wider mb-1">
                Project
              </p>
              <p className="text-white font-display font-bold text-lg">
                {projectName}
              </p>
            </div>
            <div className="text-right">
              <p className="text-white/40 text-xs font-body uppercase tracking-wider mb-1">
                Template
              </p>
              <p className="text-gvc-gold font-display font-bold">
                {TEMPLATE_LABELS[template] || template}
              </p>
            </div>
          </div>

          <div className="h-px bg-white/[0.06]" />

          <div>
            <p className="text-white/40 text-xs font-body uppercase tracking-wider mb-1">
              Your idea
            </p>
            <p className="text-white/70 text-sm font-body leading-relaxed">
              {description}
            </p>
          </div>

          {addons.length > 0 && (
            <>
              <div className="h-px bg-white/[0.06]" />
              <div>
                <p className="text-white/40 text-xs font-body uppercase tracking-wider mb-2">
                  Extras ({addons.length})
                </p>
                <div className="flex flex-wrap gap-2">
                  {addons.map((addon) => (
                    <span
                      key={addon}
                      className="inline-flex items-center px-3 py-1 rounded-lg bg-gvc-gold/10 border border-gvc-gold/15 text-gvc-gold text-xs font-body"
                    >
                      {ADDON_LABELS[addon] || addon}
                    </span>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </motion.div>

      {/* How to get started */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.4 }}
        className="w-full glass-card snake-border p-6 mb-6"
      >
        <h3 className="text-lg font-display font-bold text-white mb-2">
          How to get started
        </h3>
        <p className="text-white/40 font-body text-sm mb-5">
          Open your terminal and paste these commands one at a time. Your project page will guide you through the rest.
        </p>

        <div className="space-y-4">
          {/* Step 1 */}
          <div className="flex items-start gap-3">
            <span className="flex-shrink-0 w-7 h-7 rounded-full bg-gvc-gold/15 text-gvc-gold text-sm font-bold flex items-center justify-center mt-0.5">
              1
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-white font-body font-semibold text-sm mb-2">
                Create your project
              </p>
              <div className="bg-black/40 rounded-xl p-4 mb-1">
                <code className="text-gvc-green/90 text-sm break-all whitespace-pre-wrap">
                  {command}
                </code>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex items-start gap-3">
            <span className="flex-shrink-0 w-7 h-7 rounded-full bg-gvc-gold/15 text-gvc-gold text-sm font-bold flex items-center justify-center mt-0.5">
              2
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-white font-body font-semibold text-sm mb-2">
                Start it up
              </p>
              <div className="bg-black/40 rounded-xl p-4 space-y-1">
                <code className="text-gvc-green/90 text-sm block">cd {projectName}</code>
                <code className="text-gvc-green/90 text-sm block">npm run dev</code>
              </div>
              <p className="text-white/30 text-xs font-body mt-1.5">
                Then open{" "}
                <span className="text-white/50 font-mono">localhost:3000</span>{" "}
                in your browser.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex items-start gap-3">
            <span className="flex-shrink-0 w-7 h-7 rounded-full bg-gvc-gold/15 text-gvc-gold text-sm font-bold flex items-center justify-center mt-0.5">
              3
            </span>
            <div>
              <p className="text-white font-body font-semibold text-sm">
                Follow the page
              </p>
              <p className="text-white/40 text-sm font-body">
                Your project page walks you through downloading Claude Code, opening your project, and building it. Just follow the steps on screen.
              </p>
            </div>
          </div>
        </div>

        {/* Copy command button */}
        <button
          onClick={copyCommand}
          className={`
            mt-6 w-full inline-flex items-center justify-center gap-2 px-6 py-4
            font-display font-bold text-base rounded-xl
            transition-all duration-300
            ${
              copiedCommand
                ? "bg-gvc-green/20 text-gvc-green border border-gvc-green/30"
                : "bg-gvc-gold text-gvc-black hover:shadow-[0_0_30px_rgba(255,224,72,0.3)]"
            }
          `}
        >
          {copiedCommand ? (
            <>
              <Check className="w-5 h-5" />
              Copied to clipboard!
            </>
          ) : (
            <>
              <Copy className="w-5 h-5" />
              Copy setup command
            </>
          )}
        </button>
      </motion.div>

      {/* What you need */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.4 }}
        className="w-full glass-card p-5 mb-8"
      >
        <p className="text-white/50 text-sm font-body mb-3">
          You will need:
        </p>
        <div className="space-y-2">
          <a
            href="https://nodejs.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-gvc-gold/80 text-sm font-body hover:text-gvc-gold transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Node.js (powers your project)
          </a>
          <a
            href="https://claude.ai/download"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-gvc-gold/80 text-sm font-body hover:text-gvc-gold transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Claude Code (builds your project for you)
          </a>
        </div>
      </motion.div>

      {/* Back button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.4 }}
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
      </motion.div>
    </motion.div>
  );
}

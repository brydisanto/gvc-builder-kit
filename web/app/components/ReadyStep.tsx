"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Copy,
  Check,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import Image from "next/image";

// Template label map
const TEMPLATE_LABELS: Record<string, string> = {
  "project-site": "Project Website",
  tracker: "Tracker",
  "mini-game": "Game",
  gallery: "Gallery",
  "vote-and-rank": "Vote & Rank",
  "community-page": "Community Hub",
  "blog-journal": "Blog / Journal",
  "link-in-bio": "Links Page",
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
  const [copied, setCopied] = useState(false);
  const [terminalHelpOpen, setTerminalHelpOpen] = useState(false);

  // Build the CLI command
  const buildCommand = useCallback(() => {
    let cmd = `npx create-gvc-app --name ${projectName} --template ${template}`;
    if (addons.length > 0) {
      cmd += ` --addons ${addons.join(",")}`;
    }
    return cmd;
  }, [projectName, template, addons]);

  const command = buildCommand();

  async function copyCommand() {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement("textarea");
      textarea.value = command;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
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
        Here is a summary of what you picked, and how to create it.
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

      {/* Step-by-step instructions */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.4 }}
        className="w-full glass-card p-6 mb-6"
      >
        <h3 className="text-white font-display font-bold text-base mb-5">
          How to create your project
        </h3>
        <div className="space-y-5">
          {/* Step 1 */}
          <div className="flex items-start gap-4">
            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gvc-gold/15 text-gvc-gold text-sm font-bold flex items-center justify-center mt-0.5">
              1
            </span>
            <div>
              <p className="text-white font-body font-semibold text-sm mb-1">
                Open your terminal
              </p>
              <p className="text-white/50 text-sm font-body leading-relaxed">
                On Mac, press <kbd className="inline-block px-1.5 py-0.5 rounded bg-white/10 text-white/70 font-mono text-xs mx-0.5">Cmd + Space</kbd> and type <span className="text-white/70">Terminal</span>, then press Enter.
              </p>
              <p className="text-white/50 text-sm font-body leading-relaxed mt-1">
                On Windows, press the <kbd className="inline-block px-1.5 py-0.5 rounded bg-white/10 text-white/70 font-mono text-xs mx-0.5">Windows</kbd> key and type <span className="text-white/70">cmd</span>, then press Enter.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex items-start gap-4">
            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gvc-gold/15 text-gvc-gold text-sm font-bold flex items-center justify-center mt-0.5">
              2
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-white font-body font-semibold text-sm mb-2">
                Copy this command
              </p>
              <div className="code-block p-4 relative group">
                <code className="text-gvc-green/90 text-sm break-all whitespace-pre-wrap">
                  {command}
                </code>
              </div>
              <button
                onClick={copyCommand}
                className={`
                  mt-3 inline-flex items-center gap-2 px-5 py-2.5
                  font-display font-bold text-sm rounded-xl
                  transition-all duration-300
                  ${
                    copied
                      ? "bg-gvc-green/20 text-gvc-green border border-gvc-green/30"
                      : "bg-gvc-gold text-gvc-black hover:shadow-[0_0_30px_rgba(255,224,72,0.3)]"
                  }
                `}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    Copied to clipboard!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy command
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex items-start gap-4">
            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gvc-gold/15 text-gvc-gold text-sm font-bold flex items-center justify-center mt-0.5">
              3
            </span>
            <div>
              <p className="text-white font-body font-semibold text-sm mb-1">
                Paste it in your terminal and press Enter
              </p>
              <p className="text-white/50 text-sm font-body leading-relaxed">
                Right-click in the terminal window to paste, or press <kbd className="inline-block px-1.5 py-0.5 rounded bg-white/10 text-white/70 font-mono text-xs mx-0.5">Cmd + V</kbd> on Mac or <kbd className="inline-block px-1.5 py-0.5 rounded bg-white/10 text-white/70 font-mono text-xs mx-0.5">Ctrl + V</kbd> on Windows.
              </p>
            </div>
          </div>

          {/* Step 4 */}
          <div className="flex items-start gap-4">
            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gvc-gold/15 text-gvc-gold text-sm font-bold flex items-center justify-center mt-0.5">
              4
            </span>
            <div>
              <p className="text-white font-body font-semibold text-sm mb-1">
                Follow the prompts
              </p>
              <p className="text-white/50 text-sm font-body leading-relaxed">
                The tool will walk you through the rest. It will set everything up and tell you how to see your new project.
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* What's a terminal? expandable section */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.65, duration: 0.4 }}
        className="w-full mb-6"
      >
        <button
          onClick={() => setTerminalHelpOpen(!terminalHelpOpen)}
          className="w-full flex items-center justify-between px-5 py-4 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:border-white/10 hover:bg-white/[0.03] transition-all duration-200"
        >
          <span className="text-white/60 font-body text-sm font-semibold">
            What is a terminal?
          </span>
          {terminalHelpOpen ? (
            <ChevronUp className="w-4 h-4 text-white/40" />
          ) : (
            <ChevronDown className="w-4 h-4 text-white/40" />
          )}
        </button>

        <AnimatePresence>
          {terminalHelpOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="px-5 py-4 border border-t-0 border-white/[0.06] rounded-b-xl bg-white/[0.02]">
                <p className="text-white/50 text-sm font-body leading-relaxed mb-3">
                  A terminal is a text-based app that comes built into every computer. You type commands into it instead of clicking buttons. It might sound intimidating, but you only need to do two things: paste the command above and press Enter. That is it.
                </p>
                <p className="text-white/50 text-sm font-body leading-relaxed mb-3">
                  On a Mac, it is called <span className="text-white/70 font-semibold">Terminal</span> and you can find it by pressing <kbd className="inline-block px-1.5 py-0.5 rounded bg-white/10 text-white/70 font-mono text-xs mx-0.5">Cmd + Space</kbd> and typing &ldquo;Terminal&rdquo;.
                </p>
                <p className="text-white/50 text-sm font-body leading-relaxed">
                  On Windows, it is called <span className="text-white/70 font-semibold">Command Prompt</span>. Press the <kbd className="inline-block px-1.5 py-0.5 rounded bg-white/10 text-white/70 font-mono text-xs mx-0.5">Windows</kbd> key and type &ldquo;cmd&rdquo; to find it.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Prerequisites */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.4 }}
        className="w-full glass-card p-5 mb-8"
      >
        <p className="text-white/50 text-sm font-body mb-3">
          Before you start, make sure you have these installed:
        </p>
        <div className="space-y-2">
          <a
            href="https://nodejs.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-gvc-gold/80 text-sm font-body hover:text-gvc-gold transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Node.js (needed to run the command above)
          </a>
          <a
            href="https://docs.anthropic.com/en/docs/claude-code/overview"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-gvc-gold/80 text-sm font-body hover:text-gvc-gold transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Claude Code (your AI coding assistant, optional but recommended)
          </a>
        </div>
      </motion.div>

      {/* Navigation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.4 }}
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
          onClick={copyCommand}
          className={`
            inline-flex items-center gap-2 px-6 py-3
            font-display font-bold rounded-xl
            transition-all duration-300
            ${
              copied
                ? "bg-gvc-green/20 text-gvc-green border border-gvc-green/30"
                : "bg-gvc-gold text-gvc-black hover:shadow-[0_0_30px_rgba(255,224,72,0.3)]"
            }
          `}
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              Copy command
            </>
          )}
        </button>
      </motion.div>
    </motion.div>
  );
}

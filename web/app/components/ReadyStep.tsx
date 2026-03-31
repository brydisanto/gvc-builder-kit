"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Copy,
  Check,
  ExternalLink,
  Terminal,
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
  "collection-data": "GVC Collection data",
  "token-prices": "Token prices",
  "web3-wallet": "Web3 wallet connect",
  "stats-panel": "Animated stats panel",
  leaderboard: "Leaderboard system",
  auth: "Auth sessions",
  "game-engine": "Game engine scaffold",
  "audio-mixer": "Audio mixer",
  toasts: "Toast notifications",
  "ipfs-images": "IPFS image loading",
  "on-chain-reads": "On-chain reads",
  "badge-collection": "Badge collection",
  "vercel-kv": "Vercel KV storage",
};

interface ReadyStepProps {
  projectName: string;
  template: string;
  description: string;
  addons: string[];
  onBack: () => void;
}

function ConfettiEffect() {
  const [particles, setParticles] = useState<
    { id: number; x: number; color: string; delay: number; size: number }[]
  >([]);

  useEffect(() => {
    const colors = ["#FFE048", "#fff8b8", "#FF6B9D", "#FF5F1F", "#2EFF2E"];
    const newParticles = Array.from({ length: 40 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      color: colors[Math.floor(Math.random() * colors.length)],
      delay: Math.random() * 1.5,
      size: 4 + Math.random() * 6,
    }));
    setParticles(newParticles);

    // Clean up after animation
    const timer = setTimeout(() => setParticles([]), 4000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {particles.map((p) => (
        <div
          key={p.id}
          className="confetti-particle"
          style={{
            left: `${p.x}%`,
            top: "-10px",
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.color,
            borderRadius: Math.random() > 0.5 ? "50%" : "2px",
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </>
  );
}

export default function ReadyStep({
  projectName,
  template,
  description,
  addons,
  onBack,
}: ReadyStepProps) {
  const [copied, setCopied] = useState(false);
  const [showConfetti, setShowConfetti] = useState(true);

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

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col items-center px-4 max-w-2xl mx-auto w-full"
    >
      {showConfetti && <ConfettiEffect />}

      {/* Celebration: Shaka + text */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 12 }}
        className="flex items-center gap-4 mb-6"
      >
        <Image
          src="/shaka.png"
          alt="GVC Shaka"
          width={64}
          height={64}
          className="wiggle-infinite drop-shadow-[0_0_20px_rgba(255,224,72,0.3)]"
        />
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="text-3xl sm:text-4xl font-display font-black text-shimmer mb-3 text-center"
      >
        Ready to build!
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.4 }}
        className="text-white/50 font-body mb-8 text-center text-lg"
      >
        You&apos;re about to ship something. Let&apos;s go.
      </motion.p>

      {/* Summary card with snake border */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.4 }}
        className="w-full glass-card snake-border p-6 mb-6"
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
              Description
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
                  Power-ups ({addons.length})
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

      {/* Command block */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.4 }}
        className="w-full mb-6"
      >
        <div className="flex items-center gap-2 mb-2">
          <Terminal className="w-3.5 h-3.5 text-white/40" />
          <span className="text-xs text-white/40 font-body">
            Run this command in your terminal
          </span>
        </div>
        <div className="code-block p-5 relative group">
          <code className="text-gvc-green/90 text-sm break-all whitespace-pre-wrap">
            {command}
          </code>
          <button
            onClick={copyCommand}
            className={`
              absolute top-3 right-3 p-2 rounded-lg
              transition-all duration-300
              ${
                copied
                  ? "bg-gvc-green/20 text-gvc-green"
                  : "bg-white/5 text-white/40 opacity-0 group-hover:opacity-100 hover:bg-white/10 hover:text-white/70"
              }
            `}
          >
            {copied ? (
              <Check className="w-4 h-4" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
        </div>
        {copied && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-gvc-green text-xs mt-2 ml-2 font-body"
          >
            Copied to clipboard!
          </motion.p>
        )}
      </motion.div>

      {/* What's next? */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.65, duration: 0.4 }}
        className="w-full glass-card p-5 mb-6"
      >
        <h3 className="text-white font-display font-bold text-sm mb-4">
          What&apos;s next?
        </h3>
        <div className="space-y-3">
          {[
            { num: "1", text: "Open your terminal and paste the command above" },
            { num: "2", text: "Run gvc dev to see your project" },
            { num: "3", text: "Open it in Claude and tell it what you want to change" },
          ].map((step) => (
            <div key={step.num} className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gvc-gold/15 text-gvc-gold text-xs font-bold flex items-center justify-center mt-0.5">
                {step.num}
              </span>
              <p className="text-white/60 text-sm font-body">
                {step.num === "2" ? (
                  <>Run <code className="text-gvc-gold/70 font-mono text-xs bg-gvc-gold/10 px-1.5 py-0.5 rounded">gvc dev</code> to see your project</>
                ) : (
                  step.text
                )}
              </p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Help links */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.4 }}
        className="w-full glass-card p-5 mb-8"
      >
        <p className="text-white/50 text-sm font-body mb-3">
          New to coding? No worries.
        </p>
        <div className="space-y-2">
          <a
            href="https://docs.anthropic.com/en/docs/claude-code/overview"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-gvc-gold/80 text-sm font-body hover:text-gvc-gold transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Install Claude Code (your AI coding assistant)
          </a>
          <a
            href="https://nodejs.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-gvc-gold/80 text-sm font-body hover:text-gvc-gold transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Install Node.js (required to run the command)
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
          className="
            inline-flex items-center gap-2 px-6 py-3
            bg-gvc-gold text-gvc-black font-display font-bold
            rounded-xl
            transition-all duration-300
            hover:shadow-[0_0_30px_rgba(255,224,72,0.3)]
          "
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              Copy Command
            </>
          )}
        </button>
      </motion.div>
    </motion.div>
  );
}

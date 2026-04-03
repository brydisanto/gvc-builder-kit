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
  MessageSquare,
  TerminalSquare,
} from "lucide-react";
import Image from "next/image";

// Template label map
const TEMPLATE_LABELS: Record<string, string> = {
  "project-site": "Project Website",
  tracker: "Tracker / Dashboard",
  "mini-game": "Game",
  gallery: "Gallery",
  "vote-and-rank": "Vote & Rank",
  "badge-wallet-tool": "Badge / Wallet Lookup",
  "rarity-checker": "Rarity / Price Checker",
  leaderboard: "Community Leaderboard",
  "sweep-tracker": "Sweep / Floor Tracker",
  "card-maker": "Card / Image Maker",
  "profile-page": "Personal GVC Profile",
  "blank-canvas": "Blank Canvas",
};

// Template build instructions for Claude
const TEMPLATE_INSTRUCTIONS: Record<string, string> = {
  "project-site":
    "Build a landing page with: hero section with gold shimmer title, about section, features grid (3 columns), CTA section, footer with social links.",
  tracker:
    "Build a dashboard with: stats panel showing 3-4 key metrics with animated counters, a data table or card grid for tracked items, auto-refresh every 60 seconds.",
  "mini-game":
    "Build a browser game with: a game board or play area, score display, moves/lives counter, game-over screen with final score, and a restart button.",
  gallery:
    "Build a gallery page with: responsive image grid (3 columns desktop, 2 mobile) with gold glow cards on hover, filtering or search, and an upload/submit form.",
  "vote-and-rank":
    "Build a voting page with: 1v1 card matchups where users pick a winner, a results leaderboard sorted by wins, keyboard shortcuts for fast voting.",
  "badge-wallet-tool":
    "Build a wallet lookup tool with: an input field where users paste an Ethereum address, a results section showing their GVC NFTs, earned badges with tier glow effects, and holder stats. Use getBadgeLeaderboard() and resolveWallet() from lib/gvc-api.ts.",
  "rarity-checker":
    "Build a token lookup tool with: an input field for GVC token ID, a display showing the NFT image, all traits, rarity rank, and recent sales history. Use badge-definitions.json to show which badges that token qualifies for.",
  leaderboard:
    "Build a community leaderboard with: a ranked table of holders sorted by token count or badge count, tabs for different views, and wallet identity resolution showing ENS names. Use getHolders() and getBadgeLeaderboard() from lib/gvc-api.ts.",
  "sweep-tracker":
    "Build a floor/sweep tracker with: a stats panel showing current floor price, 24h volume, and total listings, a live feed of recent sales, and a chart showing floor price history. Use getStats(), getRecentSales(), and getSalesHistory() from lib/gvc-api.ts.",
  "card-maker":
    "Build a shareable image maker with: a canvas area where users can pick a background, overlay GVC character images or badge icons, add custom text with Brice/Mundial fonts, and download as PNG. Include preset templates like profile cards and badge flex cards.",
  "profile-page":
    "Build a personal GVC profile page with: wallet connect button, a grid showing owned GVCs, earned badges with tier glow effects, holder stats, and a shareable URL. Use getBadgeLeaderboard() and getHolders() from lib/gvc-api.ts.",
  "blank-canvas":
    "This is a blank start with the GVC brand system. Help me build whatever I describe.",
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
  const [copiedClaude, setCopiedClaude] = useState(false);
  const [terminalHelpOpen, setTerminalHelpOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"claude" | "terminal">("claude");

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
  const buildClaudePrompt = useCallback(() => {
    const templateLabel = TEMPLATE_LABELS[template] || template;
    const instruction = TEMPLATE_INSTRUCTIONS[template] || "";
    const addonList = addons
      .map((a) => ADDON_LABELS[a] || a)
      .join(", ");

    const prompt = `I want to build a project called "${projectName}" for the Good Vibes Club (GVC) community.

Here is what I want to build:
${description}

Starting point: ${templateLabel}
${instruction}

${addonList ? `I also want these features: ${addonList}` : ""}

Please use the GVC brand system:
- Colors: Gold #FFE048 (primary), Black #050505 (background), Dark #121212 (cards), Gray #1F1F1F (borders)
- Typography: Brice font for headlines (bold, premium feel), Mundial font for body text
- Design: Dark backgrounds, gold accents, rounded corners, gold glow effects on hover, generous whitespace
- Animations: Use Framer Motion for entrance animations, shimmer effect on key headlines
- Tech: Next.js with App Router, TypeScript, Tailwind CSS, Framer Motion

Smart Contract and API Reference:
- GVC NFT Contract: 0xB8Ea78fcaCEf50d41375E44E6814ebbA36Bb33c4
- VIBESTR Token: 0xd0cC2b0eFb168bFe1f94a948D8df70FA10257196
- OpenSea Collection Slug: good-vibes-club
- OpenSea API: https://api.opensea.io/api/v2
- ETH Price: https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd
- VIBESTR Price: https://api.dexscreener.com/latest/dex/tokens/0xd0cC2b0eFb168bFe1f94a948D8df70FA10257196
- Public RPC: https://ethereum-rpc.publicnode.com

Help me set up the project and start building. Walk me through each step.`;

    return prompt;
  }, [projectName, template, description, addons]);

  async function copyCommand() {
    try {
      await navigator.clipboard.writeText(command);
      setCopiedCommand(true);
      setTimeout(() => setCopiedCommand(false), 2500);
    } catch {
      fallbackCopy(command);
      setCopiedCommand(true);
      setTimeout(() => setCopiedCommand(false), 2500);
    }
  }

  async function copyClaudePrompt() {
    const prompt = buildClaudePrompt();
    try {
      await navigator.clipboard.writeText(prompt);
      setCopiedClaude(true);
      setTimeout(() => setCopiedClaude(false), 2500);
    } catch {
      fallbackCopy(prompt);
      setCopiedClaude(true);
      setTimeout(() => setCopiedClaude(false), 2500);
    }
  }

  async function openInClaude() {
    await copyClaudePrompt();
    // Small delay so the copy completes before the tab switch
    setTimeout(() => {
      window.open("https://claude.ai/new", "_blank");
    }, 300);
  }

  function fallbackCopy(text: string) {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
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

      {/* Two paths: tabs */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.4 }}
        className="w-full mb-6"
      >
        {/* Tab switcher */}
        <div className="flex rounded-xl overflow-hidden border border-white/[0.08] mb-0">
          <button
            onClick={() => setActiveTab("claude")}
            className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-display font-bold transition-all duration-200 ${
              activeTab === "claude"
                ? "bg-gvc-gold/15 text-gvc-gold border-b-2 border-gvc-gold"
                : "bg-white/[0.02] text-white/40 hover:text-white/60 border-b-2 border-transparent"
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            Open in Claude
          </button>
          <button
            onClick={() => setActiveTab("terminal")}
            className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-display font-bold transition-all duration-200 ${
              activeTab === "terminal"
                ? "bg-gvc-gold/15 text-gvc-gold border-b-2 border-gvc-gold"
                : "bg-white/[0.02] text-white/40 hover:text-white/60 border-b-2 border-transparent"
            }`}
          >
            <TerminalSquare className="w-4 h-4" />
            Use your terminal
          </button>
        </div>

        {/* Claude tab */}
        <AnimatePresence mode="wait">
          {activeTab === "claude" && (
            <motion.div
              key="claude-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="glass-card rounded-t-none p-6"
            >
              <p className="text-white/60 font-body text-sm mb-5 leading-relaxed">
                The easiest way to get started. We will copy your project details to your clipboard,
                then open Claude in a new tab. Just paste it in and Claude will help you build everything step by step.
              </p>

              <div className="space-y-4">
                {/* Step 1 */}
                <div className="flex items-start gap-4">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gvc-gold/15 text-gvc-gold text-sm font-bold flex items-center justify-center mt-0.5">
                    1
                  </span>
                  <div>
                    <p className="text-white font-body font-semibold text-sm">
                      Click the button below
                    </p>
                    <p className="text-white/40 text-sm font-body">
                      It copies your project details and opens Claude in a new tab.
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex items-start gap-4">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gvc-gold/15 text-gvc-gold text-sm font-bold flex items-center justify-center mt-0.5">
                    2
                  </span>
                  <div>
                    <p className="text-white font-body font-semibold text-sm">
                      Paste into Claude
                    </p>
                    <p className="text-white/40 text-sm font-body">
                      Press{" "}
                      <kbd className="inline-block px-1.5 py-0.5 rounded bg-white/10 text-white/70 font-mono text-xs mx-0.5">
                        Cmd + V
                      </kbd>{" "}
                      on Mac or{" "}
                      <kbd className="inline-block px-1.5 py-0.5 rounded bg-white/10 text-white/70 font-mono text-xs mx-0.5">
                        Ctrl + V
                      </kbd>{" "}
                      on Windows, then press Enter.
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex items-start gap-4">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gvc-gold/15 text-gvc-gold text-sm font-bold flex items-center justify-center mt-0.5">
                    3
                  </span>
                  <div>
                    <p className="text-white font-body font-semibold text-sm">
                      Claude takes it from there
                    </p>
                    <p className="text-white/40 text-sm font-body">
                      It already knows the GVC brand, your idea, and what features you want. Just tell it what to do in plain English.
                    </p>
                  </div>
                </div>
              </div>

              {/* Open in Claude button */}
              <button
                onClick={openInClaude}
                className={`
                  mt-6 w-full inline-flex items-center justify-center gap-3 px-6 py-4
                  font-display font-bold text-base rounded-xl
                  transition-all duration-300
                  ${
                    copiedClaude
                      ? "bg-gvc-green/20 text-gvc-green border border-gvc-green/30"
                      : "bg-gvc-gold text-gvc-black hover:shadow-[0_0_30px_rgba(255,224,72,0.3)]"
                  }
                `}
              >
                {copiedClaude ? (
                  <>
                    <Check className="w-5 h-5" />
                    Copied! Opening Claude...
                  </>
                ) : (
                  <>
                    <MessageSquare className="w-5 h-5" />
                    Open in Claude
                    <ExternalLink className="w-4 h-4 opacity-60" />
                  </>
                )}
              </button>

              <p className="text-white/30 text-xs font-body text-center mt-3">
                Opens claude.ai in a new tab with your project details on your clipboard.
              </p>
            </motion.div>
          )}

          {/* Terminal tab */}
          {activeTab === "terminal" && (
            <motion.div
              key="terminal-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="glass-card rounded-t-none p-6"
            >
              <p className="text-white/60 font-body text-sm mb-5 leading-relaxed">
                For people comfortable with a terminal. Copy the command below, paste it in, and the CLI walks you through everything.
              </p>

              <div className="space-y-4">
                {/* Step 1 */}
                <div className="flex items-start gap-4">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gvc-gold/15 text-gvc-gold text-sm font-bold flex items-center justify-center mt-0.5">
                    1
                  </span>
                  <div>
                    <p className="text-white font-body font-semibold text-sm mb-1">
                      Open your terminal
                    </p>
                    <p className="text-white/40 text-sm font-body">
                      On Mac, press{" "}
                      <kbd className="inline-block px-1.5 py-0.5 rounded bg-white/10 text-white/70 font-mono text-xs mx-0.5">
                        Cmd + Space
                      </kbd>{" "}
                      and type <span className="text-white/60">Terminal</span>.
                      On Windows, press the{" "}
                      <kbd className="inline-block px-1.5 py-0.5 rounded bg-white/10 text-white/70 font-mono text-xs mx-0.5">
                        Windows
                      </kbd>{" "}
                      key and type <span className="text-white/60">cmd</span>.
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
                      Copy and paste this command
                    </p>
                    <div className="code-block p-4">
                      <code className="text-gvc-green/90 text-sm break-all whitespace-pre-wrap">
                        {command}
                      </code>
                    </div>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex items-start gap-4">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gvc-gold/15 text-gvc-gold text-sm font-bold flex items-center justify-center mt-0.5">
                    3
                  </span>
                  <div>
                    <p className="text-white font-body font-semibold text-sm">
                      Press Enter and follow the prompts
                    </p>
                    <p className="text-white/40 text-sm font-body">
                      The tool sets everything up and tells you how to see your new project.
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
                    Copy command
                  </>
                )}
              </button>

              {/* What's a terminal? */}
              <div className="mt-4">
                <button
                  onClick={() => setTerminalHelpOpen(!terminalHelpOpen)}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:border-white/10 hover:bg-white/[0.03] transition-all duration-200"
                >
                  <span className="text-white/50 font-body text-xs">
                    What is a terminal?
                  </span>
                  {terminalHelpOpen ? (
                    <ChevronUp className="w-3.5 h-3.5 text-white/40" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5 text-white/40" />
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
                      <div className="px-4 py-3 border border-t-0 border-white/[0.06] rounded-b-xl bg-white/[0.02]">
                        <p className="text-white/40 text-xs font-body leading-relaxed">
                          A terminal is a text-based app built into every computer.
                          You type commands instead of clicking buttons.
                          You only need to do two things: paste the command above and press Enter.
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
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
          You will also need:
        </p>
        <div className="space-y-2">
          <a
            href="https://claude.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-gvc-gold/80 text-sm font-body hover:text-gvc-gold transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            A Claude account (free to sign up)
          </a>
          <a
            href="https://nodejs.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-gvc-gold/80 text-sm font-body hover:text-gvc-gold transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Node.js (needed for the terminal option)
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

#!/usr/bin/env node

import * as p from "@clack/prompts";
import pc from "picocolors";
import fs from "fs-extra";
import path from "path";
import { execSync } from "child_process";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const TEMPLATES_DIR = path.join(__dirname, "..", "templates");

// ── Brand colors (terminal approximations) ──────────────────────────
const gold = (text) => pc.yellow(text);
const brand = (text) => pc.bold(pc.yellow(text));
const dim = (text) => pc.dim(text);
const success = (text) => pc.green(text);
const info = (text) => pc.cyan(text);

// ── ASCII header ─────────────────────────────────────────────────────
function showHeader() {
  console.log();
  console.log(
    gold(`   ██████╗ ██╗   ██╗ ██████╗
  ██╔════╝ ██║   ██║██╔════╝
  ██║  ███╗██║   ██║██║
  ██║   ██║╚██╗ ██╔╝██║
  ╚██████╔╝ ╚████╔╝ ╚██████╗
   ╚═════╝   ╚═══╝   ╚═════╝`)
  );
  console.log();
  console.log(brand("  GVC BUILDER KIT"));
  console.log(dim("  ─────────────────────────────────"));
  console.log(dim("  Build something cool for the Good Vibes Club"));
  console.log();
}

// ── Preflight checks ─────────────────────────────────────────────────
function checkNodeVersion() {
  const major = parseInt(process.version.slice(1).split(".")[0], 10);
  if (major < 18) {
    console.log();
    console.log(
      pc.red("  Heads up! You need Node.js 18 or newer to use the GVC Builder Kit.")
    );
    console.log();
    console.log(
      `  Your current version is ${pc.bold(process.version)}.`
    );
    console.log();
    console.log(
      `  Grab the latest version here: ${info("https://nodejs.org")}`
    );
    console.log();
    process.exit(1);
  }
}

function checkClaudeCLI() {
  try {
    execSync("which claude", { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

// ── Template types ───────────────────────────────────────────────────
const TEMPLATE_CHOICES = [
  {
    value: "blank-canvas",
    label: "I have my own idea (blank start)",
    hint: "just the brand system, ready for anything",
  },
  {
    value: "project-site",
    label: "A website for my project",
    hint: "landing page, about section, features, CTA",
  },
  {
    value: "tracker",
    label: "A tracker or dashboard",
    hint: "stats cards, charts, live data, auto-refresh",
  },
  {
    value: "mini-game",
    label: "A game or interactive experience",
    hint: "game board, scoring, leaderboard",
  },
  {
    value: "gallery",
    label: "A place to show off my collection",
    hint: "image grid with glow cards, filtering, uploads",
  },
  {
    value: "vote-and-rank",
    label: "A voting or ranking page",
    hint: "1v1 matchups, polls, leaderboard, results",
  },
  {
    value: "badge-wallet-tool",
    label: "A badge or wallet lookup tool",
    hint: "paste a wallet, see badges, holdings, stats",
  },
  {
    value: "rarity-checker",
    label: "A rarity or price checker",
    hint: "look up any GVC by token ID, traits, rank, sales",
  },
  {
    value: "leaderboard",
    label: "A community leaderboard",
    hint: "top holders, sweepers, badge counts, activity",
  },
  {
    value: "sweep-tracker",
    label: "A sweep or floor tracker",
    hint: "floor price changes, listings under target, sweep activity",
  },
  {
    value: "card-maker",
    label: "A shareable card or image maker",
    hint: "profile cards, badge flex, memes with GVC characters",
  },
  {
    value: "profile-page",
    label: "A personal GVC profile page",
    hint: "connect wallet, show your GVCs, badges, stats",
  },
];

// ── Add-on definitions ───────────────────────────────────────────────
const ADDONS = [
  { value: "collection-data",   label: "GVC Collection data",                   hint: "fetch NFT metadata, floor prices" },
  { value: "token-prices",      label: "Token prices (ETH, VIBESTR)",            hint: "live price feeds" },
  { value: "web3-wallet",       label: "Web3 wallet connect",                   hint: "connect wallet, read address" },
  { value: "stats-panel",       label: "Animated stats panel",                  hint: "counters, charts, dashboards" },
  { value: "leaderboard",       label: "Leaderboard system (daily/weekly/all-time)", hint: "rankings, scores, streaks" },
  { value: "auth",              label: "Auth (edge-compatible sessions)",        hint: "login, sessions, protected pages" },
  { value: "game-engine",       label: "Game engine scaffold",                  hint: "canvas, game loop, sprites" },
  { value: "audio-mixer",       label: "Audio mixer (Web Audio API)",            hint: "sounds, music, mixing" },
  { value: "toasts",            label: "Toast notifications",                   hint: "alerts, success/error messages" },
  { value: "ipfs-images",       label: "IPFS image loading",                    hint: "load images from IPFS gateways" },
  { value: "on-chain-reads",    label: "On-chain reads (wallet balances, contracts)", hint: "read blockchain data" },
  { value: "badge-collection",  label: "Badge collection (90 GVC badges, tiers)",    hint: "collect, display, tier up" },
  { value: "vercel-kv",         label: "Vercel KV (Redis) setup",               hint: "key-value storage, caching" },
];

// ── Keyword matching for add-on suggestions ──────────────────────────
const SUGGESTION_RULES = [
  {
    keywords: ["nft", "collection", "floor", "listing", "opensea", "mint"],
    addon: "collection-data",
  },
  {
    keywords: ["price", "token", "vibestr", "eth", "pnkstr", "crypto"],
    addon: "token-prices",
  },
  {
    keywords: ["wallet", "connect", "web3", "metamask", "ethereum"],
    addon: "web3-wallet",
  },
  {
    keywords: ["track", "stat", "dashboard", "counter", "analytics", "chart"],
    addon: "stats-panel",
  },
  {
    keywords: ["vote", "rank", "leaderboard", "elo", "bracket", "competition"],
    addon: "leaderboard",
  },
  {
    keywords: ["game", "score", "play", "level", "quest", "arcade"],
    addon: "game-engine",
  },
  {
    keywords: ["badge", "collect", "tier", "achievement", "unlock"],
    addon: "badge-collection",
  },
  {
    keywords: ["chain", "contract", "balance", "onchain", "on-chain", "read"],
    addon: "on-chain-reads",
  },
  {
    keywords: ["ipfs", "image", "metadata", "pinata"],
    addon: "ipfs-images",
  },
  {
    keywords: ["sound", "audio", "music", "beat", "mix"],
    addon: "audio-mixer",
  },
  {
    keywords: ["login", "auth", "session", "sign in", "account"],
    addon: "auth",
  },
  {
    keywords: ["store", "save", "database", "cache", "persist", "redis"],
    addon: "vercel-kv",
  },
];

function suggestAddons(description) {
  const lower = description.toLowerCase();
  const suggested = new Set();

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

// ── Template-specific starting instructions ─────────────────────────
const TEMPLATE_INSTRUCTIONS = {
  "project-site":
    "Build a landing page with: hero section with gold shimmer title, about section, features grid (3 columns), CTA section, footer with social links. Use the GVC brand system throughout.",
  "tracker":
    "Build a dashboard with: stats panel showing 3-4 key metrics with animated counters, a data table or card grid for tracked items, auto-refresh every 60 seconds. If GVC Collection data is selected, fetch live floor price and listing count from OpenSea.",
  "mini-game":
    "Build a browser game with: a game board or play area, score display, moves/lives counter, game-over screen with final score, and a restart button. Add a leaderboard if that add-on is selected.",
  "gallery":
    "Build a gallery page with: responsive image grid (3 columns desktop, 2 mobile) with gold glow cards on hover, filtering or search, and an upload/submit form. If IPFS images is selected, load NFT images with fallback handling.",
  "vote-and-rank":
    "Build a voting page with: 1v1 card matchups where users pick a winner, a results leaderboard sorted by wins, keyboard shortcuts (left/right arrows) for fast voting. If the leaderboard add-on is selected, add daily/weekly/all-time tabs.",
  "badge-wallet-tool":
    "Build a wallet lookup tool with: an input field where users paste an Ethereum address, a results section showing their GVC NFTs, earned badges with tier glow effects, and holder stats. Use getBadgeLeaderboard() from lib/gvc-api.ts for badge data and resolveWallet() for ENS/Twitter info.",
  "rarity-checker":
    "Build a token lookup tool with: an input field for GVC token ID, a display showing the NFT image, all traits (Background, Body, Face, Hair, Type), rarity rank, and recent sales history for that token. Use the badge-definitions.json to show which badges that token qualifies for.",
  "leaderboard":
    "Build a community leaderboard with: a ranked table of holders sorted by token count or badge count, tabs for different views (top holders, most badges, most active sweepers), and wallet identity resolution showing ENS names. Use getHolders() and getBadgeLeaderboard() from lib/gvc-api.ts.",
  "sweep-tracker":
    "Build a floor/sweep tracker with: a stats panel showing current floor price, 24h volume, and total listings, a live feed of recent sales, and a chart showing floor price history. Use getStats(), getRecentSales(), and getSalesHistory() from lib/gvc-api.ts. Auto-refresh every 60 seconds.",
  "card-maker":
    "Build a shareable image maker with: a canvas area where users can pick a background from the GVC backgrounds folder, overlay GVC character images or badge icons, add custom text with Brice/Mundial fonts, and download the result as a PNG. Use HTML Canvas for rendering. Include preset templates like profile cards and badge flex cards.",
  "profile-page":
    "Build a personal GVC profile page with: wallet connect button, a grid showing the user's owned GVCs with images, their earned badges with tier glow effects, holder stats (rank, token count), and a shareable URL. Use getBadgeLeaderboard() and getHolders() from lib/gvc-api.ts.",
  "blank-canvas":
    "This is a blank start with the GVC brand system ready to go. Ask me what you'd like to build and I'll help you create it from scratch.",
};

// ── Add-on code snippets (included in CLAUDE.md when relevant) ──────
const ADDON_SNIPPETS = {
  "collection-data": `### Fetching GVC Floor Price & Listings

\`\`\`ts
// app/api/collection/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  const res = await fetch(
    "https://api.opensea.io/api/v2/collections/good-vibes-club/stats",
    { headers: { "x-api-key": process.env.OPENSEA_API_KEY ?? "" }, next: { revalidate: 60 } }
  );
  const data = await res.json();
  return NextResponse.json({
    floorPrice: data.total?.floor_price ?? 0,
    totalVolume: data.total?.volume ?? 0,
    numOwners: data.total?.num_owners ?? 0,
    totalSupply: data.total?.count ?? 0,
  });
}
\`\`\``,

  "token-prices": `### Fetching Token Prices

\`\`\`ts
// ETH price
const ethRes = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd");
const ethData = await ethRes.json();
const ethPrice = ethData.ethereum.usd;

// VIBESTR price
const vibeRes = await fetch("https://api.dexscreener.com/latest/dex/tokens/0xd0cC2b0eFb168bFe1f94a948D8df70FA10257196");
const vibeData = await vibeRes.json();
const vibePrice = vibeData.pairs?.[0]?.priceUsd ?? "0";
\`\`\``,

  "web3-wallet": `### Web3 Wallet Connect
Use **RainbowKit** + **wagmi** for wallet connection. Install with:
\`\`\`bash
npm install @rainbow-me/rainbowkit wagmi viem @tanstack/react-query
\`\`\`
Follow the RainbowKit quickstart: https://www.rainbowkit.com/docs/installation`,

  "on-chain-reads": `### On-Chain Reads (Wallet Balances)

\`\`\`ts
import { createPublicClient, http, formatEther } from "viem";
import { mainnet } from "viem/chains";

const client = createPublicClient({ chain: mainnet, transport: http("https://ethereum-rpc.publicnode.com") });

// Read ETH balance
const balance = await client.getBalance({ address: "0x..." });
console.log(formatEther(balance));
\`\`\``,

  "stats-panel": `### Animated Stat Card Component

\`\`\`tsx
"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function StatCard({ label, value, suffix = "" }: { label: string; value: number; suffix?: string }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = value / 40;
    const timer = setInterval(() => {
      start += step;
      if (start >= value) { setDisplay(value); clearInterval(timer); }
      else setDisplay(Math.floor(start));
    }, 25);
    return () => clearInterval(timer);
  }, [value]);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card-glow rounded-2xl bg-[#121212] p-6">
      <p className="font-body text-sm text-gray-400">{label}</p>
      <p className="font-display text-3xl text-[#FFE048]">{display.toLocaleString()}{suffix}</p>
    </motion.div>
  );
}
\`\`\``,

  "leaderboard": `### Leaderboard Pattern
Use **Vercel KV** (Redis) for persistent leaderboard storage. Install with:
\`\`\`bash
npm install @vercel/kv
\`\`\`
Store scores as sorted sets: \`await kv.zadd("leaderboard:daily", { score: points, member: oderId })\`
Read top entries: \`await kv.zrange("leaderboard:daily", 0, 9, { rev: true, withScores: true })\``,

  "toasts": `### Toast Notifications
Use **react-hot-toast** for feedback messages. Install with:
\`\`\`bash
npm install react-hot-toast
\`\`\`
Add \`<Toaster position="bottom-center" />\` in your layout, then call \`toast.success("Saved!")\` anywhere.`,

  "ipfs-images": `### NFT Image with IPFS Fallback

\`\`\`tsx
export function NftImage({ tokenId, className }: { tokenId: number; className?: string }) {
  const gateways = [
    \`https://ipfs.io/ipfs/\`,
    \`https://cloudflare-ipfs.com/ipfs/\`,
    \`https://gateway.pinata.cloud/ipfs/\`,
  ];
  // Fetch metadata from OpenSea, extract image URL, try gateways in order
  // Replace ipfs:// prefix with gateway URL, use <img> with onError fallback
  return <img src={src} alt={\`GVC #\${tokenId}\`} className={className} onError={handleFallback} />;
}
\`\`\``,

  "badge-collection": `### Badge-Token Map

The project includes \`badge_token_map.json\` which maps every GVC NFT (by token ID) to its earned badges.
- \`badgeToTokens\`: badge ID -> array of qualifying token IDs
- \`tokenToBadges\`: token ID -> array of earned badge IDs
- 68 badges across all 6,969 tokens (21,856 assignments)

Use it to look up a holder's badges, build leaderboards, or filter the collection by badge.

\`\`\`ts
import { getHolderBadges } from "@/lib/badge-helpers";

const map = await fetch('/badge_token_map.json').then(r => r.json());

// Get ALL badges for a holder (individual + combos + milestones + VIBESTR tier)
const result = getHolderBadges(["142", "572", "3933"], map, 150000);
// result.allBadges includes everything
// result.comboBadges e.g. ["gradient_hatrick"] if 3+ gradient tokens
// result.collectorBadges e.g. ["five_badges"] if 5+ unique badges
// result.vibestrTierBadge e.g. "vibestr_silver_tier"
\`\`\`

### Badge Card with Tier Glow

\`\`\`tsx
const TIER_COLORS: Record<string, string> = {
  bronze: "shadow-orange-400/30",
  silver: "shadow-gray-300/30",
  gold: "shadow-[#FFE048]/40",
  diamond: "shadow-cyan-300/50",
};

export function BadgeCard({ name, tier, image }: { name: string; tier: string; image: string }) {
  return (
    <div className={\`rounded-2xl bg-[#121212] p-4 shadow-lg \${TIER_COLORS[tier] ?? ""} hover:scale-105 transition-transform\`}>
      <img src={image} alt={name} className="w-full rounded-xl" />
      <p className="mt-2 font-display text-sm text-[#FFE048]">{name}</p>
      <span className="text-xs text-gray-400 capitalize">{tier}</span>
    </div>
  );
}
\`\`\``,
};

// ── Generate example prompts based on template + addons ─────────────
function generateExamplePrompts(templateType, addons) {
  const prompts = [];

  // Template-specific prompts
  const templatePrompts = {
    "project-site": [
      '"Add a team member grid with photos and role titles"',
      '"Create a timeline section showing GVC milestones"',
      '"Add a newsletter signup form at the bottom"',
    ],
    "tracker": [
      '"Add a chart showing price history over the last 7 days"',
      '"Create a notification when floor price drops below a threshold"',
      '"Add a table that shows the most recent sales"',
    ],
    "mini-game": [
      '"Add sound effects when the player scores"',
      '"Create a difficulty selector (easy, medium, hard)"',
      '"Add a share button that posts your score to Twitter"',
    ],
    "gallery": [
      '"Add a lightbox that opens when you click an image"',
      '"Create filter buttons by trait or category"',
      '"Add infinite scroll to load more items"',
    ],
    "vote-and-rank": [
      '"Add an animation when a card wins"',
      '"Show total votes and win percentage on the leaderboard"',
      '"Add a share button for matchup results"',
    ],
    "community-page": [
      '"Add a section for upcoming community events"',
      '"Create a wall of member badges and achievements"',
      '"Add links to the Discord, Twitter, and OpenSea"',
    ],
    "blog-journal": [
      '"Add a search bar to filter posts by keyword"',
      '"Create a sidebar with recent posts and categories"',
      '"Add reading time estimates to each post"',
    ],
    "link-in-bio": [
      '"Add an animated background with floating embers"',
      '"Create a toggle between dark and light mode"',
      '"Add a music player widget that plays a vibe track"',
    ],
    "blank-canvas": [
      '"Build me a homepage with a hero section and GVC branding"',
      '"Create a dashboard that shows NFT collection stats"',
      '"Add a responsive navigation bar with the GVC logo"',
    ],
  };

  prompts.push(...(templatePrompts[templateType] || templatePrompts["blank-canvas"]));

  // Addon-specific prompts
  if (addons.includes("collection-data")) prompts.push('"Show the GVC floor price and total volume in the header"');
  if (addons.includes("token-prices")) prompts.push('"Add a live ETH and VIBESTR price ticker"');
  if (addons.includes("web3-wallet")) prompts.push('"Add a connect wallet button that shows my address and ETH balance"');
  if (addons.includes("stats-panel")) prompts.push('"Build an animated stats row with counters that tick up on load"');
  if (addons.includes("leaderboard")) prompts.push('"Create a leaderboard with daily, weekly, and all-time tabs"');
  if (addons.includes("badge-collection")) prompts.push('"Display all 90 GVC badges in a grid with tier filtering"');
  if (addons.includes("game-engine")) prompts.push('"Set up a canvas-based game loop with keyboard controls"');

  // Always include these general prompts
  prompts.push('"Make everything responsive and look great on mobile"');
  prompts.push('"Add smooth page transitions with Framer Motion"');

  // Return 5-8 unique prompts
  return [...new Set(prompts)].slice(0, 8);
}

// ── CLAUDE.md generation ─────────────────────────────────────────────
function generateClaudeMd(projectName, templateType, description, addons) {
  const templateLabel = TEMPLATE_CHOICES.find((t) => t.value === templateType)?.label ?? templateType;

  const addonDescriptions = addons
    .map((a) => {
      const found = ADDONS.find((ad) => ad.value === a);
      return found ? `- **${found.label}** -- ${found.hint}` : `- ${a}`;
    })
    .join("\n");

  // Build code snippets section from selected addons
  const snippetSections = addons
    .filter((a) => ADDON_SNIPPETS[a])
    .map((a) => ADDON_SNIPPETS[a])
    .join("\n\n");

  const examplePrompts = generateExamplePrompts(templateType, addons)
    .map((p) => `- ${p}`)
    .join("\n");

  return `# ${projectName}

## What to Build
${description}

## Starting Point
This project uses the **${templateLabel}** pattern. Here's what Claude should build first:

${TEMPLATE_INSTRUCTIONS[templateType] || TEMPLATE_INSTRUCTIONS["blank-canvas"]}

## Selected Power-ups
${addonDescriptions || "None selected -- you can always add capabilities later by editing this file."}

## GVC Brand System

### Colors
- **Gold (primary):** #FFE048
- **Black (background):** #050505
- **Dark (cards/panels):** #121212
- **Gray (borders/subtle):** #1F1F1F
- **Pink accent:** #FF6B9D
- **Orange accent:** #FF5F1F
- **Green (success):** #2EFF2E

### Typography
- **Headlines:** Brice font (display), bold/black weight -- make them feel premium
- **Body text:** Mundial font, clean and readable, generous spacing
- CSS variables: \`--font-brice\` for display, \`--font-mundial\` for body
- Tailwind: \`font-display\` for headlines, \`font-body\` for text

### Design Language
- Dark-first design (#050505 background)
- Gold accents (#FFE048) for CTAs, highlights, important elements
- Gold shimmer effect on key headlines (\`.text-shimmer\` class)
- Gold glow on hover for cards (\`.card-glow\` class)
- Floating ember particles for ambient effect (\`.ember\` class)
- Rounded corners (12-16px), soft shadows
- Generous whitespace -- let things breathe
- Micro-animations on hover/interaction (scale, glow, fade)
- Use Framer Motion for entry animations

### CSS Utilities
- \`.text-shimmer\` -- animated gold gradient text
- \`.card-glow\` -- gold glow box shadow with hover enhancement
- \`.ember\` -- floating gold particle dot
- \`.font-display\` -- Brice headline font
- \`.font-body\` -- Mundial body font

## Smart Contract & API Reference
- GVC NFT: 0xB8Ea78fcaCEf50d41375E44E6814ebbA36Bb33c4
- VIBESTR Token: 0xd0cC2b0eFb168bFe1f94a948D8df70FA10257196
- WETH: 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2
- Burn Address: 0x000000000000000000000000000000000000dEaD
- OpenSea Collection: good-vibes-club
- OpenSea API: https://api.opensea.io/api/v2 (needs x-api-key header from OPENSEA_API_KEY env var)
  - To get a key: go to https://opensea.io/account/settings, sign in, scroll to Developer, click Create API Key
- ETH price: https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd
- VIBESTR price: https://api.dexscreener.com/latest/dex/tokens/0xd0cC2b0eFb168bFe1f94a948D8df70FA10257196
- Public RPC: https://ethereum-rpc.publicnode.com
${snippetSections ? `\n## Code Patterns\n\n${snippetSections}` : ""}

## Example Prompts to Try
${examplePrompts}

## Assets
- Fonts: /public/fonts/ (Brice for headlines, Mundial for body)
- Shaka icon: /public/shaka.png
- GVC logotype: /public/gvc-logotype.svg
- Background grid: /public/grid.svg

## Tech Stack
- Next.js (App Router), React, TypeScript, Tailwind CSS, Framer Motion

## Project Structure
app/ -> Pages and layouts
components/ -> Reusable UI components
public/ -> Static assets
CLAUDE.md -> This file
README.md -> Human-readable docs
`;
}

// ── README.md generation ─────────────────────────────────────────────
function generateReadme(projectName, templateType, description, addons) {
  const examplePrompts = generateExamplePrompts(templateType, addons)
    .slice(0, 6)
    .map((p) => `- ${p}`)
    .join("\n");

  return `# ${projectName}

${description}

## What to do next

You're all set! Here's how to start building:

1. Open this folder in Claude (just type \`claude\` in your terminal)
2. Tell Claude what you want to change or add
3. When you're happy, push to GitHub and deploy at vercel.com

## Things to try

${examplePrompts}

## Need help?

- Just ask Claude! It knows your project and the GVC brand.
- Check out the GVC Discord for community support.
`;
}

// ── Template variable replacement ────────────────────────────────────
// Walks all text files in a directory and replaces {{PROJECT_NAME}} placeholders
async function replaceTemplateVars(dir, vars) {
  const TEXT_EXTENSIONS = new Set([
    ".json", ".js", ".mjs", ".ts", ".tsx", ".jsx",
    ".css", ".html", ".md", ".txt", ".env", ".example",
    ".yaml", ".yml", ".toml", ".cfg",
  ]);

  const entries = await fs.readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      if (entry.name === "node_modules" || entry.name === ".next") continue;
      await replaceTemplateVars(fullPath, vars);
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase();
      // Also handle dotfiles like .env.example
      const isDotfile = entry.name.startsWith(".") && !entry.name.includes(".ico");

      if (TEXT_EXTENSIONS.has(ext) || isDotfile) {
        try {
          let content = await fs.readFile(fullPath, "utf-8");
          let changed = false;
          for (const [placeholder, value] of Object.entries(vars)) {
            const pattern = `{{${placeholder}}}`;
            if (content.includes(pattern)) {
              content = content.replaceAll(pattern, value);
              changed = true;
            }
          }
          if (changed) {
            await fs.writeFile(fullPath, content, "utf-8");
          }
        } catch {
          // Skip binary files or files that can't be read
        }
      }
    }
  }
}

// ── Subcommands ─────────────────────────────────────────────────────
function runDev() {
  console.log();
  console.log(gold("  Starting your GVC project..."));
  console.log();
  try {
    execSync("npm run dev", { cwd: process.cwd(), stdio: "inherit" });
  } catch {
    console.log();
    console.log(pc.red("  Could not start the dev server."));
    console.log(dim(`  Make sure you're inside your project folder and ran ${info("npm install")} first.`));
    process.exit(1);
  }
}

function runDeploy() {
  console.log();
  console.log(gold("  Deploying your GVC project..."));
  console.log();

  // Check if vercel CLI is available
  try {
    execSync("npx vercel --version", { stdio: "ignore" });
  } catch {
    console.log(pc.red("  Vercel CLI not found."));
    console.log(dim(`  Run ${info("npm i -g vercel")} to install it, then try again.`));
    process.exit(1);
  }

  try {
    execSync("npx vercel --prod", { cwd: process.cwd(), stdio: "inherit" });
  } catch {
    console.log();
    console.log(pc.red("  Deploy failed. Check the output above for details."));
    process.exit(1);
  }
}

function showTemplates() {
  showHeader();
  console.log(brand("  Available templates:"));
  console.log();
  for (const t of TEMPLATE_CHOICES) {
    console.log(`  ${gold("●")} ${pc.bold(t.label)}`);
    console.log(`    ${dim(t.hint)}`);
    console.log();
  }
  console.log(dim("  Run ") + info("gvc create") + dim(" to start a new project."));
  console.log();
}

// ── Main CLI flow ────────────────────────────────────────────────────
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  // Route subcommands
  if (command === "dev") return runDev();
  if (command === "deploy") return runDeploy();
  if (command === "templates") return showTemplates();
  if (command === "--version" || command === "-v") {
    console.log("create-gvc-app v0.1.2");
    return;
  }

  // "create" or no command runs the scaffold flow
  showHeader();

  // ── Preflight ──
  checkNodeVersion();

  const hasClaude = checkClaudeCLI();

  p.intro(gold("Let's build something for the Good Vibes Club"));

  // ── Project name ──
  const projectName = await p.text({
    message: "What's your project called?",
    placeholder: "my-gvc-tracker",
    validate(value) {
      if (!value || value.trim().length === 0) {
        return "Give your project a name!";
      }
      if (!/^[a-zA-Z0-9_-]+$/.test(value.trim())) {
        return "Stick to letters, numbers, dashes, and underscores";
      }
      return undefined;
    },
  });

  if (p.isCancel(projectName)) {
    p.cancel("No worries, come back anytime!");
    process.exit(0);
  }

  const projectDir = path.resolve(process.cwd(), projectName.trim());

  // Check if directory already exists
  if (fs.existsSync(projectDir)) {
    const overwrite = await p.confirm({
      message: `A folder called "${projectName}" already exists. Overwrite it?`,
      initialValue: false,
    });

    if (p.isCancel(overwrite) || !overwrite) {
      p.cancel("No worries, try a different name next time!");
      process.exit(0);
    }
  }

  // ── Template selection ──
  const templateType = await p.select({
    message: "What do you want to build?",
    options: TEMPLATE_CHOICES,
  });

  if (p.isCancel(templateType)) {
    p.cancel("No worries, come back anytime!");
    process.exit(0);
  }

  // ── Idea description ──
  const description = await p.text({
    message: "Describe your idea in a sentence or two:",
    placeholder: "A dashboard that tracks GVC floor prices and shows my NFT collection",
    validate(value) {
      if (!value || value.trim().length === 0) {
        return "Even a short description helps! Just a sentence is fine.";
      }
      return undefined;
    },
  });

  if (p.isCancel(description)) {
    p.cancel("No worries, come back anytime!");
    process.exit(0);
  }

  // ── Add-on selection with smart suggestions ──
  const suggested = suggestAddons(description);

  const addonOptions = ADDONS.map((addon) => ({
    value: addon.value,
    label: addon.label,
    hint: addon.hint,
  }));

  // Show suggestions header if we have any
  if (suggested.size > 0) {
    const suggestedNames = [...suggested]
      .map((s) => {
        const found = ADDONS.find((a) => a.value === s);
        return found ? found.label : s;
      })
      .join(", ");
    p.note(
      `Based on your description, we'd recommend:\n${gold(suggestedNames)}`,
      "Smart suggestions"
    );
  }

  const selectedAddons = await p.multiselect({
    message: "Pick the add-ons you want (space to toggle, enter to confirm):",
    options: addonOptions,
    initialValues: [...suggested],
    required: false,
  });

  if (p.isCancel(selectedAddons)) {
    p.cancel("No worries, come back anytime!");
    process.exit(0);
  }

  // ── Scaffolding ──
  const s = p.spinner();
  s.start("Setting up your project...");

  // Always use blank-canvas as the base — the template choice shapes the CLAUDE.md instructions
  const templateSrc = path.join(TEMPLATES_DIR, "blank-canvas");

  // Create project directory
  await fs.ensureDir(projectDir);

  // Copy template files
  await fs.copy(templateSrc, projectDir, { overwrite: true });

  // Replace template variables (e.g. {{PROJECT_NAME}})
  await replaceTemplateVars(projectDir, {
    PROJECT_NAME: projectName.trim(),
  });

  // Also update package.json name field directly (handles non-placeholder templates)
  const pkgPath = path.join(projectDir, "package.json");
  if (fs.existsSync(pkgPath)) {
    const pkg = await fs.readJson(pkgPath);
    pkg.name = projectName.trim();
    await fs.writeJson(pkgPath, pkg, { spaces: 2 });
  }

  s.message("Writing project files...");

  // Write CLAUDE.md
  const claudeMd = generateClaudeMd(projectName, templateType, description, selectedAddons);
  await fs.writeFile(path.join(projectDir, "CLAUDE.md"), claudeMd, "utf-8");

  // Write README.md
  const readme = generateReadme(projectName, templateType, description, selectedAddons);
  await fs.writeFile(path.join(projectDir, "README.md"), readme, "utf-8");

  // Create directories for add-ons if they don't exist
  await fs.ensureDir(path.join(projectDir, "components"));
  await fs.ensureDir(path.join(projectDir, "public"));

  s.message("Installing dependencies (this might take a minute)...");

  // Run npm install
  try {
    execSync("npm install", {
      cwd: projectDir,
      stdio: "ignore",
      timeout: 120000,
    });
  } catch {
    // Non-fatal — user can run npm install manually
    s.stop(pc.yellow("Dependencies didn't install automatically, but that's okay!"));
    p.note(
      `Just run ${info("npm install")} inside your project folder.`,
      "Quick fix"
    );
  }

  s.stop(success("Project created!"));

  // ── API key setup (if blockchain/data add-ons selected) ──
  const needsOpenseaKey = selectedAddons.some((a) =>
    ["collection-data", "ipfs-images", "on-chain-reads"].includes(a)
  );

  if (needsOpenseaKey) {
    console.log();
    p.note(
      `Some of your add-ons need an OpenSea API key to fetch NFT data.\n` +
      `It's free and takes about 2 minutes to get one:\n\n` +
      `  1. Go to ${info("https://opensea.io/account/settings")}\n` +
      `  2. Sign in (or create a free account)\n` +
      `  3. Scroll to ${gold("Developer")} and click ${gold("Create API Key")}\n` +
      `  4. Give it a name like "My GVC Project" and submit\n` +
      `  5. Copy the key\n`,
      "OpenSea API Key"
    );

    const apiKey = await p.text({
      message: "Paste your OpenSea API key (or press Enter to skip for now):",
      placeholder: "you can always add this later in .env.local",
      defaultValue: "",
    });

    if (!p.isCancel(apiKey) && apiKey && apiKey.trim().length > 0) {
      // Write .env.local with the key
      const envContent = `# GVC Builder Kit - Environment Variables\nOPENSEA_API_KEY=${apiKey.trim()}\n`;
      await fs.writeFile(path.join(projectDir, ".env.local"), envContent, "utf-8");
      p.log.success(success("API key saved to .env.local"));
    } else {
      p.log.info(
        dim("No worries! When you're ready, create a file called ") +
        gold(".env.local") +
        dim(" in your project folder and add:\n\n") +
        info("OPENSEA_API_KEY=your_key_here")
      );
    }
  }

  // ── Success message ──
  console.log();
  console.log(brand("  Your project is ready!"));
  console.log();

  const nextSteps = [
    `  ${info("cd")} ${projectName}`,
    `  ${info("npm run dev")}          ${dim("Start your project in the browser")}`,
  ];

  if (hasClaude) {
    nextSteps.push(
      `  ${info("claude")}              ${dim("Start building with Claude")}`
    );
  } else {
    nextSteps.push(
      `\n  ${dim("Install Claude CLI:")} ${info("https://docs.anthropic.com/claude-code")}`
    );
  }

  nextSteps.push(
    `\n  ${dim("When you're ready to go live:")}`,
    `  ${dim("Push to GitHub, then deploy at")} ${info("https://vercel.com")}`,
    `\n  ${dim("Tip: Run")} ${info("npm install -g create-gvc-app")} ${dim("to unlock")}`,
    `  ${dim("shortcuts like")} ${info("gvc dev")} ${dim("and")} ${info("gvc deploy")}${dim(".")}`
  );

  p.note(nextSteps.join("\n"), "Next steps");

  console.log(
    dim("  Open your project in Claude and describe what you")
  );
  console.log(
    dim("  want to change. It already knows the GVC brand")
  );
  console.log(
    dim("  and what you're building.")
  );
  console.log();

  p.outro(
    gold("Good vibes only. Go build something amazing! ") +
      dim("// gvc-builder-kit v0.1.2")
  );
}

main().catch((err) => {
  p.cancel("Something went wrong!");
  console.error(err);
  process.exit(1);
});

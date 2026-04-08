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
  console.log(dim("  Build something cool for Good Vibes Club"));
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
    label: "Blank canvas",
    hint: "you describe the vibe, Claude builds it -anything you want",
  },
  {
    value: "project-site",
    label: "A website or landing page",
    hint: "e.g. a homepage for your project with hero, about section, and links",
  },
  {
    value: "dashboard",
    label: "A dashboard or tracker",
    hint: "e.g. floor price tracker, holder leaderboard, sales feed with charts",
  },
  {
    value: "mini-game",
    label: "A game",
    hint: "e.g. a matching game, trivia quiz, or arcade-style challenge",
  },
  {
    value: "gallery",
    label: "A gallery",
    hint: "e.g. browse and filter NFTs, community art wall, or trait explorer",
  },
  {
    value: "vote-and-rank",
    label: "A voting or ranking page",
    hint: "e.g. 1v1 matchups to rank favorites, polls, community picks",
  },
  {
    value: "lookup-tool",
    label: "A lookup tool",
    hint: "e.g. paste a wallet to see badges, or enter a token ID to see traits and rarity",
  },
  {
    value: "card-maker",
    label: "A card or image maker",
    hint: "e.g. create shareable profile cards, badge flex images, or memes",
  },
  {
    value: "profile-page",
    label: "A profile page",
    hint: "e.g. connect your wallet and see your GVCs, badges, and holder stats",
  },
];

// ── Add-on definitions ───────────────────────────────────────────────
const ADDONS = [
  { value: "collection-data",   label: "NFT collection info",         hint: "floor price, listings, metadata, and trait rarity for all 6,969 GVCs" },
  { value: "token-prices",      label: "Live crypto prices",          hint: "real-time ETH and VIBESTR prices" },
  { value: "web3-wallet",       label: "Connect wallet button",       hint: "let users connect their crypto wallet" },
  { value: "stats-panel",       label: "Stats and charts",            hint: "animated counters, data cards, dashboards" },
  { value: "leaderboard",       label: "Leaderboard",                 hint: "ranked lists with daily, weekly, and all-time views" },
  { value: "auth",              label: "User accounts",               hint: "sign up, log in, and protected pages" },
  { value: "game-engine",       label: "Game starter kit",            hint: "game board, scoring, and game loop" },
  { value: "audio-mixer",       label: "Sound and music",             hint: "play sounds, background music, audio controls" },
  { value: "toasts",            label: "Pop-up notifications",        hint: "success, error, and info messages" },
  { value: "ipfs-images",       label: "NFT image loading",           hint: "display NFT images with fallback handling" },
  { value: "on-chain-reads",    label: "Blockchain lookups",          hint: "check wallet balances and read smart contracts" },
  { value: "badge-collection",  label: "Badge collection",            hint: "101 GVC badges with tiers and glow effects" },
  { value: "vercel-kv",         label: "Save and store data",         hint: "persistent storage for scores, votes, and settings" },
];

// ── Keyword matching for add-on suggestions ──────────────────────────
const SUGGESTION_RULES = [
  {
    keywords: ["nft", "collection", "floor", "listing", "opensea", "mint", "trait", "rarity", "rare", "metadata", "token id"],
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
  "dashboard":
    "Build a dashboard with: stats panel showing floor price, 24h volume, owners, and market cap with animated counters, a ranked holder or sales table, and a chart showing price or volume history. Use getStats(), getHolders(), getRecentSales(), and getSalesHistory() from lib/gvc-api.ts. Auto-refresh every 60 seconds.",
  "mini-game":
    "Build a browser game with: a game board or play area, score display, moves/lives counter, game-over screen with final score, and a restart button. Add a leaderboard if that add-on is selected.",
  "gallery":
    "Build a gallery page with: responsive image grid (3 columns desktop, 2 mobile) with gold glow cards on hover, filtering or search, and an upload/submit form. If IPFS images is selected, load NFT images with fallback handling.",
  "vote-and-rank":
    "Build a voting page with: 1v1 card matchups where users pick a winner, a results leaderboard sorted by wins, keyboard shortcuts (left/right arrows) for fast voting. If the leaderboard add-on is selected, add daily/weekly/all-time tabs.",
  "lookup-tool":
    "Build a lookup tool with: an input field that accepts either a wallet address (0x...) or a GVC token ID (0-6968). For wallets: show their GVC NFTs, earned badges with tier glow effects, and holder stats. Use getBadgeLeaderboard() from lib/gvc-api.ts. For token IDs: show the NFT image, all traits (Type, Face, Hair, Body, Background), rarity rank, and which badges that token qualifies for. Use gvc-metadata.json for trait data.",
  "card-maker":
    "Build a shareable image maker with: a canvas area where users can pick a background from the GVC backgrounds folder, overlay GVC character images or badge icons, add custom text with Brice/Mundial fonts, and download the result as a PNG. Use HTML Canvas for rendering. Include preset templates like profile cards and badge flex cards.",
  "profile-page":
    "Build a personal GVC profile page with: wallet connect button, a grid showing the user's owned GVCs with images, their earned badges with tier glow effects, holder stats (rank, token count), and a shareable URL. Use getBadgeLeaderboard() and getHolders() from lib/gvc-api.ts.",
  "blank-canvas":
    "This is a blank start with the GVC brand system ready to go. Ask me what you'd like to build and I'll help you create it from scratch.",
};

// ── Add-on code snippets (included in CLAUDE.md when relevant) ──────
const ADDON_SNIPPETS = {
  "collection-data": `### Fetching GVC Collection Stats (no API key needed)

\`\`\`ts
// Fetch live stats -floor price, volume, owners, market cap
const stats = await fetch("https://api-hazel-pi-72.vercel.app/api/stats").then(r => r.json());
// { floorPrice: 0.649, floorPriceUsd: 1340, numOwners: 1510, totalSales: 24278, avgPrice: 0.55, volume24h: 2.37, marketCapUsd: 9344543 }

// Fetch recent sales
const sales = await fetch("https://api-hazel-pi-72.vercel.app/api/sales?limit=10").then(r => r.json());
// [{ txHash: "0x...", priceEth: 0.65, paymentSymbol: "ETH", imageUrl: "https://i2c.seadn.io/...", timestamp: "2026-04-03T..." }]

// Fetch top holders
const holders = await fetch("https://api-hazel-pi-72.vercel.app/api/holders?limit=20").then(r => r.json());
// { holders: [{ address: "0x...", tokenCount: 42, ens: "vibes.eth" }] }
\`\`\`

All GVC data is available from \\\`https://api-hazel-pi-72.vercel.app/api\\\`. No API key needed. Data refreshes every 60 seconds.

### NFT Metadata & Trait Rarity

All 6,969 token traits are in \\\`public/gvc-metadata.json\\\`. Keyed by token ID (0-6968).

\`\`\`ts
const metadata = await fetch('/gvc-metadata.json').then(r => r.json());

// Look up any token
const token = metadata["142"];
// token.name   -> "Citizen of Vibetown #142"
// token.traits -> { Type: "Robot", Face: "Laser Eyes", Hair: "Mohawk Gold", Body: "Hoodie Black", Background: "BG Mint" }
// token.image  -> "ipfs://QmY6J.../142.jpg"

// Calculate trait rarity
const allTokens = Object.values(metadata);
const traitCounts: Record<string, Record<string, number>> = {};
for (const t of allTokens) {
  for (const [type, value] of Object.entries(t.traits)) {
    traitCounts[type] = traitCounts[type] || {};
    traitCounts[type][value] = (traitCounts[type][value] || 0) + 1;
  }
}
// traitCounts["Type"]["Robot"] -> number of Robots in the collection
// Rarity % = count / 6969 * 100
\`\`\`

Trait types: Type, Face, Hair, Body, Background. To display images, replace "ipfs://" with "https://ipfs.io/ipfs/".`,

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

// ── Starter page ────────────────────────────────────────────────────
// Universal landing page that shows the user's idea and walks them
// step-by-step into Claude to build it.

function generateStarterPage(templateType, projectName, description, addons, projectPath) {
  const TEMPLATE_LABELS = {
    'project-site': 'Website / Landing Page',
    'dashboard': 'Dashboard / Tracker',
    'mini-game': 'Game',
    'gallery': 'Gallery',
    'vote-and-rank': 'Vote & Rank',
    'lookup-tool': 'Lookup Tool',
    'card-maker': 'Card / Image Maker',
    'profile-page': 'Profile Page',
    'blank-canvas': 'Blank Canvas',
  };

  const ADDON_LABELS = {
    'collection-data': 'GVC Collection info',
    'token-prices': 'Live token prices',
    'web3-wallet': 'Wallet connection',
    'stats-panel': 'Stats and charts',
    'leaderboard': 'Leaderboard',
    'auth': 'User accounts',
    'game-engine': 'Game starter kit',
    'audio-mixer': 'Sound and music',
    'toasts': 'Pop-up notifications',
    'ipfs-images': 'NFT image loading',
    'on-chain-reads': 'Blockchain lookups',
    'badge-collection': 'Badge collection',
    'vercel-kv': 'Save and store data',
  };

  const templateLabel = TEMPLATE_LABELS[templateType] || templateType;
  const addonLabels = addons.map((a) => ADDON_LABELS[a] || a);
  const addonListStr = addonLabels.join(", ");

  const addonCountHtml = addonLabels.length > 0
    ? `<span className="text-white/20">&middot;</span><span className="text-white/40 font-body text-xs">${addonLabels.length} add-on${addonLabels.length !== 1 ? "s" : ""}</span>`
    : '';

  const addonPromptLine = addonLabels.length > 0
    ? `I also want these features: ${addonListStr}`
    : '';

  const templateInstruction = TEMPLATE_INSTRUCTIONS[templateType] || TEMPLATE_INSTRUCTIONS["blank-canvas"];

  // Build a self-contained prompt with all GVC context baked in
  // so Claude.ai works without access to local CLAUDE.md
  const promptParts = [
    `I want to build a project called "${projectName}" for the Good Vibes Club (GVC) community.`,
    ``,
    `Here is what I want to build:`,
    description,
    ``,
    `Starting point: ${templateLabel}`,
    templateInstruction,
    ``,
  ];

  if (addonPromptLine) promptParts.push(addonPromptLine, ``);

  promptParts.push(
    `Build me a complete, working prototype by editing app/page.tsx. The project is already set up with Next.js App Router, TypeScript, Tailwind CSS, and Framer Motion -just write the page code.`,
    ``,
    `## IMPORTANT: Your project already has the GVC brand system installed`,
    ``,
    `The project is scaffolded and running. These are ALREADY set up -use them directly:`,
    ``,
    `### Fonts (already loaded in layout.tsx)`,
    `- Headlines: \`className="font-display"\` -Brice font (bold, premium serif)`,
    `- Body text: \`className="font-body"\` -Mundial font (clean sans-serif)`,
    `- DO NOT import Google Fonts or any other fonts. Brice and Mundial are already loaded.`,
    ``,
    `### Tailwind Colors (already in tailwind.config.ts)`,
    `- \`text-gvc-gold\` / \`bg-gvc-gold\` / \`border-gvc-gold\` -#FFE048 (primary gold)`,
    `- \`bg-gvc-black\` -#050505 (page background)`,
    `- \`bg-gvc-dark\` -#121212 (cards, panels)`,
    `- \`bg-gvc-gray\` / \`border-gvc-gray\` -#1F1F1F (borders, dividers)`,
    `- \`text-gvc-green\` / \`bg-gvc-green\` -#2EFF2E (success)`,
    `- \`text-gvc-orange\` -#FF5F1F (accent)`,
    `- \`text-pink-accent\` -#FF6B9D (accent)`,
    ``,
    `### CSS Utilities (already in globals.css)`,
    `- \`text-shimmer\` -animated gold gradient text effect for headlines`,
    `- \`card-glow\` -gold glow box-shadow that intensifies on hover`,
    `- \`ember\` -floating gold particle dot (position absolute, add to background)`,
    `- \`rising-particle\` -gold particles that float up from the bottom of the page`,
    `- Grid background texture and gold bottom gradient are applied to body via ::before and ::after`,
    `- Shaka icon (/shaka.png) should wiggle on hover and is used as the site favicon`,
    `- Site titles should be UPPERCASE (all caps, Brice font-black)`,
    ``,
    `### Assets (already in /public/)`,
    `- \`/shaka.png\` -GVC shaka hand icon (use with next/image)`,
    `- \`/gvc-logotype.svg\` -Good Vibes Club wordmark`,
    `- \`/grid.svg\` -background grid texture`,
    `- \`/gvc-metadata.json\` -all 6,969 token traits and IPFS image URLs`,
    ``,
    `### Design patterns`,
    `- Dark backgrounds (#050505) with gold accents throughout`,
    `- Cards: \`bg-gvc-dark border border-white/[0.08] rounded-2xl\``,
    `- Card hover: add \`card-glow\` class or \`hover:border-gvc-gold/20\``,
    `- Borders: \`border-white/[0.08]\` (subtle) or \`border-gvc-gold/20\` (emphasis)`,
    `- Text hierarchy: \`text-gvc-gold\` for emphasis, \`text-white\` primary, \`text-white/50\` secondary, \`text-white/30\` muted`,
    `- Generous whitespace -let things breathe`,
    `- Framer Motion for entrance animations (fade up, stagger children)`,
    `- Use \`text-shimmer\` class on key headlines for the gold shimmer effect`,
    ``,
    `## GVC Data APIs (no API key needed)`,
    ``,
    `All GVC data comes from: https://api-hazel-pi-72.vercel.app/api`,
    ``,
    `| Endpoint | Returns |`,
    `|---|---|`,
    `| GET /stats | { floorPrice, floorPriceUsd, volume24h, volume24hUsd, numOwners, totalSales, avgPrice, marketCap, marketCapUsd } |`,
    `| GET /sales?limit=10 | [{ txHash, priceEth, priceUsd, paymentSymbol, imageUrl, timestamp }] |`,
    `| GET /sales/history?limit=100 | Same shape as /sales, max 1000 |`,
    `| GET /activity | 30-day buys/sells, accumulator leaderboard |`,
    `| GET /vibestr | VIBESTR token data |`,
    `| GET /vibestr/history | Daily VIBESTR price snapshots |`,
    `| GET /market-depth | Bid/offer depth, floor price, lowest listing |`,
    `| GET /traders | 30-day trade stats |`,
    `| GET /wallet/[address] | ENS name, Twitter handle for a wallet |`,
    `| GET /mentions | Recent X/Twitter mentions |`,
    ``,
    `Example:`,
    `\`\`\`ts`,
    `const stats = await fetch("https://api-hazel-pi-72.vercel.app/api/stats").then(r => r.json());`,
    `// { floorPrice: 0.649, floorPriceUsd: 1340, numOwners: 1510, totalSales: 24278, avgPrice: 0.55, volume24h: 2.37, marketCapUsd: 9344543 }`,
    `\`\`\``,
    ``,
    `## Contracts & Tokens (only use these)`,
    `- GVC NFT: 0xB8Ea78fcaCEf50d41375E44E6814ebbA36Bb33c4 (ERC-721, 6969 tokens)`,
    `- HighKey Moments: 0x74fcb6eb2a2d02207b36e804d800687ce78d210c (ERC-1155)`,
    `- VIBESTR Token: 0xd0cC2b0eFb168bFe1f94a948D8df70FA10257196 (ERC-20, 18 decimals)`,
    `- ETH is the base currency for all GVC transactions`,
    `- ETH price: https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd`,
    `- VIBESTR price: https://api.dexscreener.com/latest/dex/tokens/0xd0cC2b0eFb168bFe1f94a948D8df70FA10257196`,
    `- Public RPC: https://ethereum-rpc.publicnode.com`,
    `Do NOT reference any other NFT collections, tokens, or contracts. This project is only about GVC.`,
    ``,
    `## NFT Images`,
    `Use the image URLs returned by the /sales or /badge-leaderboard endpoints (OpenSea CDN).`,
    `For token metadata including IPFS image URLs and traits: fetch /gvc-metadata.json from the public folder.`,
    ``,
    `Now build the complete prototype in app/page.tsx. Use the brand system classes listed above (font-display, font-body, text-gvc-gold, bg-gvc-dark, text-shimmer, card-glow, etc). Use real data from the APIs wherever relevant. Make it look premium and polished.`,
  );

  const fullPrompt = promptParts.join("\n");
  const promptJson = JSON.stringify(fullPrompt);

  // Use {{PLACEHOLDER}} style and .replaceAll() to avoid nested template literal escaping issues
  const page = `"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const CLAUDE_PROMPT = {{PROMPT_JSON}};

export default function Home() {
  const [copiedStep, setCopiedStep] = useState(0);
  const [copied, setCopied] = useState(false);

  async function copyText(text, step) {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopiedStep(step);
    setTimeout(() => setCopiedStep(0), 2500);
  }

  async function copyAndOpen() {
    await copyText(CLAUDE_PROMPT, 0);
    setCopied(true);
    setTimeout(() => window.open("https://claude.ai/new", "_blank"), 400);
    setTimeout(() => setCopied(false), 3000);
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-16 relative overflow-hidden">
      {/* Background embers */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="ember"
            style={{
              left: (10 + i * 11) + "%",
              top: (15 + (i % 4) * 20) + "%",
              animationDelay: (i * 0.7) + "s",
              animationDuration: (4 + i * 0.6) + "s",
            }}
          />
        ))}
      </div>

      <div className="max-w-2xl mx-auto text-center relative z-10 w-full overflow-hidden">
        {/* Shaka */}
        <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 150 }} className="mb-6">
          <Image src="/shaka.png" alt="GVC" width={80} height={80} className="mx-auto drop-shadow-[0_0_25px_rgba(255,224,72,0.3)]" />
        </motion.div>

        {/* Title */}
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-3xl sm:text-5xl font-display font-black text-shimmer leading-tight mb-4 break-words overflow-hidden">
          {{SAFE_NAME}}
        </motion.h1>

        {/* Status */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#2EFF2E]/10 border border-[#2EFF2E]/20 mb-8">
          <div className="w-2 h-2 rounded-full bg-[#2EFF2E] animate-pulse" />
          <span className="text-sm text-[#2EFF2E] font-body">Your project is running</span>
        </motion.div>

        {/* What you described */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-left rounded-2xl bg-[#121212] border border-white/[0.08] p-6 mb-6 overflow-hidden">
          <p className="text-white/40 font-body text-xs uppercase tracking-wider mb-2">Your idea</p>
          <p className="text-white/80 font-body text-base leading-relaxed break-words">{{SAFE_DESC}}</p>
          <div className="flex items-center gap-3 mt-3">
            <span className="text-[#FFE048] font-body text-xs font-semibold">{{TEMPLATE_LABEL}}</span>{{ADDON_COUNT_HTML}}
          </div>
        </motion.div>

        {/* Step-by-step -Desktop app primary */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="text-left rounded-2xl bg-[#121212] border border-[#FFE048]/20 p-6 mb-6">
          <h2 className="text-lg font-display font-bold text-white mb-5">Now let&apos;s build it</h2>

          <div className="space-y-5">
            {/* Step 1 -Download Claude Code */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-6 h-6 rounded-full bg-[#FFE048]/15 text-[#FFE048] text-xs font-bold flex items-center justify-center">1</span>
                <p className="text-white/60 font-body text-sm">Download Claude Code</p>
              </div>
              <a href="https://claude.ai/download" target="_blank" rel="noopener noreferrer" className="w-full inline-flex items-center justify-center gap-3 px-5 py-3.5 rounded-xl bg-[#FFE048] text-[#050505] font-display font-bold text-sm hover:shadow-[0_0_20px_rgba(255,224,72,0.3)] transition-all">
                Download Claude Code (free)
                <svg className="w-4 h-4 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
              </a>
              <p className="text-white/25 font-body text-xs mt-1.5">Already have it? Skip to step 2.</p>
            </div>

            {/* Step 2 -Open project folder */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-6 h-6 rounded-full bg-[#FFE048]/15 text-[#FFE048] text-xs font-bold flex items-center justify-center">2</span>
                <p className="text-white/60 font-body text-sm">Open your project in Claude Code</p>
              </div>
              <p className="text-white/40 font-body text-sm mb-2">Open the Claude Code app and select your project folder:</p>
              <button onClick={() => copyText("{{PROJECT_PATH}}", 2)} className="w-full group relative">
                <div className={"bg-black/60 rounded-xl px-4 py-3 font-mono text-sm text-left transition-all duration-200 " + (copiedStep === 2 ? "border border-[#2EFF2E]/30" : "border border-white/[0.08] hover:border-[#FFE048]/20")}>
                  <span className={copiedStep === 2 ? "text-[#2EFF2E]" : "text-[#2EFF2E]/80"}>{{PROJECT_PATH}}</span>
                </div>
                <span className={"absolute right-3 top-1/2 -translate-y-1/2 text-xs font-body transition-colors " + (copiedStep === 2 ? "text-[#2EFF2E]" : "text-white/30 group-hover:text-white/50")}>
                  {copiedStep === 2 ? "Copied!" : "Click to copy path"}
                </span>
              </button>
              <p className="text-white/25 font-body text-xs mt-1.5">In the app, click the folder name at the top &rarr; <span className="text-white/40">Open folder</span> &rarr; navigate to this path.</p>
            </div>

            {/* Step 3 -Tell Claude to build */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-6 h-6 rounded-full bg-[#FFE048]/15 text-[#FFE048] text-xs font-bold flex items-center justify-center">3</span>
                <p className="text-white/60 font-body text-sm">Tell Claude what to build</p>
              </div>
              <button onClick={() => copyText("Build what's described in my CLAUDE.md", 3)} className="w-full group relative">
                <div className={"bg-black/60 rounded-xl px-4 py-3 font-mono text-sm text-left transition-all duration-200 " + (copiedStep === 3 ? "border border-[#2EFF2E]/30" : "border border-white/[0.08] hover:border-[#FFE048]/20")}>
                  <span className={copiedStep === 3 ? "text-[#2EFF2E]" : "text-[#2EFF2E]/80"}>Build what&apos;s described in my CLAUDE.md</span>
                </div>
                <span className={"absolute right-3 top-1/2 -translate-y-1/2 text-xs font-body transition-colors " + (copiedStep === 3 ? "text-[#2EFF2E]" : "text-white/30 group-hover:text-white/50")}>
                  {copiedStep === 3 ? "Copied!" : "Click to copy"}
                </span>
              </button>
              <p className="text-white/25 font-body text-xs mt-1.5">Paste this into the Claude Code chat. It reads your project files and starts building automatically.</p>
            </div>
          </div>

          <p className="text-white/30 font-body text-xs mt-5 leading-relaxed">
            That&apos;s it! Come back to this browser tab to watch your project get built in real time.
          </p>
        </motion.div>

        {/* Alternative -Terminal */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="text-left rounded-2xl bg-[#121212] border border-white/[0.06] p-6 mb-6">
          <h3 className="text-base font-display font-bold text-white/80 mb-2">Prefer the terminal?</h3>
          <p className="text-white/40 font-body text-sm mb-4">Open a <span className="text-white/70 font-semibold">new terminal tab</span> and paste these commands one at a time.</p>

          <div className="space-y-4">
            {/* Terminal Step 1 */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-6 h-6 rounded-full bg-white/[0.06] text-white/50 text-xs font-bold flex items-center justify-center">1</span>
                <p className="text-white/50 font-body text-sm">Go to your project folder</p>
              </div>
              <button onClick={() => copyText("cd {{PROJECT_PATH}}", 11)} className="w-full group relative">
                <div className={"bg-black/60 rounded-xl px-4 py-3 font-mono text-sm text-left transition-all duration-200 " + (copiedStep === 11 ? "border border-[#2EFF2E]/30" : "border border-white/[0.08] hover:border-white/15")}>
                  <span className={copiedStep === 11 ? "text-[#2EFF2E]" : "text-[#2EFF2E]/70"}>cd {{PROJECT_PATH}}</span>
                </div>
                <span className={"absolute right-3 top-1/2 -translate-y-1/2 text-xs font-body transition-colors " + (copiedStep === 11 ? "text-[#2EFF2E]" : "text-white/25 group-hover:text-white/40")}>
                  {copiedStep === 11 ? "Copied!" : "Click to copy"}
                </span>
              </button>
            </div>

            {/* Terminal Step 2 */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-6 h-6 rounded-full bg-white/[0.06] text-white/50 text-xs font-bold flex items-center justify-center">2</span>
                <p className="text-white/50 font-body text-sm">Start Claude Code</p>
              </div>
              <button onClick={() => copyText("claude", 12)} className="w-full group relative">
                <div className={"bg-black/60 rounded-xl px-4 py-3 font-mono text-sm text-left transition-all duration-200 " + (copiedStep === 12 ? "border border-[#2EFF2E]/30" : "border border-white/[0.08] hover:border-white/15")}>
                  <span className={copiedStep === 12 ? "text-[#2EFF2E]" : "text-[#2EFF2E]/70"}>claude</span>
                </div>
                <span className={"absolute right-3 top-1/2 -translate-y-1/2 text-xs font-body transition-colors " + (copiedStep === 12 ? "text-[#2EFF2E]" : "text-white/25 group-hover:text-white/40")}>
                  {copiedStep === 12 ? "Copied!" : "Click to copy"}
                </span>
              </button>
              <p className="text-white/25 font-body text-xs mt-1.5">Don&apos;t have Claude Code? Run: <span className="font-mono text-white/40">curl -fsSL https://claude.ai/install.sh | bash</span></p>
            </div>

            {/* Terminal Step 3 */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-6 h-6 rounded-full bg-white/[0.06] text-white/50 text-xs font-bold flex items-center justify-center">3</span>
                <p className="text-white/50 font-body text-sm">When you see the <span className="font-mono text-white/60">&gt;</span> prompt, paste this</p>
              </div>
              <button onClick={() => copyText("Build what's described in my CLAUDE.md", 13)} className="w-full group relative">
                <div className={"bg-black/60 rounded-xl px-4 py-3 font-mono text-sm text-left transition-all duration-200 " + (copiedStep === 13 ? "border border-[#2EFF2E]/30" : "border border-white/[0.08] hover:border-white/15")}>
                  <span className={copiedStep === 13 ? "text-[#2EFF2E]" : "text-[#2EFF2E]/70"}>Build what&apos;s described in my CLAUDE.md</span>
                </div>
                <span className={"absolute right-3 top-1/2 -translate-y-1/2 text-xs font-body transition-colors " + (copiedStep === 13 ? "text-[#2EFF2E]" : "text-white/25 group-hover:text-white/40")}>
                  {copiedStep === 13 ? "Copied!" : "Click to copy"}
                </span>
              </button>
              <p className="text-white/25 font-body text-xs mt-1.5">Claude reads your project and starts building. Come back to the browser to watch it happen.</p>
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="text-white/20 text-xs font-body">
          Built with the GVC Builder Kit
        </motion.p>
      </div>
    </main>
  );
}
`;

  // Replace all placeholders
  return page
    .replaceAll('{{SAFE_NAME}}', projectName.replace(/'/g, "\\'").replace(/"/g, '\\"'))
    .replaceAll('{{SAFE_DESC}}', description.replace(/'/g, "\\'").replace(/"/g, '\\"'))
    .replaceAll('{{TEMPLATE_LABEL}}', templateLabel)
    .replaceAll('{{ADDON_COUNT_HTML}}', addonCountHtml)
    .replaceAll('{{ADDON_PROMPT_LINE}}', addonPromptLine)
    .replaceAll('{{PROMPT_JSON}}', promptJson)
    .replaceAll('{{PROJECT_PATH}}', projectPath);
}

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
    "dashboard": [
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
  if (addons.includes("badge-collection")) prompts.push('"Display all 101 GVC badges in a grid with tier filtering"');
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
- \`.rising-particle\` -- gold particles that float up from the bottom
- \`.font-display\` -- Brice headline font
- \`.font-body\` -- Mundial body font
- Grid texture background and gold bottom gradient are already applied to body
- Shaka icon (/shaka.png) should wiggle on hover. It is already set as the site favicon.
- Site titles should be UPPERCASE (all caps)

## GVC API (no API key needed)
All GVC collection data is available from: https://api-hazel-pi-72.vercel.app/api
- GET /stats -- returns: { floorPrice, floorPriceUsd, volume24h, volume24hUsd, numOwners, totalSales, avgPrice, marketCap, marketCapUsd, totalVolume, totalVolumeUsd }
- GET /sales?limit=10 -- returns: [{ txHash, priceEth, priceUsd, paymentSymbol, imageUrl, timestamp }]
- GET /sales/history?limit=100 -- same shape as /sales, max 1000
- GET /activity -- 30-day buys/sells, accumulator leaderboard
- GET /vibestr -- VIBESTR token data
- GET /vibestr/history -- daily VIBESTR price snapshots
- GET /market-depth -- bid/offer depth, floor price, lowest listing
- GET /traders -- 30-day trade stats
- GET /wallet/[address] -- ENS name, Twitter handle for a wallet
- GET /mentions -- recent X/Twitter mentions
Do NOT use the OpenSea API directly. Use the GVC API above instead.

## Contracts & Tokens (only use these)
- **GVC NFT:** 0xB8Ea78fcaCEf50d41375E44E6814ebbA36Bb33c4 (ERC-721, 6969 tokens)
- **HighKey Moments:** 0x74fcb6eb2a2d02207b36e804d800687ce78d210c (ERC-1155)
- **VIBESTR Token:** 0xd0cC2b0eFb168bFe1f94a948D8df70FA10257196 (ERC-20, 18 decimals)
- **ETH** is the base currency for all GVC transactions
- ETH price: https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd
- VIBESTR price: https://api.dexscreener.com/latest/dex/tokens/0xd0cC2b0eFb168bFe1f94a948D8df70FA10257196
- Public RPC: https://ethereum-rpc.publicnode.com
Do NOT reference any other NFT collections, tokens, or contracts. This project is only about GVC.
${snippetSections ? `\n## Code Patterns\n\n${snippetSections}` : ""}

## Example Prompts to Try
${examplePrompts}

## Token Metadata (\`public/gvc-metadata.json\`)

Complete metadata for all 6,969 GVC tokens. Keyed by token ID (0-6968).

\`\`\`ts
const metadata = await fetch('/gvc-metadata.json').then(r => r.json());

const token = metadata["142"];
// token.name    -> "Citizen of Vibetown #142"
// token.traits  -> { Type: "Robot", Face: "Laser Eyes", Hair: "Mohawk Gold", Body: "Hoodie Black", Background: "BG Mint" }
// token.image   -> "ipfs://QmY6JpwTYx6zZHgfJb3gPJRh1U897NX4RudtK5jhJ3sNDS/142.jpg"

// Trait types: Type, Face, Hair, Body, Background
// To display image: replace "ipfs://" with "https://ipfs.io/ipfs/"
\`\`\`

Use cases: rarity checker, token lookup, trait filtering, collection search, trait-based galleries.

## Assets
- Fonts: /public/fonts/ (Brice for headlines, Mundial for body)
- Shaka icon: /public/shaka.png
- GVC logotype: /public/gvc-logotype.svg
- Background grid: /public/grid.svg
- Token metadata: /public/gvc-metadata.json (all 6,969 tokens with traits + images)

## Tech Stack
- Next.js (App Router), React, TypeScript, Tailwind CSS, Framer Motion

## Important: Dev Server
The dev server is already running (the user started it before opening Claude Code). Do NOT run \`npm run dev\` -just edit the files and the browser will hot-reload automatically. If you need to install a new package, use \`npm install <package>\` and the dev server will pick it up.

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
    console.log("create-gvc-app v0.5.0");
    return;
  }

  // "create" or no command runs the scaffold flow
  showHeader();

  // ── Preflight ──
  checkNodeVersion();

  const hasClaude = checkClaudeCLI();

  p.intro(gold("Let's build something for Good Vibes Club"));

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

  // Always use blank-canvas as the base -the template choice shapes the CLAUDE.md instructions
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

  // Write template-specific starter page
  const starterPage = generateStarterPage(templateType, projectName.trim(), description.trim(), selectedAddons, projectDir);
  await fs.writeFile(path.join(projectDir, "app", "page.tsx"), starterPage, "utf-8");

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
    // Non-fatal -user can run npm install manually
    s.stop(pc.yellow("Dependencies didn't install automatically, but that's okay!"));
    p.note(
      `Just run ${info("npm install")} inside your project folder.`,
      "Quick fix"
    );
  }

  s.stop(success("Project created!"));

  // ── Success message ──
  console.log();
  console.log(brand("  You're all set! Copy and paste these two commands:"));
  console.log();
  const cdLine = "cd " + projectName;
  const devLine = "npm run dev";
  const innerWidth = Math.max(cdLine.length, devLine.length) + 4;
  const pad = (text) => text + " ".repeat(innerWidth - text.length);
  console.log(`  ┌${"─".repeat(innerWidth)}┐`);
  console.log(`  │${" ".repeat(innerWidth)}│`);
  console.log(`  │  ${info(cdLine)}${" ".repeat(innerWidth - cdLine.length - 2)}│`);
  console.log(`  │  ${info(devLine)}${" ".repeat(innerWidth - devLine.length - 2)}│`);
  console.log(`  │${" ".repeat(innerWidth)}│`);
  console.log(`  └${"─".repeat(innerWidth)}┘`);
  console.log();
  console.log(`  ${dim("This starts your project. When you see")} ${success("Ready")}${dim(",")}`);
  console.log(`  ${dim("open")} ${info("http://localhost:3000")} ${dim("in your browser.")}`);
  console.log();
  console.log(`  ${dim("The page will show you exactly what to do next.")}`);
  console.log();

  p.outro(
    gold("Good vibes only! ") +
      dim("// gvc-builder-kit v0.5.0")
  );
}

main().catch((err) => {
  p.cancel("Something went wrong!");
  console.error(err);
  process.exit(1);
});

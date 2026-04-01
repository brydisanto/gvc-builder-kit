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
    value: "project-site",
    label: "A website for my project",
    hint: "landing page, about, team",
  },
  {
    value: "tracker",
    label: "A tool that tracks something",
    hint: "stats, dashboards, data",
  },
  {
    value: "mini-game",
    label: "A game or interactive experience",
    hint: "browser games, quizzes",
  },
  {
    value: "gallery",
    label: "A place to show off my collection",
    hint: "NFT gallery, portfolio",
  },
  {
    value: "vote-and-rank",
    label: "A voting or ranking page",
    hint: "polls, leaderboards, brackets",
  },
  {
    value: "community-page",
    label: "A community hub",
    hint: "events, members, social",
  },
  {
    value: "blog-journal",
    label: "A blog or content page",
    hint: "articles, updates, journal",
  },
  {
    value: "link-in-bio",
    label: "A simple links page",
    hint: "linktree-style, quick setup",
  },
  {
    value: "blank-canvas",
    label: "I have my own idea (blank start)",
    hint: "start fresh, full freedom",
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

// ── CLAUDE.md generation ─────────────────────────────────────────────
function generateClaudeMd(projectName, templateType, description, addons) {
  const addonLabels = addons
    .map((a) => {
      const found = ADDONS.find((ad) => ad.value === a);
      return found ? `- ${found.label}` : `- ${a}`;
    })
    .join("\n");

  return `# ${projectName}

## What This Project Is About
${description}

## Template
Built from the **${templateType}** template in the GVC Builder Kit.

## Selected Add-ons
${addonLabels || "None selected"}

---

## GVC Brand Rules

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

### Available CSS Utilities
- \`.text-shimmer\` -- animated gold gradient text
- \`.card-glow\` -- gold glow box shadow with hover enhancement
- \`.ember\` -- floating gold particle dot
- \`.font-display\` -- Brice headline font
- \`.font-body\` -- Mundial body font

### Assets
- GVC fonts in \`/public/fonts/\` (Brice, Mundial)
- Badge images can be loaded from IPFS or local \`/public/badges/\`

---

## Example Prompts to Try

Here are some things you can ask Claude to help you build:

### Getting started
- "Set up the homepage with a hero section using GVC brand colors"
- "Add a responsive navigation bar with the GVC logo"
- "Create a footer with social links and GVC branding"

### Features
${addons.includes("collection-data") ? '- "Fetch and display GVC NFT collection data with floor price"\n' : ""}${addons.includes("token-prices") ? '- "Add a live ETH/VIBESTR price ticker to the header"\n' : ""}${addons.includes("web3-wallet") ? '- "Add a connect wallet button that shows the user\'s address"\n' : ""}${addons.includes("stats-panel") ? '- "Build an animated stats dashboard with counters and charts"\n' : ""}${addons.includes("leaderboard") ? '- "Create a leaderboard with daily/weekly/all-time tabs"\n' : ""}${addons.includes("game-engine") ? '- "Set up a basic game loop with canvas rendering"\n' : ""}${addons.includes("badge-collection") ? '- "Display the GVC badge collection with tier filtering"\n' : ""}${addons.includes("auth") ? '- "Add authentication with edge-compatible sessions"\n' : ""}- "Make the page responsive for mobile"
- "Add smooth scroll animations"
- "Deploy this to Vercel"

---

## Tech Stack
- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **Language:** TypeScript
- **Deployment:** Vercel (recommended)

## Project Structure
\`\`\`
${projectName}/
  app/           → Pages and layouts (App Router)
  components/    → Reusable UI components
  public/        → Static assets (images, fonts)
  CLAUDE.md      → This file (context for Claude)
  README.md      → Human-readable docs
\`\`\`
`;
}

// ── README.md generation ─────────────────────────────────────────────
function generateReadme(projectName, templateType, description) {
  return `# ${projectName}

${description}

Built with the [GVC Builder Kit](https://github.com/gvc-builder-kit) for the Good Vibes Club community.

## Getting Started

\`\`\`bash
# Install dependencies (already done for you)
npm install

# Start the dev server
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) to see your project.

## Working with Claude

This project includes a \`CLAUDE.md\` file that gives Claude context about your project, the GVC brand, and what you're building.

**To use it:**
1. Open this project folder in your terminal
2. Run \`claude\` to start a conversation
3. Ask Claude to help you build features — it already knows your project context

**Example:**
\`\`\`
claude "Add a hero section with the GVC gold color scheme"
\`\`\`

## Template: ${templateType}

This project was scaffolded from the **${templateType}** template. You can customize everything — the template is just a starting point.

## Deploying

The easiest way to deploy is with [Vercel](https://vercel.com):

1. Push your code to GitHub
2. Connect the repo to Vercel
3. It auto-detects Next.js and deploys

## Learn More

- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Good Vibes Club](https://goodvibesclub.io)
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

// ── Main CLI flow ────────────────────────────────────────────────────
async function main() {
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

  // Determine template source — fall back to blank-canvas if selected template doesn't exist
  let templateSrc = path.join(TEMPLATES_DIR, templateType);
  let usedFallback = false;

  if (!fs.existsSync(templateSrc) || fs.readdirSync(templateSrc).filter((f) => !f.startsWith(".")).length === 0) {
    templateSrc = path.join(TEMPLATES_DIR, "blank-canvas");
    if (templateType !== "blank-canvas") {
      usedFallback = true;
    }
  }

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
  const readme = generateReadme(projectName, templateType, description);
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

  // ── Success message ──
  console.log();

  if (usedFallback) {
    p.note(
      `The ${gold(templateType)} template isn't built yet, so we used the ${gold("blank-canvas")} starter.\nNo worries -- Claude knows what you're building and can help shape it!`,
      "Heads up"
    );
  }

  const addonCount = selectedAddons.length;
  if (addonCount > 0) {
    p.note(
      `${gold(`${addonCount} add-on${addonCount === 1 ? "" : "s"}`)} noted in your CLAUDE.md.\nWhen you open Claude, ask it to set up any add-on -- it knows what you picked.`,
      "Add-ons"
    );
  }

  const nextSteps = [
    `${info("cd")} ${projectName}`,
    `${info("npm run dev")}          ${dim("Start the dev server")}`,
  ];

  if (hasClaude) {
    nextSteps.push(
      `${info("claude")}              ${dim("Open Claude and start building")}`
    );
  } else {
    nextSteps.push(
      `${dim("Install Claude CLI:")} ${info("https://docs.anthropic.com/claude-code")}`
    );
  }

  p.note(nextSteps.join("\n"), "Next steps");

  if (!hasClaude) {
    p.note(
      `The Claude CLI makes building way easier.\nIt reads your ${gold("CLAUDE.md")} and knows your project context.\n\nGet it at: ${info("https://docs.anthropic.com/claude-code")}`,
      "Pro tip"
    );
  }

  p.outro(
    gold("Good vibes only. Go build something amazing! ") +
      dim("// gvc-builder-kit v0.1.0")
  );
}

main().catch((err) => {
  p.cancel("Something went wrong!");
  console.error(err);
  process.exit(1);
});

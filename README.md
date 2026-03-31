# GVC Builder Kit

**One command. GVC brand. Ship something.**

`npx gvc create` gets any community member from idea to deployed project in minutes — no coding experience required. The GVC brand system is baked in, Claude knows the rules, and deploying is one command.

---

## How it works

```
npx gvc create

? What's your project called? my-gvc-tracker

? What do you want to build?
  ● A website for my project
  ○ A tool that tracks something
  ○ A game or interactive experience
  ○ A place to show off my collection
  ○ A voting or ranking page
  ○ A community hub
  ○ A blog or content page
  ○ A simple links page
  ○ I have my own idea (blank start)

? Describe your idea in a sentence or two:
  > A dashboard that shows which GVCs are listed under 0.5 ETH
    and tracks who's been sweeping the most

  Got it — I'll set you up with the Tracker template
  and include GVC Collection data + Animated stats panel.

? Want to add anything else?
  ◻ Web3 wallet connect
  ◻ Token prices (ETH, VIBESTR, PNKSTR)
  ◻ Leaderboard system
  ◻ Toast notifications

✔ Created my-gvc-tracker

Next steps:
  cd my-gvc-tracker
  gvc dev        ← start building
  gvc deploy     ← ship to the world

Open your project in Claude and tell it what you
want to change. It already knows the GVC brand.
```

You describe what you want. The CLI figures out the rest.

---

## What's inside every project

**GVC Brand System**
- Gold (#FFE048), black, dark grays — the full color palette
- Brice + Mundial fonts loaded and configured
- Gold glow effects, shimmer animations, glassmorphism cards
- Shaka icon and particle effects available

**Claude-Ready**
- Every project includes a `CLAUDE.md` that teaches Claude the GVC brand rules
- Members can open their project in Claude and start vibe coding immediately
- Claude keeps them on-brand automatically

**Human README**
- Not a dev README — a plain-English guide that says exactly what to do next
- Example prompts to give Claude so you can start customizing right away

**Deploy in one command**
- `gvc deploy` handles Vercel setup — no config needed
- Custom domains supported

---

## Templates

Described by what you want to build, not technical jargon.

| You say... | Template | What you get |
|---|---|---|
| "A website for my project" | **Project Site** | Hero, about section, features grid, CTA, footer |
| "A tool that tracks something" | **Tracker** | Stats cards, charts, live data feeds, refresh intervals |
| "A game or interactive experience" | **Mini Game** | Game board scaffold, scoring, game-over screen, leaderboard |
| "A place to show off my collection" | **Gallery** | Image grid with gold glow cards, upload/submit, filtering |
| "A voting or ranking page" | **Vote & Rank** | 1v1 matchups or poll-style voting, leaderboard, results |
| "A community hub" | **Community Page** | Member highlights, activity feed, badge wall, links |
| "A blog or content page" | **Blog / Journal** | Post list, individual post pages, markdown support |
| "A simple links page" | **Link-in-Bio** | Profile card, link list, socials, GVC-styled |
| "I have my own idea" | **Blank Canvas** | Just the brand system, ready for anything |

All templates use Next.js, Tailwind, Framer Motion, and TypeScript — the same proven stack behind every GVC site.

---

## Add-ons

Modular extras suggested based on your idea. Each comes with working API routes, typed helper functions, example components, and `.env.example` files.

**Blockchain & Data**
| Add-on | What it scaffolds |
|---|---|
| **Web3 wallet connect** | RainbowKit + wagmi config, connect button component |
| **GVC Collection data** | OpenSea API routes, `getGVCListings()`, `getFloorPrice()` helpers |
| **Token prices** | CoinGecko + DexScreener feeds for ETH/VIBESTR/PNKSTR |
| **On-chain reads** | viem client, ERC20 balance reads, contract call helpers |
| **IPFS image loading** | Multi-gateway fallback (dweb, Cloudflare, Pinata), proxy route |

**Game & Social**
| Add-on | What it scaffolds |
|---|---|
| **Badge collection** | 90 GVC badges across 4 tiers (Common/Silver/Gold/Cosmic), PinBook UI, drop tables |
| **Leaderboard system** | Daily, weekly, all-time leaderboards with Vercel KV + optimistic UI |
| **Auth** | Edge-compatible JWT sessions via Web Crypto API — works on Vercel Edge |
| **Game engine scaffold** | Pure game logic layer, seeded PRNG for daily challenges, scoring multipliers |
| **Audio mixer** | Web Audio API with 3-bus hierarchy, voice limiting, music ducking |

**UI Components**
| Add-on | What it scaffolds |
|---|---|
| **Toast notifications** | Toast provider, gold-themed notifications, auto-dismiss |
| **Animated stats panel** | Stat card grid with count-up animations, loading states, 24h deltas |
| **Vercel KV** | Redis setup, KV helpers, `.env` template |

---

## Smart suggestions

You don't need to know which add-ons to pick. Describe your idea and the CLI recommends what you need:

| Your description | CLI suggests |
|---|---|
| "A dashboard that tracks GVC floor price" | Tracker template + GVC Collection data + Animated stats panel |
| "A game where people vote on their favorite GVCs" | Vote & Rank template + IPFS image loading + Leaderboard system |
| "A page for my GVC art collection" | Gallery template + IPFS image loading |
| "A sweep tracker with wallet connect" | Tracker template + Web3 wallet + GVC Collection data + On-chain reads |
| "Something fun, not sure yet" | Blank Canvas — customize from there |

---

## Commands

| Command | What it does |
|---|---|
| `npx gvc create` | Scaffold a new project |
| `gvc dev` | Start local dev server |
| `gvc deploy` | Deploy to Vercel |
| `gvc templates` | Browse available templates |

---

## First-time setup

If it's your first time, the CLI walks you through everything:

1. Checks if Node.js is installed — links you to install if not
2. Checks if you have Claude — links you to get started
3. Runs the create flow
4. Opens your project with a README that tells you exactly what to do

No assumptions. No jargon. Just build.

---

## Who it's for

GVC community members who want to build something — a tracker, a game, a portfolio, a tool, anything — but don't know where to start. The Builder Kit removes every barrier:

- **No coding experience needed** — describe your idea, customize with Claude
- **No design decisions** — GVC brand is already there
- **No deploy complexity** — one command
- **No blockchain learning curve** — add-ons handle the setup

---

## Built from 5 production GVC projects

Every template and add-on is extracted from real, shipped GVC projects — not invented from scratch:

- **GVC Gallery** — community art gallery with submissions and voting
- **Smash the Wall** — real-time NFT market analytics dashboard
- **Vibepool** — crypto portfolio tracker with badge system
- **VibeOff** — 1v1 voting game with Elo rankings and VIBESTR payments
- **VibeMatch** — match-3 puzzle game with badge collection and leaderboards

The patterns are proven. The brand system is battle-tested.

---

## What's NOT in v1

- Community tracker / "ship it" feed (v2)
- Web-based launcher at gvc.build (v2)
- Non-Next.js templates (React Native, games, etc.)

---

## Tech

- Built with Node.js + clack (terminal UI)
- Distributed via npm (`npx gvc create`)
- Templates stored in the CLI package
- Deploy helper wraps Vercel CLI

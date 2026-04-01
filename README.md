<p align="center">
  <img src="web/public/shaka.png" alt="GVC Shaka" width="80" />
</p>

<h1 align="center">GVC Builder Kit</h1>

<p align="center">
  <strong>One command. GVC brand. Ship something.</strong>
  <br />
  <em>Built by the community, for the community.</em>
</p>

<p align="center">
  <a href="https://web-seven-tan-85.vercel.app"><strong>Try the Web Builder</strong></a>
  &nbsp;&nbsp;·&nbsp;&nbsp;
  <a href="#getting-started"><strong>Get Started</strong></a>
  &nbsp;&nbsp;·&nbsp;&nbsp;
  <a href="#what-can-i-build"><strong>Templates</strong></a>
  &nbsp;&nbsp;·&nbsp;&nbsp;
  <a href="#power-ups"><strong>Power-ups</strong></a>
</p>

---

The GVC Builder Kit gets you from idea to live project in minutes. No coding experience needed. The GVC brand is baked in, Claude knows the design rules, and deploying is one command.

Every template and power-up is extracted from **5 real, shipped GVC projects**: the Gallery, Smash the Wall, Vibepool, VibeOff, and VibeMatch. Nothing is made up. Everything is battle-tested.

---

## Getting Started

### Step 1: Install the basics

You need two things on your computer. If you already have them, skip to Step 2.

**Node.js** (makes everything run)
1. Go to [nodejs.org](https://nodejs.org)
2. Download the **LTS version** (the big green button)
3. Open the installer and follow the steps
4. When it's done, open your terminal and type `node -v` and you should see a version number

**Claude** (your AI building partner)
1. Go to [claude.ai/download](https://claude.ai/download) and install Claude for desktop
2. Or install Claude Code in your terminal: `npm install -g @anthropic-ai/claude-code`

### Step 2: Create your project

Open your terminal and run:

```
npx gvc create
```

The Builder Kit walks you through everything:

```
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
  > A dashboard that shows which GVCs are listed
    under 0.5 ETH and tracks who's been sweeping

  Got it! Setting you up with the Tracker template
  and including GVC Collection data + Stats panel.
```

You describe what you want. The Builder Kit figures out the rest.

### Step 3: Start building

```
cd my-gvc-tracker
gvc dev
```

Your project is now running on your computer. Open it in the browser to see it.

### Step 4: Customize with Claude

Open your project folder in Claude and start telling it what you want. Your project already includes a brand guide so Claude knows the GVC style.

Try things like:

> "Add a hero section with a big gold title that says Welcome to my Tracker"

> "Show the current GVC floor price in a glowing stats card"

> "Add a leaderboard that shows the top 10 sweepers"

> "Make the background darker and add some floating gold particles"

Claude will keep everything on-brand automatically.

### Step 5: Ship it

When you're ready to go live:

```
gvc deploy
```

Your project is now live on the internet with a shareable URL.

**That's it. You just built and shipped something.**

---

## Try it in the browser first

Not ready for the terminal? No worries.

Use the **[Web Builder](https://web-seven-tan-85.vercel.app)** to walk through the setup visually. Pick your template, describe your idea, choose power-ups, then get a command to run when you're ready.

---

## What you're building with

Every project comes loaded with the **GVC brand system**. The same design behind every GVC site you've seen.

| What's included | Details |
|---|---|
| **Color palette** | Gold (#FFE048), black, dark grays. The full system |
| **Typography** | Brice (headlines) + Mundial (body) loaded and ready |
| **Effects** | Gold glow, shimmer animations, glassmorphism cards, embers |
| **Icons** | Shaka and particle effects available |
| **Claude brand guide** | Every project includes a guide so Claude keeps you on-brand |

---

## What can I build?

Anything you can imagine. The Builder Kit gives you a starting point, and you take it wherever you want.

| You say... | What you get |
|---|---|
| "A website for my project" | Hero, about section, features grid, CTA, footer |
| "A tool that tracks something" | Stats cards, charts, live data feeds, auto-refresh |
| "A game or interactive experience" | Game board, scoring, game-over screen, leaderboard |
| "A place to show off my collection" | Image grid with gold glow cards, uploads, filtering |
| "A voting or ranking page" | 1v1 matchups or poll-style voting, leaderboard, results |
| "A community hub" | Member highlights, activity feed, badge wall, links |
| "A blog or content page" | Post list, individual post pages, writing support |
| "A simple links page" | Profile card, link list, socials, all GVC-styled |
| "I have my own idea" | Just the brand system, ready for anything |

---

## Power-ups

Want to connect to blockchain data, add a leaderboard, or build a game? Just describe your idea and the Builder Kit recommends what you need. You can also pick them yourself.

### Blockchain & Data

| Power-up | What it gives you |
|---|---|
| **Web3 wallet connect** | Let users connect their wallet to your site |
| **GVC Collection data** | Pull live GVC listings, floor price, and owner data |
| **Token prices** | Show live prices for ETH and VIBESTR |
| **On-chain reads** | Read wallet balances and smart contract data |
| **IPFS image loading** | Load NFT images reliably with automatic fallbacks |

### Games & Social

| Power-up | What it gives you |
|---|---|
| **Badge collection** | All 90 GVC badges across 4 tiers with a collection UI |
| **Leaderboard** | Daily, weekly, and all-time rankings |
| **User accounts** | Let people sign up and save their progress |
| **Game engine** | Scoring, daily challenges, and game logic ready to go |
| **Audio** | Sound effects and music for games and interactive projects |

### UI Extras

| Power-up | What it gives you |
|---|---|
| **Notifications** | Gold-themed popup alerts |
| **Stats panel** | Animated number cards with live data |
| **Database** | Save and retrieve data for your project |

You don't need to understand what any of these are. Describe your idea and the Builder Kit handles it.

---

## Smart suggestions

The Builder Kit reads your description and picks the right setup:

| Your idea | What you get |
|---|---|
| "A dashboard that tracks GVC floor price" | Tracker + Collection data + Stats panel |
| "A game where people vote on favorite GVCs" | Vote & Rank + NFT images + Leaderboard |
| "A page for my GVC art collection" | Gallery + NFT image loading |
| "A sweep tracker with wallet connect" | Tracker + Wallet + Collection data + On-chain reads |
| "Something fun, not sure yet" | Blank Canvas. Build whatever you want |

---

## Commands

| Command | What it does |
|---|---|
| `npx gvc create` | Create a new project |
| `gvc dev` | Run your project locally |
| `gvc deploy` | Ship it live |
| `gvc templates` | See all available templates |

---

## Where it all comes from

Every template and power-up is extracted from real GVC projects that are live right now:

| Project | What it is |
|---|---|
| **GVC Gallery** | Community art gallery with submissions and shaka voting |
| **Smash the Wall** | Real-time NFT market analytics dashboard |
| **Vibepool** | Crypto portfolio tracker with badge system |
| **VibeOff** | 1v1 voting game with Elo rankings |
| **VibeMatch** | Match-3 puzzle game with badge collection and leaderboards |

The patterns are proven. The brand system is battle-tested.

---

## Need help?

- Open your project in Claude and ask it anything
- Check the README inside your project for example prompts
- Ask in the GVC Discord. The community is always here to help

<p align="center">
  <br />
  <strong>Good Vibes Club</strong>
  <br />
  <em>Build something.</em>
</p>

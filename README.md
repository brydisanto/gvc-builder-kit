<p align="center">
  <img src="web/public/shaka.png" alt="GVC Shaka" width="80" />
</p>

<p align="center">
  Good Vibes Club Presents
</p>

<h1 align="center">The Playground</h1>

<p align="center">
  A builder toolkit for the GVC community
  <br />
  <em>Built by the community, for the community</em>
  <br /><br />
  <strong>One command. GVC brand. Ship something.</strong>
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

---

## Want to skip the setup? Start here.

Not ready to open a terminal? No problem at all.

Use the **[Web Builder](https://web-seven-tan-85.vercel.app)** to plan your project visually. Pick your template, describe your idea, choose power-ups, and see everything come together on screen. When you're ready to build it for real, it gives you the exact command to run.

This is the easiest way to get started, especially if you've never used a terminal before.

---

## What You'll Need

Before you start, here's what you need. That's it.

- **A computer.** Mac or Windows both work.
- **About 10 minutes.** That's all the setup takes.
- **No coding experience.** Seriously. You'll be guided through every step.

---

## Getting Started

This section walks you through everything from scratch. If you've never opened a terminal before, you're in the right place. We'll tell you exactly what to type at every step.

### Step 1: Open your terminal

A terminal is an app on your computer where you type commands. It looks like a text window with a blinking cursor. You type a command, press Enter, and the computer does something. That's all there is to it.

**If you're on a Mac:**
Open the Terminal app. You can find it by pressing Cmd+Space to open Spotlight search, then typing "Terminal" and pressing Enter.

**If you're on Windows:**
Open Command Prompt. Press the Windows key on your keyboard and type "cmd", then press Enter.

You should see a window with a blinking cursor. This is where you'll type commands to create and run your project. Don't worry. We'll tell you exactly what to type every step of the way.

### Step 2: Install Node.js

Node.js is what makes your project run on your computer. Think of it like an engine for your website. Without it, the project can't start. You only need to install it once.

1. Go to [nodejs.org](https://nodejs.org) in your browser
2. Click the big green button that says **LTS** (this is the stable version)
3. Open the file you downloaded and follow the installer steps. Just click "Next" or "Continue" until it's done.
4. Once it's installed, go back to your terminal and type `node -v` then press Enter. You should see a version number like `v20.11.0`. If you do, you're all set.

### Step 3: Install Claude

Claude is your AI building partner. It reads the brand guide in your project and helps you customize everything without writing code yourself. You just tell it what you want in plain English, and it does the work.

There are two ways to get Claude:

**Option A: Claude for Desktop (easiest)**
Go to [claude.ai/download](https://claude.ai/download) and install the desktop app, just like installing any other app.

**Option B: Claude Code in your terminal**
If you want to use Claude right from your terminal, type this command and press Enter:

```
npm install -g @anthropic-ai/claude-code
```

Either option works. Pick whichever feels more comfortable.

### Step 4: Create your project

This is the fun part. Copy the command below, paste it into your terminal, and press Enter. The Builder Kit will ask you a few questions about what you want to build.

```
npx create-gvc-app
```

Here's what it looks like:

```
? What's your project called? my-gvc-tracker

? What do you want to build?
  * A website for my project
    A tool that tracks something
    A game or interactive experience
    A place to show off my collection
    A voting or ranking page
    A community hub
    A blog or content page
    A simple links page
    I have my own idea (blank start)

? Describe your idea in a sentence or two:
  > A dashboard that shows which GVCs are listed
    under 0.5 ETH and tracks who's been sweeping

  Got it! Setting you up with the Tracker template
  and including GVC Collection data + Stats panel.
```

You describe what you want. The Builder Kit figures out the rest.

### Step 5: Start building

Now let's get your project running so you can see it. Type these two commands in your terminal, one at a time, pressing Enter after each:

```
cd my-gvc-tracker
npm run dev
```

The first command moves you into your project folder. The second command starts your project on your computer so you can see it in your browser.

Once it's running, open your web browser and go to:

```
http://localhost:3000
```

What is localhost:3000? It just means "your project, running on your own computer." It's not on the internet yet. Only you can see it. This is where you preview your work as you build.

### Step 6: Customize with Claude

Open your project folder in Claude and start telling it what you want. Your project already includes a brand guide so Claude knows the GVC style.

You don't need to know any programming. Just tell Claude what you want in plain English. Talk to it like you'd talk to a designer or a friend who knows how to code.

Try things like:

> "Add a hero section with a big gold title that says Welcome to my Tracker"

> "Show the current GVC floor price in a glowing stats card"

> "Add a leaderboard that shows the top 10 sweepers"

> "Make the background darker and add some floating gold particles"

Claude will keep everything on-brand automatically.

### Step 7: Ship it

When you're ready to go live, deploy your project to Vercel. It's free and takes about two minutes.

1. Push your project to a GitHub repository
2. Go to [vercel.com](https://vercel.com) and sign in with GitHub
3. Click "Add New Project" and import your repo
4. Click "Deploy"

That's it. Vercel gives you a live URL you can share with anyone.

**You just built and shipped something.**

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

When you pick extras during setup, they get added to your project's Claude guide. Open your project in Claude and tell it what you want to build. It already knows which features you selected and how to set them up.

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
| `npx create-gvc-app` | Create a new project (no install needed) |
| `npm run dev` | Run your project locally |
| Deploy via [Vercel](https://vercel.com) | Ship it live |

**Power user?** Install globally with `npm install -g create-gvc-app` to unlock shortcuts:

| Command | What it does |
|---|---|
| `gvc dev` | Same as `npm run dev` |
| `gvc deploy` | Deploy to Vercel from the terminal |
| `gvc templates` | Browse all available templates |

---

## Community Data API

Your project can pull live GVC data with zero setup. The community API is already wired into every project through `lib/gvc-api.ts`.

| Endpoint | What it returns |
|---|---|
| Collection stats | Floor price, market cap, 24h volume, total owners |
| Holder rankings | All holders ranked by token count, diamond hands stats |
| Recent sales | Live sales feed with buyer, seller, price, images |
| Sales history | 11,000+ historical sales for charts |
| Community activity | 30-day buys, sells, accumulator leaderboard |
| VIBESTR data | Token price, liquidity, volume, burned amount |
| Market depth | Bid and offer levels |
| Trader analysis | Profitable flips with hold times |
| Wallet lookup | ENS name, Twitter handle for any wallet |

No API key needed. Just import and use:

```ts
import { getStats, getHolders } from "@/lib/gvc-api";
const stats = await getStats();
```

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

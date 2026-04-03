# floor-tracker

## What to Build
I'd like to chart the good vibes club floor price over time, and also indicate on the chart when any major sweeps happen 

## Starting Point
This project uses the **A sweep or floor tracker** pattern. Here's what Claude should build first:

Build a floor/sweep tracker with: a stats panel showing current floor price, 24h volume, and total listings, a live feed of recent sales, and a chart showing floor price history. Use getStats(), getRecentSales(), and getSalesHistory() from lib/gvc-api.ts. Auto-refresh every 60 seconds.

## Selected Power-ups
- **GVC Collection data** -- fetch NFT metadata, floor prices
- **Token prices (ETH, VIBESTR)** -- live price feeds
- **Animated stats panel** -- counters, charts, dashboards

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
- CSS variables: `--font-brice` for display, `--font-mundial` for body
- Tailwind: `font-display` for headlines, `font-body` for text

### Design Language
- Dark-first design (#050505 background)
- Gold accents (#FFE048) for CTAs, highlights, important elements
- Gold shimmer effect on key headlines (`.text-shimmer` class)
- Gold glow on hover for cards (`.card-glow` class)
- Floating ember particles for ambient effect (`.ember` class)
- Rounded corners (12-16px), soft shadows
- Generous whitespace -- let things breathe
- Micro-animations on hover/interaction (scale, glow, fade)
- Use Framer Motion for entry animations

### CSS Utilities
- `.text-shimmer` -- animated gold gradient text
- `.card-glow` -- gold glow box shadow with hover enhancement
- `.ember` -- floating gold particle dot
- `.font-display` -- Brice headline font
- `.font-body` -- Mundial body font

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

## Code Patterns

### Fetching GVC Floor Price & Listings

```ts
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
```

### Fetching Token Prices

```ts
// ETH price
const ethRes = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd");
const ethData = await ethRes.json();
const ethPrice = ethData.ethereum.usd;

// VIBESTR price
const vibeRes = await fetch("https://api.dexscreener.com/latest/dex/tokens/0xd0cC2b0eFb168bFe1f94a948D8df70FA10257196");
const vibeData = await vibeRes.json();
const vibePrice = vibeData.pairs?.[0]?.priceUsd ?? "0";
```

### Animated Stat Card Component

```tsx
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
```

## Example Prompts to Try
- "Build me a homepage with a hero section and GVC branding"
- "Create a dashboard that shows NFT collection stats"
- "Add a responsive navigation bar with the GVC logo"
- "Show the GVC floor price and total volume in the header"
- "Add a live ETH and VIBESTR price ticker"
- "Build an animated stats row with counters that tick up on load"
- "Make everything responsive and look great on mobile"
- "Add smooth page transitions with Framer Motion"

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

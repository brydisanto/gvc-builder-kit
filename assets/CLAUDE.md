# GVC Builder Kit Project

This project was created with the GVC Builder Kit. It uses the Good Vibes Club brand system and is designed to be customized with Claude.

## Brand System

### Colors
- **Gold (primary):** #FFE048
- **Black (background):** #050505
- **Dark (cards/surfaces):** #121212
- **Gray (borders/dividers):** #1F1F1F
- **Pink accent:** #FF6B9D
- **Orange (CTAs):** #FF5F1F
- **Green (success):** #2EFF2E

### Typography
- **Headlines:** Brice (Bold 700, Black 900) loaded from `/public/fonts/`
- **Body text:** Mundial (Regular 400, Demibold 600, Bold 700) loaded from `/public/fonts/`
- Brice is used via `font-display` class, Mundial via `font-body` class

### Effects
- Gold glow: `shadow-[0_0_20px_rgba(255,224,72,0.3)]`
- Shimmer animation: `text-shimmer` class
- Glassmorphism: `backdrop-blur-sm` with `bg-white/[0.04]` and `border-white/[0.08]`
- Card hover glow: `card-glow` class
- Gold embers: floating particle effect available via `ember` class

### Design patterns
- Dark backgrounds with gold accents
- Rounded corners (`rounded-xl` or `rounded-2xl` for cards, `rounded-full` for pills/buttons)
- Borders use low-opacity white (`border-white/10`) or gold (`border-gvc-gold/30`)
- Hover states: scale up slightly (`hover:scale-105`) and increase glow
- Text hierarchy: gold for emphasis, white for primary, white/50 for secondary, white/30 for muted

## Tech Stack
- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS
- Framer Motion (for animations)

## Contracts and Data

### Smart Contracts (Ethereum Mainnet)
- **GVC NFT:** `0xB8Ea78fcaCEf50d41375E44E6814ebbA36Bb33c4`
- **VIBESTR Token:** `0xd0cC2b0eFb168bFe1f94a948D8df70FA10257196`
- **WETH:** `0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2`
- **Burn Address:** `0x000000000000000000000000000000000000dEaD`

### APIs
- **OpenSea Collection Slug:** `good-vibes-club`
- **OpenSea API v2:** `https://api.opensea.io/api/v2`
  - Listings: `GET /listings/collection/good-vibes-club/all`
  - Collection stats: `GET /collection/good-vibes-club`
  - NFT by token: `GET /chain/ethereum/contract/{address}/nfts/{tokenId}`
  - Requires header: `x-api-key: {OPENSEA_API_KEY}`
  - To get a key: go to https://opensea.io/account/settings, sign in, scroll to Developer, click Create API Key
- **Token Prices:**
  - ETH: `https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd`
  - VIBESTR: `https://api.dexscreener.com/latest/dex/tokens/0xd0cC2b0eFb168bFe1f94a948D8df70FA10257196`
- **Ethereum RPC:** `https://ethereum-rpc.publicnode.com` (free, no key needed)
- **NFT Images:** `https://i.seadn.io` (OpenSea CDN)

### Key URLs
- **OpenSea Collection:** https://opensea.io/collection/good-vibes-club
- **Badge Explorer:** https://www.goodvibesclub.io/badges/explore
- **GVC Website:** https://www.goodvibesclub.io

## Badges

There are 101 GVC badges across multiple tiers. Badge images are in `/public/badges/` (if the badge add-on is installed) or available in the Builder Kit assets.

### Tiers
- **Common** (grey #E0E0E0): 16 badges
- **Rare** (blue #4A9EFF): 52 badges
- **Legendary** (gold #FFE048): 13 badges
- **Cosmic** (purple #B366FF): 3 badges
- **Special** (token tiers, collector milestones, activity): 17 badges

The full badge manifest with IDs, names, tiers, and categories is in `badges.json` if included with the project.

### Badge-Token Map

`badge_token_map.json` maps every GVC NFT (by token ID) to its earned badges, and every badge to its qualifying token IDs. This is the core data for determining which holders earn which badges based on their NFT traits.

Structure:
- `badgeToTokens`: badge ID -> array of token IDs that qualify for that badge
- `tokenToBadges`: token ID -> array of badge IDs that token has earned

68 badges mapped across all 6,969 GVC tokens (21,856 total assignments).

Use cases:
- Look up a wallet's NFTs, then check `tokenToBadges` to show which badges they've earned
- Build a badge leaderboard by counting how many badges each holder has
- Filter the collection by badge (e.g. "show me all One of One holders")
- Create badge-gated features or content

### Badge Helpers (`lib/badge-helpers.ts`)

`getHolderBadges(tokenIds, map, vibestrBalance?)` returns ALL badges for a holder, including derived badges:
- Individual token badges (from the map)
- Combo badges (3+ or 5+ tokens with gradient_lover, plastic_lover, or robot_lover)
- Collector milestones (5, 10, 15, 20, 30, 40, 50, 60+ unique badges)
- VIBESTR tier badge (based on token balance: 10K blue through 10M cosmic)

```ts
import { getHolderBadges } from "@/lib/badge-helpers";

const map = await fetch('/badge_token_map.json').then(r => r.json());

// Get all badges for a holder who owns these 5 tokens and has 150K VIBESTR
const result = getHolderBadges(["142", "572", "3933", "668", "1082"], map, 150000);

result.individualBadges;  // badges from their tokens
result.comboBadges;       // e.g. ["gradient_hatrick"] if 3+ gradient_lover tokens
result.collectorBadges;   // e.g. ["five_badges"] if 5+ total badges
result.vibestrTierBadge;  // "vibestr_silver_tier" (150K >= 100K threshold)
result.allBadges;         // everything combined
result.totalUniqueBadges; // total count
```

Also available: `getVibestrTier(balance)`, `getCollectorMilestones(count)`, `getTokensForBadge(id, map)`, `getBadgesForToken(id, map)`

### Badge Leaderboard API (recommended for most use cases)

The fastest way to look up badges. Returns everything pre-computed.

```ts
import { getBadgeLeaderboard, getWalletBadges } from "@/lib/gvc-api";

// Get a single wallet's badges
const { badges, profile } = await getWalletBadges("0xabc...");

// Get the full leaderboard (all wallets, all badges, rarity counts)
const lb = await getBadgeLeaderboard();
// lb.badges["0xabc..."] -> ["rainbow_citizen", "mountain_goat", ...]
// lb.ledger["rainbow_citizen"] -> 252 (holder count, for rarity)
// lb.profileData["0xabc..."] -> { customName: "vibes.eth", ... }
```

### Earned Badges API

Some badges are manually assigned by GVC admins (e.g. vibestr_bounty_hunter). These can't be derived from on-chain data.

```ts
import { getEarnedBadges, getEarnedBadgesBatch } from "@/lib/gvc-api";

const earned = await getEarnedBadges("0xabc...");
// ["vibestr_bounty_hunter"]

// Batch (up to 50 wallets per request)
const batch = await getEarnedBadgesBatch(["0xabc...", "0xdef..."]);
// { "0xabc...": ["vibestr_bounty_hunter"], "0xdef...": [] }
```

### Badge Data Sources (101 total)

| Source | Count |
|---|---|
| NFT trait evaluation | 81 |
| ERC-20 balance (VIBESTR tiers) | 8 |
| ERC-1155 ownership (HighKey Moments) | 2 |
| Milestone (badge count thresholds) | 9 |
| Manual assignment | 1 |

### Key Contracts

| Contract | Address |
|---|---|
| VIBESTR Token | 0xd0cC2b0eFb168bFe1f94a948D8df70FA10257196 (ERC-20, 18 decimals) |
| HighKey Moments | 0x74fcb6eb2a2d02207b36e804d800687ce78d210c (ERC-1155) |
| GVC NFT | 0xB8Ea78fcaCEf50d41375E44E6814ebbA36Bb33c4 (ERC-721) |

## GVC Community API (`lib/gvc-api.ts`)

Live GVC data. No API key needed. No database setup. Just import and use.

```ts
import { getStats, getHolders, getRecentSales } from "@/lib/gvc-api";
```

| Function | Returns |
|---|---|
| `getStats()` | Floor price, market cap, 24h volume, total owners, total sales |
| `getHolders(limit?)` | All holders ranked by token count, diamond hands %, concentration |
| `getRecentSales(limit?)` | Recent sales with buyer, seller, price, token ID, image |
| `getSalesHistory(limit?)` | 11,000+ historical sales |
| `getActivity()` | 30-day buys/sells, accumulator leaderboard, new collectors |
| `getVibestr()` | Latest VIBESTR token data |
| `getVibestrHistory()` | 91 daily VIBESTR snapshots (price, liquidity, volume, burned) |
| `getMarketDepth()` | Bid/offer depth at each price level |
| `getTraders()` | Profitable flips with buy/sell prices and holding periods |
| `resolveWallet(address)` | ENS name, Twitter handle, and community tag for a wallet |
| `getMentions()` | Twitter/X mentions with engagement stats |

Example:
```ts
// In a server component or API route
const stats = await getStats();
// { floorPrice: 0.65, numOwners: 1513, marketCapUsd: 9247054, ... }

const holders = await getHolders(10);
// { stats: { totalHolders: 1513, diamondHandsPercent: 96.6, ... }, holders: [...] }

const sales = await getRecentSales(5);
// [{ tokenId: "3101", priceEth: 0.611, buyer: "0x...", imageUrl: "...", ... }]
```

Data refreshes every 60 seconds. No setup required.

## Code Snippets

If you need to add blockchain data or GVC-specific features, reference the snippets in `snippets.ts`. Available patterns:

1. **Fetch floor price** from OpenSea
2. **Fetch listings under a price** from OpenSea
3. **Read wallet balance** (ETH + VIBESTR) via viem
4. **Fetch token prices** (ETH + VIBESTR) from CoinGecko/DexScreener
5. **NFT image with fallback** component
6. **Badge card with tier glow** component
7. **Animated stats card** component
8. **Toast notifications** setup

## Project Structure

```
app/
  page.tsx          Main page
  layout.tsx        Root layout (fonts, metadata)
  globals.css       Brand tokens, animations, utilities
  api/              API routes (if any)
components/         Reusable components
public/
  fonts/            Brice + Mundial font files
  shaka.png         GVC shaka icon
  gvc-logotype.svg  Good Vibes Club wordmark
  grid.svg          Background grid texture
  badges/           Badge images (if add-on installed)
```

## Inspiration

This project's brand system is proven across 5 shipped GVC projects:
- **GVC Gallery** - community art gallery with submissions and voting
- **Smash the Wall** - real-time NFT market analytics dashboard
- **Vibepool** - crypto portfolio tracker with badge system
- **VibeOff** - 1v1 voting game with Elo rankings
- **VibeMatch** - match-3 puzzle game with badge collection and leaderboards

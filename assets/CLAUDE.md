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

# GVC Badge Engine Reference

This is a summary of the official badge system for builders. The full engine
and definitions are available from the GVC team.

## Recommended Approach

1. **Use the Leaderboard API first** (pre-computed, fastest):
   ```ts
   import { getBadgeLeaderboard, getWalletBadges } from "@/lib/gvc-api";
   
   const lb = await getBadgeLeaderboard();
   const walletBadges = lb.badges["0xabc..."] || [];
   ```

2. **Use the badge engine only when needed** (offline eval, what-if scenarios)

## Badge Data Sources (101 total)

| Source | Count | Data Required |
|---|---|---|
| NFT trait evaluation | 81 | Token metadata (traits, rank) |
| ERC-20 balance checks | 8 | VIBESTR token balance |
| ERC-1155 ownership | 2 | HighKey Moments holdings |
| Milestone (badge count) | 9 | Auto-computed from total earned |
| Manual assignment | 1 | GVC API call |

## VIBESTR Tier Thresholds

| Badge | Min Balance |
|---|---|
| Blue Tier | 69,000 |
| Pink Tier | 250,000 |
| Purple Tier | 500,000 |
| Bronze Tier | 1,000,000 |
| Silver Tier | 2,500,000 |
| Gold Tier | 4,200,000 |
| Diamond Tier | 6,900,000 |
| Cosmic Tier | 10,000,000 |

## Key Contracts

| Contract | Address | Standard |
|---|---|---|
| VIBESTR Token | 0xd0cC2b0eFb168bFe1f94a948D8df70FA10257196 | ERC-20 (18 decimals) |
| HighKey Moments | 0x74fcb6eb2a2d02207b36e804d800687ce78d210c | ERC-1155 |
| GVC NFT | 0xB8Ea78fcaCEf50d41375E44E6814ebbA36Bb33c4 | ERC-721 |

## API Endpoints

| Endpoint | Method | Purpose |
|---|---|---|
| goodvibesclub.io/api/badges | GET | Full leaderboard (badges, profiles, stats) |
| goodvibesclub.io/api/cli/earned-badges?address=0x | GET | Single wallet earned badges |
| goodvibesclub.io/api/cli/earned-badges | POST | Batch earned badges (up to 50) |

## NFT Trait Names (exact, case-sensitive)

Background, Body, Face, Hair, Type

/**
 * GVC Community Database Helpers
 *
 * Read-only access to the GVC community database (Seymour's dashboard data).
 * Contains collection stats, holder analytics, sales history, VIBESTR snapshots,
 * and more.
 *
 * Usage: Set DATABASE_URL in your .env.local file.
 */

import { Pool } from "pg";

// ── Connection ───────────────────────────────────────────────────────

let pool: Pool | null = null;

function getPool(): Pool {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
      max: 5,
    });
  }
  return pool;
}

// ── Types ────────────────────────────────────────────────────────────

export interface CollectionStats {
  floorPrice: number;
  floorPriceUsd: number;
  marketCap: number;
  marketCapUsd: number;
  numOwners: number;
  totalSales: number;
  volume24h: number;
  volume24hUsd: number;
  sales24h: number;
  avgPrice: number;
  lastUpdated: string;
}

export interface HolderInfo {
  address: string;
  tokenCount: number;
  percentOfSupply: number;
  hasActiveListing: boolean;
}

export interface HolderStats {
  totalSupply: number;
  totalHolders: number;
  diamondHandsCount: number;
  diamondHandsPercent: number;
  topHolderConcentration: number;
  holders: HolderInfo[];
}

export interface SaleEvent {
  txHash: string;
  tokenId: string;
  buyer: string;
  seller: string;
  priceEth: number;
  priceUsd: number;
  imageUrl: string;
  timestamp: string;
  paymentToken: string;
}

export interface CommunityActivity {
  totalBuys30d: number;
  totalSells30d: number;
  accumulatorCount: number;
  newCollectors30d: number;
  netAccumulationRate: number;
  accumulators: { address: string; buysThisMonth: number; currentHoldings: number }[];
}

export interface VibestrSnapshot {
  date: string;
  floorPrice: string;
  priceUsd: number;
  volume24h: number;
  liquidityUsd: number;
  marketCapUsd: number;
  priceChange24h: number;
  burnedAmount: string;
  holdingsCount: number;
}

export interface FlipTrade {
  buyer: string;
  tokenId: string;
  buyPrice: number;
  sellPrice: number;
  profit: number;
  profitPercent: number;
  holdingDays: number;
}

export interface WalletIdentity {
  address: string;
  ensName: string | null;
  twitter: string | null;
  tag: string | null;
}

// ── Data fetchers ────────────────────────────────────────────────────

/**
 * Get current GVC collection stats (floor, volume, owners, market cap).
 */
export async function getCollectionStats(): Promise<CollectionStats | null> {
  const db = getPool();
  const result = await db.query(
    `SELECT value FROM cache_entries WHERE key = 'collection-stats' LIMIT 1`
  );
  if (result.rows.length === 0) return null;
  const v = result.rows[0].value;
  return {
    floorPrice: v.floorPrice,
    floorPriceUsd: v.floorPriceUsd,
    marketCap: v.marketCap,
    marketCapUsd: v.marketCapUsd,
    numOwners: v.numOwners,
    totalSales: v.totalSales,
    volume24h: v.volume24h,
    volume24hUsd: v.volume24hUsd,
    sales24h: v.sales24h,
    avgPrice: v.avgPrice,
    lastUpdated: v.lastUpdated,
  };
}

/**
 * Get all holders ranked by token count with diamond hands stats.
 */
export async function getHolders(): Promise<HolderStats | null> {
  const db = getPool();
  const result = await db.query(
    `SELECT value FROM cache_entries WHERE key = 'community-holders-v2' LIMIT 1`
  );
  if (result.rows.length === 0) return null;
  return result.rows[0].value;
}

/**
 * Get recent GVC sales.
 */
export async function getRecentSales(limit = 20): Promise<SaleEvent[]> {
  const db = getPool();
  const result = await db.query(
    `SELECT value FROM cache_entries WHERE key = 'events-recent' LIMIT 1`
  );
  if (result.rows.length === 0) return [];
  return (result.rows[0].value as SaleEvent[]).slice(0, limit);
}

/**
 * Get 30-day community activity (buys, sells, accumulators, new collectors).
 */
export async function getCommunityActivity(): Promise<CommunityActivity | null> {
  const db = getPool();
  const result = await db.query(
    `SELECT value FROM cache_entries WHERE key = 'community-activity' LIMIT 1`
  );
  if (result.rows.length === 0) return null;
  return result.rows[0].value;
}

/**
 * Get historical sales from the price cache.
 * Returns sales sorted by most recent first.
 */
export async function getSalesHistory(limit = 100): Promise<{
  txHash: string;
  priceEth: number;
  priceUsd: number | null;
  paymentSymbol: string;
  imageUrl: string | null;
  createdAt: string;
}[]> {
  const db = getPool();
  const result = await db.query(
    `SELECT tx_hash, price_eth, price_usd, payment_symbol, image_url, created_at
     FROM price_cache ORDER BY created_at DESC LIMIT $1`,
    [limit]
  );
  return result.rows.map((r) => ({
    txHash: r.tx_hash,
    priceEth: parseFloat(r.price_eth),
    priceUsd: r.price_usd ? parseFloat(r.price_usd) : null,
    paymentSymbol: r.payment_symbol,
    imageUrl: r.image_url,
    createdAt: r.created_at,
  }));
}

/**
 * Get VIBESTR token snapshots (price, liquidity, volume, burned amount).
 */
export async function getVibestrSnapshots(): Promise<VibestrSnapshot[]> {
  const db = getPool();
  const result = await db.query(
    `SELECT date, data FROM vibestr_snapshots ORDER BY date ASC`
  );
  return result.rows.map((r) => ({
    date: r.date,
    floorPrice: r.data.floor?.price || "0",
    priceUsd: r.data.poolData?.price_usd || r.data.price_usd || 0,
    volume24h: r.data.poolData?.volume_24h || r.data.volume_24h || 0,
    liquidityUsd: r.data.poolData?.liquidity_usd || r.data.liquidity_usd || 0,
    marketCapUsd: r.data.poolData?.market_cap_usd || r.data.market_cap_usd || 0,
    priceChange24h: r.data.poolData?.price_change_24h || r.data.price_change_24h || 0,
    burnedAmount: r.data.burnedAmount || "0",
    holdingsCount: r.data.holdingsCount || 0,
  }));
}

/**
 * Get 30-day flip/trade analysis.
 */
export async function getTraderAnalysis(): Promise<{ flips: FlipTrade[] } | null> {
  const db = getPool();
  const result = await db.query(
    `SELECT value FROM cache_entries WHERE key = 'trader-analysis-30' LIMIT 1`
  );
  if (result.rows.length === 0) return null;
  return result.rows[0].value;
}

/**
 * Get market depth (bid/offer levels).
 */
export async function getMarketDepth(): Promise<{
  offers: { price: number; depth: number }[];
  listings: { price: number; depth: number }[];
} | null> {
  const db = getPool();
  const result = await db.query(
    `SELECT value FROM cache_entries WHERE key = 'market-depth-good-vibes-club' LIMIT 1`
  );
  if (result.rows.length === 0) return null;
  return result.rows[0].value;
}

/**
 * Resolve a wallet address to ENS name and/or Twitter handle.
 */
export async function resolveWallet(address: string): Promise<WalletIdentity> {
  const db = getPool();
  const lower = address.toLowerCase();

  // Check account tags
  const tag = await db.query(
    `SELECT name FROM account_tags WHERE address = $1 LIMIT 1`,
    [lower]
  );

  // Check ENS cache
  const ens = await db.query(
    `SELECT value FROM cache_entries WHERE key = $1 LIMIT 1`,
    [`ens-${lower}`]
  );

  return {
    address: lower,
    ensName: ens.rows[0]?.value?.name || null,
    twitter: ens.rows[0]?.value?.twitter || null,
    tag: tag.rows[0]?.name || null,
  };
}

/**
 * Get X/Twitter mentions of GVC.
 */
export async function getXMentions(): Promise<{
  stats: { totalMentions: number; uniqueAccounts: number; avgLikes: number };
  mentions: {
    url: string;
    text: string;
    likes: number;
    authorHandle: string;
    timestamp: string;
  }[];
} | null> {
  const db = getPool();
  const result = await db.query(
    `SELECT value FROM cache_entries WHERE key = 'x-mentions' LIMIT 1`
  );
  if (result.rows.length === 0) return null;
  return result.rows[0].value;
}

/**
 * GVC Community API Client
 *
 * Fetch live GVC collection data, holder analytics, sales history,
 * and more. No API key needed. No database setup.
 *
 * All data is cached and refreshes every 60 seconds.
 */

const API_BASE = "https://api-hazel-pi-72.vercel.app/api";

async function fetchJSON<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error(`GVC API error: ${res.status}`);
  return res.json();
}

// ── Collection Stats ─────────────────────────────────────────────────

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

/** Get current GVC collection stats (floor, volume, owners, market cap). */
export function getStats() {
  return fetchJSON<CollectionStats>("/stats");
}

// ── Holders ──────────────────────────────────────────────────────────

export interface Holder {
  address: string;
  tokenCount: number;
  percentOfSupply: number;
  hasActiveListing: boolean;
}

export interface HolderData {
  stats: {
    totalSupply: number;
    totalHolders: number;
    diamondHandsCount: number;
    diamondHandsPercent: number;
    topHolderConcentration: number;
  };
  holders: Holder[];
}

/** Get all holders ranked by token count. Use ?limit= to cap the list. */
export function getHolders(limit?: number) {
  const q = limit ? `?limit=${limit}` : "";
  return fetchJSON<HolderData>(`/holders${q}`);
}

// ── Sales ────────────────────────────────────────────────────────────

export interface SaleEvent {
  id: string;
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

/** Get recent GVC sales. */
export function getRecentSales(limit?: number) {
  const q = limit ? `?limit=${limit}` : "";
  return fetchJSON<SaleEvent[]>(`/sales${q}`);
}

/** Get historical sales (up to 1000). */
export function getSalesHistory(limit = 100) {
  return fetchJSON<
    {
      txHash: string;
      priceEth: number;
      priceUsd: number | null;
      paymentSymbol: string;
      imageUrl: string | null;
      createdAt: string;
    }[]
  >(`/sales/history?limit=${limit}`);
}

// ── Community Activity ───────────────────────────────────────────────

export interface CommunityActivity {
  stats: {
    totalBuys30d: number;
    totalSells30d: number;
    accumulatorCount: number;
    newCollectors30d: number;
    netAccumulationRate: number;
  };
  accumulators: {
    address: string;
    buysThisMonth: number;
    currentHoldings: number;
  }[];
}

/** Get 30-day community activity (buys, sells, accumulators). */
export function getActivity() {
  return fetchJSON<CommunityActivity>("/activity");
}

// ── VIBESTR ──────────────────────────────────────────────────────────

export interface VibestrSnapshot {
  date: string;
  priceUsd: number;
  volume24h: number;
  liquidityUsd: number;
  marketCapUsd: number;
  priceChange24h: number;
  burnedAmount: string;
  holdingsCount: number;
}

/** Get latest VIBESTR token data. */
export function getVibestr() {
  return fetchJSON<Record<string, unknown>>("/vibestr");
}

/** Get VIBESTR price history (91 daily snapshots). */
export function getVibestrHistory() {
  return fetchJSON<VibestrSnapshot[]>("/vibestr/history");
}

// ── Market Depth ─────────────────────────────────────────────────────

/** Get current bid/offer depth at each price level. */
export function getMarketDepth() {
  return fetchJSON<{
    offers: { price: number; depth: number }[];
    listings: { price: number; depth: number }[];
  }>("/market-depth");
}

// ── Traders ──────────────────────────────────────────────────────────

/** Get 30-day flip analysis with profit tracking. */
export function getTraders() {
  return fetchJSON<{
    flips: {
      buyer: string;
      tokenId: string;
      buyPrice: number;
      sellPrice: number;
      profit: number;
      profitPercent: number;
      holdingDays: number;
    }[];
  }>("/traders");
}

// ── Wallet Identity ──────────────────────────────────────────────────

/** Resolve a wallet address to ENS name, Twitter handle, and community tag. */
export function resolveWallet(address: string) {
  return fetchJSON<{
    address: string;
    ensName: string | null;
    twitter: string | null;
    tag: string | null;
  }>(`/wallet/${address}`);
}

// ── X/Twitter Mentions ───────────────────────────────────────────────

/** Get recent X/Twitter mentions of GVC. */
export function getMentions() {
  return fetchJSON<{
    stats: {
      totalMentions: number;
      uniqueAccounts: number;
      avgLikes: number;
    };
    mentions: {
      url: string;
      text: string;
      likes: number;
      authorHandle: string;
      timestamp: string;
    }[];
  }>("/mentions");
}

// ── Badge Leaderboard (from goodvibesclub.io) ────────────────────────

const GVC_BASE = "https://www.goodvibesclub.io/api";

export interface BadgeLeaderboard {
  /** Address -> array of badge IDs. Pre-computed across linked wallets. */
  badges: Record<string, string[]>;
  /** Badge ID -> holder count. Use for rarity. */
  ledger: Record<string, number>;
  /** Address -> profile info (custom name, avatar). */
  profileData: Record<string, { customName?: string; profileImageUrl?: string }>;
  /** Global totals. */
  stats: {
    addresses: number;
    addressesWithBadges: number;
    totalBadgeAssignments: number;
  };
}

/**
 * Get the complete badge leaderboard. This is the fastest way to look up
 * any wallet's badges, build rankings, or check badge rarity.
 * Data refreshes roughly every minute. Cache locally for at least 60 seconds.
 */
export async function getBadgeLeaderboard(): Promise<BadgeLeaderboard> {
  const res = await fetch(`${GVC_BASE}/badges`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error(`Badge API error: ${res.status}`);
  return res.json();
}

/**
 * Get earned/manual badges for a single wallet (e.g. vibestr_bounty_hunter).
 * These are badges assigned by GVC admins, not derivable from on-chain data.
 */
export async function getEarnedBadges(address: string): Promise<string[]> {
  const res = await fetch(
    `${GVC_BASE}/cli/earned-badges?address=${address.toLowerCase()}`
  );
  if (!res.ok) return [];
  const data = await res.json();
  return data.success ? data.badgeIds : [];
}

/**
 * Batch fetch earned badges for multiple wallets (up to 50 per request).
 * Much more efficient than calling getEarnedBadges per wallet.
 */
export async function getEarnedBadgesBatch(
  addresses: string[]
): Promise<Record<string, string[]>> {
  const res = await fetch(`${GVC_BASE}/cli/earned-badges`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ addresses: addresses.map((a) => a.toLowerCase()) }),
  });
  if (!res.ok) return {};
  const data = await res.json();
  return data.success ? data.results : {};
}

/**
 * Look up a single wallet's badges from the leaderboard.
 * Convenience wrapper around getBadgeLeaderboard().
 */
export async function getWalletBadges(address: string): Promise<{
  badges: string[];
  profile: { customName?: string; profileImageUrl?: string } | null;
}> {
  const lb = await getBadgeLeaderboard();
  const lower = address.toLowerCase();
  return {
    badges: lb.badges[lower] || [],
    profile: lb.profileData[lower] || null,
  };
}

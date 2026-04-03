/**
 * GVC Badge Helpers
 *
 * Derives all 101 badges for a holder, including:
 * - Individual token badges (from badge_token_map.json)
 * - Collector milestones (based on total unique badges)
 * - Combo badges (3+ or 5+ of a trait type across tokens)
 * - VIBESTR tier badges (based on token balance)
 */

// ── Types ────────────────────────────────────────────────────────────

export interface BadgeTokenMap {
  badgeToTokens: Record<string, string[]>;
  tokenToBadges: Record<string, string[]>;
}

export interface HolderBadgeResult {
  /** All unique individual badges earned across held tokens */
  individualBadges: string[];
  /** Collector milestone badges earned based on total badge count */
  collectorBadges: string[];
  /** Combo badges earned for holding 3+ or 5+ of a trait type */
  comboBadges: string[];
  /** VIBESTR tier badge (if vibestrBalance is provided) */
  vibestrTierBadge: string | null;
  /** All badges combined */
  allBadges: string[];
  /** Total unique badge count (used for collector milestones) */
  totalUniqueBadges: number;
  /** Per-token breakdown */
  tokenBreakdown: Record<string, string[]>;
}

// ── Collector milestones ─────────────────────────────────────────────

const COLLECTOR_MILESTONES: { threshold: number; badge: string }[] = [
  { threshold: 5, badge: "five_badges" },
  { threshold: 10, badge: "ten_badges" },
  { threshold: 15, badge: "fifteen_badges" },
  { threshold: 20, badge: "twenty_badges" },
  { threshold: 30, badge: "thirty_badges" },
  { threshold: 40, badge: "forty_badges" },
  { threshold: 50, badge: "fifty_badges" },
  { threshold: 60, badge: "unfathomable_vibes" },
];

// ── Combo badges ─────────────────────────────────────────────────────
// Earned when a holder owns 3+ or 5+ tokens with a specific trait badge

const COMBO_BADGES: {
  sourceBadge: string;
  threeCount: string;
  fiveCount: string;
}[] = [
  {
    sourceBadge: "gradient_lover",
    threeCount: "gradient_hatrick",
    fiveCount: "gradient_high_five",
  },
  {
    sourceBadge: "plastic_lover",
    threeCount: "plastic_hatrick",
    fiveCount: "plastic_high_five",
  },
  {
    sourceBadge: "robot_lover",
    threeCount: "robot_hatrick",
    fiveCount: "robot_high_five",
  },
];

// ── VIBESTR tier thresholds ──────────────────────────────────────────
// Based on VIBESTR token balance (not NFT traits)

const VIBESTR_TIERS: { threshold: number; badge: string }[] = [
  { threshold: 10_000_000, badge: "vibestr_cosmic_tier" },
  { threshold: 6_900_000, badge: "vibestr_diamond_tier" },
  { threshold: 4_200_000, badge: "vibestr_gold_tier" },
  { threshold: 2_500_000, badge: "vibestr_silver_tier" },
  { threshold: 1_000_000, badge: "vibestr_bronze_tier" },
  { threshold: 500_000, badge: "vibestr_purple_tier" },
  { threshold: 250_000, badge: "vibestr_pink_tier" },
  { threshold: 69_000, badge: "vibestr_blue_tier" },
];

// ── Main function ────────────────────────────────────────────────────

/**
 * Get all badges for a holder based on their GVC token IDs and optional VIBESTR balance.
 *
 * @param tokenIds - Array of GVC token IDs the holder owns (as strings)
 * @param map - The badge_token_map.json data
 * @param vibestrBalance - Optional VIBESTR token balance (as a number, not wei)
 * @returns Full badge breakdown including individual, collector, combo, and tier badges
 *
 * @example
 * ```ts
 * const map = await fetch('/badge_token_map.json').then(r => r.json());
 * const result = getHolderBadges(["142", "572", "3933", "668", "1082"], map, 150000);
 * console.log(result.allBadges);
 * ```
 */
export function getHolderBadges(
  tokenIds: string[],
  map: BadgeTokenMap,
  vibestrBalance?: number
): HolderBadgeResult {
  // 1. Collect individual badges per token
  const tokenBreakdown: Record<string, string[]> = {};
  const allIndividual = new Set<string>();
  const badgeCounts: Record<string, number> = {};

  for (const tokenId of tokenIds) {
    const badges = map.tokenToBadges[tokenId] || [];
    tokenBreakdown[tokenId] = badges;

    for (const badge of badges) {
      allIndividual.add(badge);
      badgeCounts[badge] = (badgeCounts[badge] || 0) + 1;
    }
  }

  const individualBadges = Array.from(allIndividual).sort();

  // 2. Calculate combo badges (3+ or 5+ tokens with same trait)
  const comboBadges: string[] = [];
  for (const combo of COMBO_BADGES) {
    const count = badgeCounts[combo.sourceBadge] || 0;
    if (count >= 5) {
      comboBadges.push(combo.fiveCount);
      comboBadges.push(combo.threeCount);
    } else if (count >= 3) {
      comboBadges.push(combo.threeCount);
    }
  }

  // 3. Calculate collector milestones
  // Count includes individual + combo badges
  const preCollectorCount = individualBadges.length + comboBadges.length;
  const collectorBadges: string[] = [];
  for (const milestone of COLLECTOR_MILESTONES) {
    if (preCollectorCount >= milestone.threshold) {
      collectorBadges.push(milestone.badge);
    }
  }

  // 4. Determine VIBESTR tier
  let vibestrTierBadge: string | null = null;
  if (vibestrBalance !== undefined) {
    for (const tier of VIBESTR_TIERS) {
      if (vibestrBalance >= tier.threshold) {
        vibestrTierBadge = tier.badge;
        break;
      }
    }
  }

  // 5. Combine everything
  const allBadges = [
    ...individualBadges,
    ...comboBadges,
    ...collectorBadges,
    ...(vibestrTierBadge ? [vibestrTierBadge] : []),
  ];

  return {
    individualBadges,
    collectorBadges,
    comboBadges,
    vibestrTierBadge,
    allBadges,
    totalUniqueBadges: allBadges.length,
    tokenBreakdown,
  };
}

// ── Convenience functions ────────────────────────────────────────────

/**
 * Get the VIBESTR tier badge for a given balance.
 */
export function getVibestrTier(balance: number): string | null {
  for (const tier of VIBESTR_TIERS) {
    if (balance >= tier.threshold) {
      return tier.badge;
    }
  }
  return null;
}

/**
 * Check which collector milestones a badge count qualifies for.
 */
export function getCollectorMilestones(badgeCount: number): string[] {
  return COLLECTOR_MILESTONES.filter((m) => badgeCount >= m.threshold).map(
    (m) => m.badge
  );
}

/**
 * Get all tokens that qualify for a specific badge.
 */
export function getTokensForBadge(
  badgeId: string,
  map: BadgeTokenMap
): string[] {
  return map.badgeToTokens[badgeId] || [];
}

/**
 * Get all badges for a single token.
 */
export function getBadgesForToken(
  tokenId: string,
  map: BadgeTokenMap
): string[] {
  return map.tokenToBadges[tokenId] || [];
}

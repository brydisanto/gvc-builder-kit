/**
 * GVC Badge Rule Engine — Standalone Export
 *
 * Zero-dependency module for evaluating ALL badge types (101 badges).
 *
 * Included in this export:
 *   - badge-definitions.json  — all badge definitions with requirement configs
 *   - badge-engine.ts         — this file
 *
 * Quick start:
 *   import { BadgeRuleEngine } from './badge-engine';
 *   import definitions from './badge-definitions.json';
 *
 *   const engine = new BadgeRuleEngine();
 *   const earned = await engine.evaluateAll(definitions, {
 *     tokens: userNftTokens,
 *     erc20Balances: { '0xd0cC2b0eFb168bFe1f94a948D8df70FA10257196': 500000n },
 *     erc1155Holdings: { '0x74fcb6eb2a2d02207b36e804d800687ce78d210c': ['1', '2', '3'] },
 *     earnedBadgeIds: ['some_manual_badge'],
 *   });
 *
 * Data the CLI must provide (per wallet address):
 *
 *   1. NFT tokens — array of TokenData (token_id, rank, traits)
 *      Source: Alchemy getNFTsForOwner, reservoir, or your own indexer
 *
 *   2. ERC-20 balances — map of contract address to balance (bigint, raw units)
 *      Only one contract currently used:
 *        $VIBESTR: 0xd0cC2b0eFb168bFe1f94a948D8df70FA10257196 (18 decimals)
 *      Source: alchemy_getTokenBalances, ethers provider.getBalance, etc.
 *
 *   3. ERC-1155 holdings — map of contract address to array of owned token IDs
 *      Only one contract currently used:
 *        HighKey Moments: 0x74fcb6eb2a2d02207b36e804d800687ce78d210c
 *      Source: Alchemy getNFTsForOwner with contractAddresses filter
 *
 *   4. Earned badge IDs (optional) — manually-assigned badges from the GVC database.
 *      These cannot be computed from on-chain data. Pass [] if unavailable.
 */

// ─── Types ───────────────────────────────────────────────────────────────────

export interface TokenData {
	token_id: number | string;
	rank: number;
	rarity_score: number;
	traits: {
		Background: string;
		Body: string;
		Face: string;
		Hair: string;
		Type: string;
		[otherTraitType: string]: string;
	};
}

export interface BadgeRequirementConfig {
	type: string;
	config: Record<string, unknown>;
}

export interface BadgeDefinition {
	badgeId: string;
	name: string;
	description: string;
	category: 'Type' | 'Rarity' | 'Trait' | 'Collection' | 'Earned';
	rarity: 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary';
	imageUrl?: string;
	enabled: boolean;
	sortOrder: number;
	requirement: BadgeRequirementConfig;
}

export interface UserBadge {
	badgeId: string;
	tokenId: string;
	earnedAt: string;
}

/**
 * Everything the engine needs to evaluate all 101 badges for a single wallet.
 */
export interface WalletBadgeInput {
	/** NFT tokens owned by this wallet (with traits, rank, rarity) */
	tokens: TokenData[];

	/**
	 * ERC-20 balances: contract address (lowercase) -> raw balance in base units (bigint).
	 *
	 * Currently only one token matters:
	 *   $VIBESTR (0xd0cC2b0eFb168bFe1f94a948D8df70FA10257196) — 18 decimals
	 *
	 * Example: 500,000 $VIBESTR = 500000n * 10n**18n = 500000000000000000000000n
	 *
	 * The definitions store thresholds in human-readable units (e.g. "500000").
	 * The engine converts them using the decimals field in each badge config.
	 */
	erc20Balances?: Record<string, bigint>;

	/**
	 * ERC-1155 holdings: contract address (lowercase) -> array of token IDs owned.
	 *
	 * Currently only one contract matters:
	 *   HighKey Moments (0x74fcb6eb2a2d02207b36e804d800687ce78d210c)
	 *
	 * Two badge types use this:
	 *   - erc1155_contract_any: owns at least one token from the contract
	 *   - erc1155_contract_all: owns every token ID (pass all known IDs)
	 *
	 * For erc1155_contract_all with no explicit tokenIds in the config,
	 * supply allKnownErc1155TokenIds so the engine knows the complete set.
	 */
	erc1155Holdings?: Record<string, string[]>;

	/**
	 * The complete set of token IDs that exist for each ERC-1155 contract.
	 * Only needed for erc1155_contract_all badges where the config doesn't
	 * specify explicit tokenIds (the engine auto-discovers the full set).
	 * Key: contract address (lowercase), Value: every token ID minted.
	 */
	allKnownErc1155TokenIds?: Record<string, string[]>;

	/**
	 * Badge IDs that were manually assigned (earned badges).
	 * These come from the GVC database, not on-chain data.
	 * Pass [] if your CLI doesn't have access to this data.
	 */
	earnedBadgeIds?: string[];
}

// ─── Internal Types ──────────────────────────────────────────────────────────

interface RuleProcessorResult {
	qualified: boolean;
	tokenIds: string[];
}

interface RuleProcessor {
	evaluate(tokens: TokenData[], config: Record<string, unknown>): RuleProcessorResult;
}

// ─── Utilities ───────────────────────────────────────────────────────────────

const COMPLETIONIST_BADGE_ID = 'the_completionist';

function resolveBadgeCountRequirement(badge: BadgeDefinition, totalEnabledBadges: number): number {
	const config = badge.requirement?.config ?? {};
	const isCompletionist = badge.badgeId === COMPLETIONIST_BADGE_ID || config.dynamic === true;

	if (isCompletionist) {
		return Math.max(totalEnabledBadges - 1, 0);
	}

	const count = Number(config.count);
	return Number.isFinite(count) && count > 0 ? count : 0;
}

function parseHumanToBaseUnits(amount: string, decimals: number): bigint {
	const [intPart, fracPartRaw] = amount.split('.');
	const fracPart = (fracPartRaw || '').slice(0, decimals);
	const paddedFrac = fracPart.padEnd(decimals, '0');
	const normalized = `${intPart}${paddedFrac}`.replace(/^0+(?=\d)/, '');
	return BigInt(normalized.length ? normalized : '0');
}

function normalizeTokenId(tokenId: string): string {
	if (!tokenId) return '0';
	try {
		if (tokenId.startsWith('0x') || tokenId.startsWith('0X')) {
			return BigInt(tokenId).toString(10);
		}
		return BigInt(tokenId).toString(10);
	} catch {
		return tokenId.toLowerCase();
	}
}

function matchesPattern(value: string, patterns: string[], matchSubstring: boolean): boolean {
	const normalizedValue = value.toLowerCase();
	return patterns.some((pattern) => {
		const normalizedPattern = pattern.toLowerCase();
		return matchSubstring ? normalizedValue.includes(normalizedPattern) : normalizedValue === normalizedPattern;
	});
}

// ─── NFT Trait Processors ────────────────────────────────────────────────────

class TypeMatchProcessor implements RuleProcessor {
	evaluate(tokens: TokenData[], config: { value: string }): RuleProcessorResult {
		for (const token of tokens) {
			const tokenType = token.traits.Type;

			if (config.value === '') {
				return { qualified: true, tokenIds: [String(token.token_id)] };
			}

			const useSubstringMatch = ['Robot', 'Plastic', 'Gradient'].includes(config.value);
			const typeMatches = useSubstringMatch
				? tokenType.toLowerCase().includes(config.value.toLowerCase())
				: tokenType.toLowerCase() === config.value.toLowerCase();

			if (typeMatches) {
				return { qualified: true, tokenIds: [String(token.token_id)] };
			}
		}
		return { qualified: false, tokenIds: [] };
	}
}

class TraitMatchProcessor implements RuleProcessor {
	evaluate(
		tokens: TokenData[],
		config: {
			traitType: string;
			value: string;
			matchSubstring?: boolean;
			excludeValues?: string[];
			excludeSubstrings?: string[];
		}
	): RuleProcessorResult {
		for (const token of tokens) {
			const traitValue = token.traits[config.traitType] || '';

			if (config.excludeValues && config.excludeValues.includes(traitValue)) {
				continue;
			}
			if (
				config.excludeSubstrings &&
				config.excludeSubstrings.some((sub) => traitValue.toLowerCase().includes(sub.toLowerCase()))
			) {
				continue;
			}

			const useSubstringMatch =
				config.matchSubstring === true ||
				(config.matchSubstring !== false &&
					config.traitType === 'Body' &&
					['Surfer', 'Baller', 'Farmer Plants'].includes(config.value));

			const valueMatches = useSubstringMatch
				? traitValue.toLowerCase().includes(config.value.toLowerCase())
				: traitValue.toLowerCase() === config.value.toLowerCase();

			if (valueMatches) {
				return { qualified: true, tokenIds: [String(token.token_id)] };
			}
		}
		return { qualified: false, tokenIds: [] };
	}
}

class AlternativeTraitsProcessor implements RuleProcessor {
	evaluate(
		tokens: TokenData[],
		config: { alternatives: Array<{ traitType: string; value: string; matchSubstring?: boolean }> }
	): RuleProcessorResult {
		for (const token of tokens) {
			const matches = config.alternatives.some(({ traitType, value, matchSubstring }) => {
				const tokenValue = token.traits[traitType] || '';
				const lowerCaseTokenValue = tokenValue.toLowerCase();
				const lowerCaseRequiredValue = value.toLowerCase();

				if (
					traitType === 'Face' &&
					(lowerCaseRequiredValue === 'stache' || lowerCaseRequiredValue === 'beard')
				) {
					return lowerCaseTokenValue.includes(lowerCaseRequiredValue);
				}

				const useSubstringMatchForOthers =
					matchSubstring === true ||
					lowerCaseRequiredValue === 'superrare' ||
					lowerCaseRequiredValue === 'plastic armor' ||
					lowerCaseRequiredValue === 'plastic helmet';

				if (useSubstringMatchForOthers) {
					return lowerCaseTokenValue.includes(lowerCaseRequiredValue);
				}

				return lowerCaseTokenValue === lowerCaseRequiredValue;
			});

			if (matches) {
				return { qualified: true, tokenIds: [String(token.token_id)] };
			}
		}
		return { qualified: false, tokenIds: [] };
	}
}

class RankProcessor implements RuleProcessor {
	evaluate(tokens: TokenData[], config: { maxRank: number }): RuleProcessorResult {
		for (const token of tokens) {
			if (token.rank <= config.maxRank) {
				return { qualified: true, tokenIds: [String(token.token_id)] };
			}
		}
		return { qualified: false, tokenIds: [] };
	}
}

class CollectionProcessor implements RuleProcessor {
	evaluate(
		tokens: TokenData[],
		config: {
			minCount: number;
			uniqueTypeRequirements?: { traitType: string; requiredValues: string[] };
			specificIds?: string[];
		}
	): RuleProcessorResult {
		if (tokens.length < config.minCount) {
			return { qualified: false, tokenIds: [] };
		}

		if (config.specificIds && config.specificIds.length > 0) {
			const tokenIds = tokens.map((token) => String(token.token_id));
			const foundIds = config.specificIds.filter((id) => tokenIds.includes(id));

			if (foundIds.length >= config.minCount) {
				return { qualified: true, tokenIds: foundIds.slice(0, config.minCount) };
			}
			return { qualified: false, tokenIds: [] };
		}

		if (config.uniqueTypeRequirements) {
			const { traitType, requiredValues } = config.uniqueTypeRequirements;
			const valueToTokensMap = new Map<string, string[]>();

			requiredValues.forEach((value) => valueToTokensMap.set(value, []));

			tokens.forEach((token) => {
				const traitValue = token.traits[traitType];
				requiredValues.forEach((reqValue) => {
					if (traitValue.toLowerCase().includes(reqValue.toLowerCase())) {
						const existing = valueToTokensMap.get(reqValue) || [];
						existing.push(String(token.token_id));
						valueToTokensMap.set(reqValue, existing);
					}
				});
			});

			for (const requiredValue of requiredValues) {
				const matchingTokens = valueToTokensMap.get(requiredValue);
				if (!matchingTokens || matchingTokens.length === 0) {
					return { qualified: false, tokenIds: [] };
				}
			}

			const satisfyingTokens = requiredValues.map((value) => valueToTokensMap.get(value)![0]);
			return { qualified: true, tokenIds: satisfyingTokens };
		}

		return {
			qualified: true,
			tokenIds: tokens.slice(0, config.minCount).map((t) => String(t.token_id)),
		};
	}
}

class CountUniqueTraitValuesProcessor implements RuleProcessor {
	evaluate(
		tokens: TokenData[],
		config: { traitType: string; valueSubstring: string; minCount: number }
	): RuleProcessorResult {
		const matchingTokenIds: string[] = [];
		let matchingCount = 0;

		for (const token of tokens) {
			const traitValue = token.traits[config.traitType];

			if (traitValue && traitValue.toLowerCase().includes(config.valueSubstring.toLowerCase())) {
				matchingCount++;
				matchingTokenIds.push(String(token.token_id));
			}
		}

		if (matchingCount >= config.minCount) {
			return { qualified: true, tokenIds: matchingTokenIds.slice(0, config.minCount) };
		}
		return { qualified: false, tokenIds: [] };
	}
}

class DuplicateTraitProcessor implements RuleProcessor {
	evaluate(tokens: TokenData[], config: { traitType: string; minCount: number }): RuleProcessorResult {
		const traitValueMap = new Map<string, string[]>();

		tokens.forEach((token) => {
			const traitValue = token.traits[config.traitType];
			if (traitValue) {
				const existing = traitValueMap.get(traitValue) || [];
				existing.push(String(token.token_id));
				traitValueMap.set(traitValue, existing);
			}
		});

		for (const [, tokenIds] of traitValueMap) {
			if (tokenIds.length >= config.minCount) {
				return { qualified: true, tokenIds: tokenIds.slice(0, config.minCount) };
			}
		}

		return { qualified: false, tokenIds: [] };
	}
}

class TraitCombinationProcessor implements RuleProcessor {
	evaluate(
		tokens: TokenData[],
		config: { combination: Record<string, string>; matchAll: boolean }
	): RuleProcessorResult {
		for (const token of tokens) {
			const results = Object.entries(config.combination).map(([traitType, requiredValue]) => {
				const tokenValue = token.traits[traitType];

				const useSubstringMatch = requiredValue === 'SuperRare';
				if (useSubstringMatch) {
					return tokenValue.toLowerCase().includes(requiredValue.toLowerCase());
				}

				if (requiredValue.includes('|')) {
					const possibleValues = requiredValue.split('|');
					return possibleValues.some((val) => tokenValue.toLowerCase() === val.toLowerCase().trim());
				}

				return tokenValue.toLowerCase() === requiredValue.toLowerCase();
			});

			const qualified = config.matchAll ? results.every((result) => result) : results.some((result) => result);

			if (qualified) {
				return { qualified: true, tokenIds: [String(token.token_id)] };
			}
		}
		return { qualified: false, tokenIds: [] };
	}
}

class MultiConditionCollectionProcessor implements RuleProcessor {
	evaluate(
		tokens: TokenData[],
		config: { conditions: Array<{ traitType: string; value: string; matchSubstring?: boolean }> }
	): RuleProcessorResult {
		const numConditions = config.conditions.length;
		const satisfyingTokenIds: string[] = new Array(numConditions).fill(null);
		const usedTokens = new Set<string>();
		let conditionsMetCount = 0;

		for (let i = 0; i < numConditions; i++) {
			const condition = config.conditions[i];
			const useSubstring = condition.matchSubstring ?? false;

			for (const token of tokens) {
				const tokenId = String(token.token_id);

				if (usedTokens.has(tokenId)) continue;

				const traitValue = token.traits[condition.traitType] || '';
				const matches = useSubstring
					? traitValue.toLowerCase().includes(condition.value.toLowerCase())
					: traitValue.toLowerCase() === condition.value.toLowerCase();

				if (matches) {
					satisfyingTokenIds[i] = tokenId;
					usedTokens.add(tokenId);
					conditionsMetCount++;
					break;
				}
			}
		}

		if (conditionsMetCount === numConditions) {
			return { qualified: true, tokenIds: satisfyingTokenIds.filter((id) => id !== null) };
		}
		return { qualified: false, tokenIds: [] };
	}
}

class CustomEliteRainbowRangerProcessor implements RuleProcessor {
	evaluate(tokens: TokenData[]): RuleProcessorResult {
		let rainbowTokenId: string | null = null;
		let armorOrHelmetTokenId: string | null = null;

		for (const token of tokens) {
			if (token.traits.Type?.toLowerCase().includes('rainbow')) {
				rainbowTokenId = String(token.token_id);
				break;
			}
		}

		for (const token of tokens) {
			const bodyMatch = token.traits.Body?.toLowerCase().includes('plastic armor');
			const helmetMatch = token.traits.Hair?.toLowerCase().includes('plastic helmet');
			if (bodyMatch || helmetMatch) {
				armorOrHelmetTokenId = String(token.token_id);
				break;
			}
		}

		if (rainbowTokenId && armorOrHelmetTokenId) {
			const uniqueIds = new Set([rainbowTokenId, armorOrHelmetTokenId]);
			return { qualified: true, tokenIds: Array.from(uniqueIds) };
		}
		return { qualified: false, tokenIds: [] };
	}
}

class CustomMountainGoatProcessor implements RuleProcessor {
	evaluate(
		tokens: TokenData[],
		config: { conditions: Array<{ traitType: string; value: string; matchSubstring?: boolean }> }
	): RuleProcessorResult {
		if (!config.conditions || config.conditions.length === 0) {
			return { qualified: false, tokenIds: [] };
		}

		const matchingTokenIds: string[] = [];

		for (const token of tokens) {
			const tokenId = String(token.token_id);
			let tokenMatchesAnyCondition = false;

			for (const condition of config.conditions) {
				const traitValue = token.traits[condition.traitType] || '';
				const useSubstring = condition.matchSubstring ?? false;

				const matches = useSubstring
					? traitValue.toLowerCase().includes(condition.value.toLowerCase())
					: traitValue.toLowerCase() === condition.value.toLowerCase();

				if (matches) {
					tokenMatchesAnyCondition = true;
					break;
				}
			}

			if (tokenMatchesAnyCondition && !matchingTokenIds.includes(tokenId)) {
				matchingTokenIds.push(tokenId);
			}
		}

		if (matchingTokenIds.length >= 2) {
			return { qualified: true, tokenIds: matchingTokenIds };
		}
		return { qualified: false, tokenIds: [] };
	}
}

class CustomFlowStateProcessor implements RuleProcessor {
	evaluate(
		tokens: TokenData[],
		config: { hairGroups?: string[]; allowedValues?: string[]; requiredCount?: number }
	): RuleProcessorResult {
		const requiredCount = config.requiredCount ?? 5;
		const hairGroups = (config.hairGroups || []).map((g) => g.toLowerCase().trim());
		if (hairGroups.length === 0) return { qualified: false, tokenIds: [] };

		const matchedGroups = new Map<string, string>();

		for (const token of tokens) {
			const hairValue = (token.traits.Hair || '').toLowerCase().trim();
			if (!hairValue) continue;

			for (const group of hairGroups) {
				if (matchedGroups.has(group)) continue;
				if (hairValue.startsWith(group)) {
					matchedGroups.set(group, String(token.token_id));
					break;
				}
			}

			if (matchedGroups.size >= requiredCount) {
				return {
					qualified: true,
					tokenIds: Array.from(matchedGroups.values()),
				};
			}
		}

		return { qualified: false, tokenIds: [] };
	}
}

class CustomTraitMaxiProcessor implements RuleProcessor {
	evaluate(
		tokens: TokenData[],
		config: {
			requiredCount?: number;
			traitTypes?: string[];
			traitGroups?: Record<string, string[]>;
		}
	): RuleProcessorResult {
		const requiredCount = config.requiredCount ?? 5;
		const traitTypes = config.traitTypes || ['Body', 'Hair', 'Face', 'Type'];

		const sortedGroupsCache = new Map<string, string[]>();

		for (const traitType of traitTypes) {
			const rawGroups = config.traitGroups?.[traitType];

			let sortedGroups: string[] | undefined;
			if (rawGroups && rawGroups.length > 0) {
				if (!sortedGroupsCache.has(traitType)) {
					sortedGroupsCache.set(
						traitType,
						[...rawGroups].sort((a, b) => b.length - a.length).map((g) => g.toLowerCase())
					);
				}
				sortedGroups = sortedGroupsCache.get(traitType);
			}

			const valueCounts = new Map<string, string[]>();

			for (const token of tokens) {
				const rawValue = token.traits[traitType];
				if (!rawValue) continue;

				let key = rawValue;
				if (sortedGroups) {
					const lower = rawValue.toLowerCase();
					for (const prefix of sortedGroups) {
						if (lower.startsWith(prefix)) {
							key = prefix;
							break;
						}
					}
				}

				const tokenIds = valueCounts.get(key) || [];
				tokenIds.push(String(token.token_id));
				valueCounts.set(key, tokenIds);

				if (tokenIds.length >= requiredCount) {
					return { qualified: true, tokenIds: tokenIds.slice(0, requiredCount) };
				}
			}
		}

		return { qualified: false, tokenIds: [] };
	}
}

class CustomAnchormanProcessor implements RuleProcessor {
	evaluate(
		tokens: TokenData[],
		config: {
			bodyTraitValues: string[];
			faceTraitValues: string[];
			bodyMatchSubstring?: boolean;
			faceMatchSubstring?: boolean;
		}
	): RuleProcessorResult {
		const bodyTraitValues = config.bodyTraitValues || ['Suit'];
		const faceTraitValues = config.faceTraitValues || ['Beard', 'Stache'];
		const bodyMatchSubstring = config.bodyMatchSubstring ?? true;
		const faceMatchSubstring = config.faceMatchSubstring ?? true;

		for (const token of tokens) {
			const bodyValue = token.traits.Body || '';
			const faceValue = token.traits.Face || '';
			const hasBody = matchesPattern(bodyValue, bodyTraitValues, bodyMatchSubstring);
			const hasFace = matchesPattern(faceValue, faceTraitValues, faceMatchSubstring);

			if (hasBody && hasFace) {
				return { qualified: true, tokenIds: [String(token.token_id)] };
			}
		}

		return { qualified: false, tokenIds: [] };
	}
}

class ManualAssignmentProcessor implements RuleProcessor {
	evaluate(): RuleProcessorResult {
		return { qualified: false, tokenIds: [] };
	}
}

class BadgeCountProcessor implements RuleProcessor {
	evaluate(): RuleProcessorResult {
		return { qualified: false, tokenIds: [] };
	}
}

// ─── ERC-20 Evaluation ──────────────────────────────────────────────────────

function evaluateErc20Badges(
	badges: BadgeDefinition[],
	balances: Record<string, bigint>
): UserBadge[] {
	const awarded: UserBadge[] = [];

	// erc20_balance_range: check balance falls within [min, max) for a token
	const rangeBadges = badges.filter((b) => b.requirement.type === 'erc20_balance_range');
	for (const badge of rangeBadges) {
		const cfg = badge.requirement.config as {
			tokenAddress?: string;
			decimals?: number;
			min?: string;
			max?: string;
		};
		if (!cfg?.tokenAddress || cfg.decimals === undefined || !cfg.min) continue;

		const balance = balances[cfg.tokenAddress.toLowerCase()] ?? 0n;
		const minUnits = parseHumanToBaseUnits(cfg.min, cfg.decimals);

		let withinMax = true;
		if (cfg.max) {
			const maxUnits = parseHumanToBaseUnits(cfg.max, cfg.decimals);
			withinMax = balance < maxUnits;
		}

		if (balance >= minUnits && withinMax) {
			awarded.push({ badgeId: badge.badgeId, tokenId: 'erc20', earnedAt: new Date().toISOString() });
		}
	}

	// erc20_any_of: holds any positive balance of any token in a list
	const anyOfBadges = badges.filter((b) => b.requirement.type === 'erc20_any_of');
	for (const badge of anyOfBadges) {
		const cfg = badge.requirement.config as { tokenAddresses?: string[] };
		const addresses = (cfg?.tokenAddresses || []).map((a) => a.toLowerCase());
		const hasAny = addresses.some((addr) => (balances[addr] ?? 0n) > 0n);
		if (hasAny) {
			awarded.push({ badgeId: badge.badgeId, tokenId: 'erc20', earnedAt: new Date().toISOString() });
		}
	}

	return awarded;
}

// ─── ERC-1155 Evaluation ─────────────────────────────────────────────────────

function evaluateErc1155Badges(
	badges: BadgeDefinition[],
	holdings: Record<string, string[]>,
	allKnownTokenIds: Record<string, string[]>
): UserBadge[] {
	const awarded: UserBadge[] = [];

	// erc1155_contract_any: owns at least one token from the contract
	const anyBadges = badges.filter((b) => b.requirement.type === 'erc1155_contract_any');
	for (const badge of anyBadges) {
		const cfg = badge.requirement.config as { contractAddress?: string; tokenIds?: string[] };
		if (!cfg?.contractAddress) continue;

		const contract = cfg.contractAddress.toLowerCase();
		const owned = (holdings[contract] || []).map((id) => normalizeTokenId(id));
		if (owned.length === 0) continue;

		const filterIds = (cfg.tokenIds || []).map((id) => normalizeTokenId(String(id))).filter(Boolean);
		const matched = filterIds.length > 0
			? filterIds.find((id) => owned.includes(id))
			: owned[0];

		if (matched) {
			awarded.push({ badgeId: badge.badgeId, tokenId: matched, earnedAt: new Date().toISOString() });
		}
	}

	// erc1155_contract_all: owns every token ID from the contract
	const allBadges = badges.filter((b) => b.requirement.type === 'erc1155_contract_all');
	for (const badge of allBadges) {
		const cfg = badge.requirement.config as { contractAddress?: string; tokenIds?: string[] };
		if (!cfg?.contractAddress) continue;

		const contract = cfg.contractAddress.toLowerCase();
		const owned = new Set((holdings[contract] || []).map((id) => normalizeTokenId(id)));
		if (owned.size === 0) continue;

		// Use explicit token IDs from config, or fall back to allKnownTokenIds
		const explicitIds = Array.from(
			new Set((cfg.tokenIds || []).map((id) => normalizeTokenId(String(id))).filter(Boolean))
		);
		const requiredIds = explicitIds.length > 0
			? explicitIds
			: (allKnownTokenIds[contract] || []).map((id) => normalizeTokenId(id));

		if (requiredIds.length === 0) continue;

		const hasAll = requiredIds.every((id) => owned.has(id));
		if (hasAll) {
			awarded.push({ badgeId: badge.badgeId, tokenId: requiredIds[0], earnedAt: new Date().toISOString() });
		}
	}

	return awarded;
}

// ─── Engine ──────────────────────────────────────────────────────────────────

export class BadgeRuleEngine {
	private processors: Map<string, RuleProcessor>;

	constructor() {
		this.processors = new Map<string, RuleProcessor>();
		this.processors.set('type_match', new TypeMatchProcessor());
		this.processors.set('trait_match', new TraitMatchProcessor());
		this.processors.set('alternative_traits', new AlternativeTraitsProcessor());
		this.processors.set('rank', new RankProcessor());
		this.processors.set('collection', new CollectionProcessor());
		this.processors.set('count_unique_trait_values', new CountUniqueTraitValuesProcessor());
		this.processors.set('duplicate_trait', new DuplicateTraitProcessor());
		this.processors.set('trait_combination', new TraitCombinationProcessor());
		this.processors.set('multi_condition_collection', new MultiConditionCollectionProcessor());
		this.processors.set('custom_mountain_goat', new CustomMountainGoatProcessor());
		this.processors.set('custom_elite_rainbow_ranger', new CustomEliteRainbowRangerProcessor());
		this.processors.set('custom_flow_state', new CustomFlowStateProcessor());
		this.processors.set('custom_trait_maxi', new CustomTraitMaxiProcessor());
		this.processors.set('custom_anchorman', new CustomAnchormanProcessor());
		this.processors.set('manual_assignment', new ManualAssignmentProcessor());
		this.processors.set('badge_count', new BadgeCountProcessor());
	}

	/** Evaluate a single NFT-trait badge definition against a set of tokens */
	processBadge(badge: BadgeDefinition, tokens: TokenData[]): UserBadge | null {
		const processor = this.processors.get(badge.requirement.type);
		if (!processor) {
			return null;
		}

		const result = processor.evaluate(tokens, badge.requirement.config);

		if (result.qualified && result.tokenIds.length > 0) {
			return {
				badgeId: badge.badgeId,
				tokenId: result.tokenIds[0],
				earnedAt: new Date().toISOString(),
			};
		}

		return null;
	}

	/** Evaluate only NFT-trait badges + milestone badges (no ERC-20/1155/earned) */
	processNftBadges(badges: BadgeDefinition[], tokens: TokenData[]): UserBadge[] {
		const earnedBadges: UserBadge[] = [];
		const earnedBadgeIds = new Set<string>();

		for (const badge of badges) {
			if (badge.requirement.type === 'badge_count' || badge.requirement.type === 'manual_assignment') {
				continue;
			}
			if (badge.requirement.type.startsWith('erc20') || badge.requirement.type.startsWith('erc1155')) {
				continue;
			}

			if (earnedBadgeIds.has(badge.badgeId)) continue;

			const userBadge = this.processBadge(badge, tokens);
			if (userBadge) {
				earnedBadges.push(userBadge);
				earnedBadgeIds.add(badge.badgeId);
			}
		}

		return earnedBadges;
	}

	/**
	 * Evaluate ALL badge types for a wallet. This is the main entry point.
	 *
	 * Evaluation order (matches production):
	 *   1. NFT trait badges — from token metadata
	 *   2. Earned/manual badges — from database (pass-through)
	 *   3. ERC-20 balance badges — from on-chain balances
	 *   4. ERC-1155 ownership badges — from on-chain holdings
	 *   5. Milestone badges — computed from total count of 1-4
	 *
	 * Returns the complete list of earned badges.
	 */
	evaluateAll(badges: BadgeDefinition[], input: WalletBadgeInput): UserBadge[] {
		// Only evaluate enabled badges
		const enabledBadges = badges.filter((b) => b.enabled);

		const allEarned: UserBadge[] = [];
		const earnedBadgeIds = new Set<string>();

		const addBadges = (newBadges: UserBadge[]) => {
			for (const badge of newBadges) {
				if (!earnedBadgeIds.has(badge.badgeId)) {
					allEarned.push(badge);
					earnedBadgeIds.add(badge.badgeId);
				}
			}
		};

		// 1. NFT trait badges
		addBadges(this.processNftBadges(enabledBadges, input.tokens));

		// 2. Earned/manual badges (pass-through from database)
		if (input.earnedBadgeIds) {
			for (const badgeId of input.earnedBadgeIds) {
				if (!earnedBadgeIds.has(badgeId)) {
					allEarned.push({ badgeId, tokenId: 'earned', earnedAt: new Date().toISOString() });
					earnedBadgeIds.add(badgeId);
				}
			}
		}

		// 3. ERC-20 badges
		if (input.erc20Balances) {
			addBadges(evaluateErc20Badges(enabledBadges, input.erc20Balances));
		}

		// 4. ERC-1155 badges
		if (input.erc1155Holdings) {
			addBadges(evaluateErc1155Badges(
				enabledBadges,
				input.erc1155Holdings,
				input.allKnownErc1155TokenIds || {}
			));
		}

		// 5. Milestone / badge_count badges (computed from everything above)
		const totalEnabledBadges = enabledBadges.length;
		const badgeCountBadges = enabledBadges
			.filter((b) => b.requirement.type === 'badge_count')
			.map((badge) => ({
				badge,
				requiredCount: resolveBadgeCountRequirement(badge, totalEnabledBadges),
			}))
			.sort((a, b) => a.requiredCount - b.requiredCount);

		let dynamicBadgeCount = earnedBadgeIds.size;

		for (const { badge, requiredCount } of badgeCountBadges) {
			if (dynamicBadgeCount >= requiredCount && !earnedBadgeIds.has(badge.badgeId)) {
				allEarned.push({
					badgeId: badge.badgeId,
					tokenId: 'system',
					earnedAt: new Date().toISOString(),
				});
				earnedBadgeIds.add(badge.badgeId);
				dynamicBadgeCount++;
			}
		}

		return allEarned;
	}
}

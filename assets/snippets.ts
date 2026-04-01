// ============================================================================
// GVC Builder Kit - Code Snippets
// 8 standalone, copy-paste-ready snippets for GVC community builders.
// Each snippet works in a Next.js App Router project.
// ============================================================================

// ----------------------------------------------------------------------------
// SNIPPET 1: Fetch GVC Floor Price
// File: app/api/floor-price/route.ts
//
// Fetches the current Good Vibes Club collection floor price from OpenSea.
// Returns the lowest listing price in ETH.
// ----------------------------------------------------------------------------

export const snippet_floorPrice = `
import { NextResponse } from "next/server";

const OPENSEA_API = "https://api.opensea.io/api/v2/listings/collection/good-vibes-club/all";

export async function GET() {
  try {
    const res = await fetch(OPENSEA_API, {
      headers: {
        accept: "application/json",
        "x-api-key": process.env.OPENSEA_API_KEY ?? "",
      },
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch from OpenSea" },
        { status: res.status }
      );
    }

    const data = await res.json();
    const listings = data.listings ?? [];

    if (listings.length === 0) {
      return NextResponse.json({ floorPrice: null, message: "No active listings" });
    }

    const prices = listings
      .map((listing: any) => {
        const raw = listing.price?.current?.value;
        return raw ? Number(raw) / 1e18 : null;
      })
      .filter((p: number | null): p is number => p !== null);

    const floorPrice = Math.min(...prices);

    return NextResponse.json({ floorPrice, currency: "ETH", listings: prices.length });
  } catch (err) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// Usage:
// fetch("/api/floor-price").then(r => r.json()).then(d => console.log(d.floorPrice));
`;

// ----------------------------------------------------------------------------
// SNIPPET 2: Fetch GVC Listings Under a Price
// File: app/api/listings/route.ts
//
// Fetches GVC NFTs currently listed below a target price threshold.
// Pass ?maxPrice=0.05 as a query parameter (value in ETH).
// ----------------------------------------------------------------------------

export const snippet_listingsUnderPrice = `
import { NextResponse } from "next/server";
import { type NextRequest } from "next/server";

const OPENSEA_API = "https://api.opensea.io/api/v2/listings/collection/good-vibes-club/all";

interface ListingItem {
  tokenId: string;
  name: string;
  price: number;
  image: string;
}

export async function GET(request: NextRequest) {
  const maxPrice = parseFloat(
    request.nextUrl.searchParams.get("maxPrice") ?? "0.05"
  );

  try {
    const res = await fetch(OPENSEA_API, {
      headers: {
        accept: "application/json",
        "x-api-key": process.env.OPENSEA_API_KEY ?? "",
      },
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch from OpenSea" },
        { status: res.status }
      );
    }

    const data = await res.json();
    const listings = data.listings ?? [];

    const affordable: ListingItem[] = listings
      .map((listing: any) => {
        const raw = listing.price?.current?.value;
        const priceEth = raw ? Number(raw) / 1e18 : null;
        if (priceEth === null || priceEth > maxPrice) return null;

        const asset = listing.protocol_data?.parameters?.offer?.[0];
        const tokenId = asset?.identifierOrCriteria ?? "unknown";

        return {
          tokenId,
          name: \`GVC #\${tokenId}\`,
          price: priceEth,
          image: \`https://i.seadn.io/gcs/files/good-vibes-club/\${tokenId}.png\`,
        };
      })
      .filter(Boolean) as ListingItem[];

    affordable.sort((a, b) => a.price - b.price);

    return NextResponse.json({ count: affordable.length, listings: affordable });
  } catch (err) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// Usage:
// fetch("/api/listings?maxPrice=0.03").then(r => r.json()).then(d => {
//   d.listings.forEach(nft => console.log(\`#\${nft.tokenId}: \${nft.price} ETH\`));
// });
`;

// ----------------------------------------------------------------------------
// SNIPPET 3: Read On-Chain Token Balance
// File: app/api/wallet/route.ts
//
// Reads VIBESTR ERC-20 token balance and native ETH balance for any wallet.
// Uses viem for type-safe Ethereum interactions.
// Requires: npm install viem
// ----------------------------------------------------------------------------

export const snippet_walletBalance = `
import { NextResponse } from "next/server";
import { type NextRequest } from "next/server";
import { createPublicClient, http, formatUnits, type Address } from "viem";
import { mainnet } from "viem/chains";

const VIBESTR_CONTRACT: Address = "0xd0cC2b0eFb168bFe1f94a948D8df70FA10257196";

const ERC20_ABI = [
  {
    name: "balanceOf",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    name: "decimals",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint8" }],
  },
] as const;

const client = createPublicClient({
  chain: mainnet,
  transport: http("https://ethereum-rpc.publicnode.com"),
});

export async function GET(request: NextRequest) {
  const address = request.nextUrl.searchParams.get("address");

  if (!address || !/^0x[a-fA-F0-9]{40}$/.test(address)) {
    return NextResponse.json(
      { error: "Valid Ethereum address required (?address=0x...)" },
      { status: 400 }
    );
  }

  try {
    const wallet = address as Address;

    const [ethBalanceRaw, vibestrBalanceRaw, vibestrDecimals] = await Promise.all([
      client.getBalance({ address: wallet }),
      client.readContract({
        address: VIBESTR_CONTRACT,
        abi: ERC20_ABI,
        functionName: "balanceOf",
        args: [wallet],
      }),
      client.readContract({
        address: VIBESTR_CONTRACT,
        abi: ERC20_ABI,
        functionName: "decimals",
      }),
    ]);

    const ethBalance = formatUnits(ethBalanceRaw, 18);
    const vibestrBalance = formatUnits(vibestrBalanceRaw, vibestrDecimals);

    return NextResponse.json({
      address: wallet,
      eth: { balance: ethBalance, raw: ethBalanceRaw.toString() },
      vibestr: { balance: vibestrBalance, raw: vibestrBalanceRaw.toString() },
    });
  } catch (err) {
    return NextResponse.json({ error: "Failed to read balances" }, { status: 500 });
  }
}

// Usage:
// fetch("/api/wallet?address=0xYOUR_WALLET_HERE")
//   .then(r => r.json())
//   .then(d => console.log(\`ETH: \${d.eth.balance}, VIBESTR: \${d.vibestr.balance}\`));
`;

// ----------------------------------------------------------------------------
// SNIPPET 4: Fetch Token Price (ETH + VIBESTR)
// File: app/api/prices/route.ts
//
// Fetches live USD prices for ETH (via CoinGecko) and VIBESTR (via DexScreener).
// No API key required for either service.
// ----------------------------------------------------------------------------

export const snippet_tokenPrices = `
import { NextResponse } from "next/server";

const COINGECKO_ETH = "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd";
const DEXSCREENER_VIBESTR = "https://api.dexscreener.com/latest/dex/tokens/0xd0cC2b0eFb168bFe1f94a948D8df70FA10257196";

export async function GET() {
  try {
    const [ethRes, vibestrRes] = await Promise.all([
      fetch(COINGECKO_ETH, { next: { revalidate: 60 } }),
      fetch(DEXSCREENER_VIBESTR, { next: { revalidate: 60 } }),
    ]);

    let ethPrice: number | null = null;
    let vibestrPrice: number | null = null;

    if (ethRes.ok) {
      const ethData = await ethRes.json();
      ethPrice = ethData.ethereum?.usd ?? null;
    }

    if (vibestrRes.ok) {
      const vibestrData = await vibestrRes.json();
      const topPair = vibestrData.pairs?.[0];
      vibestrPrice = topPair?.priceUsd ? parseFloat(topPair.priceUsd) : null;
    }

    return NextResponse.json({
      eth: { usd: ethPrice },
      vibestr: { usd: vibestrPrice },
      updatedAt: new Date().toISOString(),
    });
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch prices" }, { status: 500 });
  }
}

// Usage:
// fetch("/api/prices").then(r => r.json()).then(d => {
//   console.log(\`ETH: $\${d.eth.usd}, VIBESTR: $\${d.vibestr.usd}\`);
// });
`;

// ----------------------------------------------------------------------------
// SNIPPET 5: Load NFT Image with IPFS Fallback
// File: components/NFTImage.tsx
//
// Displays an NFT image with graceful error handling. Falls back to a
// placeholder if the primary image URL (OpenSea CDN or IPFS) fails to load.
// ----------------------------------------------------------------------------

export const snippet_nftImage = `
"use client";

import { useState } from "react";
import Image from "next/image";

interface NFTImageProps {
  src: string;
  tokenId: string;
  alt?: string;
  size?: number;
}

const PLACEHOLDER = "data:image/svg+xml," + encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" fill="#1a1a2e">' +
  '<rect width="300" height="300" rx="16"/>' +
  '<text x="150" y="150" text-anchor="middle" dy=".35em" fill="#FFE048" font-size="18" font-family="sans-serif">GVC</text>' +
  '</svg>'
);

export default function NFTImage({ src, tokenId, alt, size = 300 }: NFTImageProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError) {
      // Try IPFS gateway fallback if we haven't already
      if (imgSrc.includes("ipfs://")) {
        setImgSrc(imgSrc.replace("ipfs://", "https://ipfs.io/ipfs/"));
      } else {
        setImgSrc(PLACEHOLDER);
      }
      setHasError(true);
    }
  };

  return (
    <div
      className="relative overflow-hidden rounded-xl bg-zinc-900"
      style={{ width: size, height: size }}
    >
      <Image
        src={imgSrc}
        alt={alt ?? \`GVC #\${tokenId}\`}
        width={size}
        height={size}
        className="object-cover transition-opacity duration-300"
        onError={handleError}
        unoptimized={imgSrc.startsWith("data:")}
      />
    </div>
  );
}

// Usage:
// <NFTImage
//   src="https://i.seadn.io/gcs/files/abc123.png"
//   tokenId="1234"
//   size={200}
// />
`;

// ----------------------------------------------------------------------------
// SNIPPET 6: Display a Badge with Tier Glow
// File: components/BadgeCard.tsx
//
// Renders a GVC badge card with a colored glow effect matching its rarity tier.
// Includes hover scale animation for interactive feel.
// ----------------------------------------------------------------------------

export const snippet_badgeCard = `
"use client";

interface BadgeCardProps {
  id: string;
  name: string;
  tier: "common" | "rare" | "legendary" | "cosmic";
  image: string;
}

const TIER_GLOW: Record<BadgeCardProps["tier"], string> = {
  common:    "#E0E0E0",
  rare:      "#4A9EFF",
  legendary: "#FFE048",
  cosmic:    "#B366FF",
};

const TIER_LABEL_CLASS: Record<BadgeCardProps["tier"], string> = {
  common:    "bg-zinc-600 text-zinc-200",
  rare:      "bg-blue-600 text-blue-100",
  legendary: "bg-yellow-500 text-yellow-950",
  cosmic:    "bg-purple-600 text-purple-100",
};

export default function BadgeCard({ id, name, tier, image }: BadgeCardProps) {
  const glowColor = TIER_GLOW[tier];

  return (
    <div
      className="group relative w-48 rounded-2xl bg-zinc-900 p-3 transition-all duration-300 hover:scale-105 cursor-pointer"
      style={{
        boxShadow: \`0 0 0 1px \${glowColor}33, 0 0 20px \${glowColor}22\`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow =
          \`0 0 0 1px \${glowColor}88, 0 0 40px \${glowColor}44, 0 0 80px \${glowColor}22\`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow =
          \`0 0 0 1px \${glowColor}33, 0 0 20px \${glowColor}22\`;
      }}
    >
      <div className="overflow-hidden rounded-xl">
        <img
          src={image}
          alt={name}
          className="aspect-square w-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
      </div>

      <div className="mt-3 space-y-1">
        <p className="text-sm font-semibold text-white truncate">{name}</p>
        <span
          className={\`inline-block rounded-full px-2 py-0.5 text-xs font-bold uppercase tracking-wider \${TIER_LABEL_CLASS[tier]}\`}
        >
          {tier}
        </span>
      </div>
    </div>
  );
}

// Usage:
// <BadgeCard
//   id="badge-042"
//   name="Vibe Pioneer"
//   tier="legendary"
//   image="/badges/pioneer.png"
// />
`;

// ----------------------------------------------------------------------------
// SNIPPET 7: Animated Stats Card
// File: components/StatCard.tsx
//
// Animated stat card with a count-up number effect on mount. Uses
// framer-motion for entrance animation and requestAnimationFrame for
// smooth number counting.
// Requires: npm install framer-motion
// ----------------------------------------------------------------------------

export const snippet_statCard = `
"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface StatCardProps {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
}

function useCountUp(target: number, duration = 1500): number {
  const [current, setCurrent] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const start = performance.now();

    function tick(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic for smooth deceleration
      const eased = 1 - Math.pow(1 - progress, 3);
      setCurrent(Math.floor(eased * target));

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setCurrent(target);
      }
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [target, duration]);

  return current;
}

export default function StatCard({
  label,
  value,
  prefix = "",
  suffix = "",
  duration = 1500,
}: StatCardProps) {
  const displayValue = useCountUp(value, duration);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="group relative rounded-2xl bg-zinc-900 border border-zinc-800 p-6 transition-all duration-300 hover:border-yellow-500/50"
      style={{
        boxShadow: "0 0 0 0 transparent",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow =
          "0 0 30px rgba(255, 224, 72, 0.15), 0 0 60px rgba(255, 224, 72, 0.05)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = "0 0 0 0 transparent";
      }}
    >
      <p className="text-sm font-medium text-zinc-400 uppercase tracking-wider">
        {label}
      </p>
      <p className="mt-2 text-3xl font-bold text-white tabular-nums">
        {prefix}
        {displayValue.toLocaleString()}
        {suffix && <span className="ml-1 text-lg text-zinc-400">{suffix}</span>}
      </p>
    </motion.div>
  );
}

// Usage:
// <div className="grid grid-cols-3 gap-4">
//   <StatCard label="Floor Price" value={0.042} prefix="" suffix="ETH" />
//   <StatCard label="Holders" value={2847} />
//   <StatCard label="Total Volume" value={1250} prefix="$" suffix="USD" />
// </div>
`;

// ----------------------------------------------------------------------------
// SNIPPET 8: Toast Notification Setup
// File: app/layout.tsx (add Toaster) + usage example
//
// GVC-themed toast notifications using react-hot-toast. Gold accent for
// success states, dark background to match the GVC aesthetic.
// Requires: npm install react-hot-toast
// ----------------------------------------------------------------------------

export const snippet_toastSetup = `
// --- Step 1: Add the Toaster to your root layout ---
// File: app/layout.tsx

import { Toaster } from "react-hot-toast";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}

        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#18181b",
              color: "#fafafa",
              border: "1px solid #27272a",
              borderRadius: "12px",
              fontSize: "14px",
              padding: "12px 16px",
            },
            success: {
              iconTheme: {
                primary: "#FFE048",
                secondary: "#18181b",
              },
              style: {
                borderColor: "#FFE04833",
              },
            },
            error: {
              iconTheme: {
                primary: "#ef4444",
                secondary: "#18181b",
              },
              style: {
                borderColor: "#ef444433",
              },
            },
          }}
        />
      </body>
    </html>
  );
}

// --- Step 2: Use toast anywhere in your client components ---
// File: Any client component

"use client";

import toast from "react-hot-toast";

function handleSmash() {
  toast.success("Wall smashed!");
}

function handleClaim() {
  const toastId = toast.loading("Claiming badge...");

  // Simulate async operation
  setTimeout(() => {
    toast.success("Badge claimed!", { id: toastId });
  }, 2000);
}

function handleError() {
  toast.error("Wallet not connected");
}

// Custom styled toast with GVC gold accent:
function handleCustom() {
  toast("New listing detected!", {
    icon: "\\u2728",
    style: {
      background: "#18181b",
      color: "#FFE048",
      border: "1px solid #FFE04866",
    },
  });
}

// Usage:
// <button onClick={handleSmash}>Smash the Wall</button>
// <button onClick={handleClaim}>Claim Badge</button>
// <button onClick={handleCustom}>Custom Toast</button>
`;

// ============================================================================
// Snippet Index - Quick reference for all available snippets
// ============================================================================

export const snippetIndex = [
  { id: 1, key: "snippet_floorPrice",         file: "app/api/floor-price/route.ts",  description: "Fetch GVC floor price from OpenSea" },
  { id: 2, key: "snippet_listingsUnderPrice",  file: "app/api/listings/route.ts",     description: "Fetch GVC NFTs listed under a target price" },
  { id: 3, key: "snippet_walletBalance",       file: "app/api/wallet/route.ts",       description: "Read VIBESTR and ETH on-chain balances" },
  { id: 4, key: "snippet_tokenPrices",         file: "app/api/prices/route.ts",       description: "Fetch live ETH and VIBESTR USD prices" },
  { id: 5, key: "snippet_nftImage",            file: "components/NFTImage.tsx",        description: "NFT image component with IPFS fallback" },
  { id: 6, key: "snippet_badgeCard",           file: "components/BadgeCard.tsx",       description: "Badge card with tier-based glow effect" },
  { id: 7, key: "snippet_statCard",            file: "components/StatCard.tsx",        description: "Animated stat card with count-up effect" },
  { id: 8, key: "snippet_toastSetup",          file: "app/layout.tsx",                description: "GVC-themed toast notification setup" },
] as const;

export default function Home() {
  const endpoints = [
    { path: "/api/stats", description: "Collection stats (floor price, market cap, owners, volume)" },
    { path: "/api/holders?limit=20", description: "Holder rankings with optional limit" },
    { path: "/api/sales?limit=10", description: "Recent sale events with optional limit" },
    { path: "/api/sales/history?limit=100", description: "Historical sales from price cache (max 1000)" },
    { path: "/api/activity", description: "30-day community activity stats and accumulators" },
    { path: "/api/vibestr", description: "Latest VIBESTR token data" },
    { path: "/api/vibestr/history", description: "VIBESTR price/volume snapshots over time" },
    { path: "/api/market-depth", description: "Current offers and listings" },
    { path: "/api/traders", description: "Trader flip analysis (30-day)" },
    { path: "/api/wallet/[address]", description: "Resolve wallet to ENS name, Twitter, or community tag" },
    { path: "/api/mentions", description: "Recent X/Twitter mentions" },
  ];

  return (
    <div style={{ background: "#0a0a0a", color: "#e5e5e5", minHeight: "100vh", padding: "3rem 2rem", fontFamily: "system-ui, sans-serif" }}>
      <h1 style={{ fontSize: "2rem", fontWeight: 700, marginBottom: "0.5rem" }}>GVC Builder API</h1>
      <p style={{ color: "#888", marginBottom: "2rem" }}>Community data endpoints for Good Vibes Club builders. All routes return JSON and cache for 60 seconds.</p>
      <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "1rem" }}>
        {endpoints.map((ep) => (
          <li key={ep.path} style={{ borderBottom: "1px solid #222", paddingBottom: "0.75rem" }}>
            <code style={{ color: "#22d3ee", fontSize: "0.95rem" }}>{ep.path}</code>
            <p style={{ color: "#888", margin: "0.25rem 0 0", fontSize: "0.85rem" }}>{ep.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

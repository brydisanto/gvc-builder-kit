/** @type {import('next').NextConfig} */
const nextConfig = {
  headers: async () => [
    {
      source: "/api/:path*",
      headers: [
        { key: "Access-Control-Allow-Origin", value: "*" },
        { key: "Access-Control-Allow-Methods", value: "GET" },
        {
          key: "Cache-Control",
          value: "public, s-maxage=60, stale-while-revalidate=120",
        },
      ],
    },
  ],
};

export default nextConfig;

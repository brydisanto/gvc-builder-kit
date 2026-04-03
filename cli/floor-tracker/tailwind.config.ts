import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "gvc-gold": "#FFE048",
        "gvc-black": "#050505",
        "gvc-dark": "#121212",
        "gvc-gray": "#1F1F1F",
        "pink-accent": "#FF6B9D",
        "gvc-orange": "#FF5F1F",
        "gvc-green": "#2EFF2E",
      },
      fontFamily: {
        display: ["var(--font-brice)", "serif"],
        body: ["var(--font-mundial)", "sans-serif"],
      },
      animation: {
        shimmer: "shimmer 2.5s ease-in-out infinite",
        glowPulse: "glowPulse 2s ease-in-out infinite",
        wiggle: "wiggle 0.5s ease-in-out",
        "ember-float": "emberFloat 6s ease-in-out infinite",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        glowPulse: {
          "0%, 100%": {
            boxShadow: "0 0 20px rgba(255, 224, 72, 0.3), 0 0 60px rgba(255, 224, 72, 0.1)",
          },
          "50%": {
            boxShadow: "0 0 30px rgba(255, 224, 72, 0.5), 0 0 80px rgba(255, 224, 72, 0.2)",
          },
        },
        wiggle: {
          "0%, 100%": { transform: "rotate(0deg)" },
          "25%": { transform: "rotate(-12deg)" },
          "50%": { transform: "rotate(8deg)" },
          "75%": { transform: "rotate(-4deg)" },
        },
        emberFloat: {
          "0%, 100%": { transform: "translateY(0) scale(1)", opacity: "0.6" },
          "50%": { transform: "translateY(-20px) scale(1.1)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};

export default config;

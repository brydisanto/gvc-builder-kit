import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "gvc-gold": "#FFE048",
        "gvc-black": "#050505",
        "gvc-dark": "#121212",
        "gvc-gray": "#1F1F1F",
        "gvc-green": "#2EFF2E",
        "pink-accent": "#FF6B9D",
        "gvc-orange": "#FF5F1F",
      },
      fontFamily: {
        display: ["var(--font-brice)", "serif"],
        body: ["var(--font-mundial)", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;

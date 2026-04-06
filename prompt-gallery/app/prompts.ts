export interface Prompt {
  id: string;
  title: string;
  description: string;
  category: "profile" | "scene" | "meme" | "cinematic" | "artistic";
  template: string;
  previewEmoji: string;
}

const PROMPTS: Prompt[] = [
  {
    id: "action-hero",
    title: "80s Action Hero",
    description: "Your GVC citizen as the star of a 1980s action movie poster",
    category: "cinematic",
    previewEmoji: "🎬",
    template: `A dramatic 1980s action movie poster featuring a character with these traits: {TRAITS}. The character is posed heroically with explosions behind them, neon lights, retro VHS aesthetic. Title text reads "VIBETOWN" in chrome metallic lettering. Cinematic lighting, lens flare, synthwave color palette with gold accents.`,
  },
  {
    id: "pixel-art",
    title: "Pixel Art Portrait",
    description: "Your character reimagined as a 16-bit pixel art sprite",
    category: "artistic",
    previewEmoji: "👾",
    template: `A 16-bit pixel art portrait of a character with these traits: {TRAITS}. Retro video game style, clean pixel edges, limited color palette with gold (#FFE048) as the primary accent color. Dark background (#050505). Nostalgic, charming, game-ready sprite aesthetic.`,
  },
  {
    id: "vogue-cover",
    title: "Vogue Cover",
    description: "Your citizen on the cover of a high-fashion magazine",
    category: "profile",
    previewEmoji: "📸",
    template: `A high-fashion magazine cover photograph featuring a character with these traits: {TRAITS}. Vogue magazine style, dramatic studio lighting, editorial pose. "VIBETOWN VOGUE" masthead in elegant gold typography. Minimal, luxurious, high-end fashion photography aesthetic with dark background and gold accents.`,
  },
  {
    id: "wanted-poster",
    title: "Wanted Poster",
    description: "An Old West wanted poster for your GVC character",
    category: "meme",
    previewEmoji: "🤠",
    template: `A weathered Wild West wanted poster featuring a character with these traits: {TRAITS}. Aged parchment paper, distressed typography reading "WANTED" at the top and "FOR SPREADING GOOD VIBES" at the bottom. Reward listed as "6,969 VIBESTR". Sepia tones with gold (#FFE048) accents. Hand-drawn illustration style.`,
  },
  {
    id: "anime-hero",
    title: "Anime Protagonist",
    description: "Your character as an anime hero mid-battle",
    category: "cinematic",
    previewEmoji: "⚔️",
    template: `An anime-style illustration of a character with these traits: {TRAITS}. Dynamic action pose with flowing energy effects in gold (#FFE048). Speed lines, dramatic lighting, manga-inspired composition. Dark atmospheric background with glowing gold particles. Studio Ghibli meets Shonen style.`,
  },
  {
    id: "trading-card",
    title: "Holographic Trading Card",
    description: "A rare holographic collectible card of your citizen",
    category: "profile",
    previewEmoji: "✨",
    template: `A holographic collectible trading card featuring a character with these traits: {TRAITS}. Prismatic rainbow holographic foil effect, premium card stock appearance. Character stats displayed: "VIBES: MAX", "RARITY: LEGENDARY". Gold (#FFE048) border and accents. Card name in bold display font. Dark background with iridescent shimmer.`,
  },
  {
    id: "renaissance",
    title: "Renaissance Painting",
    description: "Your GVC as a classical Renaissance oil painting",
    category: "artistic",
    previewEmoji: "🎨",
    template: `A Renaissance-era oil painting portrait of a character with these traits: {TRAITS}. Classical composition, dramatic chiaroscuro lighting, rich oil paint textures. Ornate gold (#FFE048) gilded frame visible. Baroque style, museum-quality, reminiscent of Rembrandt or Vermeer. Dark moody background with warm gold highlights.`,
  },
  {
    id: "neon-cyberpunk",
    title: "Cyberpunk Neon",
    description: "Your citizen in a futuristic neon-lit cyberpunk city",
    category: "scene",
    previewEmoji: "🌃",
    template: `A cyberpunk scene featuring a character with these traits: {TRAITS}. Standing in a rain-soaked neon-lit alley in a futuristic city. Holographic advertisements, flying vehicles in the background. Primary neon color is gold (#FFE048) with deep black (#050505) shadows. Blade Runner meets Akira aesthetic. Cinematic, moody, atmospheric.`,
  },
  {
    id: "sports-card",
    title: "MVP Sports Card",
    description: "Your character as an all-star athlete trading card",
    category: "meme",
    previewEmoji: "🏆",
    template: `A premium sports trading card featuring a character with these traits: {TRAITS}. Posed as an MVP athlete with dynamic action photography. Stats panel showing "VIBES: 99 OVR". Team name "VIBETOWN CITIZENS". Gold (#FFE048) foil accents, jersey number #6969. Professional sports photography lighting with bokeh background.`,
  },
  {
    id: "album-cover",
    title: "Album Cover",
    description: "Your GVC citizen's debut album artwork",
    category: "artistic",
    previewEmoji: "🎵",
    template: `A music album cover featuring a character with these traits: {TRAITS}. Artistic, moody composition. Album title "GOOD VIBES ONLY" in bold display typography. Dark (#050505) background with gold (#FFE048) graphic elements. Modern, minimal, premium music artwork aesthetic. Could be hip-hop, electronic, or indie — the vibe is confident and cool.`,
  },
  {
    id: "space-explorer",
    title: "Space Explorer",
    description: "Your citizen exploring the cosmos in a spacesuit",
    category: "scene",
    previewEmoji: "🚀",
    template: `A character with these traits: {TRAITS}, wearing a futuristic gold-accented spacesuit, floating in space with Earth visible in the background. Helmet visor reflects stars. Gold (#FFE048) trim on the suit. The word "VIBETOWN" is embroidered on the chest patch. Photorealistic, cinematic space photography, deep blacks with gold highlights.`,
  },
  {
    id: "chibi",
    title: "Chibi Kawaii",
    description: "An adorable chibi version of your character",
    category: "profile",
    previewEmoji: "🥺",
    template: `An adorable chibi/kawaii illustration of a character with these traits: {TRAITS}. Oversized head, tiny body, big sparkly eyes. Cute pose with peace sign or heart gesture. Soft pastel gold (#FFE048) accents on dark background. Clean vector-style illustration, sticker-ready, incredibly cute and wholesome.`,
  },
];

export default PROMPTS;

export const CATEGORIES = [
  { id: "all", label: "All" },
  { id: "profile", label: "Profile Pics" },
  { id: "scene", label: "Scenes" },
  { id: "cinematic", label: "Cinematic" },
  { id: "artistic", label: "Artistic" },
  { id: "meme", label: "Memes & Fun" },
] as const;

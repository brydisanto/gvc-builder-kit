export interface Prompt {
  id: string;
  title: string;
  description: string;
  category: "profile" | "scene" | "meme" | "cinematic" | "artistic" | "character";
  template: string;
  previewEmoji: string;
  exampleImage?: string; // path to /examples/[id].png — add your own!
  exampleTokenId?: string; // which token was used for the example
}

const PROMPTS: Prompt[] = [
  {
    id: "full-body",
    title: "Full Body Character",
    description: "See your GVC citizen as a complete full-body 3D character",
    category: "character",
    previewEmoji: "🧍",
    exampleImage: "/examples/full-body.png",
    exampleTokenId: "4217",
    template: `Generate a full-body version of my character.

IDENTITY LOCK (CRITICAL)
Preserve exactly:
• head shape, facial features, expression
• material finish (glossy, matte, soft plastic, etc.)
• color palette and shading behavior
• accessories and clothing from the original image
Do not redesign or reinterpret the character's style.
The result must feel like the same exact character, simply revealed as full body.

STYLE CONTINUATION (VERY IMPORTANT)
Extend the existing outfit naturally into a full-body design:
• continue fabric types, stitching logic, and material behavior from the upper body
• maintain the same design language, color transitions, and detailing
• avoid adding unrelated fashion elements
• everything must feel like it belongs to the same original design

PROPORTION GUIDE
Use standard GVC character proportions:
• head is approximately 1/4 of total body height (stylized large head)
• short legs relative to torso (premium toy/vinyl figure proportions)
• simplified mitten-like hands
• chunky sneakers with visible sole detail

GVC STYLE TARGET
Render in a vibrant, high-quality stylized 3D aesthetic:
• soft rounded forms
• premium toy-like finish
• clean surfaces with subtle micro-texture
• global illumination, soft reflections, and bounce light
• cinematic but playful lighting

POSE
Neutral standing pose, relaxed and balanced
Feet fully visible
Arms naturally positioned (slight variation allowed)

CAMERA
Full-body centered framing
Slight perspective (85mm lens feel)
Character standing on a subtle platform or ground plane

BACKGROUND
Minimal gradient background matching the character's color palette
Soft studio lighting, no distractions

OUTPUT
Highly polished 3D render, consistent with high-end character design
Add subtle Vibetown energy:
• soft colored rim light (matching palette)
• gentle glow accents
• clean studio + dreamy gradient blend`,
  },
  {
    id: "action-hero",
    title: "80s Action Hero",
    description: "Your GVC citizen as the star of a 1980s action movie poster",
    category: "cinematic",
    previewEmoji: "🎬",
    exampleImage: "/examples/action-hero.svg",
    template: `Create a dramatic 1980s action movie poster. The character ({TRAITS}) is posed heroically with explosions behind them. Neon lights, retro VHS aesthetic, film grain. Title text reads "VIBETOWN" in chrome metallic lettering. Cinematic lighting, lens flare, synthwave color palette with gold (#FFE048) accents. Full poster composition with tagline at the bottom.`,
  },
  {
    id: "pixel-art",
    title: "Pixel Art Portrait",
    description: "Your character reimagined as a 16-bit pixel art sprite",
    category: "artistic",
    previewEmoji: "👾",
    exampleImage: "/examples/pixel-art.svg",
    template: `Reimagine this character ({TRAITS}) as a 16-bit pixel art sprite. Retro video game style, clean pixel edges, limited color palette with gold (#FFE048) highlights. Dark background (#050505). The character should be recognizable but translated into charming nostalgic pixel art. Game-ready sprite aesthetic, like a character select screen.`,
  },
  {
    id: "vogue-cover",
    title: "Vogue Cover",
    description: "Your citizen on the cover of a high-fashion magazine",
    category: "profile",
    previewEmoji: "📸",
    exampleImage: "/examples/vogue-cover.svg",
    template: `Place this character ({TRAITS}) on the cover of a luxury fashion magazine. "VIBETOWN VOGUE" masthead in elegant gold serif typography at the top. Dramatic studio lighting, editorial pose, high-end photography aesthetic. Dark moody background with gold (#FFE048) accents. Cover lines like "The Citizen Issue" and "Good Vibes Only" in small white text. Magazine layout composition.`,
  },
  {
    id: "wanted-poster",
    title: "Wanted Poster",
    description: "An Old West wanted poster for your GVC character",
    category: "meme",
    previewEmoji: "🤠",
    exampleImage: "/examples/wanted-poster.svg",
    template: `Create a weathered Wild West wanted poster featuring this character ({TRAITS}). Aged yellowed parchment paper with burned edges, distressed woodblock typography. "WANTED" in large bold text at top, character portrait in the center, "FOR SPREADING GOOD VIBES" below. Reward listed as "6,969 VIBESTR". Sepia tones with subtle gold (#FFE048) accents. Hand-drawn illustration style matching the character's appearance.`,
  },
  {
    id: "anime-hero",
    title: "Anime Protagonist",
    description: "Your character as an anime hero mid-battle",
    category: "cinematic",
    previewEmoji: "⚔️",
    exampleImage: "/examples/anime-hero.svg",
    template: `Transform this character ({TRAITS}) into an anime-style illustration. Dynamic action pose with flowing energy effects in gold (#FFE048). Speed lines, dramatic lighting, manga-inspired composition. Dark atmospheric background with glowing gold particles. The character's outfit and features should be translated into anime style while staying recognizable. High quality, Studio Ghibli meets Shonen aesthetic.`,
  },
  {
    id: "trading-card",
    title: "Holographic Trading Card",
    description: "A rare holographic collectible card of your citizen",
    category: "profile",
    previewEmoji: "✨",
    exampleImage: "/examples/trading-card.svg",
    template: `Design a premium holographic collectible trading card featuring this character ({TRAITS}). Prismatic rainbow holographic foil effect on the border and background. Character centered on the card with stats displayed: "VIBES: MAX" and "RARITY: LEGENDARY". Gold (#FFE048) metallic border. Card name in bold display font at the bottom. The card appears to be floating with light refracting off the holographic surface. Premium collector quality.`,
  },
  {
    id: "renaissance",
    title: "Renaissance Painting",
    description: "Your GVC as a classical Renaissance oil painting",
    category: "artistic",
    previewEmoji: "🎨",
    exampleImage: "/examples/renaissance.svg",
    template: `Paint this character ({TRAITS}) as a classical Renaissance-era oil painting portrait. Dramatic chiaroscuro lighting (Rembrandt style), rich oil paint textures with visible brushstrokes. The character is posed regally, wearing their original outfit but rendered in classical painting technique. Ornate gold (#FFE048) gilded frame visible around the edges. Dark moody background with warm golden highlights. Museum-quality, old master aesthetic.`,
  },
  {
    id: "neon-cyberpunk",
    title: "Cyberpunk Neon",
    description: "Your citizen in a futuristic neon-lit cyberpunk city",
    category: "scene",
    previewEmoji: "🌃",
    exampleImage: "/examples/neon-cyberpunk.svg",
    template: `Place this character ({TRAITS}) in a rain-soaked cyberpunk city alley at night. Neon signs in gold (#FFE048) reflecting off wet pavement. Holographic advertisements floating in the air, flying vehicles in the distant sky. The character stands confidently in the scene, their original outfit fitting naturally into the futuristic setting. Deep black (#050505) shadows with vibrant neon highlights. Blade Runner meets Akira aesthetic. Cinematic, moody, atmospheric.`,
  },
  {
    id: "sports-card",
    title: "MVP Sports Card",
    description: "Your character as an all-star athlete trading card",
    category: "meme",
    previewEmoji: "🏆",
    exampleImage: "/examples/sports-card.svg",
    template: `Design a premium sports trading card featuring this character ({TRAITS}) as an MVP athlete. Dynamic action pose as if mid-play. Stats panel showing "VIBES: 99 OVR". Team name "VIBETOWN CITIZENS" with jersey number #6969. Gold (#FFE048) foil accents and premium card design. Professional sports photography lighting with bokeh background. The character's features and outfit adapted into athletic gear while staying recognizable.`,
  },
  {
    id: "album-cover",
    title: "Album Cover",
    description: "Your GVC citizen's debut album artwork",
    category: "artistic",
    previewEmoji: "🎵",
    exampleImage: "/examples/album-cover.svg",
    template: `Design a music album cover featuring this character ({TRAITS}). Artistic, moody composition. Album title "GOOD VIBES ONLY" in bold display typography. Dark (#050505) background with gold (#FFE048) graphic elements. The character is posed confidently, their outfit and look adapted to feel like a recording artist. Modern, minimal, premium music artwork aesthetic. Could be hip-hop, electronic, or indie — the vibe is confident and cool. Square format.`,
  },
  {
    id: "space-explorer",
    title: "Space Explorer",
    description: "Your citizen exploring the cosmos in a spacesuit",
    category: "scene",
    previewEmoji: "🚀",
    exampleImage: "/examples/space-explorer.svg",
    template: `Place this character ({TRAITS}) in outer space, wearing a futuristic spacesuit with gold (#FFE048) trim and accents. They're floating weightlessly with Earth visible in the background. Helmet visor reflects stars and nebulae. "VIBETOWN" embroidered on the chest patch. The character's face and features are visible through the visor. Photorealistic space photography, deep blacks with gold highlights and cosmic colors.`,
  },
  {
    id: "chibi",
    title: "Chibi Kawaii",
    description: "An adorable chibi version of your character",
    category: "profile",
    previewEmoji: "🥺",
    exampleImage: "/examples/chibi.svg",
    template: `Reimagine this character ({TRAITS}) as an adorable chibi/kawaii illustration. Oversized head (3x body ratio), tiny body, big sparkly eyes full of joy. Cute pose — peace sign or holding a heart. Keep their original outfit and distinctive features but make everything impossibly cute. Soft gold (#FFE048) accents on dark background. Clean vector-style illustration, sticker-ready. Maximum wholesome energy.`,
  },
];

export default PROMPTS;

export const CATEGORIES = [
  { id: "all", label: "All" },
  { id: "character", label: "Character" },
  { id: "profile", label: "Profile Pics" },
  { id: "scene", label: "Scenes" },
  { id: "cinematic", label: "Cinematic" },
  { id: "artistic", label: "Artistic" },
  { id: "meme", label: "Memes & Fun" },
] as const;

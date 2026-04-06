export interface Prompt {
  id: string;
  title: string;
  description: string;
  category: "profile" | "scene" | "meme" | "cinematic" | "artistic" | "character";
  template: string;
  icon: "body" | "film" | "pixel" | "camera" | "scroll" | "sword" | "sparkle" | "paint" | "city" | "trophy" | "music" | "rocket" | "heart";
  author: string; // X handle, e.g. "@GoodVibesClub"
  exampleImage?: string;
  exampleTokenId?: string;
  hasReferenceImage?: boolean;
  pinned?: boolean;
}

const PROMPTS: Prompt[] = [
  {
    id: "full-body",
    title: "Full Body Character",
    description: "Generate your GVC as a complete, full-body, 3D character. Exporting your full-body character will produce better quality outputs in all future prompts.",
    category: "character",
    icon: "body",
    author: "@GoodVibesClub",
    exampleImage: "/examples/full-body.png",
    exampleTokenId: "2375",
    hasReferenceImage: true,
    pinned: true,
    template: `I've uploaded two images.

MY CHARACTER: This is my Good Vibes Club (GVC) NFT character. Use this as the definitive reference for the character's identity - head, face, expression, outfit, colors, materials, and accessories. This is the image that is NOT named "Image-2-GVC-Proportion-Reference.png".

PROPORTION REFERENCE (the file named "Image-2-GVC-Proportion-Reference.png"): This is a proportion guide showing the standard GVC full-body character from multiple angles. Use this ONLY for body proportions, limb length, stance, and overall height ratio. Do NOT copy the style, clothing, colors, or materials from this image.

TASK: Generate a full-body version of my character using the body proportions from the proportion reference.

IDENTITY LOCK (CRITICAL)
Preserve exactly from my character image:
- head shape, facial features, expression
- material finish (glossy, matte, soft plastic, etc.)
- color palette and shading behavior
- accessories and clothing
Do not redesign or reinterpret the character's style.
The result must feel like the same exact character, simply revealed as full body.

STYLE CONTINUATION (VERY IMPORTANT)
Extend the existing outfit from my character image naturally into a full-body design:
- continue fabric types, stitching logic, and material behavior from the upper body
- maintain the same design language, color transitions, and detailing
- avoid adding unrelated fashion elements
- everything must feel like it belongs to the same original design

PROPORTION GUIDE (from "Image-2-GVC-Proportion-Reference.png" ONLY)
Use the proportion reference image for:
- body height ratio (head is ~1/4 of total height)
- limb proportions (short legs, simplified hands)
- pose balance and stance
- chunky sneaker style on feet
Do NOT transfer any style, clothing, colors, or materials from the proportion reference.

GVC STYLE TARGET
Render in a vibrant, high-quality stylized 3D aesthetic:
- soft rounded forms
- premium toy-like finish
- clean surfaces with subtle micro-texture
- global illumination, soft reflections, and bounce light
- cinematic but playful lighting

POSE
Neutral standing pose, relaxed and balanced
Feet fully visible
Arms naturally positioned (slight variation allowed)

CAMERA
Full-body centered framing
Slight perspective (85mm lens feel)
Character standing on a subtle platform or ground plane

BACKGROUND
Minimal gradient background matching the character's color palette from my character image
Soft studio lighting, no distractions

OUTPUT
Highly polished 3D render, consistent with high-end character design
Add subtle Vibetown energy:
- soft colored rim light (matching the character's palette)
- gentle glow accents
- clean studio + dreamy gradient blend`,
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
  { id: "meme", label: "Memes and Fun" },
] as const;

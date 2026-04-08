export interface Prompt {
  id: string;
  title: string;
  description: string;
  category: "profile" | "scene" | "meme" | "cinematic" | "artistic" | "character";
  template: string;
  icon: "body" | "film" | "pixel" | "camera" | "scroll" | "sword" | "sparkle" | "paint" | "city" | "trophy" | "music" | "rocket" | "heart";
  author: string;
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

MY CHARACTER (GVC-{TOKEN_ID}.png): This is my Good Vibes Club (GVC) NFT character. Use this as the definitive reference for identity - head, face, expression, outfit, colors, materials, and accessories.

PROPORTION REFERENCE (Image-2-GVC-Proportion-Reference.png): Use ONLY for body proportions, limb length, and stance. Do NOT copy style, clothing, colors, or materials from this image.

TASK
Generate a full-body version of the character from GVC-{TOKEN_ID}.png using the body proportions from Image-2-GVC-Proportion-Reference.png.

IDENTITY LOCK (CRITICAL)
Preserve exactly from GVC-{TOKEN_ID}.png:
- head shape, facial features, expression
- material finish (glossy, matte, soft plastic, etc.)
- color palette and shading behavior
- accessories and clothing
Do not redesign or reinterpret the character's style.
The result must feel like the same exact character, simply revealed as full body.

STYLE CONTINUATION (VERY IMPORTANT)
Extend the existing outfit naturally into a full-body design:
- continue fabric types, stitching logic, and material behavior from the upper body
- maintain the same design language, color transitions, and detailing
- avoid adding unrelated fashion elements
- everything must feel like it belongs to the same original design
- never apply a pattern to the pants, pants should only appear as one color

PROPORTION GUIDE (from Image-2-GVC-Proportion-Reference.png ONLY)
Use Image-2-GVC-Proportion-Reference.png to guide:
- body height ratio
- limb proportions
- pose balance and stance
Do NOT transfer style, clothing, or materials from Image-2-GVC-Proportion-Reference.png.

GVC STYLE TARGET
Render in a vibrant, high-quality stylized 3D aesthetic:
- soft rounded forms
- premium toy-like finish
- clean surfaces with subtle micro-texture
- global illumination, soft reflections, and bounce light
- cinematic but playful lighting

POSE
Neutral standing pose, relaxed and balanced.
Feet fully visible.
Arms naturally positioned (slight variation allowed).

CAMERA
Full-body centered framing.
Slight perspective (85mm lens feel).
Character standing on a subtle platform or ground plane.

BACKGROUND
Minimal gradient background matching the character's color palette from GVC-{TOKEN_ID}.png.
Soft studio lighting, no distractions.

OUTPUT
Highly polished 3D render, consistent with high-end character design.
Add subtle Vibetown energy:
- soft colored rim light (matching palette from GVC-{TOKEN_ID}.png)
- gentle glow accents
- clean studio + dreamy gradient blend`,
  },
  {
    id: "t-pose",
    title: "T-Pose",
    description: "Generate your GVC in a T-Pose from 3 angles (front, 3/4, rear). Ideal for character sheets, 3D modeling reference, and animation-ready assets.",
    category: "character",
    icon: "body",
    author: "@GoodVibesClub",
    exampleImage: "/examples/t-pose.png",
    exampleTokenId: "1330",
    hasReferenceImage: true,
    pinned: true,
    template: `I've uploaded two images.

MY CHARACTER (GVC-{TOKEN_ID}.png): This is my Good Vibes Club (GVC) NFT character. Use this as the definitive reference for identity - head, face, expression, outfit, colors, materials, and accessories.

PROPORTION REFERENCE (Image-2-GVC-Proportion-Reference.png): Use ONLY for body proportions, limb length, stance, and camera angles. Do NOT copy style, clothing, colors, or materials from this image.

TASK
Generate a full-body version of the character from GVC-{TOKEN_ID}.png in 3 different angles using the body proportions from Image-2-GVC-Proportion-Reference.png.

IDENTITY LOCK (CRITICAL)
Preserve exactly from GVC-{TOKEN_ID}.png:
- head shape, facial features, expression
- material finish (glossy, matte, soft plastic, etc.)
- color palette and shading behavior
- accessories and clothing
Do not redesign or reinterpret the character's style.
The result must feel like the same exact character, simply revealed as full body.

STYLE CONTINUATION (VERY IMPORTANT)
Extend the existing outfit naturally into a full-body design:
- continue fabric types, stitching logic, and material behavior from the upper body
- maintain the same design language, color transitions, and detailing
- avoid adding unrelated fashion elements
- everything must feel like it belongs to the same original design
- never apply a pattern to the pants, pants should only appear as one color

PROPORTION GUIDE (from Image-2-GVC-Proportion-Reference.png ONLY)
Use Image-2-GVC-Proportion-Reference.png to guide:
- body height ratio
- limb proportions
- pose balance and stance
Do NOT transfer style, clothing, or materials from Image-2-GVC-Proportion-Reference.png.

GVC STYLE TARGET
Render in a vibrant, high-quality stylized 3D aesthetic:
- soft rounded forms
- premium toy-like finish
- clean surfaces with subtle micro-texture
- global illumination, soft reflections, and bounce light
- cinematic but playful lighting

POSE
Single T Pose identical across all 3 angles:
- feet fully visible
- arms naturally positioned
- the pose must not change between views

CAMERA
3 angles of the same pose:
- front view
- 3/4 view
- rear view
Full-body centered framing in each.
Slight perspective (85mm lens feel).
Character standing on a subtle elevated platform (toy collectible feel).

BACKGROUND
Minimal gradient background matching the character's color palette from GVC-{TOKEN_ID}.png.
Soft studio lighting, no distractions.

OUTPUT
Highly polished 3D render, consistent with high-end collectible character design.
Add subtle Vibetown energy:
- soft colored rim light (matching palette from GVC-{TOKEN_ID}.png)
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

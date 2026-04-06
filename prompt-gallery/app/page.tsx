"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import PROMPTS, { CATEGORIES, Prompt } from "./prompts";

interface TokenMeta {
  name: string;
  traits: Record<string, string>;
  image: string;
}

// Map raw trait values to richer descriptions
const TYPE_DESCRIPTIONS: Record<string, string> = {
  "Grayscale": "rendered in a monochrome grayscale palette",
  "Robot": "a metallic robot with mechanical joints and glowing circuit details",
  "Plastic": "made of glossy smooth plastic with a toy-like sheen",
  "Skeleton": "a skeletal figure with exposed bones and hollow eye sockets",
  "Zombie": "a zombie with decayed skin and eerie undead features",
  "Alien": "an alien with otherworldly skin tone and extraterrestrial features",
  "Gold": "made entirely of polished gold with a luxurious metallic finish",
  "Ghost": "a translucent ghostly figure with an ethereal glow",
};

function describeTraits(traits: Record<string, string>): string {
  const parts: string[] = [];

  // Type — the most defining visual characteristic
  const typeVal = traits["Type"] || "";
  if (typeVal.startsWith("Gradient")) {
    parts.push(`with a vibrant gradient color scheme (${typeVal.replace("Gradient ", "")})`);
  } else if (TYPE_DESCRIPTIONS[typeVal]) {
    parts.push(TYPE_DESCRIPTIONS[typeVal]);
  } else if (typeVal) {
    parts.push(`with a ${typeVal.toLowerCase()} appearance`);
  }

  // Face
  if (traits["Face"]) {
    parts.push(`wearing ${traits["Face"].toLowerCase()} on their face`);
  }

  // Hair
  if (traits["Hair"]) {
    const hair = traits["Hair"];
    parts.push(`with ${hair.toLowerCase()} hairstyle`);
  }

  // Body
  if (traits["Body"]) {
    parts.push(`dressed in a ${traits["Body"].toLowerCase()}`);
  }

  // Background — used as scene context
  if (traits["Background"]) {
    const bg = traits["Background"].replace("BG ", "").toLowerCase();
    parts.push(`originally on a ${bg} background`);
  }

  return parts.join(", ");
}

function formatTraitsShort(traits: Record<string, string>): string {
  return Object.entries(traits)
    .map(([type, value]) => `${type}: ${value}`)
    .join(", ");
}

const GVC_STYLE_PREFIX = `I've uploaded an image of my Good Vibes Club (GVC) NFT character. This is a 3D-rendered collectible character from an NFT collection created by award-winning animation studio Toast. The art style features smooth, stylized 3D rendering with clean surfaces, expressive features, and a premium animated movie quality.

Using this exact character as the subject (keep their specific look, outfit, and features), create the following:\n\n`;

const GVC_STYLE_SUFFIX = `\n\nIMPORTANT: The character in the generated image must look like the uploaded GVC character — same outfit, same features, same vibe. Adapt them into the new scene/style while keeping them recognizable.`;

function assemblePrompt(template: string, traits: Record<string, string>): string {
  const description = describeTraits(traits);
  const filled = template.replace("{TRAITS}", description);
  return GVC_STYLE_PREFIX + filled + GVC_STYLE_SUFFIX;
}

export default function Home() {
  const [tokenId, setTokenId] = useState("");
  const [tokenMeta, setTokenMeta] = useState<TokenMeta | null>(null);
  const [metadata, setMetadata] = useState<Record<string, TokenMeta> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
  const [copied, setCopied] = useState(false);
  const [category, setCategory] = useState("all");

  // Load metadata
  useEffect(() => {
    fetch("/gvc-metadata.json")
      .then((r) => r.json())
      .then(setMetadata)
      .catch(() => setError("Could not load token metadata."));
  }, []);

  function lookupToken() {
    if (!metadata || !tokenId.trim()) return;
    setError("");
    setLoading(true);

    const id = tokenId.trim();
    const token = metadata[id];

    if (!token) {
      setError(`Token #${id} not found. Enter a number between 0 and 6968.`);
      setTokenMeta(null);
    } else {
      setTokenMeta(token);
    }
    setLoading(false);
  }

  const filteredPrompts = useMemo(
    () =>
      category === "all"
        ? PROMPTS
        : PROMPTS.filter((p) => p.category === category),
    [category]
  );

  const assembledPrompt = useMemo(() => {
    if (!selectedPrompt || !tokenMeta) return "";
    return assemblePrompt(selectedPrompt.template, tokenMeta.traits);
  }, [selectedPrompt, tokenMeta]);

  async function copyPrompt() {
    if (!assembledPrompt) return;
    try {
      await navigator.clipboard.writeText(assembledPrompt);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = assembledPrompt;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  const imageUrl = tokenMeta?.image
    ? tokenMeta.image.replace("ipfs://", "https://ipfs.io/ipfs/")
    : null;

  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Background embers */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="ember"
            style={{
              left: (8 + i * 15) + "%",
              top: (10 + (i % 3) * 25) + "%",
              animationDelay: (i * 0.9) + "s",
              animationDuration: (5 + i * 0.5) + "s",
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Header */}
        <div className="text-center mb-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 150 }}
            className="mb-4"
          >
            <Image
              src="/shaka.png"
              alt="GVC"
              width={64}
              height={64}
              className="mx-auto drop-shadow-[0_0_20px_rgba(255,224,72,0.3)]"
            />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-5xl font-display font-black text-shimmer mb-3"
          >
            Prompt Gallery
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-white/40 font-body text-lg max-w-xl mx-auto"
          >
            Pick a prompt, enter your GVC token ID, and get a custom image prompt featuring your character.
          </motion.p>
        </div>

        {/* Token lookup */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl bg-gvc-dark border border-white/[0.08] p-6 mb-8"
        >
          <h2 className="text-lg font-display font-bold text-white mb-3">
            Your GVC
          </h2>
          <div className="flex gap-3 mb-4">
            <input
              type="text"
              placeholder="Enter your token ID (0-6968)"
              value={tokenId}
              onChange={(e) => setTokenId(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && lookupToken()}
              className="flex-1 px-4 py-3 rounded-xl bg-black/40 border border-white/[0.08] text-white font-body text-sm placeholder:text-white/30 focus:outline-none focus:border-gvc-gold/30 transition-colors"
            />
            <button
              onClick={lookupToken}
              disabled={loading || !metadata}
              className="px-6 py-3 bg-gvc-gold text-gvc-black font-display font-bold rounded-xl hover:shadow-[0_0_20px_rgba(255,224,72,0.3)] transition-all disabled:opacity-50"
            >
              {loading ? "..." : "Look Up"}
            </button>
          </div>

          {error && (
            <p className="text-red-400 font-body text-sm">{error}</p>
          )}

          {tokenMeta && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-4 mt-2"
            >
              {imageUrl && (
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-black/40 flex-shrink-0">
                  <img
                    src={imageUrl}
                    alt={tokenMeta.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-white font-display font-bold">
                  {tokenMeta.name}
                </p>
                <p className="text-white/40 font-body text-xs mb-2">
                  {formatTraitsShort(tokenMeta.traits)}
                </p>
                {imageUrl && (
                  <a
                    href={imageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gvc-gold/10 border border-gvc-gold/20 text-gvc-gold text-xs font-body font-semibold hover:bg-gvc-gold/15 transition-colors"
                  >
                    Save your GVC image
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                  </a>
                )}
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Category filter */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-wrap gap-2 mb-6"
        >
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className={`px-4 py-2 rounded-xl font-display font-bold text-sm transition-all ${
                category === cat.id
                  ? "bg-gvc-gold/15 text-gvc-gold border border-gvc-gold/30"
                  : "border border-white/[0.08] text-white/40 hover:text-white/60 hover:border-white/15"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </motion.div>

        {/* Prompt grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {filteredPrompts.map((prompt, i) => (
            <motion.button
              key={prompt.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.05 }}
              onClick={() => setSelectedPrompt(prompt)}
              className={`text-left p-5 rounded-2xl border transition-all duration-300 hover:scale-[1.02] ${
                selectedPrompt?.id === prompt.id
                  ? "bg-gvc-gold/[0.08] border-gvc-gold/30 shadow-[0_0_20px_rgba(255,224,72,0.15)]"
                  : "bg-gvc-dark border-white/[0.08] hover:border-white/15"
              }`}
            >
              <div className="text-3xl mb-3">{prompt.previewEmoji}</div>
              <h3
                className={`font-display font-bold text-base mb-1 ${
                  selectedPrompt?.id === prompt.id
                    ? "text-gvc-gold"
                    : "text-white"
                }`}
              >
                {prompt.title}
              </h3>
              <p className="text-white/40 font-body text-sm leading-relaxed">
                {prompt.description}
              </p>
              <span className="inline-block mt-2 px-2 py-0.5 rounded-full bg-white/[0.04] text-white/25 text-xs font-body capitalize">
                {prompt.category}
              </span>
            </motion.button>
          ))}
        </div>

        {/* Assembled prompt output */}
        <AnimatePresence>
          {selectedPrompt && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="rounded-2xl bg-gvc-dark border border-gvc-gold/20 p-6 mb-8"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-display font-bold text-white">
                  {selectedPrompt.title}
                </h2>
                {tokenMeta && (
                  <span className="text-gvc-gold font-body text-xs">
                    for {tokenMeta.name}
                  </span>
                )}
              </div>

              {!tokenMeta ? (
                <div className="text-center py-8">
                  <p className="text-white/40 font-body text-sm">
                    Enter your token ID above to generate a custom prompt for your character
                  </p>
                </div>
              ) : (
                <>
                  <div className="bg-black/40 rounded-xl p-4 mb-4 border border-white/[0.06]">
                    <p className="text-white/70 font-body text-sm leading-relaxed whitespace-pre-wrap">
                      {assembledPrompt}
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={copyPrompt}
                      className={`flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 font-display font-bold text-sm rounded-xl transition-all duration-300 ${
                        copied
                          ? "bg-gvc-green/20 text-gvc-green border border-gvc-green/30"
                          : "bg-gvc-gold text-gvc-black hover:shadow-[0_0_20px_rgba(255,224,72,0.3)]"
                      }`}
                    >
                      {copied ? "Copied!" : "Copy Prompt"}
                    </button>
                    <a
                      href="https://gemini.google.com/app"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 font-display font-bold text-sm rounded-xl border border-white/[0.12] text-white/70 hover:border-gvc-gold/30 hover:text-gvc-gold transition-all"
                    >
                      Open Gemini
                      <svg className="w-3.5 h-3.5 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                    </a>
                    <a
                      href="https://chatgpt.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 font-display font-bold text-sm rounded-xl border border-white/[0.08] text-white/40 hover:border-white/15 hover:text-white/60 transition-all"
                    >
                      ChatGPT
                      <svg className="w-3.5 h-3.5 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                    </a>
                  </div>
                  <div className="mt-4 pt-4 border-t border-white/[0.06]">
                    <p className="text-white/40 font-body text-xs font-semibold mb-2">How to use:</p>
                    <ol className="text-white/30 font-body text-xs space-y-1 list-decimal list-inside">
                      <li>Save your GVC image above (right-click &rarr; Save Image)</li>
                      <li>Open Gemini (or ChatGPT)</li>
                      <li>Upload your GVC image to the chat</li>
                      <li>Paste the prompt below the image and send</li>
                    </ol>
                    <p className="text-white/20 font-body text-xs mt-2">We recommend <span className="text-white/35">Gemini</span> for best image generation results.</p>
                  </div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <div className="text-center pt-4 pb-8">
          <Image
            src="/gvc-logotype.svg"
            alt="Good Vibes Club"
            width={100}
            height={20}
            className="mx-auto mb-2 opacity-30"
          />
          <p className="text-white/15 text-xs font-body">
            Good Vibes Club Prompt Gallery
          </p>
        </div>
      </div>
    </main>
  );
}

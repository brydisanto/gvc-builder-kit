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

function assemblePrompt(template: string, traits: Record<string, string>, hasReferenceImage?: boolean): string {
  const description = describeTraits(traits);
  const filled = template.replace("{TRAITS}", description);
  // Prompts with their own multi-image instructions (like Full Body) skip the generic prefix/suffix
  if (hasReferenceImage) return filled;
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
  const [activeTab, setActiveTab] = useState<"browse" | "submit">("browse");

  // Submission form state
  const [submitTitle, setSubmitTitle] = useState("");
  const [submitPromptText, setSubmitPromptText] = useState("");
  const [submitTokenId, setSubmitTokenId] = useState("");
  const [submitHandle, setSubmitHandle] = useState("");
  const [submitFile, setSubmitFile] = useState<File | null>(null);
  const [submitPreview, setSubmitPreview] = useState("");
  const [submitDragOver, setSubmitDragOver] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  function handleFileDrop(e: React.DragEvent) {
    e.preventDefault();
    setSubmitDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setSubmitFile(file);
      setSubmitPreview(URL.createObjectURL(file));
    }
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setSubmitFile(file);
      setSubmitPreview(URL.createObjectURL(file));
    }
  }

  function clearFile() {
    setSubmitFile(null);
    setSubmitPreview("");
  }

  function handleSubmit() {
    if (!submitTitle || !submitPromptText || !submitTokenId || !submitFile) return;
    setSubmitStatus("sending");

    const submission = {
      title: submitTitle,
      prompt: submitPromptText,
      tokenId: submitTokenId,
      handle: submitHandle,
      fileName: submitFile.name,
      timestamp: new Date().toISOString(),
    };
    console.log("Prompt submission:", submission);

    // Simulate success — backend comes later
    setTimeout(() => {
      setSubmitStatus("sent");
      setShowSuccessModal(true);
    }, 800);
  }

  function closeSuccessModal() {
    setShowSuccessModal(false);
    setSubmitStatus("idle");
    setSubmitTitle("");
    setSubmitPromptText("");
    setSubmitTokenId("");
    setSubmitHandle("");
    clearFile();
  }

  const shareText = submitTitle
    ? `Just submitted "${submitTitle}" to the GVC Prompt Gallery! 🤙✨ Create AI art with your Good Vibes Club character → `
    : "Just submitted a prompt to the GVC Prompt Gallery! 🤙✨ → ";
  const shareUrl = "https://prompt-gallery-theta.vercel.app";

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
    return assemblePrompt(selectedPrompt.template, tokenMeta.traits, selectedPrompt.hasReferenceImage);
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

        {/* Tab switcher */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="flex justify-center gap-2 mb-8"
        >
          <button
            onClick={() => setActiveTab("browse")}
            className={`px-6 py-2.5 rounded-xl font-display font-bold text-sm transition-all ${
              activeTab === "browse"
                ? "bg-gvc-gold/15 text-gvc-gold border border-gvc-gold/30"
                : "border border-white/[0.08] text-white/40 hover:text-white/60 hover:border-white/15"
            }`}
          >
            Browse Prompts
          </button>
          <button
            onClick={() => setActiveTab("submit")}
            className={`px-6 py-2.5 rounded-xl font-display font-bold text-sm transition-all ${
              activeTab === "submit"
                ? "bg-gvc-gold/15 text-gvc-gold border border-gvc-gold/30"
                : "border border-white/[0.08] text-white/40 hover:text-white/60 hover:border-white/15"
            }`}
          >
            Submit a Prompt
          </button>
        </motion.div>

        {activeTab === "browse" && (<>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
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

        {/* Example generation slidedown */}
        <AnimatePresence>
          {selectedPrompt?.exampleImage && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden mb-4"
            >
              <div className="rounded-2xl bg-gvc-dark border border-white/[0.08] p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-gvc-gold font-display font-bold text-sm">Example</span>
                  <span className="text-white/20 font-body text-xs">&mdash;</span>
                  <span className="text-white/40 font-body text-xs">{selectedPrompt.title}</span>
                  {selectedPrompt.exampleTokenId && (
                    <span className="text-white/20 font-body text-xs ml-auto">Token #{selectedPrompt.exampleTokenId}</span>
                  )}
                </div>
                <div className="rounded-xl overflow-hidden bg-black/40 flex items-center justify-center">
                  <img
                    src={selectedPrompt.exampleImage}
                    alt={`Example: ${selectedPrompt.title}`}
                    className="max-w-full max-h-[500px] object-contain"
                  />
                </div>
                <p className="text-white/20 font-body text-xs mt-2 text-center">
                  Generated with Gemini. Your results will vary based on your character.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

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
                    {selectedPrompt.hasReferenceImage ? (
                      <>
                        <p className="text-white/50 font-body text-xs font-semibold mb-3">This prompt requires 2 images:</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                          <div className="rounded-xl bg-black/30 border border-white/[0.06] p-3">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="w-5 h-5 rounded-full bg-gvc-gold/15 text-gvc-gold text-[10px] font-bold flex items-center justify-center">1</span>
                              <p className="text-white/60 font-body text-xs font-semibold">Your GVC character</p>
                            </div>
                            <p className="text-white/30 font-body text-xs">Save your GVC image from above. This is what the character will look like.</p>
                          </div>
                          <div className="rounded-xl bg-black/30 border border-gvc-gold/15 p-3">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="w-5 h-5 rounded-full bg-gvc-gold/15 text-gvc-gold text-[10px] font-bold flex items-center justify-center">2</span>
                              <p className="text-white/60 font-body text-xs font-semibold">Proportion reference</p>
                            </div>
                            <p className="text-white/30 font-body text-xs mb-2">This tells AI the body proportions to use.</p>
                            <a
                              href="/ref/ReferenceImage.png"
                              download="GVC-Proportion-Reference.png"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gvc-gold/10 border border-gvc-gold/20 text-gvc-gold text-xs font-body font-semibold hover:bg-gvc-gold/15 transition-colors"
                            >
                              Download reference image
                              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                            </a>
                          </div>
                        </div>
                        <p className="text-white/40 font-body text-xs font-semibold mb-2">Steps:</p>
                        <ol className="text-white/30 font-body text-xs space-y-1.5 list-decimal list-inside">
                          <li>Save your GVC image from above</li>
                          <li>Download the proportion reference image</li>
                          <li>Open <span className="text-white/50">Gemini</span> (or ChatGPT)</li>
                          <li>Upload <span className="text-white/50">both images</span> to the chat &mdash; your GVC first, then the reference</li>
                          <li>Paste the prompt and send</li>
                        </ol>
                        <p className="text-white/20 font-body text-xs mt-2">We recommend <span className="text-white/35">Gemini</span> for best results. Make sure to upload both images before pasting the prompt.</p>
                      </>
                    ) : (
                      <>
                        <p className="text-white/40 font-body text-xs font-semibold mb-2">How to use:</p>
                        <ol className="text-white/30 font-body text-xs space-y-1 list-decimal list-inside">
                          <li>Save your GVC image above (right-click &rarr; Save Image)</li>
                          <li>Open Gemini (or ChatGPT)</li>
                          <li>Upload your GVC image to the chat</li>
                          <li>Paste the prompt below the image and send</li>
                        </ol>
                        <p className="text-white/20 font-body text-xs mt-2">We recommend <span className="text-white/35">Gemini</span> for best image generation results.</p>
                      </>
                    )}
                  </div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
        </>)}

        {activeTab === "submit" && (<>
        {/* Submit your prompt */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          id="submit"
          className="rounded-2xl bg-gvc-dark border border-gvc-gold/20 p-6 sm:p-8 mb-8 max-w-2xl mx-auto"
        >
          <div className="text-center mb-6">
            <h2 className="text-2xl font-display font-black text-shimmer mb-2">
              Submit Your Prompt
            </h2>
            <p className="text-white/40 font-body text-sm">
              Created an amazing prompt? Share it with the community. The best ones get added to the gallery.
            </p>
          </div>

          <div className="space-y-5">
            {/* Prompt Title */}
            <div>
              <label className="text-white/50 font-body text-xs uppercase tracking-wider mb-1.5 block">Prompt Title</label>
              <input
                type="text"
                placeholder='e.g. "Underwater Explorer" or "Vaporwave Portrait"'
                value={submitTitle}
                onChange={(e) => setSubmitTitle(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/[0.08] text-white font-body text-sm placeholder:text-white/30 focus:outline-none focus:border-gvc-gold/30 transition-colors"
              />
            </div>

            {/* Prompt Text */}
            <div>
              <label className="text-white/50 font-body text-xs uppercase tracking-wider mb-1.5 block">Your Prompt</label>
              <textarea
                placeholder="Paste the full prompt you used to generate the image. Include style details, scene description, and any specific instructions that made it work well."
                value={submitPromptText}
                onChange={(e) => setSubmitPromptText(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/[0.08] text-white font-body text-sm placeholder:text-white/30 focus:outline-none focus:border-gvc-gold/30 transition-colors resize-none"
              />
              <p className="text-white/20 font-body text-xs mt-1">
                Tip: The best prompts are specific about style, lighting, composition, and mood.
              </p>
            </div>

            {/* Token ID */}
            <div>
              <label className="text-white/50 font-body text-xs uppercase tracking-wider mb-1.5 block">GVC Token ID</label>
              <input
                type="text"
                placeholder="Which GVC did you use? (e.g. 142)"
                value={submitTokenId}
                onChange={(e) => setSubmitTokenId(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/[0.08] text-white font-body text-sm placeholder:text-white/30 focus:outline-none focus:border-gvc-gold/30 transition-colors"
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="text-white/50 font-body text-xs uppercase tracking-wider mb-1.5 block">Example Image</label>
              {!submitPreview ? (
                <div
                  onDragOver={(e) => { e.preventDefault(); setSubmitDragOver(true); }}
                  onDragLeave={() => setSubmitDragOver(false)}
                  onDrop={handleFileDrop}
                  onClick={() => document.getElementById("file-input")?.click()}
                  className={`relative rounded-xl border-2 border-dashed p-8 text-center cursor-pointer transition-all duration-200 ${
                    submitDragOver
                      ? "border-gvc-gold/50 bg-gvc-gold/5"
                      : "border-white/15 hover:border-gvc-gold/30 hover:bg-white/[0.02]"
                  }`}
                >
                  <input
                    id="file-input"
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <div className="text-3xl mb-2">🖼️</div>
                  <p className="text-white/50 font-body text-sm mb-1">
                    Drag and drop or click to upload
                  </p>
                  <p className="text-white/20 font-body text-xs">
                    PNG, JPG, or WebP. Max 10MB.
                  </p>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative rounded-xl overflow-hidden bg-black/40 border border-white/[0.08]"
                >
                  <img
                    src={submitPreview}
                    alt="Upload preview"
                    className="w-full max-h-[300px] object-contain"
                  />
                  <button
                    onClick={clearFile}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-red-500/30 hover:border-red-500/30 transition-all"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </motion.div>
              )}
            </div>

            {/* X Handle */}
            <div>
              <label className="text-white/50 font-body text-xs uppercase tracking-wider mb-1.5 block">X / Twitter Handle</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 font-body text-sm">@</span>
                <input
                  type="text"
                  placeholder="yourhandle"
                  value={submitHandle}
                  onChange={(e) => setSubmitHandle(e.target.value.replace(/^@/, "").replace(/[^a-zA-Z0-9_]/g, "").slice(0, 15))}
                  className="w-full pl-9 pr-4 py-3 rounded-xl bg-black/40 border border-white/[0.08] text-white font-body text-sm placeholder:text-white/30 focus:outline-none focus:border-gvc-gold/30 transition-colors"
                />
              </div>
            </div>

            {/* Submit button */}
            <button
              onClick={handleSubmit}
              disabled={submitStatus === "sending" || !submitTitle || !submitPromptText || !submitTokenId || !submitFile}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-4 font-display font-bold text-base rounded-xl transition-all duration-300 bg-gvc-gold text-gvc-black hover:shadow-[0_0_20px_rgba(255,224,72,0.3)] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-none"
            >
              {submitStatus === "sending" ? (
                <span className="inline-flex items-center gap-2">
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                  Submitting...
                </span>
              ) : "Submit Prompt"}
            </button>
          </div>
        </motion.div>
        </>)}

        {/* Success Modal */}
        <AnimatePresence>
          {showSuccessModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
              onClick={closeSuccessModal}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-md rounded-2xl bg-gvc-dark border border-gvc-gold/30 p-8 text-center shadow-[0_0_60px_rgba(255,224,72,0.15)]"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="text-5xl mb-4"
                >
                  🤙
                </motion.div>
                <h3 className="text-2xl font-display font-black text-shimmer mb-2">
                  Prompt Submitted!
                </h3>
                <p className="text-white/50 font-body text-sm mb-6">
                  We&apos;ll review your prompt and add the best ones to the gallery. Good vibes only.
                </p>

                {/* Social share buttons */}
                <div className="space-y-3 mb-6">
                  <a
                    href={`https://x.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 font-display font-bold text-sm rounded-xl bg-white text-black hover:bg-white/90 transition-all"
                  >
                    Share on X
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                  </a>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`${shareText}${shareUrl}`);
                    }}
                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 font-display font-bold text-sm rounded-xl border border-white/[0.12] text-white/70 hover:border-gvc-gold/30 hover:text-gvc-gold transition-all"
                  >
                    Copy share link
                  </button>
                </div>

                <button
                  onClick={closeSuccessModal}
                  className="text-white/30 font-body text-sm hover:text-white/60 transition-colors"
                >
                  Close
                </button>
              </motion.div>
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

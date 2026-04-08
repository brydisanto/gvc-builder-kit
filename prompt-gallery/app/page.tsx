"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import PROMPTS, { CATEGORIES, Prompt } from "./prompts";

function PromptIcon({ type, className = "w-6 h-6" }: { type: string; className?: string }) {
  const icons: Record<string, React.ReactNode> = {
    body: <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>,
    film: <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h1.5C5.496 19.5 6 18.996 6 18.375m-2.625 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-1.5A1.125 1.125 0 0118 18.375M20.625 4.5H3.375m17.25 0c.621 0 1.125.504 1.125 1.125M20.625 4.5h-1.5C18.504 4.5 18 5.004 18 5.625m3.75 0v1.5c0 .621-.504 1.125-1.125 1.125M3.375 4.5c-.621 0-1.125.504-1.125 1.125M3.375 4.5h1.5C5.496 4.5 6 5.004 6 5.625m-2.625 0v1.5c0 .621.504 1.125 1.125 1.125m0 0h1.5m-1.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m1.5-3.75C5.496 8.25 6 7.746 6 7.125v-1.5M4.875 8.25C5.496 8.25 6 8.754 6 9.375v1.5c0 .621-.504 1.125-1.125 1.125m1.5 0h12m-12 0c-.621 0-1.125.504-1.125 1.125M18 12.375c.621 0 1.125-.504 1.125-1.125m0 0v-1.5c0-.621-.504-1.125-1.125-1.125m1.5 3.75c-.621 0-1.125.504-1.125 1.125" /></svg>,
    pixel: <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.25 9.75L16.5 12l-2.25 2.25m-4.5 0L7.5 12l2.25-2.25M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" /></svg>,
    camera: <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" /></svg>,
    sparkle: <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" /></svg>,
    paint: <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" /></svg>,
  };
  return <>{icons[type] || icons.sparkle}</>;
}

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

  // Type -the most defining visual characteristic
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

  // Background -used as scene context
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

const GVC_STYLE_SUFFIX = `\n\nIMPORTANT: The character in the generated image must look like the uploaded GVC character -same outfit, same features, same vibe. Adapt them into the new scene/style while keeping them recognizable.`;

function assemblePrompt(template: string, traits: Record<string, string>, skipPrefix?: boolean, tid?: string): string {
  const description = describeTraits(traits);
  let filled = template.replace("{TRAITS}", description);
  if (tid) filled = filled.replaceAll("{TOKEN_ID}", tid);
  // Prompts with their own multi-image instructions skip the generic prefix/suffix
  if (skipPrefix) return filled;
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
  const [communityPrompts, setCommunityPrompts] = useState<any[]>([]);
  const [promptGenerated, setPromptGenerated] = useState(false);
  const [generating, setGenerating] = useState(false);

  async function downloadImage(url: string, filename: string) {
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    } catch {
      window.open(url, "_blank");
    }
  }

  function handleGenerate() {
    setGenerating(true);
    setPromptGenerated(false);
    setTimeout(() => {
      setGenerating(false);
      setPromptGenerated(true);
    }, 1800);
  }

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

  async function handleSubmit() {
    if (!submitTitle || !submitPromptText || !submitTokenId || !submitFile) return;
    setSubmitStatus("sending");

    try {
      const formData = new FormData();
      formData.append("title", submitTitle);
      formData.append("prompt", submitPromptText);
      formData.append("tokenId", submitTokenId);
      formData.append("xHandle", submitHandle);
      formData.append("image", submitFile);

      const res = await fetch("/api/submissions", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Submission failed");
      }

      setSubmitStatus("sent");
      setShowSuccessModal(true);
    } catch (e: any) {
      console.error("Submission error:", e);
      setSubmitStatus("error");
      setTimeout(() => setSubmitStatus("idle"), 3000);
    }
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
    ? `Just submitted "${submitTitle}" to the The Prompt Machine!  Create AI art with your Good Vibes Club character -`
    : "Just submitted a prompt to the The Prompt Machine!  -";
  const shareUrl = "https://prompt-gallery-theta.vercel.app";

  // Load metadata and community prompts
  useEffect(() => {
    fetch("/gvc-metadata.json")
      .then((r) => r.json())
      .then(setMetadata)
      .catch(() => setError("Could not load token metadata."));
    fetch("/api/submissions")
      .then((r) => r.json())
      .then((data) => setCommunityPrompts(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  function lookupToken() {
    if (!metadata || !tokenId.trim()) return;
    setError("");
    setLoading(true);

    const id = tokenId.trim();
    const token = metadata[id];

    if (!token) {
      setError(`Token #${id} not found. Enter a number between 1 and 6969.`);
      setTokenMeta(null);
    } else {
      setTokenMeta(token);
    }
    setLoading(false);
  }

  const filteredPrompts = useMemo(() => {
      // Convert community prompts to the same shape as built-in prompts
      const communityAsPrompts: Prompt[] = communityPrompts.map((cp: any) => ({
        id: cp.id,
        title: cp.title,
        description: "",
        category: cp.category || "scene",
        template: cp.prompt || "",
        icon: "sparkle" as const,
        author: cp.x_handle ? `@${cp.x_handle}` : "@community",
        exampleImage: cp.image_url,
        exampleTokenId: cp.token_id,
      }));

      const all = [...PROMPTS, ...communityAsPrompts];
      const list = category === "all"
        ? all
        : all.filter((p) => p.category === category || p.pinned);
      return list.sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));
    },
    [category, communityPrompts]
  );

  const assembledPrompt = useMemo(() => {
    if (!selectedPrompt || !tokenMeta) return "";
    return assemblePrompt(selectedPrompt.template, tokenMeta.traits, selectedPrompt.hasReferenceImage || selectedPrompt.requiresTpose, tokenId);
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
            The Prompt Machine
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-white/40 font-body text-lg max-w-xl mx-auto"
          >
            Prompts to help bring your GVC characters to life. Vibetown is built by the community, for the community.
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

        {/* STEP 1 - Select Your Prompt */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-8 h-8 rounded-full bg-gvc-gold/15 text-gvc-gold text-sm font-bold flex items-center justify-center flex-shrink-0">1</span>
            <h2 className="text-lg font-display font-bold text-white">Select Your Prompt</h2>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {CATEGORIES.map((cat) => (
              <button key={cat.id} onClick={() => setCategory(cat.id)} className={`px-4 py-2 rounded-xl font-display font-bold text-sm transition-all ${category === cat.id ? "bg-gvc-gold/15 text-gvc-gold border border-gvc-gold/30" : "border border-white/[0.08] text-white/40 hover:text-white/60 hover:border-white/15"}`}>
                {cat.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPrompts.map((prompt, i) => (
              <motion.button key={prompt.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 + i * 0.05 }} onClick={() => { setSelectedPrompt(prompt); setPromptGenerated(false); }} className={`text-left p-5 rounded-2xl border transition-all duration-300 hover:scale-[1.02] ${selectedPrompt?.id === prompt.id ? "bg-gvc-gold/[0.08] border-gvc-gold/30 shadow-[0_0_20px_rgba(255,224,72,0.15)]" : "bg-gvc-dark border-white/[0.08] hover:border-white/15"}`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${selectedPrompt?.id === prompt.id ? "bg-gvc-gold/20 text-gvc-gold" : "bg-white/[0.04] text-white/40"}`}>
                  <PromptIcon type={prompt.icon} />
                </div>
                <h3 className={`font-display font-bold text-base mb-1 flex items-center gap-1.5 ${selectedPrompt?.id === prompt.id ? "text-gvc-gold" : "text-white"}`}>
                  {prompt.pinned && <svg className="w-3.5 h-3.5 flex-shrink-0 opacity-50" fill="currentColor" viewBox="0 0 24 24"><path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z" /></svg>}
                  {prompt.title}
                </h3>
                <p className="text-white/40 font-body text-sm leading-relaxed">{prompt.description}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="inline-block px-2 py-0.5 rounded-full bg-white/[0.04] text-white/25 text-xs font-body capitalize">{prompt.category}</span>
                  <a href={`https://x.com/${prompt.author.replace("@", "")}`} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="text-white/20 text-xs font-body hover:text-gvc-gold/60 transition-colors">By {prompt.author}</a>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Example slidedown */}
        <AnimatePresence>
          {selectedPrompt?.exampleImage && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }} className="overflow-hidden mb-6">
              <div className="rounded-2xl bg-gvc-dark border border-white/[0.08] p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-gvc-gold font-display font-bold text-sm">Example Output</span>
                  <span className="text-white/20 font-body text-xs">-</span>
                  <span className="text-white/40 font-body text-xs">{selectedPrompt.title}</span>
                  {selectedPrompt.exampleTokenId && (<span className="text-white/20 font-body text-xs ml-auto">Token #{selectedPrompt.exampleTokenId}</span>)}
                </div>
                <div className="rounded-xl overflow-hidden bg-black/40 flex items-center justify-center">
                  <img src={selectedPrompt.exampleImage} alt={`Example: ${selectedPrompt.title}`} className="max-w-full max-h-[500px] object-contain" />
                </div>
                <p className="text-white/20 font-body text-xs mt-2 text-center">Generated with Gemini. Your results will vary based on your character.</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* STEP 2 - Enter Your Token ID */}
        <AnimatePresence>
          {selectedPrompt && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="rounded-2xl bg-gvc-dark border border-white/[0.08] p-6 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-8 rounded-full bg-gvc-gold/15 text-gvc-gold text-sm font-bold flex items-center justify-center flex-shrink-0">2</span>
                <h2 className="text-lg font-display font-bold text-white">Enter Your GVC&apos;s Token ID</h2>
              </div>
              <div className="flex gap-3 mb-4">
                <input type="text" placeholder="Enter your token ID (1-6969)" value={tokenId} onChange={(e) => setTokenId(e.target.value)} onKeyDown={(e) => e.key === "Enter" && lookupToken()} className="flex-1 px-4 py-3 rounded-xl bg-black/40 border border-white/[0.08] text-white font-body text-sm placeholder:text-white/30 focus:outline-none focus:border-gvc-gold/30 transition-colors" />
                <button onClick={lookupToken} disabled={loading || !metadata} className="px-6 py-3 bg-gvc-gold text-gvc-black font-display font-bold rounded-xl hover:shadow-[0_0_20px_rgba(255,224,72,0.3)] transition-all disabled:opacity-50">
                  {loading ? "..." : "Look Up"}
                </button>
              </div>
              {error && <p className="text-red-400 font-body text-sm">{error}</p>}
              {tokenMeta && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-start gap-4 mt-2">
                  {imageUrl && (
                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-black/40 flex-shrink-0">
                      <img src={imageUrl} alt={tokenMeta.name} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-display font-bold">{tokenMeta.name}</p>
                    {imageUrl && (
                      <button onClick={() => downloadImage(imageUrl, `GVC-${tokenId}.png`)} className="inline-flex items-center gap-1.5 px-3 py-1.5 mt-2 rounded-lg bg-gvc-gold/10 border border-gvc-gold/20 text-gvc-gold text-xs font-body font-semibold hover:bg-gvc-gold/15 transition-colors">
                        Save your GVC image
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
              {tokenMeta && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-5 relative">
                  {/* Particle burst on generate */}
                  <AnimatePresence>
                    {generating && (
                      <>
                        {[...Array(12)].map((_, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 1, scale: 0, x: 0, y: 0 }}
                            animate={{
                              opacity: 0,
                              scale: 1,
                              x: (Math.random() - 0.5) * 300,
                              y: (Math.random() - 0.5) * 200 - 50,
                            }}
                            transition={{ duration: 0.8 + Math.random() * 0.4, ease: "easeOut" }}
                            className="absolute left-1/2 top-1/2 w-2 h-2 rounded-full bg-gvc-gold pointer-events-none z-10"
                          />
                        ))}
                      </>
                    )}
                  </AnimatePresence>

                  <motion.button
                    onClick={handleGenerate}
                    disabled={generating}
                    whileHover={!generating ? { scale: 1.02, boxShadow: "0 0 40px rgba(255,224,72,0.4)" } : {}}
                    whileTap={!generating ? { scale: 0.97 } : {}}
                    animate={generating ? {
                      boxShadow: [
                        "0 0 20px rgba(255,224,72,0.2)",
                        "0 0 60px rgba(255,224,72,0.5)",
                        "0 0 20px rgba(255,224,72,0.2)",
                      ],
                    } : {}}
                    transition={generating ? { duration: 1.2, repeat: Infinity } : { type: "spring", stiffness: 400, damping: 25 }}
                    className={`w-full px-6 py-5 font-display font-black text-lg rounded-xl transition-colors duration-300 relative overflow-hidden ${
                      generating
                        ? "bg-gvc-gold/80 text-gvc-black cursor-wait"
                        : "bg-gvc-gold text-gvc-black"
                    }`}
                  >
                    {/* Shimmer sweep during generation */}
                    {generating && (
                      <motion.div
                        initial={{ x: "-100%" }}
                        animate={{ x: "200%" }}
                        transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
                      />
                    )}
                    <span className="relative z-10">
                      {generating ? "Generating..." : promptGenerated ? "Regenerate Prompt" : "Generate Prompt"}
                    </span>
                  </motion.button>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* STEP 3 - Copy The Prompt */}
        <AnimatePresence>
          {promptGenerated && selectedPrompt && tokenMeta && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="rounded-2xl bg-gvc-dark border border-gvc-gold/20 p-6 mb-6">
              <div className="flex items-center gap-3 mb-2">
                <span className="w-8 h-8 rounded-full bg-gvc-gold/15 text-gvc-gold text-sm font-bold flex items-center justify-center flex-shrink-0">3</span>
                <h2 className="text-lg font-display font-bold text-white">{(selectedPrompt.hasReferenceImage || selectedPrompt.requiresTpose) ? "Copy The Prompt Below" : "Let \u0027Errrr Rip!"}</h2>
              </div>

              

              <div className="bg-black/40 rounded-xl p-4 mb-4 border border-white/[0.06]">
                <p className="text-white/70 font-body text-sm leading-relaxed whitespace-pre-wrap">{assembledPrompt}</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button onClick={copyPrompt} className={`flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 font-display font-bold text-sm rounded-xl transition-all duration-300 ${copied ? "bg-gvc-green/20 text-gvc-green border border-gvc-green/30" : "bg-gvc-gold text-gvc-black hover:shadow-[0_0_20px_rgba(255,224,72,0.3)]"}`}>
                  {copied ? "Copied!" : "Copy Prompt"}
                </button>
                <a href="https://gemini.google.com/app" target="_blank" rel="noopener noreferrer" className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 font-display font-bold text-sm rounded-xl border border-white/[0.12] text-white/70 hover:border-gvc-gold/30 hover:text-gvc-gold transition-all">
                  Open Gemini
                  <svg className="w-3.5 h-3.5 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                </a>

              </div>

              {!selectedPrompt.hasReferenceImage && !selectedPrompt.requiresTpose && (
                <div className="mt-5 pt-5 border-t border-white/[0.06]">
                  <p className="text-white/30 font-body text-sm">Open <a href="https://gemini.google.com/app" target="_blank" rel="noopener noreferrer" className="text-gvc-gold/60 hover:text-gvc-gold underline underline-offset-2 transition-colors">Gemini</a>. We recommend using Gemini for the best results (but you can also use ChatGPT, Midjourney, Dall-E, etc). Upload your GVC image and paste the prompt.</p>
                </div>
              )}

            </motion.div>
          )}
        </AnimatePresence>

        {/* STEP 4 - Let 'Errrr Rip! (only for prompts with reference images) */}
        <AnimatePresence>
          {promptGenerated && selectedPrompt && tokenMeta && (selectedPrompt.hasReferenceImage || selectedPrompt.requiresTpose) && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="rounded-2xl bg-gvc-dark border border-white/[0.08] p-6 mb-6">
              <div className="flex items-center gap-3 mb-2">
                <span className="w-8 h-8 rounded-full bg-gvc-gold/15 text-gvc-gold text-sm font-bold flex items-center justify-center flex-shrink-0">4</span>
                <h2 className="text-lg font-display font-bold text-white">Let &apos;Errrr Rip!</h2>
              </div>

              {selectedPrompt.requiresTpose ? (
                <>
                  <p className="text-white/40 font-body text-sm mb-5 pl-11">This prompt requires 3 images. Download and prepare them below, then upload all three to Gemini along with the prompt.</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                    <div className="rounded-xl bg-black/30 border border-white/[0.08] p-4">
                      <p className="text-white font-body text-sm font-semibold mb-2">Your GVC character</p>
                      <p className="text-white/40 font-body text-xs mb-3">Your original GVC PFP image.</p>
                      {imageUrl && (
                        <button onClick={() => downloadImage(imageUrl, `GVC-${tokenId}.png`)} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gvc-gold/10 border border-gvc-gold/20 text-gvc-gold text-xs font-body font-semibold hover:bg-gvc-gold/15 transition-colors">
                          Download GVC-{tokenId}.png
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                        </button>
                      )}
                    </div>
                    <div className="rounded-xl bg-black/30 border border-gvc-gold/20 p-4">
                      <p className="text-white font-body text-sm font-semibold mb-2">Your T-Pose</p>
                      <p className="text-white/40 font-body text-xs mb-3">Use the T-Pose you generated from the pinned prompt. Save it as <span className="text-white/60 font-mono">TPoseReference-{tokenId}.png</span></p>
                    </div>
                    <div className="rounded-xl bg-black/30 border border-white/[0.08] p-4">
                      <p className="text-white font-body text-sm font-semibold mb-2">Scene image</p>
                      <p className="text-white/40 font-body text-xs mb-3">The base scene your character will be placed into.</p>
                      <a href="/examples/welcome-to-vibetown.png" download="welcome-to-vibetown.png" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gvc-gold/10 border border-gvc-gold/20 text-gvc-gold text-xs font-body font-semibold hover:bg-gvc-gold/15 transition-colors">
                        Download scene
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                      </a>
                    </div>
                  </div>
                </>
              ) : (
                <>
                <p className="text-white/40 font-body text-sm mb-5 pl-11">This prompt requires 2 images. Download them below, then upload both to Gemini along with the prompt.</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    <div className="rounded-xl bg-black/30 border border-white/[0.08] p-4">
                      <p className="text-white font-body text-sm font-semibold mb-2">Your GVC character</p>
                      <p className="text-white/40 font-body text-sm mb-3">Save your character image and upload it to the chat.</p>
                      {imageUrl && (
                        <button onClick={() => downloadImage(imageUrl, `GVC-${tokenId}.png`)} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gvc-gold/10 border border-gvc-gold/20 text-gvc-gold text-sm font-body font-semibold hover:bg-gvc-gold/15 transition-colors">
                          Save GVC image
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                        </button>
                      )}
                    </div>
                    <div className="rounded-xl bg-black/30 border border-gvc-gold/20 p-4">
                      <p className="text-white font-body text-sm font-semibold mb-2">Proportion reference</p>
                      <p className="text-white/40 font-body text-sm mb-3">Download and upload this alongside your character.</p>
                      <a href="/ref/ReferenceImage.png" download="Image-2-GVC-Proportion-Reference.png" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gvc-gold/10 border border-gvc-gold/20 text-gvc-gold text-sm font-body font-semibold hover:bg-gvc-gold/15 transition-colors">
                        Download reference
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                      </a>
                    </div>
                  </div>
                </>
              )}

              <ol className="text-white/50 font-body text-sm space-y-2 list-decimal list-inside mb-4">
                <li>Download {selectedPrompt.requiresTpose ? "all three images " : "both images "}above</li>
                <li>Open <a href="https://gemini.google.com/app" target="_blank" rel="noopener noreferrer" className="text-gvc-gold/60 hover:text-gvc-gold underline underline-offset-2 transition-colors font-semibold">Gemini</a>. We recommend using Gemini for the best results (but you can also use ChatGPT, Midjourney, Dall-E, etc).</li>
                <li>Upload <span className="text-white/80 font-semibold">{selectedPrompt.requiresTpose ? "all three images" : "both images"}</span> to the chat</li>
                <li>Paste the prompt and hit send</li>
              </ol>
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
                  <div className="w-10 h-10 rounded-xl bg-white/[0.04] flex items-center justify-center mx-auto mb-2 text-white/30">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" /></svg>
                  </div>
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
              {submitStatus === "error" ? "Something went wrong. Try again." : submitStatus === "sending" ? (
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
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
              onClick={closeSuccessModal}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-md rounded-3xl bg-gvc-dark border border-gvc-gold/20 overflow-hidden shadow-[0_0_80px_rgba(255,224,72,0.1)]"
              >
                {/* Close button */}
                <div className="flex justify-end p-4 pb-0">
                  <button onClick={closeSuccessModal} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/20 transition-all">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>

                {/* Uploaded image preview */}
                {submitPreview && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="px-6 mb-4"
                  >
                    <div className="rounded-2xl overflow-hidden border border-gvc-gold/10">
                      <img src={submitPreview} alt="Your submission" className="w-full max-h-[350px] object-contain bg-black/40" />
                    </div>
                  </motion.div>
                )}

                <div className="px-6 pb-8 text-center">
                  <motion.h3
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-2xl font-display font-black text-shimmer mb-2"
                  >
                    You rock, dude!
                  </motion.h3>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-white/50 font-body text-sm mb-6"
                  >
                    Your prompt was submitted and is in review with the GVC team. Go share it with the community while you wait!
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <a
                      href={`https://x.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-3 px-5 py-4 font-display font-bold text-base rounded-xl bg-white text-black hover:bg-white/90 transition-all"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                      Share on X
                    </a>
                  </motion.div>

                  <button
                    onClick={closeSuccessModal}
                    className="mt-4 text-white/30 font-body text-sm hover:text-white/60 transition-colors"
                  >
                    Close
                  </button>
                </div>
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
            Good Vibes Club - The Prompt Machine
          </p>
        </div>
      </div>
    </main>
  );
}

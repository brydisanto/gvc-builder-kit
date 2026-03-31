"use client";

import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Terminal } from "lucide-react";
import Image from "next/image";

interface HeroStepProps {
  onNext: () => void;
}

export default function HeroStep({ onNext }: HeroStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col items-center justify-center text-center min-h-[60vh] px-4"
    >
      {/* Background embers */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(22)].map((_, i) => (
          <div
            key={i}
            className="ember"
            style={{
              left: `${5 + (i * 4.3) % 90}%`,
              top: `${8 + ((i * 17) % 75)}%`,
              animationDelay: `${i * 0.4}s`,
              animationDuration: `${3.5 + (i % 5) * 0.8}s`,
              width: `${2 + (i % 4) * 1.5}px`,
              height: `${2 + (i % 4) * 1.5}px`,
              opacity: 0.3 + (i % 4) * 0.15,
            }}
          />
        ))}
      </div>

      {/* Shaka */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5, rotate: -20 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ delay: 0.1, duration: 0.6, type: "spring", stiffness: 150, damping: 14 }}
        className="wiggle-hover mb-6 cursor-default"
      >
        <Image
          src="/shaka.png"
          alt="GVC Shaka"
          width={120}
          height={120}
          className="drop-shadow-[0_0_30px_rgba(255,224,72,0.3)]"
          priority
        />
      </motion.div>

      {/* Badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gvc-gray/60 border border-gvc-gold/20 mb-8"
      >
        <Sparkles className="w-4 h-4 text-gvc-gold" />
        <span className="text-sm text-gvc-gold/90 font-body">
          Good Vibes Club
        </span>
      </motion.div>

      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="text-5xl sm:text-7xl lg:text-8xl font-display font-black text-shimmer leading-[1.05] mb-4 tracking-wide"
      >
        GVC BUILDER
        <br />
        KIT
      </motion.h1>

      {/* Tagline */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="text-sm text-gvc-gold/50 font-body uppercase tracking-[0.2em] mb-4"
      >
        Built by the community, for the community
      </motion.p>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="text-lg sm:text-xl text-white/50 font-body max-w-lg mx-auto mb-8"
      >
        Go from idea to live project in minutes.
        <br className="hidden sm:block" />
        No coding experience needed.
      </motion.p>

      {/* Feature pills */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="flex flex-wrap items-center justify-center gap-3 mb-10"
      >
        {["GVC Brand System", "Claude-Ready", "One-Command Deploy"].map((pill) => (
          <span
            key={pill}
            className="inline-flex items-center px-4 py-2 rounded-full bg-white/[0.04] border border-white/[0.08] text-white/50 text-sm font-body"
          >
            {pill}
          </span>
        ))}
      </motion.div>

      {/* CTA Button */}
      <motion.button
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.5 }}
        whileHover={{ scale: 1.04, y: -2 }}
        whileTap={{ scale: 0.97 }}
        onClick={onNext}
        className="
          group relative inline-flex items-center gap-3 px-10 py-5
          bg-gvc-gold text-gvc-black font-display font-bold text-xl
          rounded-2xl
          transition-all duration-300
          glow-pulse
        "
      >
        Start Building
        <ArrowRight className="w-6 h-6 transition-transform duration-300 group-hover:translate-x-1" />
      </motion.button>

      {/* Terminal link */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="mt-6 text-sm text-white/30 font-body inline-flex items-center gap-2 hover:text-white/50 transition-colors cursor-default"
      >
        <Terminal className="w-3.5 h-3.5" />
        Or try it in your terminal with <code className="text-gvc-gold/60 font-mono text-xs">npx create-gvc-app</code>
      </motion.p>
    </motion.div>
  );
}

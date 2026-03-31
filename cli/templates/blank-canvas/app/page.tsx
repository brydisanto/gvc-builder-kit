"use client";

import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Zap } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-24 relative overflow-hidden">
      {/* Background embers */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="ember"
            style={{
              left: `${15 + i * 14}%`,
              top: `${20 + (i % 3) * 25}%`,
              animationDelay: `${i * 0.9}s`,
              animationDuration: `${5 + i * 0.8}s`,
            }}
          />
        ))}
      </div>

      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="text-center max-w-3xl mx-auto relative z-10"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gvc-gray/60 border border-gvc-gold/20 mb-8">
          <Sparkles className="w-4 h-4 text-gvc-gold" />
          <span className="text-sm text-gvc-gold/90 font-body">
            GVC Builder Kit
          </span>
        </div>

        <h1 className="text-5xl sm:text-7xl font-display font-black text-shimmer leading-tight mb-6">
          YOUR PROJECT
          <br />
          NAME
        </h1>

        <p className="text-lg sm:text-xl text-white/60 font-body max-w-xl mx-auto mb-12">
          Built with the GVC Builder Kit. Open this project in Claude and start
          building something legendary.
        </p>
      </motion.div>

      {/* Example Cards */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-3xl w-full relative z-10 mb-16"
      >
        <div className="card-glow rounded-2xl bg-gvc-dark border border-white/[0.06] p-6 hover:border-gvc-gold/30 transition-all duration-300">
          <div className="w-10 h-10 rounded-xl bg-gvc-gold/10 flex items-center justify-center mb-4">
            <Zap className="w-5 h-5 text-gvc-gold" />
          </div>
          <h3 className="font-display font-bold text-white text-lg mb-2">
            Gold Glow
          </h3>
          <p className="text-white/50 text-sm font-body leading-relaxed">
            Cards with the signature GVC gold glow effect baked right in.
          </p>
        </div>

        <div className="rounded-2xl bg-gvc-dark border border-white/[0.06] p-6 hover:border-pink-accent/30 transition-all duration-300">
          <div className="w-10 h-10 rounded-xl bg-pink-accent/10 flex items-center justify-center mb-4">
            <Sparkles className="w-5 h-5 text-pink-accent" />
          </div>
          <h3 className="font-display font-bold text-white text-lg mb-2">
            Brand Colors
          </h3>
          <p className="text-white/50 text-sm font-body leading-relaxed">
            Full GVC palette wired up -- gold, pink, orange, green, all ready.
          </p>
        </div>

        <div className="rounded-2xl bg-gvc-dark border border-white/[0.06] p-6 hover:border-gvc-green/30 transition-all duration-300">
          <div className="w-10 h-10 rounded-xl bg-gvc-green/10 flex items-center justify-center mb-4">
            <ArrowRight className="w-5 h-5 text-gvc-green" />
          </div>
          <h3 className="font-display font-bold text-white text-lg mb-2">
            Ship Fast
          </h3>
          <p className="text-white/50 text-sm font-body leading-relaxed">
            Fonts, animations, and design tokens. Just tell Claude what to
            build.
          </p>
        </div>
      </motion.div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="text-center relative z-10"
      >
        <p className="text-white/40 text-sm font-body">
          Open this project in{" "}
          <span className="text-gvc-gold/80">Claude</span> and start building
        </p>
      </motion.div>
    </main>
  );
}

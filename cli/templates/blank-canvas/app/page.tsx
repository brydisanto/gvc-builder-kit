"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-16 relative overflow-hidden">
      {/* Background embers */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="ember"
            style={{
              left: `${10 + i * 11}%`,
              top: `${15 + (i % 4) * 20}%`,
              animationDelay: `${i * 0.7}s`,
              animationDuration: `${4 + i * 0.6}s`,
            }}
          />
        ))}
      </div>

      <div className="max-w-2xl mx-auto text-center relative z-10">
        {/* Shaka */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, type: "spring", stiffness: 150 }}
          className="mb-6"
        >
          <Image
            src="/shaka.png"
            alt="GVC"
            width={80}
            height={80}
            className="mx-auto drop-shadow-[0_0_25px_rgba(255,224,72,0.3)]"
          />
        </motion.div>

        {/* Project name */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="text-4xl sm:text-6xl font-display font-black text-shimmer leading-tight mb-4"
        >
          {{PROJECT_NAME}}
        </motion.h1>

        {/* Status badge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gvc-green/10 border border-gvc-green/20 mb-8"
        >
          <div className="w-2 h-2 rounded-full bg-gvc-green animate-pulse" />
          <span className="text-sm text-gvc-green font-body">
            Your project is running
          </span>
        </motion.div>

        {/* What to do next */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-left max-w-md mx-auto mb-10 rounded-2xl bg-[#121212] border border-white/[0.08] p-6"
        >
          <h2 className="text-lg font-display font-bold text-white mb-3">
            Start building
          </h2>
          <p className="text-white/40 font-body text-sm mb-4">
            Open a new terminal tab and run:
          </p>
          <div className="bg-black/40 rounded-lg px-4 py-3 font-mono text-sm text-[#2EFF2E]/80 mb-3">
            claude
          </div>
          <p className="text-white/40 font-body text-sm">
            Claude already knows your project, brand, and what features you picked. Just tell it what you want to change.
          </p>
        </motion.div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-white/20 text-xs font-body"
        >
          Built with the GVC Builder Kit
        </motion.p>
      </div>
    </main>
  );
}

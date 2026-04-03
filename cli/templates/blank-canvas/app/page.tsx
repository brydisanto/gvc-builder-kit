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
          className="text-left max-w-lg mx-auto mb-10"
        >
          <h2 className="text-lg font-display font-bold text-white mb-4">
            What to do next
          </h2>

          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <span className="flex-shrink-0 w-7 h-7 rounded-full bg-gvc-gold/15 text-gvc-gold text-sm font-bold flex items-center justify-center mt-0.5">
                1
              </span>
              <div>
                <p className="text-white font-body font-semibold text-sm">
                  Open a new terminal tab
                </p>
                <p className="text-white/40 text-sm font-body">
                  Keep this one running. It powers the page you're looking at.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <span className="flex-shrink-0 w-7 h-7 rounded-full bg-gvc-gold/15 text-gvc-gold text-sm font-bold flex items-center justify-center mt-0.5">
                2
              </span>
              <div>
                <p className="text-white font-body font-semibold text-sm">
                  Navigate to your project
                </p>
                <div className="mt-1 bg-black/40 rounded-lg px-3 py-2 font-mono text-xs text-gvc-green/80">
                  cd {{PROJECT_NAME}}
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <span className="flex-shrink-0 w-7 h-7 rounded-full bg-gvc-gold/15 text-gvc-gold text-sm font-bold flex items-center justify-center mt-0.5">
                3
              </span>
              <div>
                <p className="text-white font-body font-semibold text-sm">
                  Start building with Claude
                </p>
                <div className="mt-1 bg-black/40 rounded-lg px-3 py-2 font-mono text-xs text-gvc-green/80">
                  claude
                </div>
                <p className="text-white/40 text-sm font-body mt-1">
                  Claude already knows your project and the GVC brand. Just tell it what you want.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Example prompts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-left max-w-lg mx-auto mb-10"
        >
          <h2 className="text-lg font-display font-bold text-white mb-3">
            Try saying
          </h2>
          <div className="space-y-2">
            {[
              "Build what's described in my CLAUDE.md",
              "Add a hero section with a big gold title",
              "Show the current GVC floor price in a stats card",
              "Make it look like the GVC Gallery",
            ].map((prompt) => (
              <div
                key={prompt}
                className="bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-3 text-white/50 text-sm font-body hover:border-gvc-gold/20 hover:text-white/70 transition-all duration-200 cursor-default"
              >
                &ldquo;{prompt}&rdquo;
              </div>
            ))}
          </div>
        </motion.div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="text-white/20 text-xs font-body"
        >
          Built with the GVC Builder Kit. This page will be replaced by whatever you build.
        </motion.p>
      </div>
    </main>
  );
}

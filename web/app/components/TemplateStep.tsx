"use client";

import { motion } from "framer-motion";
import { ArrowRight, ArrowLeft } from "lucide-react";
import {
  Globe,
  BarChart3,
  Gamepad2,
  Image,
  Vote,
  Users,
  PenLine,
  Link,
  Sparkles,
} from "lucide-react";

const TEMPLATES = [
  {
    value: "project-site",
    icon: Globe,
    title: "Project Website",
    description: "A website for my project",
    example: "Like a homepage for your brand or idea",
    color: "text-blue-400",
    bgColor: "bg-blue-400/10",
  },
  {
    value: "tracker",
    icon: BarChart3,
    title: "Tracker",
    description: "A tool that tracks something",
    example: "Like Smash the Wall or Vibepool",
    color: "text-emerald-400",
    bgColor: "bg-emerald-400/10",
  },
  {
    value: "mini-game",
    icon: Gamepad2,
    title: "Game",
    description: "A game or interactive experience",
    example: "Like VibeMatch or VibeOff",
    color: "text-purple-400",
    bgColor: "bg-purple-400/10",
  },
  {
    value: "gallery",
    icon: Image,
    title: "Gallery",
    description: "A place to show off my collection",
    example: "Like the GVC Gallery",
    color: "text-pink-400",
    bgColor: "bg-pink-400/10",
  },
  {
    value: "vote-and-rank",
    icon: Vote,
    title: "Vote & Rank",
    description: "A voting or ranking page",
    example: "Like VibeOff's 1v1 voting",
    color: "text-orange-400",
    bgColor: "bg-orange-400/10",
  },
  {
    value: "community-page",
    icon: Users,
    title: "Community Hub",
    description: "A community hub",
    example: "A home base for your crew",
    color: "text-cyan-400",
    bgColor: "bg-cyan-400/10",
  },
  {
    value: "blog-journal",
    icon: PenLine,
    title: "Blog / Journal",
    description: "A blog or content page",
    example: "Share your thoughts and stories",
    color: "text-amber-400",
    bgColor: "bg-amber-400/10",
  },
  {
    value: "link-in-bio",
    icon: Link,
    title: "Links Page",
    description: "A simple links page",
    example: "Your personal link-in-bio",
    color: "text-rose-400",
    bgColor: "bg-rose-400/10",
  },
  {
    value: "blank-canvas",
    icon: Sparkles,
    title: "Blank Canvas",
    description: "I have my own idea",
    example: "Start from scratch with just the brand",
    color: "text-gvc-gold",
    bgColor: "bg-gvc-gold/10",
  },
];

interface TemplateStepProps {
  value: string;
  onChange: (value: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function TemplateStep({
  value,
  onChange,
  onNext,
  onBack,
}: TemplateStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col items-center justify-center px-4 max-w-3xl mx-auto w-full"
    >
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="text-3xl sm:text-4xl font-display font-black text-white mb-3 text-center"
      >
        What do you want to build?
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="text-white/40 font-body mb-8 text-center"
      >
        Pick the one closest to your idea. You can always change it later.
      </motion.p>

      {/* Card Grid */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 w-full mb-8"
      >
        {TEMPLATES.map((template, i) => {
          const isSelected = value === template.value;
          const Icon = template.icon;

          return (
            <motion.button
              key={template.value}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.04, duration: 0.4 }}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onChange(template.value)}
              className={`
                relative text-left p-5 rounded-2xl border transition-all duration-300
                ${
                  isSelected
                    ? "gold-selected bg-gvc-gold/[0.06]"
                    : "border-white/[0.06] bg-white/[0.02] hover:border-white/15 hover:bg-white/[0.04]"
                }
              `}
            >
              <div
                className={`
                  w-11 h-11 rounded-xl flex items-center justify-center mb-3
                  transition-colors duration-300
                  ${
                    isSelected
                      ? "bg-gvc-gold/20 text-gvc-gold"
                      : `${template.bgColor} ${template.color}`
                  }
                `}
              >
                <Icon className="w-5.5 h-5.5" />
              </div>

              <h3
                className={`
                  font-display font-bold text-base mb-1 transition-colors duration-300
                  ${isSelected ? "text-gvc-gold" : "text-white"}
                `}
              >
                {template.title}
              </h3>

              <p className="text-white/40 text-sm font-body leading-relaxed">
                {template.description}
              </p>

              <p className="text-white/25 text-xs font-body mt-1 italic">
                {template.example}
              </p>

              {isSelected && (
                <motion.div
                  layoutId="template-check"
                  className="absolute top-3 right-3 w-6 h-6 rounded-full bg-gvc-gold flex items-center justify-center"
                >
                  <svg
                    className="w-3.5 h-3.5 text-gvc-black"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </motion.div>

      {/* Navigation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.4 }}
        className="flex items-center gap-4"
      >
        <button
          onClick={onBack}
          className="
            inline-flex items-center gap-2 px-5 py-3
            text-white/50 font-body text-sm
            rounded-xl border border-white/10
            hover:border-white/20 hover:text-white/70
            transition-all duration-200
          "
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <button
          onClick={onNext}
          disabled={!value}
          className="
            inline-flex items-center gap-2 px-6 py-3
            bg-gvc-gold text-gvc-black font-display font-bold
            rounded-xl
            transition-all duration-300
            hover:shadow-[0_0_30px_rgba(255,224,72,0.3)]
            disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:shadow-none
          "
        >
          Continue
          <ArrowRight className="w-4 h-4" />
        </button>
      </motion.div>
    </motion.div>
  );
}

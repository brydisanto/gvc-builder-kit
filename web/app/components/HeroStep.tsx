"use client";

import { motion } from "framer-motion";
import { ArrowRight, Terminal } from "lucide-react";
import Image from "next/image";
import { useMemo } from "react";

// All 101 badge filenames
const ALL_BADGES = [
  "anchorman","any_gvc","astro_balls","astro_bean","captain","checkmate",
  "chris_favorite_badge","cosmic_guardian","doge","electric_rings",
  "elite_rainbow_ranger","fifteen_badges","fifty_badges","five_badges",
  "flow_state","forty_badges","full_send_maverick","full_throttle",
  "funky_fresh","fur_the_win","gamer","gold_member","gradient_hatrick",
  "gradient_high_five","gradient_lover","grayscale_seeker","great_stacheby",
  "gud_meat","hail_mary_heroes","high_noon_hustler","highkeymoments_1",
  "highkeymoments_2","homerun","hoodie_up_society","hue_too_fresh","king",
  "kinky","ladies_night","lamp","mountain_goat","multi_type_master",
  "necks_level","no_face_no_problem","nounish_vibes","one_of_one",
  "party_in_the_back","patch_powerhouse","pepe","plants","plastic_hatrick",
  "plastic_high_five","plastic_lover","poker_face","pothead","power_duo",
  "rack_em_up","rainbow_boombox","rainbow_bubble_goggles","rainbow_citizen",
  "rainbow_visor","ranger","robot_hatrick","robot_high_five","robot_lover",
  "science_goggles","seas_the_day","shadow_funk_division","shower","showtime",
  "sir_vibes_a_lot","stone","straw_man","sugar_rush","suited_up","super_rare",
  "surfer","tanks_a_lot","tatted_up","ten_badges","the_completionist",
  "thirty_badges","toy_bricks","trait_maxi","twenty_badges",
  "unfathomable_vibes","varsity_vibes","vibefoot_fan_club","vibestr_blue_tier",
  "vibestr_bounty_hunter","vibestr_bronze_tier","vibestr_cosmic_tier",
  "vibestr_diamond_tier","vibestr_gold_tier","vibestr_pink_tier",
  "vibestr_purple_tier","vibestr_silver_tier","vibetown_baller",
  "vibetown_social_club","visooor_enjoyooor","yin_n_yang","zoom_in_vibe_out",
];

// GVC portrait token IDs (real collection NFTs)
const GVC_PORTRAITS = [
  3939, 4604, 5300, 1138, 2445, 4612, 5267, 1934, 1960,
  147, 3504, 1576, 4836, 1082, 346, 4506, 4915, 1473,
  3516, 1346, 2787, 6608, 4443, 821, 5894,
];

interface HeroStepProps {
  onNext: () => void;
}

export default function HeroStep({ onNext }: HeroStepProps) {
  const badges = useMemo(() => shuffleArray([...ALL_BADGES]).slice(0, 25), []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col items-center justify-center w-full min-h-screen"
    >
      {/* Background embers */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(14)].map((_, i) => (
          <div
            key={i}
            className="ember"
            style={{
              left: `${5 + (i * 7) % 90}%`,
              top: `${10 + ((i * 19) % 70)}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${3.5 + (i % 5) * 0.8}s`,
              width: `${2 + (i % 4) * 1.5}px`,
              height: `${2 + (i % 4) * 1.5}px`,
              opacity: 0.3 + (i % 4) * 0.12,
            }}
          />
        ))}
      </div>

      {/* Top: GVC Portrait Marquee */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        className="w-screen overflow-hidden badge-marquee-container pt-6"
      >
        <div className="badge-marquee">
          <div className="badge-marquee-track portrait-speed">
            {[...GVC_PORTRAITS, ...GVC_PORTRAITS].map((tokenId, i) => (
              <div key={`p-${i}`} className="badge-marquee-item">
                <div className="w-[130px] h-[130px] rounded-2xl overflow-hidden opacity-80 hover:opacity-100 hover:scale-105 transition-all duration-300">
                  <Image
                    src={`/portraits/gvc-${tokenId}.jpg`}
                    alt={`GVC #${tokenId}`}
                    width={130}
                    height={130}
                    className="w-full h-full object-cover"
                    unoptimized
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Center: Content */}
      <div className="flex flex-col items-center text-center px-6 py-12 sm:py-16 relative z-10">
        {/* Shaka */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5, rotate: -20 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ delay: 0.1, duration: 0.6, type: "spring", stiffness: 150, damping: 14 }}
          className="wiggle-hover mb-4 cursor-default"
        >
          <Image
            src="/shaka.png"
            alt="GVC Shaka"
            width={80}
            height={80}
            className="drop-shadow-[0_0_30px_rgba(255,224,72,0.3)]"
            priority
          />
        </motion.div>

        {/* Presents */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-sm text-gvc-gold/50 font-display font-bold uppercase tracking-[0.08em] mb-3"
        >
          Good Vibes Club Presents
        </motion.p>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-5xl sm:text-7xl lg:text-8xl font-display font-black text-shimmer leading-[1.0] mb-4 tracking-wide"
        >
          The
          <br />
          Playground
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-lg sm:text-xl text-white/60 font-body mb-1"
        >
          A builder toolkit for the GVC community
        </motion.p>

        {/* Italic tagline */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.5 }}
          className="text-sm text-white/25 font-body italic mb-6"
        >
          Built by the community, for the community
        </motion.p>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-base text-white font-body max-w-lg mx-auto mb-8"
        >
          Go from idea to live project in minutes. No coding experience needed.
        </motion.p>

        {/* CTA Button */}
        <motion.button
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          whileHover={{ scale: 1.04, y: -2 }}
          whileTap={{ scale: 0.97 }}
          onClick={onNext}
          className="
            group relative inline-flex items-center gap-3 px-10 py-5
            bg-gvc-gold text-gvc-black font-display font-bold text-xl
            rounded-2xl transition-all duration-300 glow-pulse
          "
        >
          Start Building
          <ArrowRight className="w-6 h-6 transition-transform duration-300 group-hover:translate-x-1" />
        </motion.button>

        {/* Terminal link */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="mt-5 text-sm text-white/25 font-body inline-flex items-center gap-2 hover:text-white/40 transition-colors cursor-default"
        >
          <Terminal className="w-3.5 h-3.5" />
          Or try it in your terminal with <code className="text-gvc-gold/50 font-mono text-xs ml-1">npx create-gvc-app</code>
        </motion.p>
      </div>

      {/* Bottom: Badge Marquee */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.8 }}
        className="w-screen overflow-hidden badge-marquee-container pb-6"
      >
        <div className="badge-marquee badge-marquee-reverse">
          <div className="badge-marquee-track">
            {[...badges, ...badges].map((badge, i) => (
              <div key={`b-${i}`} className="badge-marquee-item">
                <Image
                  src={`/badges/${badge}.webp`}
                  alt={badge}
                  width={130}
                  height={130}
                  className="rounded-2xl opacity-85 hover:opacity-100 hover:scale-110 transition-all duration-300"
                />
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function shuffleArray<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

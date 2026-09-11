"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, Play, Mic, Film } from "lucide-react";
import { HeroCarousel, type HeroCarouselItem } from "@/components/ui/hero-carousel";
import { ImagesBadge } from "@/components/ui/images-badge";

const BADGE_IMAGES = [
  { src: "/Telugu-Movies.jpg", alt: "Telugu Cinema Dubbing" },
  { src: "/Hindhi-Movies.jpg", alt: "Hindi Cinema Localization" },
  { src: "/Japanies-Movie.jpg", alt: "Japanese Anime Voice Sync" },
  { src: "/Chaina-Movies.jpg", alt: "Chinese Film Localization" },
  { src: "/Malayalam-Movies.jpg", alt: "Malayalam Cinema Dubbing" },
  { src: "/Spider-Man.jpg", alt: "Hollywood Film Dubbing" }
];

const MOVIE_DUB_ITEMS: HeroCarouselItem[] = [
  {
    id: "telugu-dub",
    title: "Telugu Blockbusters\nMultilingual Dub",
    image: "/Telugu-Movies.jpg",
    credit: "DUBZEEK TELUGU ENGINE",
    meta: ["TELUGU (తెలుగు)", "VOICE CLONED", "LIP SYNC HD"],
    accent: "#7c3aed"
  },
  {
    id: "hindi-dub",
    title: "Hindi Cinema\nRegional Localization",
    image: "/Hindhi-Movies.jpg",
    credit: "BOLLYWOOD DUBBING PRO",
    meta: ["HINDI (हिंदी)", "PROSODY MATCH", "BGM ISOLATED"],
    accent: "#ea580c"
  },
  {
    id: "japanese-dub",
    title: "Japanese Anime\nCharacter Voice Sync",
    image: "/Japanies-Movie.jpg",
    credit: "TOKYO ANIME DUBBING",
    meta: ["JAPANESE (日本語)", "WAV2LIP HD", "MULTI-SPEAKER"],
    accent: "#0284c7"
  },
  {
    id: "chinese-dub",
    title: "Chinese Cinema\nGlobal Broadcast",
    image: "/Chaina-Movies.jpg",
    credit: "MANDARIN LOCALIZATION",
    meta: ["CHINESE (中文)", "ASR ACCURACY", "STUDIO PRO"],
    accent: "#dc2626"
  },
  {
    id: "malayalam-dub",
    title: "Malayalam Cinema\nPan-Indian Dubbing",
    image: "/Malayalam-Movies.jpg",
    credit: "MOLLEYWOOD AI DUB",
    meta: ["MALAYALAM (മലയാളം)", "EMOTION SYNC", "DEMUCS BGM"],
    accent: "#2563eb"
  },
  {
    id: "hollywood-dub",
    title: "Hollywood Blockbusters\nGlobal Release",
    image: "/Spider-Man.jpg",
    credit: "GLOBAL CINEMA LOCALIZATION",
    meta: ["ENGLISH ↔ MULTILINGUAL", "FULL HD 60FPS", "THEATRICAL"],
    accent: "#db2777"
  },
  {
    id: "ott-series-dub",
    title: "Global OTT Series\nMulti-Speaker Diarization",
    image: "/All-Of-Us-Death.jpg",
    credit: "STREAMING PLATFORM SCALE",
    meta: ["KOREAN / GLOBAL", "30+ LANGUAGES", "SERIES DUB"],
    accent: "#4f46e5"
  }
];

export default function HeroSection() {
  return (
    <section className="relative pt-12 pb-16 md:pt-16 md:pb-24 overflow-hidden bg-white">
      <div className="w-full relative z-10 space-y-10">
        
        {/* Hero Header */}
        <div className="text-center max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
          
          {/* Interactive Stacked Images Badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-center"
          >
            <ImagesBadge
              images={BADGE_IMAGES}
              maxVisible={3}
              revealCount={3}
              label="Next-Gen AI Voice Cloning & Deep Lip-Sync Engine"
              size="md"
              shape="circle"
            />
          </motion.div>

          {/* Main Title - Single Line */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight"
          >
            Dub Any Video Into <span className="text-gradient">Multiple Languages</span> Without Losing Speaker Emotion
          </motion.h1>

        </div>

        {/* Full-Width Interactive Hero Filmstrip Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="w-full h-[540px] sm:h-[620px]"
        >
          <HeroCarousel
            items={MOVIE_DUB_ITEMS}
            defaultIndex={0}
            brand="DUBZEEK AI CINEMA"
            autoplay={true}
            autoplayDelay={4000}
          />
        </motion.div>

      </div>
    </section>
  );
}

"use client";

import React from "react";
import { HeroCarousel, type HeroCarouselItem } from "@/components/ui/hero-carousel";
import { Film, Sparkles, Globe } from "lucide-react";

const MOVIE_DUB_ITEMS: HeroCarouselItem[] = [
  {
    id: "telugu-dub",
    title: "Telugu Blockbusters\nMultilingual Dub",
    image: "/Telugu-Movies.jpg",
    credit: "LINGUADUB TELUGU ENGINE",
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

export default function MovieCarouselShowcase() {
  return (
    <section className="py-20 bg-white border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-purple-800 bg-purple-100 px-3.5 py-1 rounded-full inline-flex items-center gap-1.5">
            <Film className="w-3.5 h-3.5" /> Movie & Cinema Dubbing Showcase
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3 tracking-tight">
            Real-Time Filmstrip Carousel
          </h2>
          <p className="text-slate-600 mt-2 text-base">
            Drag or scroll through localized movie titles. Notice how the background color dynamically adapts to each film's accent color!
          </p>
        </div>
      </div>

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[520px] sm:h-[600px]">
        <HeroCarousel
          items={MOVIE_DUB_ITEMS}
          defaultIndex={0}
          brand="LINGUADUB CINEMA"
          autoplay={true}
          autoplayDelay={4000}
        />
      </div>
    </section>
  );
}

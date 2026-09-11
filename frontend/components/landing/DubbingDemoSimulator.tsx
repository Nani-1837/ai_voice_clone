"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import CardSwap, { Card } from "@/components/ui/card-swap";
import { Play, Pause, Volume2, Globe, Sparkles, UserCheck, Mic, Layers, Film } from "lucide-react";

interface DubScenario {
  id: string;
  lang: string;
  title: string;
  movieTag: string;
  originalText: string;
  dubbedText: string;
  emotion: string;
  image: string;
  accent: string;
}

const DEMO_SCENARIOS: DubScenario[] = [
  {
    id: "telugu-dub",
    lang: "Telugu (తెలుగు)",
    title: "Quantum Physics & AI Lecture",
    movieTag: "Telugu Dubbing Engine",
    originalText: "Artificial Intelligence is transforming global education and media localization.",
    dubbedText: "ఆర్టిఫిషియల్ ఇంటెలిజెన్స్ ప్రపంచ విద్యాభ్యాసం మరియు మీడియా లోకలైజేషన్‌ను అనూహ్యమైన వేగంతో మారుస్తోంది.",
    emotion: "Inspiring & Authoritative",
    image: "/Telugu-Movies.jpg",
    accent: "bg-purple-100 text-purple-900 border-purple-300"
  },
  {
    id: "hindi-dub",
    lang: "Hindi (हिंदी)",
    title: "Cinematic Action Drama",
    movieTag: "Bollywood Localization",
    originalText: "Understanding quantum superposition allows us to build faster computational algorithms.",
    dubbedText: "क्वांटम सुपरपोजिशन को समझने से हमें तेजी से और अधिक सक्षम कंप्यूटेशनल एल्गोरिदम बनाने में मदद मिलती है।",
    emotion: "Energetic & Dramatic",
    image: "/Hindhi-Movies.jpg",
    accent: "bg-orange-100 text-orange-900 border-orange-300"
  },
  {
    id: "japanese-dub",
    lang: "Japanese (日本語)",
    title: "Anime Sci-Fi Series",
    movieTag: "Tokyo Anime Dub",
    originalText: "We must journey across the stars to safeguard our shared heritage.",
    dubbedText: "故郷を守り、共通の遺産を保存するために、私たちは星々を越えて旅しなければなりません。",
    emotion: "Dramatic & Emotional",
    image: "/Japanies-Movie.jpg",
    accent: "bg-sky-100 text-sky-900 border-sky-300"
  },
  {
    id: "chinese-dub",
    lang: "Chinese (中文)",
    title: "Global Financial Briefing",
    movieTag: "Mandarin Broadcast",
    originalText: "Sustainable growth requires scalable cross-border video platforms.",
    dubbedText: "可持续增长需要具有可扩展性的跨国视频通信平台。",
    emotion: "Professional & Direct",
    image: "/Chaina-Movies.jpg",
    accent: "bg-red-100 text-red-900 border-red-300"
  },
  {
    id: "malayalam-dub",
    lang: "Malayalam (മലയാളം)",
    title: "Pan-Indian Film Dubbing",
    movieTag: "Mollywood AI Engine",
    originalText: "Preserving original speaker emotions ensures authentic theatrical localized experience.",
    dubbedText: "అసలు స్పీకర్ భావోద్వేగాలను కాపాడటం ప్రామాణిక థియేట్రికల్ అనుభవాన్ని అందిస్తుంది.",
    emotion: "Theatrical & Crisp",
    image: "/Malayalam-Movies.jpg",
    accent: "bg-blue-100 text-blue-900 border-blue-300"
  }
];

export default function DubbingDemoSimulator() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [voiceCloningActive, setVoiceCloningActive] = useState(true);
  const [lipSyncActive, setLipSyncActive] = useState(true);
  const [bgmPreserved, setBgmPreserved] = useState(true);
  const [activeCardIdx, setActiveCardIdx] = useState(0);
  const [waveHeights, setWaveHeights] = useState<number[]>([40, 65, 30, 85, 50, 75, 45, 90, 60, 35, 70, 80]);

  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setWaveHeights(prev => prev.map(() => Math.floor(Math.random() * 65) + 25));
      }, 150);
    } else {
      setWaveHeights([25, 35, 20, 45, 30, 40, 25, 50, 30, 20, 35, 40]);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <section id="simulator" className="py-20 bg-white border-y border-slate-200 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-purple-800 bg-purple-100 px-3.5 py-1 rounded-full inline-flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-purple-700" />
            Interactive 3D CardSwap Engine
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3 tracking-tight">
            Test Real-Time Multilingual Dubbing
          </h2>
          <p className="text-slate-600 mt-2 text-base">
            Click or wait for cards to swap smoothly. 
          </p>
        </div>

        {/* Grid Layout: Left Controls & Right CardSwap 3D Stack */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Feature Controls & Scenario Info */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 space-y-4">
              <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">
                Real-Time AI Pipeline Status
              </span>
              
              <div className="space-y-3">
                <button
                  onClick={() => setVoiceCloningActive(!voiceCloningActive)}
                  className={`w-full flex items-center justify-between p-3.5 rounded-2xl border transition-all ${
                    voiceCloningActive
                      ? "bg-purple-50 border-purple-300 text-purple-950 font-extrabold"
                      : "bg-white border-slate-200 text-slate-600"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <UserCheck className="w-4 h-4 text-purple-700" />
                    <span className="text-xs">Zero-Shot Voice Cloning</span>
                  </div>
                  <span className="text-[10px] font-bold bg-purple-200 text-purple-900 px-2 py-0.5 rounded-full">
                    {voiceCloningActive ? "ACTIVE" : "OFF"}
                  </span>
                </button>

                <button
                  onClick={() => setLipSyncActive(!lipSyncActive)}
                  className={`w-full flex items-center justify-between p-3.5 rounded-2xl border transition-all ${
                    lipSyncActive
                      ? "bg-cyan-50 border-cyan-300 text-cyan-950 font-extrabold"
                      : "bg-white border-slate-200 text-slate-600"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Mic className="w-4 h-4 text-cyan-700" />
                    <span className="text-xs">Visual Lip Sync (Wav2Lip HD)</span>
                  </div>
                  <span className="text-[10px] font-bold bg-cyan-200 text-cyan-900 px-2 py-0.5 rounded-full">
                    {lipSyncActive ? "ENABLED" : "OFF"}
                  </span>
                </button>

                <button
                  onClick={() => setBgmPreserved(!bgmPreserved)}
                  className={`w-full flex items-center justify-between p-3.5 rounded-2xl border transition-all ${
                    bgmPreserved
                      ? "bg-pink-50 border-pink-300 text-pink-950 font-extrabold"
                      : "bg-white border-slate-200 text-slate-600"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Layers className="w-4 h-4 text-pink-700" />
                    <span className="text-xs">BGM Score & SFX Isolation</span>
                  </div>
                  <span className="text-[10px] font-bold bg-pink-200 text-pink-900 px-2 py-0.5 rounded-full">
                    {bgmPreserved ? "DEMUCS PRO" : "MUTED"}
                  </span>
                </button>
              </div>

              <div className="pt-3 border-t border-slate-200 text-xs text-slate-500 font-medium">
                Tip: Cards swap automatically every 5 seconds. You can hover to pause or click any card to inspect its dialogue track.
              </div>
            </div>
          </div>

          {/* Right Column: CardSwap Component Deck */}
          <div className="lg:col-span-7 flex justify-center items-center py-6 min-h-[460px] relative">
            <div className="w-full max-w-[480px] sm:max-w-[500px] h-[380px] sm:h-[400px] relative flex justify-center items-center">
              <CardSwap
                width={460}
                height={360}
                cardDistance={45}
                verticalDistance={55}
                delay={4500}
                pauseOnHover={true}
                skewAmount={5}
                easing="elastic"
                onCardClick={(idx) => setActiveCardIdx(idx)}
              >
                {DEMO_SCENARIOS.map((sc, idx) => (
                  <Card key={sc.id} className="p-6 flex flex-col justify-between shadow-2xl bg-white border-2 border-slate-200">
                    
                    {/* Top Card Header */}
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-extrabold px-3 py-1 rounded-full border ${sc.accent}`}>
                          {sc.lang}
                        </span>
                        <span className="text-[11px] font-bold text-slate-500">{sc.movieTag}</span>
                      </div>
                      <span className="text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                        1080p Sync
                      </span>
                    </div>

                    {/* Middle Audio Waveform & Player */}
                    <div className="my-3 bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center justify-between gap-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsPlaying(!isPlaying);
                        }}
                        className="w-11 h-11 rounded-full bg-gradient-to-tr from-purple-300 via-indigo-200 to-cyan-300 text-black flex items-center justify-center shadow-md border border-purple-400 shrink-0"
                      >
                        {isPlaying ? <Pause className="w-5 h-5 text-black fill-black" /> : <Play className="w-5 h-5 ml-0.5 text-black fill-black" />}
                      </button>

                      <div className="flex-1">
                        <div className="flex justify-between text-[10px] font-mono font-bold text-slate-600 mb-1">
                          <span>{sc.emotion}</span>
                          <span>00:14 / 00:45</span>
                        </div>

                        <div className="flex items-center gap-1 h-8">
                          {waveHeights.slice(0, 14).map((h, i) => (
                            <motion.div
                              key={i}
                              animate={{ height: `${h}%` }}
                              transition={{ duration: 0.15 }}
                              className="w-2 bg-gradient-to-t from-purple-600 to-cyan-500 rounded-full"
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Dialogue Text Box */}
                    <div className="space-y-2 text-xs">
                      <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                        <span className="text-[10px] font-extrabold text-slate-400 block mb-0.5">EN ASR INPUT:</span>
                        <p className="text-slate-800 font-semibold line-clamp-1">"{sc.originalText}"</p>
                      </div>

                      <div className="bg-purple-50 p-2.5 rounded-lg border border-purple-200">
                        <span className="text-[10px] font-extrabold text-purple-700 block mb-0.5">LOCALIZED DUBBED:</span>
                        <p className="text-purple-950 font-bold line-clamp-1">"{sc.dubbedText}"</p>
                      </div>
                    </div>

                  </Card>
                ))}
              </CardSwap>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

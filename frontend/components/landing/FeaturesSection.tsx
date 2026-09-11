"use client";

import React from "react";
import { motion } from "framer-motion";
import { Mic, Users, HeartPulse, Clock, Music, Video, Sparkles, Cpu, ShieldCheck } from "lucide-react";

const FEATURES = [
  {
    icon: Users,
    color: "purple",
    title: "Multi-Speaker Diarization",
    description: "Automatically identifies distinct speakers in a scene, assigning unique voice cloning profiles to maintain character integrity."
  },
  {
    icon: HeartPulse,
    color: "pink",
    title: "Emotion & Prosody Transfer",
    description: "Detects emotional nuance (joy, anger, suspense, authority) in original dialogue and transfers matching pitch contours to target speech."
  },
  {
    icon: Clock,
    color: "cyan",
    title: "Speech Timing Optimization",
    description: "Uses WSOLA & syllable time-stretching so dubbed audio matches exact start/end timestamps of original video actors."
  },
  {
    icon: Music,
    color: "indigo",
    title: "BGM & SFX Preservation",
    description: "Deconstructs original audio tracks into isolated vocals vs background score, preserving music and sound effects intact."
  },
  {
    icon: Video,
    color: "emerald",
    title: "Visual Lip Synchronization",
    description: "Advanced deep neural lip-syncing aligns actor mouth movements with translated target phonemes in HD video outputs."
  },
  {
    icon: Cpu,
    color: "amber",
    title: "Context-Aware Translation",
    description: "Employs domain-tuned NMT models trained specifically on film scripts, documentaries, online courses, and commercial media."
  }
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-purple-600 bg-purple-100 px-3 py-1 rounded-full">
            Full AI Processing Pipeline
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3 tracking-tight">
            Built For Studio-Grade Video Localization
          </h2>
          <p className="text-slate-600 mt-3 text-base">
            From raw input video to multi-speaker audio demuxing, neural translation, synthetic dubbing, and lip rendering.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {FEATURES.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="glass-card glass-card-hover p-6 rounded-2xl bg-white border border-slate-200 hover:border-purple-300 relative group"
              >
                <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-purple-600 group-hover:text-white transition-all shadow-xs">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-purple-700 transition-colors">
                  {feat.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {feat.description}
                </p>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

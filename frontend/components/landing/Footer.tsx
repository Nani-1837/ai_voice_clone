"use client";

import React from "react";
import Link from "next/link";
import { Mic, Globe, ShieldCheck, Cpu, Film, BookOpen, Award, Sparkles, CheckCircle2, Lock } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white text-slate-600 text-xs border-t border-slate-200 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Top Abstract & Platform Overview Section */}
        <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Link href="/" className="flex items-center gap-2.5">
              <img
                src="/cropped_circle_image.png"
                alt="Dubzeek AI Logo"
                className="w-10 h-10 rounded-full object-cover shadow-xs border border-slate-200"
              />
              <span className="font-extrabold text-xl text-slate-900 tracking-tight">
                Dubzeek <span className="text-purple-600">AI</span>
              </span>
            </Link>
            
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-1.5 bg-purple-100 text-purple-800 font-bold px-3 py-1 rounded-full text-xs">
                <Sparkles className="w-3.5 h-3.5" /> Preserving Voice, Emotion & Lip Sync
              </span>
              <span className="inline-flex items-center gap-1.5 bg-cyan-100 text-cyan-800 font-bold px-3 py-1 rounded-full text-xs">
                <Globe className="w-3.5 h-3.5" /> 30+ Global & Regional Languages
              </span>
            </div>
          </div>

          <p className="text-slate-700 text-xs leading-relaxed max-w-5xl font-medium">
            <strong>Dubzeek AI Platform Overview:</strong> Dubzeek AI is an artificial intelligence-based multilingual video dubbing and localization platform designed to convert video content from one language into multiple regional and international languages while preserving the original speaker characteristics, emotions, speech timing, and visual synchronization. The system accepts an input video and automatically extracts the audio, identifies speakers, segments dialogues, converts speech into text using automatic speech recognition, translates the extracted content into the selected target language, and generates natural speech using text to speech technology.
          </p>
        </div>

        {/* 4 Column Detailed Link Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 border-b border-slate-200 pb-12">
          
          {/* Column 1: Core AI Pipeline */}
          <div className="space-y-3">
            <div className="font-extrabold text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-purple-600" />
              AI Processing Pipeline
            </div>
            <ul className="space-y-2 text-slate-600">
              <li>1. Video Preprocessing & Audio Extraction</li>
              <li>2. Multi-Speaker Diarization (PyAnnote)</li>
              <li>3. Speech-to-Text ASR (WhisperX Engine)</li>
              <li>4. Context-Aware Neural Translation (NMT)</li>
              <li>5. Voice Cloning & Emotion Transfer</li>
              <li>6. Speech Timing Optimization (WSOLA)</li>
              <li>7. BGM & SFX Isolation (Demucs Engine)</li>
              <li>8. Deep Lip Synchronization (Wav2Lip HD)</li>
            </ul>
          </div>

          {/* Column 2: Regional Indian Languages */}
          <div className="space-y-3">
            <div className="font-extrabold text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-orange-600" />
              Regional Indian Languages
            </div>
            <ul className="space-y-2 text-slate-600 font-medium">
              <li>• Telugu (తెలుగు) — Full Voice Clone</li>
              <li>• Hindi (हिंदी) — Full Voice Clone</li>
              <li>• Tamil (தமிழ்) — Full Voice Clone</li>
              <li>• Kannada (ಕನ್ನಡ) — High Accuracy</li>
              <li>• Malayalam (മലയാളം) — High Accuracy</li>
              <li>• Bengali (বাংলা) — High Accuracy</li>
              <li>• Marathi (मराठी) — High Accuracy</li>
              <li>• Gujarati (ગુજરાતી) — High Accuracy</li>
            </ul>
          </div>

          {/* Column 3: International Languages */}
          <div className="space-y-3">
            <div className="font-extrabold text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-cyan-600" />
              International Coverage
            </div>
            <ul className="space-y-2 text-slate-600 font-medium">
              <li>• Japanese (日本語) — Lip Sync Ultra</li>
              <li>• Chinese Mandarin (中文) — Standard</li>
              <li>• Spanish (Español) — LatAm & EU</li>
              <li>• German (Deutsch) — High Fidelity</li>
              <li>• French (Français) — Broadcast Quality</li>
              <li>• Arabic (العربية) — Regional Dialects</li>
              <li>• Korean (한국어) — Lip Sync Ultra</li>
              <li>• English (US/UK/AU) — Base Acoustic</li>
            </ul>
          </div>

          {/* Column 4: Use Cases & Solutions */}
          <div className="space-y-3">
            <div className="font-extrabold text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <Film className="w-3.5 h-3.5 text-pink-600" />
              Supported Media Formats
            </div>
            <ul className="space-y-2 text-slate-600">
              <li>• Feature Movies & Cinema Film</li>
              <li>• Online Courses & EdTech Masterclasses</li>
              <li>• Youtube & Creator Video Channels</li>
              <li>• Commercial Advertisements & Promos</li>
              <li>• Documentaries & News Broadcasts</li>
              <li>• OTT & Streaming Video Distribution</li>
              <li>• Enterprise Corporate Training</li>
            </ul>
          </div>

          {/* Column 5: Enterprise Security & SLA */}
          <div className="space-y-3">
            <div className="font-extrabold text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Security & Guarantee
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-900">
                <Lock className="w-3.5 h-3.5 text-emerald-600" /> SOC2 Type II Certified
              </div>
              <p className="text-[11px] text-slate-500 leading-tight">
                Enterprise data isolation, zero voice model training on public data, 100% commercial rights ownership.
              </p>
            </div>
            <ul className="space-y-2 text-slate-600 text-[11px]">
              <li><Link href="/privacy" className="hover:text-purple-600 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-purple-600 transition-colors">Terms of Service</Link></li>
              <li><Link href="/sla" className="hover:text-purple-600 transition-colors">Enterprise SLA Guarantee</Link></li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-medium">
          <div>
            © {new Date().getFullYear()} Dubzeek AI Platform. All rights reserved. Built for Next.js Global SaaS Application.
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Pure White Studio Interface</span>
            <span className="text-slate-300">•</span>
            <span className="text-purple-700 font-bold">Telugu, Hindi, Tamil & Global Dubbing</span>
          </div>
        </div>

      </div>
    </footer>
  );
}

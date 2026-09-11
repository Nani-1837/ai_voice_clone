"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Mic, Play, Pause, Upload, Globe, Volume2, Users, Sliders, Layers, Film, Sparkles, Check, ArrowLeft, RefreshCw, Download, FileText, Settings, ShieldCheck
} from "lucide-react";

export default function StudioPage() {
  const [selectedTargetLang, setSelectedTargetLang] = useState("Telugu");
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTab, setActiveTab] = useState<"transcript" | "speakers" | "timeline" | "render">("transcript");
  const [rendering, setRendering] = useState(false);
  const [renderProgress, setRenderProgress] = useState(0);

  // Simulated dialogue segments
  const [segments, setSegments] = useState([
    {
      id: 1,
      speaker: "Speaker 1 (Prof. Alan)",
      speakerColor: "purple",
      startTime: "00:02",
      endTime: "00:08",
      originalText: "Artificial Intelligence is transforming global education and media localization at an unprecedented pace.",
      dubbedText: "ఆర్టిఫిషియల్ ఇంటెలిజెన్స్ ప్రపంచ విద్యాభ్యాసం మరియు మీడియా లోకలైజేషన్‌ను అనూహ్యమైన వేగంతో మారుస్తోంది.",
      emotion: "Inspiring & Authoritative",
      pitch: 1.0,
      speed: 1.0
    },
    {
      id: 2,
      speaker: "Speaker 2 (Student Maria)",
      speakerColor: "cyan",
      startTime: "00:09",
      endTime: "00:15",
      originalText: "Understanding quantum superposition allows us to build faster and more resilient computational algorithms.",
      dubbedText: "క్వాంటమ్ సూపర్ పొజిషన్ అర్థం చేసుకోవడం ద్వారా మనం వేగవంతమైన మరియు మరింత పునరావృత కంప్యూటేషనల్ అల్గారిథమ్‌లను రూపొందించవచ్చు.",
      emotion: "Academic & Curious",
      pitch: 1.1,
      speed: 0.98
    }
  ]);

  const handleStartRender = () => {
    setRendering(true);
    setRenderProgress(0);
    let p = 0;
    const interval = setInterval(() => {
      p += 10;
      setRenderProgress(p);
      if (p >= 100) {
        clearInterval(interval);
        setRendering(false);
      }
    }, 400);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900 font-sans">
      
      {/* Top Studio Bar */}
      <header className="bg-white border-b border-slate-200 px-6 py-3.5 flex items-center justify-between sticky top-0 z-40 shadow-xs">
        <div className="flex items-center gap-4">
          <Link href="/" className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-cyan-500 flex items-center justify-center text-white font-bold text-sm shadow-xs">
              <Mic className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-slate-900">Quantum_Physics_Lecture.mp4</span>
                <span className="text-[10px] font-semibold bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                  Multi-Speaker Diarized
                </span>
              </div>
              <div className="text-[11px] text-slate-400">Project ID: #LGD-948201 • 1080p60 • Duration: 04:12</div>
            </div>
          </div>
        </div>

        {/* Top Controls */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
            <Globe className="w-4 h-4 text-slate-500 ml-2" />
            <select
              value={selectedTargetLang}
              onChange={(e) => setSelectedTargetLang(e.target.value)}
              className="bg-transparent text-xs font-semibold text-slate-800 pr-3 py-1 focus:outline-none cursor-pointer"
            >
              <option value="Telugu">Target: Telugu (తెలుగు)</option>
              <option value="Hindi">Target: Hindi (हिंदी)</option>
              <option value="Tamil">Target: Tamil (தமிழ்)</option>
              <option value="Japanese">Target: Japanese (日本語)</option>
              <option value="Chinese">Target: Chinese (中文)</option>
              <option value="Spanish">Target: Spanish (Español)</option>
            </select>
          </div>

          <button
            onClick={handleStartRender}
            disabled={rendering}
            className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-md shadow-purple-600/20 transition-all disabled:opacity-50"
          >
            {rendering ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            <span>{rendering ? `Rendering ${renderProgress}%` : "Render Final Video"}</span>
          </button>
        </div>
      </header>

      {/* Main Studio 3-Column Layout */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Player & Multi-Track Audio Controls (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Main Video Viewport */}
          <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800 text-white shadow-xl relative overflow-hidden">
            <div className="aspect-video bg-slate-950 rounded-xl relative overflow-hidden flex flex-col justify-between p-4 border border-slate-800">
              
              <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono">
                <span className="bg-purple-950 text-purple-300 border border-purple-800 px-2 py-0.5 rounded">
                  LIP-SYNC: WAV2LIP HD
                </span>
                <span>TRACK: AI DUBBED ({selectedTargetLang.toUpperCase()})</span>
              </div>

              {/* Play Overlay */}
              <div className="flex flex-col items-center justify-center my-auto">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-14 h-14 rounded-full bg-purple-600 hover:bg-purple-500 text-white flex items-center justify-center shadow-lg shadow-purple-600/50 transition-transform active:scale-95"
                >
                  {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
                </button>
                <div className="text-xs font-medium text-slate-300 mt-2">
                  {isPlaying ? "Playing Synchronized Audio & Lip Mesh..." : "Click to Scrub Synchronized Preview"}
                </div>
              </div>

              {/* Audio Track Selector */}
              <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800">
                <span className="text-slate-400 font-mono">00:04 / 04:12</span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> BGM Preserved (Demucs)
                </span>
              </div>
            </div>

            {/* Audio Waveform Scrubbing Bar */}
            <div className="mt-4 pt-3 border-t border-slate-800 space-y-2">
              <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                <span>Original Vocal Track</span>
                <span>Isolated BGM Track</span>
                <span className="text-purple-400 font-bold">Neural Dubbed Track ({selectedTargetLang})</span>
              </div>
              <div className="h-10 bg-slate-950 rounded-lg p-2 border border-slate-800 flex items-center justify-between gap-1">
                {[40, 60, 30, 80, 45, 90, 70, 35, 65, 85, 50, 75, 95, 60, 40, 80, 55, 70, 90, 45, 60].map((h, i) => (
                  <div
                    key={i}
                    style={{ height: `${h}%` }}
                    className="w-full bg-gradient-to-t from-purple-600 to-cyan-400 rounded-full"
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Diarized Voice Profiles */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
              <span>Speaker Diarization & Clones</span>
              <span className="text-purple-600">2 Profiles Active</span>
            </h3>

            <div className="p-3 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-purple-600 text-white font-bold text-xs flex items-center justify-center">
                  S1
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Speaker 1: Prof. Alan</div>
                  <div className="text-[11px] text-purple-700 font-medium">Male • Clone Pitch 1.0x • {selectedTargetLang}</div>
                </div>
              </div>
              <span className="text-[10px] font-bold text-purple-800 bg-purple-200 px-2 py-0.5 rounded-full">
                Active
              </span>
            </div>

            <div className="p-3 rounded-xl bg-cyan-50 border border-cyan-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-cyan-600 text-white font-bold text-xs flex items-center justify-center">
                  S2
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Speaker 2: Student Maria</div>
                  <div className="text-[11px] text-cyan-700 font-medium">Female • Clone Pitch 1.1x • {selectedTargetLang}</div>
                </div>
              </div>
              <span className="text-[10px] font-bold text-cyan-800 bg-cyan-200 px-2 py-0.5 rounded-full">
                Active
              </span>
            </div>
          </div>

        </div>

        {/* Right Column: Interactive Transcript Segment & Emotion Matrix (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <div>
                <h2 className="text-base font-bold text-slate-900">Transcript & Translation Matrix</h2>
                <p className="text-xs text-slate-500">Edit translated lines, adjust speech timing, or tweak prosody sliders.</p>
              </div>

              {/* Sub-Tabs */}
              <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold">
                <button
                  onClick={() => setActiveTab("transcript")}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    activeTab === "transcript" ? "bg-white text-purple-700 shadow-xs" : "text-slate-600"
                  }`}
                >
                  Transcript Matrix
                </button>
                <button
                  onClick={() => setActiveTab("speakers")}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    activeTab === "speakers" ? "bg-white text-purple-700 shadow-xs" : "text-slate-600"
                  }`}
                >
                  Emotion Sliders
                </button>
              </div>
            </div>

            {/* Segment Cards */}
            <div className="space-y-4">
              {segments.map((seg, idx) => (
                <div key={seg.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                  
                  {/* Segment Header */}
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono font-bold text-slate-500">
                      [{seg.startTime} - {seg.endTime}] • Segment #{seg.id}
                    </span>
                    <span className={`px-2 py-0.5 rounded font-semibold text-[11px] ${
                      seg.speakerColor === "purple" ? "bg-purple-100 text-purple-700" : "bg-cyan-100 text-cyan-700"
                    }`}>
                      {seg.speaker}
                    </span>
                  </div>

                  {/* ASR Text */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Original English (ASR Extracted)
                    </label>
                    <div className="text-xs text-slate-800 font-medium bg-white p-2.5 rounded-lg border border-slate-200">
                      "{seg.originalText}"
                    </div>
                  </div>

                  {/* Dubbed Text Editor */}
                  <div>
                    <label className="block text-[10px] font-bold text-purple-700 uppercase tracking-wider mb-1 flex items-center justify-between">
                      <span>Target Translation ({selectedTargetLang})</span>
                      <span className="text-slate-400 font-normal">Editable</span>
                    </label>
                    <textarea
                      value={seg.dubbedText}
                      onChange={(e) => {
                        const val = e.target.value;
                        setSegments(prev => prev.map(s => s.id === seg.id ? { ...s, dubbedText: val } : s));
                      }}
                      rows={2}
                      className="w-full text-xs font-medium text-purple-950 bg-purple-50/70 p-2.5 rounded-lg border border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  {/* Prosody & Emotion Sliders */}
                  <div className="pt-2 border-t border-slate-200/60 grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-[10px] font-semibold text-slate-500">Pitch Shift: {seg.pitch}x</span>
                      <input
                        type="range"
                        min="0.8"
                        max="1.2"
                        step="0.05"
                        value={seg.pitch}
                        onChange={(e) => {
                          const p = parseFloat(e.target.value);
                          setSegments(prev => prev.map(s => s.id === seg.id ? { ...s, pitch: p } : s));
                        }}
                        className="w-full accent-purple-600"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] font-semibold text-slate-500">Speech Speed: {seg.speed}x</span>
                      <input
                        type="range"
                        min="0.8"
                        max="1.2"
                        step="0.05"
                        value={seg.speed}
                        onChange={(e) => {
                          const sp = parseFloat(e.target.value);
                          setSegments(prev => prev.map(s => s.id === seg.id ? { ...s, speed: sp } : s));
                        }}
                        className="w-full accent-purple-600"
                      />
                    </div>
                  </div>

                </div>
              ))}
            </div>

            {/* Bottom Export Bar */}
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <div className="text-xs text-slate-500">
                All segments synced to lip-movement mesh.
              </div>
              <button
                onClick={handleStartRender}
                className="inline-flex items-center gap-2 bg-slate-900 hover:bg-purple-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xs transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Export Dubbed Video (.MP4)</span>
              </button>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

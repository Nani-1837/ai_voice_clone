"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  Globe2,
  Mic2,
  Sliders,
  CheckCircle2,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  Play,
  Pause,
  Trash2,
  FileVideo,
  ChevronDown,
  Volume2,
  Check,
  ShieldCheck,
  Zap,
  Film
} from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import { FileCard } from "@/components/ui/file-card-collections";

export default function CreateDubbingPage() {
  const router = useRouter();

  // State
  const [file, setFile] = useState<{ name: string; size: string; duration: string; url: string } | null>(null);
  const [sourceLang, setSourceLang] = useState("English");
  const [targetLang, setTargetLang] = useState("Telugu");
  const [selectedVoice, setSelectedVoice] = useState("Original Voice Clone (Zero-Shot)");
  
  // Studio Toggles
  const [voiceCloning, setVoiceCloning] = useState(true);
  const [emotionPreservation, setEmotionPreservation] = useState(true);
  const [lipSync, setLipSync] = useState(true);
  const [bgmPreservation, setBgmPreservation] = useState(true);

  // Processing Simulation State
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [currentPipelineStage, setCurrentPipelineStage] = useState(0);

  const popularLanguages = [
    "English", "Telugu", "Hindi", "Tamil", "Kannada", 
    "Malayalam", "Bengali", "Chinese", "Japanese", "Korean", "Spanish", "French", "German"
  ];

  const dubbingCollections = [
    {
      pair: "Telugu -> English",
      source: "Telugu",
      target: "English",
      title: "Telugu Cinema to English Global Dub",
      desc: "Zero-shot voice cloning for Telugu feature films into international English accent."
    },
    {
      pair: "English -> Telugu",
      source: "English",
      target: "Telugu",
      title: "Hollywood & Tech to Telugu Dub",
      desc: "Localize English tech talks, webinars, and cinema into native Telugu prosody."
    },
    {
      pair: "Hindi -> English",
      source: "Hindi",
      target: "English",
      title: "Bollywood to Global English",
      desc: "Natural cadence translation preserving speaker emotional tone and cadence."
    },
    {
      pair: "English -> Hindi",
      source: "English",
      target: "Hindi",
      title: "Pan-India Hindi Release",
      desc: "Transform English video lectures and shorts into crisp Hindi narration."
    },
    {
      pair: "Tamil -> Telugu",
      source: "Tamil",
      target: "Telugu",
      title: "Kollywood to Tollywood Voice Matching",
      desc: "Cross-regional South Indian dialect mapping with original BGM isolation."
    },
    {
      pair: "Telugu -> Tamil",
      source: "Telugu",
      target: "Tamil",
      title: "Tollywood to Kollywood Multilingual Dub",
      desc: "Synchronized Tamil voiceover with Wav2Lip neural lip sync alignment."
    },
    {
      pair: "Malayalam -> Telugu",
      source: "Malayalam",
      target: "Telugu",
      title: "Mollywood to Telugu Cinema Dub",
      desc: "High-fidelity acoustic modeling for Malayalam movies into Telugu."
    },
    {
      pair: "Kannada -> Telugu",
      source: "Kannada",
      target: "Telugu",
      title: "Sandalwood to Telugu Voice Clone",
      desc: "Preserve actor voice characteristics across Kannada and Telugu translations."
    },
    {
      pair: "Korean -> Telugu",
      source: "Korean",
      target: "Telugu",
      title: "K-Drama to Telugu Localized Dub",
      desc: "Neural AI translation tailored for Korean drama series into Telugu speech."
    },
    {
      pair: "Japanese -> English",
      source: "Japanese",
      target: "English",
      title: "Anime & Japanese Film Voice Sync",
      desc: "Precision timestamp matching for anime voice acting into English."
    },
    {
      pair: "Spanish -> English",
      source: "Spanish",
      target: "English",
      title: "Spanish Cinema to English Translation",
      desc: "Seamless translation of Spanish series and movies into native English."
    },
    {
      pair: "German -> English",
      source: "German",
      target: "English",
      title: "European Tech & Docs to English",
      desc: "High precision technical dubbing for German lectures and documentaries."
    }
  ];

  const pipelineStages = [
    { title: "Video Uploaded & Validated", desc: "1080p60 Source MP4 Container" },
    { title: "Audio & Vocal Isolation", desc: "Demucs Vocal & BGM Separator" },
    { title: "Speaker Diarization", desc: "Multi-Speaker Voice Fingerprinting" },
    { title: "Speech Recognition (ASR)", desc: "Whisper HD Timestamp Extraction" },
    { title: "Contextual NMT Translation", desc: "DeepL / NLLB Neural Language Model" },
    { title: "Voice Cloning & Emotion Prosody", desc: "Zero-Shot Voice Matching Engine" },
    { title: "Neural Audio Synchronization", desc: "Time-Stretching & Alignment" },
    { title: "HD Lip Synchronization", desc: "Wav2Lip Neural Mesh Alignment" },
    { title: "Final Video Composite Rendering", desc: "Fast H.264 Video Encoder" },
  ];

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setFile({
      name: "Product_Demo_Presentation.mp4",
      size: "45.2 MB",
      duration: "04:12",
      url: "/cropped_circle_image.png",
    });
  };

  const handleBrowse = () => {
    setFile({
      name: "Product_Demo_Presentation.mp4",
      size: "45.2 MB",
      duration: "04:12",
      url: "/cropped_circle_image.png",
    });
  };

  const handleSelectPreset = (col: typeof dubbingCollections[0]) => {
    setSourceLang(col.source);
    setTargetLang(col.target);
    if (!file) {
      handleBrowse();
    }
  };

  const startGenerating = () => {
    setIsProcessing(true);
    setProcessingProgress(0);
    setCurrentPipelineStage(0);

    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setProcessingProgress(progress);
      const stageIdx = Math.min(Math.floor((progress / 100) * pipelineStages.length), pipelineStages.length - 1);
      setCurrentPipelineStage(stageIdx);

      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          router.push("/projects/dub-948201");
        }, 1200);
      }
    }, 400);
  };

  return (
    <AppLayout>
      <div className="bg-white min-h-screen pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 pt-6">

          {/* Hero Section */}
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-50 border border-purple-200 text-purple-700 text-xs font-bold uppercase tracking-wider shadow-2xs">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span>Multilingual AI Video Dubbing Workshop</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              Create Multilingual AI Dubbing Projects
            </h1>
            <p className="text-base sm:text-lg text-slate-600 font-medium leading-relaxed">
              Select a pre-configured language collection card below or upload your video to instantly translate and clone voices with neural lip synchronization.
            </p>
          </div>

          {/* Featured Dubbing Collections - 3 Column Grid Layout */}
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                  <Film className="w-5 h-5 text-purple-600" />
                  <span>Featured Language Collections</span>
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Click any card to load pre-configured voice cloning & language models.
                </p>
              </div>
              <span className="hidden sm:inline-block px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-xl">
                3 Columns • 12 Presets
              </span>
            </div>

            {/* 3 Columns Grid with Increased Gap and Rows */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {dubbingCollections.map((col) => {
                const isActive = sourceLang === col.source && targetLang === col.target;
                return (
                  <div
                    key={col.pair}
                    onClick={() => handleSelectPreset(col)}
                    className={`bg-white border-2 rounded-3xl p-6 sm:p-7 shadow-xs hover:shadow-xl transition-all duration-300 cursor-pointer group relative flex flex-col justify-between space-y-6 ${
                      isActive
                        ? "border-purple-600 ring-2 ring-purple-600/30 bg-purple-50/30"
                        : "border-slate-100 hover:border-purple-400"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <FileCard formatFile={col.pair} active={isActive} />
                      <span
                        className={`px-3.5 py-1 text-xs font-extrabold rounded-full border transition-colors ${
                          isActive
                            ? "bg-purple-600 text-white border-purple-600"
                            : "bg-slate-50 text-purple-700 border-purple-100 group-hover:bg-purple-600 group-hover:text-white"
                        }`}
                      >
                        {col.source} ➔ {col.target}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-base font-extrabold text-slate-900 group-hover:text-purple-600 transition-colors">
                        {col.title}
                      </h3>
                      <p className="text-xs text-slate-500 leading-relaxed font-medium">
                        {col.desc}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-purple-600 group-hover:text-purple-700">
                      <span>Select Preset Studio</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Interactive Workshop Video Upload & Configuration Studio */}
          <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-10 space-y-8 shadow-xs">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-purple-600" />
                  <span>Video Dubbing Studio Workshop</span>
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Upload your video file and fine-tune voice parameters before starting processing.
                </p>
              </div>
              
              {file && (
                <button
                  onClick={startGenerating}
                  disabled={isProcessing}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-extrabold text-sm px-6 py-3 rounded-2xl shadow-md shadow-purple-600/20 transition-all cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Start AI Video Dubbing</span>
                </button>
              )}
            </div>

            {/* Upload Area */}
            {!file ? (
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={handleBrowse}
                className="border-2 border-dashed border-purple-200 hover:border-purple-500 bg-white hover:bg-purple-50/50 rounded-3xl p-8 sm:p-12 text-center space-y-4 cursor-pointer transition-all group"
              >
                <div className="w-16 h-16 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto shadow-xs group-hover:scale-110 transition-transform">
                  <Upload className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <p className="text-base font-bold text-slate-900">
                    Drop your video here, or <span className="text-purple-600 underline">Browse Files</span>
                  </p>
                  <p className="text-xs text-slate-400">Supported formats: MP4, MOV, AVI, MKV (Up to 500 MB)</p>
                </div>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBrowse();
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Use Demo Sample Video</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-5 bg-white border border-slate-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-slate-900 rounded-xl overflow-hidden flex items-center justify-center text-white shrink-0">
                    <FileVideo className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <p className="font-bold text-sm text-slate-900 truncate max-w-xs">{file.name}</p>
                    <p className="text-xs text-slate-500">{file.size} • Duration: {file.duration}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                    ✓ Video Ready
                  </span>
                  <button
                    onClick={() => setFile(null)}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Language & Voice Controls */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded-2xl border border-slate-200">
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Source Language</label>
                <select
                  value={sourceLang}
                  onChange={(e) => setSourceLang(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-purple-500"
                >
                  <option value="English">English (Auto-Detect Speech)</option>
                  <option value="Telugu">Telugu (తెలుగు)</option>
                  <option value="Hindi">Hindi (हिंदी)</option>
                  <option value="Tamil">Tamil (தமிழ்)</option>
                  <option value="Spanish">Spanish (Español)</option>
                  <option value="German">German (Deutsch)</option>
                  <option value="Korean">Korean (한국어)</option>
                  <option value="Japanese">Japanese (日本語)</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-purple-700 uppercase tracking-wider">Target Dubbed Language</label>
                <select
                  value={targetLang}
                  onChange={(e) => setTargetLang(e.target.value)}
                  className="w-full p-3 bg-purple-50 border border-purple-200 rounded-xl text-sm font-bold text-purple-950 focus:ring-2 focus:ring-purple-500"
                >
                  {popularLanguages.map((lang) => (
                    <option key={lang} value={lang}>{lang}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Advanced AI Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: "Zero-Shot Voice Cloning", state: voiceCloning, setState: setVoiceCloning, icon: Mic2 },
                { label: "Emotion & Prosody Sync", state: emotionPreservation, setState: setEmotionPreservation, icon: Volume2 },
                { label: "HD Lip Sync Mesh", state: lipSync, setState: setLipSync, icon: Sliders },
                { label: "BGM & SFX Isolation", state: bgmPreservation, setState: setBgmPreservation, icon: MusicIcon },
              ].map((opt, idx) => (
                <div
                  key={idx}
                  onClick={() => opt.setState(!opt.state)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                    opt.state
                      ? "bg-white border-purple-300 shadow-2xs"
                      : "bg-slate-100 border-slate-200 opacity-60"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <opt.icon className="w-4 h-4 text-purple-600" />
                    <span className="text-xs font-bold text-slate-800">{opt.label}</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={opt.state}
                    onChange={() => {}}
                    className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                  />
                </div>
              ))}
            </div>

            {/* Bottom Generate Action */}
            <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-slate-500 font-medium">
                Active Selection: <span className="font-bold text-slate-900">{sourceLang} ➔ {targetLang}</span> preserving background score & Zero-Shot Voice Clone.
              </div>
              <button
                onClick={startGenerating}
                disabled={!file || isProcessing}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-sm px-8 py-3.5 rounded-2xl shadow-md shadow-purple-600/20 disabled:opacity-50 transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Process Dubbing Video</span>
              </button>
            </div>
          </div>

          {/* Processing Modal Overlay */}
          {isProcessing && (
            <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl space-y-6 border border-slate-200"
              >
                <div className="text-center space-y-2">
                  <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto text-purple-600 animate-pulse">
                    <Sparkles className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-extrabold text-slate-900">Processing Video Dubbing</h3>
                  <p className="text-xs text-slate-500">
                    Applying Demucs vocal isolation, neural translation, and Wav2Lip mesh alignment...
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold text-slate-700">
                    <span>{pipelineStages[currentPipelineStage]?.title}</span>
                    <span>{processingProgress}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden p-0.5">
                    <div
                      className="bg-gradient-to-r from-purple-600 to-indigo-600 h-full rounded-full transition-all duration-300"
                      style={{ width: `${processingProgress}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 text-center font-medium">
                    {pipelineStages[currentPipelineStage]?.desc}
                  </p>
                </div>
              </motion.div>
            </div>
          )}

        </div>
      </div>
    </AppLayout>
  );
}

function MusicIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 18V5l12-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="16" r="3" />
    </svg>
  );
}

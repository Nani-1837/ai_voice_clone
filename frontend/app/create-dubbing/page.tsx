"use client";

import React, { useState, useEffect } from "react";
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
  ChevronUp,
  Info,
  Clock,
  RefreshCw,
  Volume2,
  Check,
  ShieldCheck
} from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import { FileCard } from "@/components/ui/file-card-collections";

export default function CreateDubbingPage() {
  const router = useRouter();

  // Step State (1: Upload, 2: Language, 3: Voice, 4: Advanced Options, 5: Review, 6: Processing)
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form State
  const [file, setFile] = useState<{ name: string; size: string; duration: string; url: string } | null>(null);
  const [uploadProgress, setUploadProgress] = useState(100);

  const [sourceLang, setSourceLang] = useState("English");
  const [targetLang, setTargetLang] = useState("Telugu");
  const [langSearch, setLangSearch] = useState("");

  const [voiceMode, setVoiceMode] = useState<"preserve" | "ai_generated">("preserve");
  const [selectedVoice, setSelectedVoice] = useState("Original Voice Clone (Zero-Shot)");
  const [playingVoiceSample, setPlayingVoiceSample] = useState<string | null>(null);

  // Advanced Options Toggle State
  const [voiceCloning, setVoiceCloning] = useState(true);
  const [emotionPreservation, setEmotionPreservation] = useState(true);
  const [lipSync, setLipSync] = useState(true);
  const [bgmPreservation, setBgmPreservation] = useState(true);
  const [speechTiming, setSpeechTiming] = useState(true);
  const [speakerDetection, setSpeakerDetection] = useState(true);
  const [multiSpeakerMapping, setMultiSpeakerMapping] = useState(true);

  // Processing Pipeline Simulation
  const [processingProgress, setProcessingProgress] = useState(0);
  const [currentPipelineStage, setCurrentPipelineStage] = useState(0);

  const popularLanguages = [
    "English", "Telugu", "Hindi", "Tamil", "Kannada", 
    "Malayalam", "Bengali", "Chinese", "Japanese", "Korean", "Spanish", "French", "German"
  ];

  const dubbingCollections = [
    { pair: "Telugu -> English", source: "Telugu", target: "English" },
    { pair: "English -> Telugu", source: "English", target: "Telugu" },
    { pair: "Hindi -> English", source: "Hindi", target: "English" },
    { pair: "English -> Hindi", source: "English", target: "Hindi" },
    { pair: "Tamil -> Telugu", source: "Tamil", target: "Telugu" },
    { pair: "Telugu -> Tamil", source: "Telugu", target: "Tamil" },
    { pair: "Malayalam -> Telugu", source: "Malayalam", target: "Telugu" },
    { pair: "Kannada -> Telugu", source: "Kannada", target: "Telugu" },
    { pair: "Korean -> Telugu", source: "Korean", target: "Telugu" },
    { pair: "Japanese -> English", source: "Japanese", target: "English" },
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

  // Simulate File Upload
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

  // Start Processing Pipeline Simulation
  const startGenerating = () => {
    setCurrentStep(6);
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
      <div className="max-w-4xl mx-auto space-y-8 pb-12">
        {/* Header Title */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Create New Dubbing Project
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Guided 6-step workflow to localize your video with voice cloning & lip sync.
            </p>
          </div>
          <Link
            href="/projects"
            className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1.5 p-2 bg-slate-100 rounded-xl"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Cancel</span>
          </Link>
        </div>

        {/* Step Progress Multi-Step Indicator Bar */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <div className="grid grid-cols-6 gap-2 text-center text-xs font-bold">
            {[
              { step: 1, label: "Upload" },
              { step: 2, label: "Language" },
              { step: 3, label: "Voice" },
              { step: 4, label: "Options" },
              { step: 5, label: "Review" },
              { step: 6, label: "Generate" },
            ].map((s) => (
              <button
                key={s.step}
                onClick={() => s.step < currentStep && setCurrentStep(s.step)}
                disabled={s.step > currentStep}
                className={`py-2 px-1 rounded-xl transition-all flex flex-col items-center gap-1 ${
                  currentStep === s.step
                    ? "bg-purple-600 text-white shadow-xs"
                    : currentStep > s.step
                    ? "bg-purple-50 text-purple-700 hover:bg-purple-100"
                    : "bg-slate-50 text-slate-400 opacity-60"
                }`}
              >
                <span className="text-[10px] font-extrabold uppercase">Step {s.step}</span>
                <span className="text-xs truncate font-semibold">{s.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* STEP 1: UPLOAD VIDEO */}
        {currentStep === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs"
          >
            <div className="text-center space-y-1">
              <h2 className="text-lg font-bold text-slate-900">Step 1: Upload Source Video</h2>
              <p className="text-xs text-slate-500">Select or drop the video file you wish to translate & dub.</p>
            </div>

            {!file ? (
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={handleBrowse}
                className="border-2 border-dashed border-purple-200 hover:border-purple-500 bg-purple-50/40 hover:bg-purple-50/80 rounded-3xl p-8 sm:p-12 text-center space-y-4 cursor-pointer transition-all group"
              >
                <div className="w-16 h-16 rounded-2xl bg-white text-purple-600 flex items-center justify-center mx-auto shadow-md group-hover:scale-110 transition-transform">
                  <Upload className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <p className="text-base font-bold text-slate-900">Drop your video here, or <span className="text-purple-600 underline">Browse Files</span></p>
                  <p className="text-xs text-slate-400">Supported formats: MP4, MOV, AVI, MKV (Up to 500 MB)</p>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between gap-4">
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
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    ✓ Uploaded 100%
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

            <div className="flex justify-end pt-4 border-t border-slate-100">
              <button
                onClick={() => file && setCurrentStep(2)}
                disabled={!file}
                className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm px-6 py-3 rounded-xl shadow-md shadow-purple-600/20 disabled:opacity-50 transition-all"
              >
                <span>Continue to Language Selection</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* STEP 2: LANGUAGE SELECTION */}
        {currentStep === 2 && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs"
          >
            <div className="text-center space-y-1">
              <h2 className="text-lg font-bold text-slate-900">Step 2: Choose Source & Target Language</h2>
              <p className="text-xs text-slate-500">Specify the spoken language in the video and your target dubbed language.</p>
            </div>

            {/* Translation Direction Banner */}
            <div className="p-4 bg-gradient-to-r from-purple-50 via-indigo-50 to-cyan-50 border border-purple-100 rounded-2xl flex items-center justify-center gap-4 text-sm font-bold text-slate-800">
              <span className="px-3 py-1 bg-white rounded-lg border border-slate-200 shadow-2xs text-slate-900">{sourceLang}</span>
              <span className="text-purple-600 font-extrabold text-lg">→</span>
              <span className="px-3 py-1 bg-purple-600 text-white rounded-lg shadow-2xs font-extrabold">{targetLang}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Source Language Selector */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Source Language</label>
                <select
                  value={sourceLang}
                  onChange={(e) => setSourceLang(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-purple-500 text-slate-900"
                >
                  <option value="English">English (Auto-Detect Speech)</option>
                  <option value="Telugu">Telugu (తెలుగు)</option>
                  <option value="Hindi">Hindi (हिंदी)</option>
                  <option value="Tamil">Tamil (தமிழ்)</option>
                  <option value="Spanish">Spanish (Español)</option>
                </select>
              </div>

              {/* Target Language Selector */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-purple-700 uppercase tracking-wider">Target Dubbed Language</label>
                <select
                  value={targetLang}
                  onChange={(e) => setTargetLang(e.target.value)}
                  className="w-full p-3 bg-purple-50 border border-purple-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-purple-500 text-purple-950"
                >
                  {popularLanguages.map((lang) => (
                    <option key={lang} value={lang}>{lang}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Popular Quick Languages */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-bold text-slate-500">Quick Target Pick:</span>
              <div className="flex flex-wrap gap-2">
                {popularLanguages.map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setTargetLang(lang)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      targetLang === lang
                        ? "bg-purple-600 text-white font-bold shadow-xs"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>

            {/* Featured Multilingual Dubbing Collection Cards */}
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  <span>Popular Dubbing Collections & Presets</span>
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Select a pre-configured multilingual collection card below to instantly set both source and target dubbing languages with optimal neural voice models.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 pt-1">
                {dubbingCollections.map((col) => {
                  const isActive = sourceLang === col.source && targetLang === col.target;
                  return (
                    <FileCard
                      key={col.pair}
                      formatFile={col.pair}
                      active={isActive}
                      onClick={() => {
                        setSourceLang(col.source);
                        setTargetLang(col.target);
                      }}
                      className="w-full flex justify-center"
                    />
                  );
                })}
              </div>
            </div>

            <div className="flex justify-between pt-4 border-t border-slate-100">
              <button
                onClick={() => setCurrentStep(1)}
                className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                ← Back
              </button>
              <button
                onClick={() => setCurrentStep(3)}
                className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm px-6 py-3 rounded-xl shadow-md shadow-purple-600/20 transition-all"
              >
                <span>Continue to Voice Selection</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* STEP 3: VOICE SELECTION */}
        {currentStep === 3 && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs"
          >
            <div className="text-center space-y-1">
              <h2 className="text-lg font-bold text-slate-900">Step 3: Select Localized Voice Profile</h2>
              <p className="text-xs text-slate-500">Choose between cloning the speaker's original voice or choosing an AI voice.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Option A: Preserve Original Speaker Voice */}
              <div
                onClick={() => {
                  setVoiceMode("preserve");
                  setSelectedVoice("Original Speaker Voice Clone (Zero-Shot)");
                }}
                className={`p-5 rounded-2xl border-2 cursor-pointer transition-all space-y-3 ${
                  voiceMode === "preserve"
                    ? "border-purple-600 bg-purple-50/60 shadow-sm"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
                    <Mic2 className="w-5 h-5 text-purple-600" />
                    <span>Preserve Original Speaker Voice</span>
                  </div>
                  {voiceMode === "preserve" && <Check className="w-5 h-5 text-purple-600" />}
                </div>
                <p className="text-xs text-slate-600">
                  Extracts speaker timbre & clone parameters to speak {targetLang} in the original speaker's exact voice.
                </p>
                <span className="inline-block text-[10px] font-bold bg-purple-100 text-purple-700 px-2.5 py-0.5 rounded-full">
                  Recommended for Localization
                </span>
              </div>

              {/* Option B: AI Generated Studio Voices */}
              <div
                onClick={() => {
                  setVoiceMode("ai_generated");
                  setSelectedVoice("Ananya - Professional Female (Telugu)");
                }}
                className={`p-5 rounded-2xl border-2 cursor-pointer transition-all space-y-3 ${
                  voiceMode === "ai_generated"
                    ? "border-purple-600 bg-purple-50/60 shadow-sm"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
                    <Sparkles className="w-5 h-5 text-indigo-600" />
                    <span>AI Generated Studio Voices</span>
                  </div>
                  {voiceMode === "ai_generated" && <Check className="w-5 h-5 text-purple-600" />}
                </div>
                <p className="text-xs text-slate-600">
                  Choose from our studio voice library with custom emotions, pitch shifts, and accent controls.
                </p>
                <span className="inline-block text-[10px] font-bold bg-indigo-100 text-indigo-700 px-2.5 py-0.5 rounded-full">
                  12 Studio Voices Available
                </span>
              </div>
            </div>

            {/* AI Studio Voice Selection List if mode is AI Generated */}
            {voiceMode === "ai_generated" && (
              <div className="space-y-3 pt-2">
                <span className="text-xs font-bold text-slate-700">Select Studio Voice for {targetLang}:</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { name: "Ananya", gender: "Female", style: "Warm & Academic", emotion: "High" },
                    { name: "Vijay", gender: "Male", style: "Authoritative News", emotion: "High" },
                    { name: "Srinivas", gender: "Male", style: "Conversational Podcast", emotion: "Medium" },
                    { name: "Kavya", gender: "Female", style: "Narrative & Clear", emotion: "High" },
                  ].map((v) => (
                    <div
                      key={v.name}
                      onClick={() => setSelectedVoice(`${v.name} - ${v.gender} (${targetLang})`)}
                      className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer text-xs ${
                        selectedVoice.includes(v.name)
                          ? "border-purple-600 bg-purple-100/60 font-bold"
                          : "border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      <div>
                        <div className="font-bold text-slate-900">{v.name} ({v.gender})</div>
                        <div className="text-[11px] text-slate-500">{v.style}</div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setPlayingVoiceSample(playingVoiceSample === v.name ? null : v.name);
                        }}
                        className="p-2 bg-purple-50 text-purple-700 hover:bg-purple-200 rounded-lg text-[10px] font-bold flex items-center gap-1"
                      >
                        {playingVoiceSample === v.name ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                        <span>Sample</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-between pt-4 border-t border-slate-100">
              <button
                onClick={() => setCurrentStep(2)}
                className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                ← Back
              </button>
              <button
                onClick={() => setCurrentStep(4)}
                className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm px-6 py-3 rounded-xl shadow-md shadow-purple-600/20 transition-all"
              >
                <span>Continue to Advanced Options</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* STEP 4: ADVANCED OPTIONS */}
        {currentStep === 4 && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs"
          >
            <div className="text-center space-y-1">
              <h2 className="text-lg font-bold text-slate-900">Step 4: Advanced AI Enhancement Options</h2>
              <p className="text-xs text-slate-500">Fine-tune lip sync, emotion preservation, and multi-speaker diarization.</p>
            </div>

            <div className="space-y-3">
              {[
                {
                  id: "lipSync",
                  label: "Lip Synchronization (Wav2Lip HD)",
                  desc: "Synchronize speaker mouth movements with the generated translated speech.",
                  state: lipSync,
                  setState: setLipSync,
                  badge: "HD Neural Mesh",
                },
                {
                  id: "emotion",
                  label: "Emotion Preservation",
                  desc: "Preserve the emotional characteristics & prosody of original speech in translation.",
                  state: emotionPreservation,
                  setState: setEmotionPreservation,
                  badge: "Acoustic Matching",
                },
                {
                  id: "bgm",
                  label: "Background Music Preservation",
                  desc: "Isolate background music and sound effects using Demucs AI stem separation.",
                  state: bgmPreservation,
                  setState: setBgmPreservation,
                  badge: "BGM Preserved",
                },
                {
                  id: "timing",
                  label: "Speech Timing Optimization",
                  desc: "Adjust speech speed to match original video scene duration perfectly.",
                  state: speechTiming,
                  setState: setSpeechTiming,
                },
                {
                  id: "cloning",
                  label: "Zero-Shot Voice Cloning",
                  desc: "Clone original voice nuances across multilingual translation.",
                  state: voiceCloning,
                  setState: setVoiceCloning,
                },
                {
                  id: "speaker",
                  label: "Multi-Speaker Diarization & Voice Mapping",
                  desc: "Detect multiple speakers and map separate voice clones to each speaker.",
                  state: multiSpeakerMapping,
                  setState: setMultiSpeakerMapping,
                },
              ].map((opt) => (
                <div
                  key={opt.id}
                  className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-start justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-slate-900">{opt.label}</span>
                      {opt.badge && (
                        <span className="text-[10px] font-bold bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                          {opt.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500">{opt.desc}</p>
                  </div>

                  <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                    <input
                      type="checkbox"
                      checked={opt.state}
                      onChange={(e) => opt.setState(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>
              ))}
            </div>

            <div className="flex justify-between pt-4 border-t border-slate-100">
              <button
                onClick={() => setCurrentStep(3)}
                className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                ← Back
              </button>
              <button
                onClick={() => setCurrentStep(5)}
                className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm px-6 py-3 rounded-xl shadow-md shadow-purple-600/20 transition-all"
              >
                <span>Continue to Summary Review</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* STEP 5: REVIEW */}
        {currentStep === 5 && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs"
          >
            <div className="text-center space-y-1">
              <h2 className="text-lg font-bold text-slate-900">Step 5: Review Dubbing Configuration</h2>
              <p className="text-xs text-slate-500">Confirm details before submitting your project to the neural dubbing pipeline.</p>
            </div>

            <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 block font-semibold">Source Video</span>
                  <span className="font-bold text-slate-900 truncate block">{file?.name}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-semibold">Language Direction</span>
                  <span className="font-bold text-purple-700">{sourceLang} → {targetLang}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-semibold">Voice Profile</span>
                  <span className="font-bold text-slate-900 truncate block">{selectedVoice}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-semibold">Lip Sync</span>
                  <span className="font-bold text-emerald-600">{lipSync ? "Enabled (Wav2Lip HD)" : "Disabled"}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-semibold">Emotion Preservation</span>
                  <span className="font-bold text-emerald-600">{emotionPreservation ? "Enabled" : "Disabled"}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-semibold">Estimated Time</span>
                  <span className="font-bold text-indigo-600">~ 2 min 30 sec</span>
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-4 border-t border-slate-100">
              <button
                onClick={() => setCurrentStep(4)}
                className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                ← Back
              </button>
              <button
                onClick={startGenerating}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 text-white font-extrabold text-sm px-8 py-3.5 rounded-2xl shadow-lg shadow-purple-600/30 transition-all hover:scale-105"
              >
                <Sparkles className="w-5 h-5" />
                <span>Generate Dubbed Video</span>
              </button>
            </div>
          </motion.div>
        )}

        {/* STEP 6: PROCESSING PIPELINE */}
        {currentStep === 6 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 text-white space-y-8 shadow-2xl relative overflow-hidden"
          >
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-950 border border-purple-800 rounded-full text-xs font-bold text-purple-300">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-purple-400" />
                <span>Processing Neural Dubbing Pipeline</span>
              </div>
              <h2 className="text-2xl font-extrabold tracking-tight">Processing Your Multilingual Video</h2>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Do not close this page. Your project will continue processing in the background.
              </p>
            </div>

            {/* Overall Progress Bar */}
            <div className="space-y-2 bg-slate-950 p-6 rounded-2xl border border-slate-800">
              <div className="flex justify-between items-center text-xs font-bold font-mono">
                <span className="text-slate-400">OVERALL PROGRESS</span>
                <span className="text-purple-400 text-lg">{processingProgress}%</span>
              </div>
              <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden p-0.5">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-400 rounded-full transition-all duration-300"
                  style={{ width: `${processingProgress}%` }}
                ></div>
              </div>
              <div className="flex justify-between items-center text-[11px] text-slate-500 pt-1">
                <span>Estimated Time Remaining: ~45s</span>
                <span>Target: {targetLang}</span>
              </div>
            </div>

            {/* Pipeline Step Checklist */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Neural Pipeline Stages</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {pipelineStages.map((stg, i) => {
                  const isDone = i < currentPipelineStage;
                  const isCurrent = i === currentPipelineStage;
                  return (
                    <div
                      key={i}
                      className={`p-3 rounded-xl border text-xs flex items-center gap-3 transition-all ${
                        isDone
                          ? "bg-purple-950/40 border-purple-800 text-purple-200"
                          : isCurrent
                          ? "bg-purple-900/60 border-purple-500 text-white font-bold ring-1 ring-purple-500"
                          : "bg-slate-950/40 border-slate-800/80 text-slate-600"
                      }`}
                    >
                      <div className="shrink-0">
                        {isDone ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        ) : isCurrent ? (
                          <RefreshCw className="w-4 h-4 text-purple-400 animate-spin" />
                        ) : (
                          <div className="w-4 h-4 rounded-full border border-slate-700"></div>
                        )}
                      </div>
                      <div>
                        <div className="font-semibold">{stg.title}</div>
                        <div className="text-[10px] opacity-70">{stg.desc}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </AppLayout>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  PlusCircle,
  Film,
  CheckCircle2,
  Clock,
  Zap,
  ArrowRight,
  Play,
  Download,
  Trash2,
  Sparkles,
  RefreshCw,
  FileVideo,
  Layers,
  Globe2,
  Mic2,
  Users,
  HeartPulse,
  Video,
  Cpu,
  ShieldCheck,
  FileText
} from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import { ImagesBadge } from "@/components/ui/images-badge";

const BADGE_IMAGES = [
  { src: "/Telugu-Movies.jpg", alt: "Telugu Cinema Dubbing" },
  { src: "/Hindhi-Movies.jpg", alt: "Hindi Cinema Localization" },
  { src: "/Japanies-Movie.jpg", alt: "Japanese Anime Voice Sync" },
  { src: "/Spider-Man.jpg", alt: "Hollywood Film Dubbing" }
];

interface Project {
  id: string;
  name: string;
  thumbnail: string;
  originalLanguage: string;
  targetLanguage: string;
  duration: string;
  status: "Draft" | "Uploading" | "Processing" | "Completed" | "Failed";
  createdDate: string;
  progressPercentage?: number;
}

export default function DashboardPage() {
  const [userName, setUserName] = useState("Creator");
  const [projects, setProjects] = useState<Project[]>([
    {
      id: "dub-948201",
      name: "AI & Quantum Computing Intro.mp4",
      thumbnail: "/Telugu-Movies.jpg",
      originalLanguage: "English",
      targetLanguage: "Telugu (తెలుగు)",
      duration: "04:12",
      status: "Completed",
      createdDate: "Sep 12, 2026",
    },
    {
      id: "dub-948202",
      name: "Global Education Keynote.mp4",
      thumbnail: "/Hindhi-Movies.jpg",
      originalLanguage: "English",
      targetLanguage: "Hindi (हिंदी)",
      duration: "08:45",
      status: "Processing",
      progressPercentage: 68,
      createdDate: "Sep 12, 2026",
    },
    {
      id: "dub-948203",
      name: "Product Walkthrough Reel.mp4",
      thumbnail: "/Japanies-Movie.jpg",
      originalLanguage: "English",
      targetLanguage: "Tamil (தமிழ்)",
      duration: "02:30",
      status: "Draft",
      createdDate: "Sep 11, 2026",
    },
  ]);

  useEffect(() => {
    const storedUser = localStorage.getItem("dubzeek_user");
    if (storedUser) {
      try {
        const u = JSON.parse(storedUser);
        if (u.full_name) {
          setUserName(u.full_name.split(" ")[0]);
        }
      } catch (e) {
        console.error("Failed to parse user", e);
      }
    }
  }, []);

  const stats = [
    {
      label: "Total Dubbing Projects",
      value: `${projects.length} Active`,
      subtext: "9 Completed • 1 Processing",
      icon: Film,
      color: "text-purple-600",
      bg: "bg-purple-50",
      border: "border-purple-100"
    },
    {
      label: "Available Quota",
      value: "45 / 60 Min",
      subtext: "75% Free Tier Used",
      icon: Zap,
      color: "text-cyan-600",
      bg: "bg-cyan-50",
      border: "border-cyan-100"
    },
    {
      label: "Language Coverage",
      value: "30+ Languages",
      subtext: "Zero-Shot Voice Cloning",
      icon: Globe2,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
      border: "border-indigo-100"
    },
  ];

  const features = [
    {
      icon: Users,
      title: "Multi-Speaker Diarization",
      desc: "Identifies distinct speakers in scene & maps unique voice cloning profiles.",
      badge: "Speaker Diarization"
    },
    {
      icon: HeartPulse,
      title: "Emotion & Prosody Sync",
      desc: "Preserves emotional pitch contours, authority, and excitement in target audio.",
      badge: "Prosody Match"
    },
    {
      icon: Video,
      title: "HD Lip Synchronization",
      desc: "Aligns actor mouth movements with translated target speech in 1080p60.",
      badge: "Wav2Lip HD"
    },
  ];

  const getStatusBadge = (status: Project["status"]) => {
    switch (status) {
      case "Completed":
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200">✓ Completed</span>;
      case "Processing":
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-amber-100 text-amber-800 border border-amber-200"><RefreshCw className="w-3 h-3 animate-spin" /> Processing</span>;
      case "Uploading":
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-blue-100 text-blue-800 border border-blue-200">Uploading</span>;
      case "Draft":
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-slate-100 text-slate-800 border border-slate-200">Draft</span>;
      case "Failed":
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-red-100 text-red-800 border border-red-200">Failed</span>;
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this project?")) {
      setProjects((prev) => prev.filter((p) => p.id !== id));
    }
  };

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* ONE LINE HEROSECTION STYLE HEADING */}
        <div className="text-center max-w-5xl mx-auto space-y-4 pt-2">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center"
          >
            <ImagesBadge
              images={BADGE_IMAGES}
              maxVisible={3}
              revealCount={3}
              label={`Welcome back, ${userName}! • Next-Gen AI Video Studio`}
              size="md"
              shape="circle"
            />
          </motion.div>

          {/* Single Line Hero Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight whitespace-nowrap overflow-hidden text-ellipsis px-2"
          >
            Dub Any Video Into <span className="text-gradient">Multiple Languages</span> Without Losing Speaker Emotion
          </motion.h1>

          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto font-medium">
            AI-powered voice cloning, multi-speaker diarization, acoustic prosody transfer, and Wav2Lip HD synchronization.
          </p>

          {/* Primary Dominant CTA */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="pt-2"
          >
            <Link
              href="/create-dubbing"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 text-white font-extrabold text-sm sm:text-base px-8 py-4 rounded-2xl shadow-xl shadow-purple-600/30 hover:shadow-purple-600/50 transition-all hover:scale-105 active:scale-95 border border-purple-400/30"
            >
              <Sparkles className="w-5 h-5 text-yellow-300 animate-pulse" />
              <span>Create New Dubbing Project</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </motion.div>
        </div>

        {/* 3 COLUMNS LOOK: PROFESSIONAL LEVEL METRICS (3 COLUMNS) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((st, idx) => {
            const Icon = st.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * idx }}
                className={`glass-card glass-card-hover p-6 rounded-3xl bg-white border ${st.border} shadow-sm space-y-3 relative overflow-hidden group`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{st.label}</span>
                  <div className={`w-10 h-10 rounded-2xl ${st.bg} ${st.color} flex items-center justify-center font-bold shadow-2xs group-hover:scale-110 transition-transform`}>
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  {st.value}
                </div>
                <p className="text-xs font-medium text-slate-500">{st.subtext}</p>
              </motion.div>
            );
          })}
        </div>

        {/* 3 COLUMNS LOOK: ALL FEATURES CARDS (3 COLUMNS) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-purple-700 bg-purple-100 px-3 py-1 rounded-full border border-purple-200">
              Neural Dubbing Engine Capabilities
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="glass-card glass-card-hover p-6 rounded-3xl bg-white border border-slate-200 hover:border-purple-300 relative group flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-110 group-hover:bg-purple-600 group-hover:text-white transition-all shadow-2xs">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between">
                        <h3 className="text-base font-bold text-slate-900 group-hover:text-purple-700 transition-colors">
                          {feat.title}
                        </h3>
                      </div>
                      <p className="text-xs text-slate-600 mt-2 leading-relaxed font-normal">
                        {feat.desc}
                      </p>
                    </div>
                  </div>
                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full">
                      {feat.badge}
                    </span>
                    <span className="text-xs font-bold text-purple-600 group-hover:translate-x-1 transition-transform">
                      Active →
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* 3 COLUMNS LOOK: RECENT PROJECTS GRID (3 COLUMNS) */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Recent Dubbing Projects</h2>
            {projects.length > 0 && (
              <Link href="/projects" className="text-xs font-bold text-purple-600 hover:underline">
                View All Projects ({projects.length}) →
              </Link>
            )}
          </div>

          {projects.length === 0 ? (
            /* Empty State Onboarding Component */
            <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 text-center max-w-3xl mx-auto space-y-6 shadow-xs">
              <div className="w-16 h-16 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto border border-purple-100">
                <Film className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-bold text-slate-900">Your first multilingual video starts here.</h3>
                <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
                  Upload a video and Dubzeek will automatically handle speech extraction, translation, voice synthesis, and lip sync.
                </p>
              </div>

              {/* Step Pipeline Preview */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-xl mx-auto text-left py-2">
                {[
                  { title: "1. Extract Audio", icon: FileVideo },
                  { title: "2. Transcribe Speech", icon: FileText },
                  { title: "3. Translate Dialogue", icon: Globe2 },
                  { title: "4. Generate Voices", icon: Mic2 },
                  { title: "5. Synchronize Audio", icon: Layers },
                  { title: "6. Render Video", icon: Sparkles },
                ].map((step, i) => {
                  const StepIcon = step.icon;
                  return (
                    <div key={i} className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center gap-2 text-xs font-semibold text-slate-700">
                      <StepIcon className="w-4 h-4 text-purple-600 shrink-0" />
                      <span>{step.title}</span>
                    </div>
                  );
                })}
              </div>

              <Link
                href="/create-dubbing"
                className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm px-8 py-3.5 rounded-2xl shadow-md shadow-purple-600/20 transition-all hover:scale-105"
              >
                <PlusCircle className="w-5 h-5" />
                <span>Create Your First Dubbing</span>
              </Link>
            </div>
          ) : (
            /* 3 COLUMNS LOOK: PROJECTS GRID */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="glass-card glass-card-hover bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-4 hover:border-purple-300 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    {/* Thumbnail & Status Badge */}
                    <div className="relative aspect-video bg-slate-900 rounded-2xl overflow-hidden group">
                      <img
                        src={project.thumbnail}
                        alt={project.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                      />
                      <div className="absolute top-2.5 left-2.5">
                        {getStatusBadge(project.status)}
                      </div>
                      <div className="absolute bottom-2.5 right-2.5 px-2.5 py-0.5 bg-black/80 backdrop-blur-xs text-white text-[10px] font-mono font-bold rounded-lg border border-white/20">
                        {project.duration}
                      </div>
                    </div>

                    {/* Project Metadata */}
                    <div>
                      <h3 className="font-bold text-sm text-slate-900 truncate" title={project.name}>
                        {project.name}
                      </h3>
                      <div className="flex items-center justify-between text-xs text-slate-500 mt-1">
                        <span>{project.originalLanguage} → <strong className="text-purple-700 font-extrabold">{project.targetLanguage}</strong></span>
                        <span className="text-[11px] text-slate-400 font-medium">{project.createdDate}</span>
                      </div>
                    </div>

                    {/* Progress Bar for Processing Projects */}
                    {project.status === "Processing" && (
                      <div className="space-y-1 pt-1">
                        <div className="flex justify-between text-[11px] font-bold text-amber-700">
                          <span>Synthesizing Voice & Lip Sync...</span>
                          <span>{project.progressPercentage}%</span>
                        </div>
                        <div className="w-full h-2 bg-amber-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-amber-500 to-purple-600 rounded-full transition-all duration-500"
                            style={{ width: `${project.progressPercentage}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions Footer */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <Link
                      href={`/projects/${project.id}`}
                      className="font-extrabold text-purple-600 hover:text-purple-800 flex items-center gap-1 group/btn"
                    >
                      <span>Open Studio Project</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                    </Link>

                    <div className="flex items-center gap-1">
                      {project.status === "Completed" && (
                        <button
                          onClick={() => alert("Downloading Dubbed Video (.MP4)...")}
                          className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
                          title="Download Dubbed Video"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(project.id)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                        title="Delete Project"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </AppLayout>
  );
}

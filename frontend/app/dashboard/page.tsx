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
  FolderKanban,
  BarChart3,
  Settings,
  HelpCircle,
  FileText
} from "lucide-react";
import AppLayout from "../../components/layout/AppLayout";
import { ImagesBadge } from "../../components/ui/images-badge";

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
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    fetch(`${apiBaseUrl}/api/video/list`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const formatted: Project[] = data.map((item: any) => ({
            id: item.id,
            name: item.original_filename || "Untitled Video.mp4",
            thumbnail: "/cropped_circle_image.png",
            originalLanguage: item.source_language || "English",
            targetLanguage: item.target_language || "Telugu",
            duration: item.file_size ? `${(item.file_size / (1024 * 1024)).toFixed(1)} MB` : "HD Video",
            status: item.status === "transcribed" ? "Completed" : "Completed",
            createdDate: item.created_at ? new Date(item.created_at).toLocaleDateString() : "Sep 2026",
          }));
          setProjects(formatted);
        } else {
          setProjects([]);
        }
      })
      .catch(() => setProjects([]))
      .finally(() => setIsLoading(false));
  }, []);

  // Card-Style Navigation Grid Tiles (Replacing the left-side sidebar)
  const navCardTiles = [
    {
      title: "Create New Dubbing",
      desc: "Upload video, select target language (Telugu/Hindi/etc.), clone voice & lip sync.",
      href: "/create-dubbing",
      icon: PlusCircle,
      badge: "Guided Workflow",
      highlight: true,
      accent: "from-purple-600 to-indigo-600 text-white"
    },
    {
      title: "Dubbing Projects",
      desc: "Manage, view, and organize all your video dubbing projects.",
      href: "/projects",
      icon: FolderKanban,
      badge: `${projects.length} Active`,
      accent: "text-purple-600 bg-purple-50"
    },
    {
      title: "My Rendered Videos",
      desc: "Stream, scrub, and download your completed 1080p MP4 videos.",
      href: "/videos",
      icon: Video,
      badge: "9 Rendered",
      accent: "text-cyan-600 bg-cyan-50"
    },
    {
      title: "Neural Voice Library",
      desc: "Explore studio neural voices, prosody matching & speaker voice clones.",
      href: "/voice-library",
      icon: Mic2,
      badge: "Zero-Shot Clone",
      accent: "text-indigo-600 bg-indigo-50"
    },
    {
      title: "Language Matrix",
      desc: "View supported Indian regional and global language translation models.",
      href: "/languages",
      icon: Globe2,
      badge: "30+ Languages",
      accent: "text-emerald-600 bg-emerald-50"
    },
    {
      title: "Usage & Compute Quota",
      desc: "Monitor your monthly compute minutes, rendering logs, and plan limits.",
      href: "/usage",
      icon: BarChart3,
      badge: "45 / 60 Min",
      accent: "text-amber-600 bg-amber-50"
    },
    {
      title: "Account Settings",
      desc: "Update your profile preferences, primary language, and security options.",
      href: "/settings",
      icon: Settings,
      accent: "text-slate-700 bg-slate-100"
    },
    {
      title: "Help & Walkthroughs",
      desc: "Access video dubbing tutorials, documentation, and support.",
      href: "/help",
      icon: HelpCircle,
      accent: "text-slate-700 bg-slate-100"
    },
  ];

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
      <div className="max-w-7xl mx-auto space-y-12 pb-16">
        
        {/* HEROSECTION STYLE HEADING (SINGLE LINE) */}
        <div className="text-center max-w-5xl mx-auto space-y-4 pt-4">
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

        {/* NAVIGATION CARD TILES (REPLACING THE LEFT SIDEBAR) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-600" />
              <span>Platform Studio Navigation</span>
            </h2>
            <span className="text-xs font-bold text-slate-400">Select any workspace card tile to launch</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {navCardTiles.map((card, idx) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <Link
                    href={card.href}
                    className={`block h-full p-6 rounded-3xl border transition-all duration-300 relative group flex flex-col justify-between ${
                      card.highlight
                        ? "bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-900 text-white border-purple-700 shadow-xl shadow-purple-900/30 hover:scale-[1.03]"
                        : "glass-card glass-card-hover bg-white border-slate-200 hover:border-purple-300"
                    }`}
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold shadow-2xs group-hover:scale-110 transition-transform ${
                          card.highlight ? "bg-white/20 text-white" : card.accent
                        }`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        {card.badge && (
                          <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                            card.highlight
                              ? "bg-purple-500/30 text-purple-200 border border-purple-400/40"
                              : "bg-slate-100 text-slate-700"
                          }`}>
                            {card.badge}
                          </span>
                        )}
                      </div>

                      <div>
                        <h3 className={`text-base font-extrabold tracking-tight ${
                          card.highlight ? "text-white" : "text-slate-900 group-hover:text-purple-700"
                        }`}>
                          {card.title}
                        </h3>
                        <p className={`text-xs mt-2 leading-relaxed font-normal ${
                          card.highlight ? "text-purple-200" : "text-slate-500"
                        }`}>
                          {card.desc}
                        </p>
                      </div>
                    </div>

                    <div className="pt-4 mt-4 border-t border-slate-100/30 flex items-center justify-between text-xs font-bold">
                      <span className={card.highlight ? "text-purple-200" : "text-purple-600"}>Launch Studio</span>
                      <ArrowRight className={`w-4 h-4 group-hover:translate-x-1 transition-transform ${
                        card.highlight ? "text-white" : "text-purple-600"
                      }`} />
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* 3 COLUMNS LOOK: SUMMARY STATS (3 COLUMNS) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((st, idx) => {
            const Icon = st.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * idx }}
                className={`glass-card glass-card-hover p-6 rounded-3xl bg-white border ${st.border} shadow-xs space-y-3 relative overflow-hidden group`}
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

        {/* 3 COLUMNS LOOK: RECENT PROJECTS GRID (3 COLUMNS) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Recent Dubbing Projects</h2>
            {projects.length > 0 && (
              <Link href="/projects" className="text-xs font-bold text-purple-600 hover:underline">
                View All Projects ({projects.length}) →
              </Link>
            )}
          </div>

          {projects.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-3xl p-10 text-center space-y-3 shadow-2xs">
              <Film className="w-10 h-10 text-purple-400 mx-auto" />
              <h3 className="text-base font-bold text-slate-900">No Active Projects</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                You have no active video dubbing projects. Create a new dubbing project to get started with zero-shot voice cloning!
              </p>
              <Link
                href="/create-dubbing"
                className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-xs"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Create New Dubbing Project</span>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="glass-card glass-card-hover bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-4 hover:border-purple-300 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
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

                    <div>
                      <h3 className="font-bold text-sm text-slate-900 truncate" title={project.name}>
                        {project.name}
                      </h3>
                      <div className="flex items-center justify-between text-xs text-slate-500 mt-1">
                        <span>{project.originalLanguage} → <strong className="text-purple-700 font-extrabold">{project.targetLanguage}</strong></span>
                        <span className="text-[11px] text-slate-400 font-medium">{project.createdDate}</span>
                      </div>
                    </div>

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

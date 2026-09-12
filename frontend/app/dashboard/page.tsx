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
  ExternalLink,
  Sparkles,
  RefreshCw,
  AlertCircle,
  FileVideo,
  Layers,
  Globe2,
  Mic2,
  FileText
} from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";

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
      thumbnail: "/cropped_circle_image.png",
      originalLanguage: "English",
      targetLanguage: "Telugu",
      duration: "04:12",
      status: "Completed",
      createdDate: "Sep 12, 2026",
    },
    {
      id: "dub-948202",
      name: "Global Education Keynote.mp4",
      thumbnail: "/cropped_circle_image.png",
      originalLanguage: "English",
      targetLanguage: "Hindi",
      duration: "08:45",
      status: "Processing",
      progressPercentage: 68,
      createdDate: "Sep 12, 2026",
    },
    {
      id: "dub-948203",
      name: "Product Walkthrough Reel.mp4",
      thumbnail: "/cropped_circle_image.png",
      originalLanguage: "English",
      targetLanguage: "Tamil",
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
    { label: "Total Projects", value: projects.length, icon: Film, color: "text-purple-600", bg: "bg-purple-50" },
    { label: "Completed Videos", value: projects.filter((p) => p.status === "Completed").length, icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Processing Videos", value: projects.filter((p) => p.status === "Processing").length, icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Available Minutes", value: "45 min", icon: Zap, color: "text-indigo-600", bg: "bg-indigo-50" },
  ];

  const getStatusBadge = (status: Project["status"]) => {
    switch (status) {
      case "Completed":
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">✓ Completed</span>;
      case "Processing":
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-700"><RefreshCw className="w-3 h-3 animate-spin" /> Processing</span>;
      case "Uploading":
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-700">Uploading</span>;
      case "Draft":
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700">Draft</span>;
      case "Failed":
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-700">Failed</span>;
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this project?")) {
      setProjects((prev) => prev.filter((p) => p.id !== id));
    }
  };

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Overview & Primary CTA */}
        <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-purple-800/40">
          <div className="space-y-2 max-w-xl z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-500/20 border border-purple-400/30 rounded-full text-xs font-semibold text-purple-200 backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5 text-purple-300" />
              <span>AI Multilingual Video Localization</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {userName}! 👋
            </h1>
            <p className="text-sm text-slate-300">
              Turn your videos into any language with AI voice cloning, lip sync, and emotion preservation.
            </p>
          </div>

          {/* Primary Dominant CTA */}
          <Link
            href="/create-dubbing"
            className="z-10 inline-flex items-center gap-3 bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-400 hover:from-purple-600 hover:to-cyan-500 text-white font-extrabold text-sm px-6 py-4 rounded-2xl shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-all hover:scale-[1.02] active:scale-[0.98] shrink-0"
          >
            <PlusCircle className="w-5 h-5" />
            <span>Create New Dubbing</span>
          </Link>
        </div>

        {/* 4 Summary Statistics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-xs space-y-3 hover:border-purple-200 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500">{stat.label}</span>
                  <div className={`p-2.5 rounded-xl ${stat.bg} ${stat.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  {stat.value}
                </div>
              </div>
            );
          })}
        </div>

        {/* Recent Projects / Empty State Onboarding */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">Recent Dubbing Projects</h2>
            {projects.length > 0 && (
              <Link href="/projects" className="text-xs font-semibold text-purple-600 hover:underline">
                View All Projects →
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
            /* Projects Grid List */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4 hover:border-purple-300 hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    {/* Thumbnail & Status Badge */}
                    <div className="relative aspect-video bg-slate-900 rounded-xl overflow-hidden group">
                      <img
                        src={project.thumbnail}
                        alt={project.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
                      />
                      <div className="absolute top-2 left-2">
                        {getStatusBadge(project.status)}
                      </div>
                      <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/70 backdrop-blur-xs text-white text-[10px] font-mono rounded">
                        {project.duration}
                      </div>
                    </div>

                    {/* Project Metadata */}
                    <div>
                      <h3 className="font-bold text-sm text-slate-900 truncate" title={project.name}>
                        {project.name}
                      </h3>
                      <div className="flex items-center justify-between text-xs text-slate-500 mt-1">
                        <span>{project.originalLanguage} → <strong className="text-purple-700 font-bold">{project.targetLanguage}</strong></span>
                        <span className="text-[11px] text-slate-400">{project.createdDate}</span>
                      </div>
                    </div>

                    {/* Progress Bar for Processing Projects */}
                    {project.status === "Processing" && (
                      <div className="space-y-1">
                        <div className="flex justify-between text-[11px] font-semibold text-amber-700">
                          <span>Synthesizing Voice & Lip Sync...</span>
                          <span>{project.progressPercentage}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-amber-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-amber-500 rounded-full transition-all duration-500"
                            style={{ width: `${project.progressPercentage}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions Footer */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/projects/${project.id}`}
                        className="font-bold text-purple-600 hover:text-purple-800 flex items-center gap-1"
                      >
                        <span>Open Project</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>

                    <div className="flex items-center gap-1">
                      {project.status === "Completed" && (
                        <button
                          className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
                          title="Download Dubbed Video"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(project.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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

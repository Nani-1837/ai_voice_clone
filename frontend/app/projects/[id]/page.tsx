"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Play,
  Pause,
  Download,
  Share2,
  Copy,
  RefreshCw,
  Trash2,
  MoreVertical,
  Check,
  Film,
  Volume2,
  FileText,
  Sparkles,
  Globe2,
  Sliders,
  CheckCircle2,
  Edit2
} from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";

export default function ProjectDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params?.id || "dub-948201";

  // Comparison Tab State ("dubbed" | "original")
  const [activeVideo, setActiveVideo] = useState<"dubbed" | "original">("dubbed");
  const [isPlaying, setIsPlaying] = useState(false);

  // Audio & Subtitle Track State
  const [activeAudioTrack, setActiveAudioTrack] = useState<"dubbed" | "original">("dubbed");
  const [activeSubtitle, setActiveSubtitle] = useState<"translated" | "original" | "off">("translated");

  // Secondary Action Modals
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [projectName, setProjectName] = useState("Quantum_Physics_Lecture.mp4");

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto space-y-6 pb-12">
        {/* Top Breadcrumb & Title Bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">{projectName}</h1>
                <button
                  onClick={() => setShowRenameModal(true)}
                  className="p-1 text-slate-400 hover:text-purple-600 rounded-md"
                  title="Rename Project"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-xs text-slate-400">Project ID: #{projectId} • Created Sep 12, 2026</p>
            </div>
          </div>

          {/* Download & Share CTAs */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => alert("Downloading dubbed video (.MP4)...")}
              className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Download Video (.MP4)</span>
            </button>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
              title="Delete Project"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Video Player & Before/After Comparison Card */}
        <div className="bg-slate-900 rounded-3xl p-4 sm:p-6 border border-slate-800 text-white shadow-2xl space-y-4">
          
          {/* Comparison Mode Toggle Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-xl text-xs font-semibold border border-slate-800">
              <button
                onClick={() => setActiveVideo("dubbed")}
                className={`px-4 py-1.5 rounded-lg transition-all ${
                  activeVideo === "dubbed"
                    ? "bg-purple-600 text-white font-bold shadow-xs"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Dubbed Video (Telugu)
              </button>
              <button
                onClick={() => setActiveVideo("original")}
                className={`px-4 py-1.5 rounded-lg transition-all ${
                  activeVideo === "original"
                    ? "bg-slate-800 text-white font-bold shadow-xs"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Original Video (English)
              </button>
            </div>

            {/* AI Enhancement Status Badges */}
            <div className="flex items-center gap-2 text-[11px] font-bold">
              <span className="bg-purple-950 text-purple-300 border border-purple-800 px-2.5 py-1 rounded-full flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
                <span>Lip Sync Enabled (Wav2Lip HD)</span>
              </span>
              <span className="bg-cyan-950 text-cyan-300 border border-cyan-800 px-2.5 py-1 rounded-full flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>Voice Preservation Enabled</span>
              </span>
            </div>
          </div>

          {/* Main Video Viewport */}
          <div className="aspect-video bg-slate-950 rounded-2xl relative overflow-hidden flex flex-col justify-between p-6 border border-slate-800">
            <div className="flex justify-between items-center text-xs text-slate-400 font-mono">
              <span className="bg-black/60 backdrop-blur-xs px-2.5 py-1 rounded">
                MODE: {activeVideo.toUpperCase()} PREVIEW
              </span>
              <span className="text-purple-400 font-bold">ENGLISH → TELUGU DUB</span>
            </div>

            {/* Play Button Overlay */}
            <div className="flex flex-col items-center justify-center my-auto">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-16 h-16 rounded-full bg-purple-600 hover:bg-purple-500 text-white flex items-center justify-center shadow-lg shadow-purple-600/50 transition-transform active:scale-95"
              >
                {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
              </button>
              <p className="text-xs text-slate-300 mt-3 font-medium">
                {isPlaying ? "Playing Synchronized Video & Subtitles..." : "Click Play to Compare Original vs Dubbed Video"}
              </p>
            </div>

            {/* Bottom Scrubbing Status */}
            <div className="flex items-center justify-between text-xs text-slate-400 font-mono pt-2 border-t border-slate-800/80">
              <span>00:04 / 04:12</span>
              <span>1080p60 • Neural Audio Synced</span>
            </div>
          </div>
        </div>

        {/* Audio Tracks & Subtitles Export Panel */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Audio Tracks Box */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-purple-600" />
              <span>Audio Tracks</span>
            </h3>
            <div className="space-y-2 text-xs">
              <button
                onClick={() => setActiveAudioTrack("dubbed")}
                className={`w-full p-3 rounded-xl border flex items-center justify-between text-left font-semibold ${
                  activeAudioTrack === "dubbed"
                    ? "border-purple-600 bg-purple-50 text-purple-900 font-bold"
                    : "border-slate-200 hover:bg-slate-50"
                }`}
              >
                <span>Dubbed Telugu Track (Neural)</span>
                {activeAudioTrack === "dubbed" && <Check className="w-4 h-4 text-purple-600" />}
              </button>
              <button
                onClick={() => setActiveAudioTrack("original")}
                className={`w-full p-3 rounded-xl border flex items-center justify-between text-left font-semibold ${
                  activeAudioTrack === "original"
                    ? "border-purple-600 bg-purple-50 text-purple-900 font-bold"
                    : "border-slate-200 hover:bg-slate-50"
                }`}
              >
                <span>Original English Vocal Track</span>
                {activeAudioTrack === "original" && <Check className="w-4 h-4 text-purple-600" />}
              </button>
            </div>
          </div>

          {/* Subtitles Box */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-600" />
              <span>Subtitle Track</span>
            </h3>
            <div className="space-y-2 text-xs">
              <button
                onClick={() => setActiveSubtitle("translated")}
                className={`w-full p-3 rounded-xl border flex items-center justify-between text-left font-semibold ${
                  activeSubtitle === "translated"
                    ? "border-purple-600 bg-purple-50 text-purple-900 font-bold"
                    : "border-slate-200 hover:bg-slate-50"
                }`}
              >
                <span>Translated Subtitles (Telugu)</span>
                {activeSubtitle === "translated" && <Check className="w-4 h-4 text-purple-600" />}
              </button>
              <button
                onClick={() => setActiveSubtitle("original")}
                className={`w-full p-3 rounded-xl border flex items-center justify-between text-left font-semibold ${
                  activeSubtitle === "original"
                    ? "border-purple-600 bg-purple-50 text-purple-900 font-bold"
                    : "border-slate-200 hover:bg-slate-50"
                }`}
              >
                <span>Original Subtitles (English)</span>
                {activeSubtitle === "original" && <Check className="w-4 h-4 text-purple-600" />}
              </button>
            </div>
          </div>

          {/* Export Downloads Box */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Download className="w-4 h-4 text-cyan-600" />
              <span>Downloads & Export</span>
            </h3>
            <div className="space-y-2 text-xs">
              <button
                onClick={() => alert("Downloading Video (.MP4)...")}
                className="w-full p-2.5 bg-purple-50 hover:bg-purple-100 text-purple-800 font-bold rounded-xl flex items-center justify-between"
              >
                <span>Download Video (.MP4)</span>
                <Download className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => alert("Downloading Dubbed Audio (.MP3)...")}
                className="w-full p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-800 font-semibold rounded-xl flex items-center justify-between"
              >
                <span>Download Audio (.MP3)</span>
                <Download className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => alert("Downloading Subtitles (.SRT)...")}
                className="w-full p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-800 font-semibold rounded-xl flex items-center justify-between"
              >
                <span>Download Subtitles (.SRT)</span>
                <Download className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>

        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {showDeleteModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
                className="bg-white border border-slate-200 rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl text-center"
              >
                <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto">
                  <Trash2 className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-slate-900">Delete Project?</h3>
                  <p className="text-xs text-slate-500">
                    Are you sure you want to delete "{projectName}"? This action cannot be undone.
                  </p>
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      setShowDeleteModal(false);
                      router.push("/dashboard");
                    }}
                    className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-sm"
                  >
                    Yes, Delete
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AppLayout>
  );
}

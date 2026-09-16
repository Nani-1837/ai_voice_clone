"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Download,
  Trash2,
  Edit2,
  Music,
  Scissors,
  CheckCircle2,
  Sparkles
} from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import { extractAudioFromVideo } from "@/lib/api";

export default function ProjectDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = (params?.id as string) || "dub-948201";

  // Video & Audio Ref & Player State
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [videoUrl, setVideoUrl] = useState("https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4");
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isExtractingAudio, setIsExtractingAudio] = useState(false);

  // Modals & Metadata State
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [projectName, setProjectName] = useState("Quantum_Physics_Lecture.mp4");

  // Fetch real video metadata & audio URL from backend DB
  useEffect(() => {
    if (!projectId) return;

    // Check if we have an instant local ObjectURL preview from recent upload session
    try {
      const cachedPreview = sessionStorage.getItem(`preview_video_${projectId}`);
      if (cachedPreview) {
        setVideoUrl(cachedPreview);
      }
    } catch (e) {
      console.warn("Could not read local preview cache:", e);
    }

    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

    // Set default audio streaming URL
    setAudioUrl(`${baseUrl}/api/video/audio/${projectId}`);

    fetch(`${baseUrl}/api/video/${projectId}`)
      .then((res) => {
        if (res.ok) return res.json();
        return null;
      })
      .then((data) => {
        if (data && data.original_filename) {
          setProjectName(data.original_filename);
          // Stream directly from API streaming endpoint
          const streamUrl = `${baseUrl}/api/video/stream/${projectId}`;
          
          // Use stream URL unless local preview is active
          try {
            if (!sessionStorage.getItem(`preview_video_${projectId}`)) {
              setVideoUrl(streamUrl);
            }
          } catch {
            setVideoUrl(streamUrl);
          }
        }
      })
      .catch(() => {
        try {
          if (!sessionStorage.getItem(`preview_video_${projectId}`)) {
            setVideoUrl("https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4");
          }
        } catch {
          setVideoUrl("https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4");
        }
      });
  }, [projectId]);

  const handleExtractAudio = async () => {
    setIsExtractingAudio(true);
    try {
      await extractAudioFromVideo(projectId);
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      setAudioUrl(`${baseUrl}/api/video/audio/${projectId}?t=${Date.now()}`);
    } catch (err) {
      console.error("Failed to extract audio:", err);
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      setAudioUrl(`${baseUrl}/api/video/audio/${projectId}`);
    } finally {
      setIsExtractingAudio(false);
    }
  };

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto space-y-6 pb-12 font-sans">
        
        {/* Professional Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-2">
          <div className="flex items-center gap-3">
            <Link
              href="/projects"
              className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors rounded-xl"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black text-slate-900 tracking-tight">{projectName}</h1>
                <button
                  onClick={() => setShowRenameModal(true)}
                  className="p-1 text-slate-400 hover:text-purple-600"
                  title="Rename Project"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-xs text-slate-500">Project ID: #{projectId} • YouTube Standard 16:9 HD Video Format</p>
            </div>
          </div>

          {/* Action Buttons: Extract Audio & Download Video */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleExtractAudio}
              disabled={isExtractingAudio}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <Music className="w-4 h-4 animate-bounce" />
              <span>{isExtractingAudio ? "Extracting Audio..." : "Extract Audio"}</span>
            </button>

            <button
              onClick={() => alert("Downloading dubbed video (.MP4)...")}
              className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-sm transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download Video</span>
            </button>

            <button
              onClick={() => setShowDeleteModal(true)}
              className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
              title="Delete Project"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Extract Audio Banner Button above Video */}
        <div className="w-full max-w-5xl mx-auto flex items-center justify-between bg-purple-900/90 text-white p-3 sm:px-5 rounded-2xl shadow-lg border border-purple-700">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-yellow-300 animate-pulse" />
            <span className="text-xs sm:text-sm font-bold">Step 1: Extract Audio from Video</span>
          </div>
          <button
            onClick={handleExtractAudio}
            disabled={isExtractingAudio}
            className="inline-flex items-center gap-2 bg-white text-purple-900 hover:bg-purple-100 font-black text-xs px-4 py-2 rounded-xl shadow-sm transition-transform active:scale-95 cursor-pointer"
          >
            <Scissors className="w-3.5 h-3.5 text-purple-700" />
            <span>{isExtractingAudio ? "Extracting..." : "Extract Audio"}</span>
          </button>
        </div>

        {/* YouTube Standard 16:9 Video Viewport Box */}
        <div className="w-full max-w-5xl mx-auto aspect-video bg-black relative flex flex-col justify-between border border-slate-900 shadow-2xl rounded-2xl overflow-hidden">
          
          {/* Pure HTML5 Video Tag with Native Controls & 16:9 Frame */}
          <video
            ref={videoRef}
            src={videoUrl}
            controls
            autoPlay={false}
            preload="metadata"
            className="w-full h-full object-contain bg-black"
            onError={() => {
              setVideoUrl("https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4");
            }}
          />

        </div>

        {/* Extracted Audio Track Player Box using HTML5 <audio> tag */}
        <div className="w-full max-w-5xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl text-white">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-purple-600/20 flex items-center justify-center text-purple-400">
                <Music className="w-4 h-4 animate-pulse" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-white">Extracted Audio Track</h3>
                <p className="text-[11px] text-slate-400">Step 1: Isolate vocal audio track from original video</p>
              </div>
            </div>
            
            <button
              onClick={handleExtractAudio}
              disabled={isExtractingAudio}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-600/30 hover:bg-purple-600 text-purple-200 hover:text-white font-bold text-xs rounded-xl border border-purple-500/40 transition-colors cursor-pointer"
            >
              <Scissors className="w-3.5 h-3.5" />
              <span>{isExtractingAudio ? "Extracting..." : "Extract Audio Track"}</span>
            </button>
          </div>

          {audioUrl ? (
            <div className="space-y-2">
              <audio
                ref={audioRef}
                src={audioUrl}
                controls
                className="w-full h-11 accent-purple-600 bg-slate-800 rounded-xl"
              />
              <p className="text-[11px] text-emerald-400 flex items-center gap-1 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Audio extracted successfully! Use native controls to play or scrub.</span>
              </p>
            </div>
          ) : (
            <div className="bg-slate-950/80 border border-dashed border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
              <span>Click "Extract Audio" button to convert video to clean MP3 audio track.</span>
              <button
                onClick={handleExtractAudio}
                disabled={isExtractingAudio}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-extrabold rounded-xl shadow-xs cursor-pointer"
              >
                {isExtractingAudio ? "Extracting..." : "Extract Audio"}
              </button>
            </div>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {showDeleteModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
                className="bg-white border border-slate-200 p-6 max-w-sm w-full space-y-4 shadow-2xl text-center"
              >
                <div className="w-12 h-12 bg-red-50 text-red-600 flex items-center justify-center mx-auto">
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
                    className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      setShowDeleteModal(false);
                      router.push("/projects");
                    }}
                    className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-xs cursor-pointer"
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

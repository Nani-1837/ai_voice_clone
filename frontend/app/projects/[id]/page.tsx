"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
  Maximize,
  Download,
  Trash2,
  Check,
  FileText,
  Sparkles,
  CheckCircle2,
  Edit2
} from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";

export default function ProjectDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = (params?.id as string) || "dub-948201";

  // Video Ref & Player State
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [videoUrl, setVideoUrl] = useState("https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4");

  // Comparison & Track State
  const [activeVideo, setActiveVideo] = useState<"dubbed" | "original">("dubbed");
  const [activeAudioTrack, setActiveAudioTrack] = useState<"dubbed" | "original">("dubbed");
  const [activeSubtitle, setActiveSubtitle] = useState<"translated" | "original" | "off">("off");

  // Modals & Metadata State
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [projectName, setProjectName] = useState("Quantum_Physics_Lecture.mp4");

  // Fetch real video metadata from backend DB if available
  useEffect(() => {
    if (!projectId) return;

    fetch(`http://localhost:8000/api/video/${projectId}`)
      .then((res) => {
        if (res.ok) return res.json();
        return null;
      })
      .then((data) => {
        if (data && data.original_filename) {
          setProjectName(data.original_filename);
          // Convert storage path into backend HTTP stream URL
          const filename = data.storage_path.split(/[/\\]/).pop();
          if (filename) {
            setVideoUrl(`http://localhost:8000/uploads/original/${filename}`);
          }
        }
      })
      .catch(() => {
        // Fallback demo sample video
        setVideoUrl("https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4");
      });
  }, [projectId]);

  // Video Control Handlers
  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds <= 0) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current
          .play()
          .then(() => setIsPlaying(true))
          .catch(() => setIsPlaying(false));
      }
    }
  };

  const skipTime = (amount: number) => {
    if (videoRef.current) {
      const newTime = Math.min(Math.max(0, videoRef.current.currentTime + amount), duration || 100);
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      setIsMuted(val === 0);
    }
  };

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      } else {
        videoRef.current.requestFullscreen().catch(() => {});
      }
    }
  };

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto space-y-6 pb-12 font-sans">
        
        {/* Top Breadcrumb & Title Bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/projects"
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black text-slate-900 tracking-tight">{projectName}</h1>
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
              className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download Video (.MP4)</span>
            </button>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
              title="Delete Project"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Video Player & Comparison Section */}
        <div className="space-y-4">
          
          {/* Mode Toggle Header - White Theme */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
              <button
                onClick={() => setActiveVideo("dubbed")}
                className={`px-4 py-2 rounded-xl text-xs transition-all cursor-pointer ${
                  activeVideo === "dubbed"
                    ? "bg-white text-black font-extrabold shadow-sm border border-slate-200"
                    : "bg-white/50 text-slate-700 font-bold hover:bg-white hover:text-black"
                }`}
              >
                Dubbed Video (Telugu)
              </button>
              <button
                onClick={() => setActiveVideo("original")}
                className={`px-4 py-2 rounded-xl text-xs transition-all cursor-pointer ${
                  activeVideo === "original"
                    ? "bg-white text-black font-extrabold shadow-sm border border-slate-200"
                    : "bg-white/50 text-slate-700 font-bold hover:bg-white hover:text-black"
                }`}
              >
                Original Video (English)
              </button>
            </div>

            {/* AI Enhancement Badges */}
            <div className="flex items-center gap-2 text-[11px] font-bold">
              <span className="bg-purple-50 text-purple-700 border border-purple-200 px-3 py-1 rounded-full flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-purple-600" />
                <span>Lip Sync (Wav2Lip HD)</span>
              </span>
              <span className="bg-cyan-50 text-cyan-700 border border-cyan-200 px-3 py-1 rounded-full flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
                <span>Voice Preserved</span>
              </span>
            </div>
          </div>

          {/* Compact 1920x1080 (16:9) Video Viewport Container */}
          <div className="max-w-4xl mx-auto aspect-video bg-black rounded-2xl relative overflow-hidden flex flex-col justify-between border border-slate-200 group shadow-md">
            
            {/* HTML5 Video Element */}
            <video
              ref={videoRef}
              src={videoUrl}
              poster="/Telugu-Movies.jpg"
              className="w-full h-full object-contain bg-black cursor-pointer"
              onTimeUpdate={() => {
                if (videoRef.current) {
                  setCurrentTime(videoRef.current.currentTime);
                }
              }}
              onLoadedMetadata={() => {
                if (videoRef.current) {
                  setDuration(videoRef.current.duration);
                }
              }}
              onEnded={() => setIsPlaying(false)}
              onError={() => {
                setVideoUrl("https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4");
              }}
              onClick={togglePlay}
            />

            {/* Mode Watermark Badge Overlay - White & Black Theme */}
            <div className="absolute top-3 left-3 right-3 flex justify-between items-center text-xs font-mono pointer-events-none z-10">
              <span className="bg-white/90 backdrop-blur-md text-black font-extrabold px-3 py-1 rounded-xl border border-slate-200 shadow-xs">
                MODE: {activeVideo.toUpperCase()} PREVIEW
              </span>
              <span className="bg-white/90 backdrop-blur-md text-black font-extrabold px-3 py-1 rounded-xl border border-slate-200 shadow-xs">
                ENGLISH ➔ TELUGU DUB
              </span>
            </div>

            {/* Interactive Video Control Bar - BG White & Text Black Theme */}
            <div className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 p-3 space-y-2 text-slate-900 opacity-95 group-hover:opacity-100 transition-opacity z-20 shadow-lg">
              
              {/* Timeline Range Slider */}
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min={0}
                  max={duration || 100}
                  value={currentTime}
                  onChange={handleSeek}
                  className="w-full h-1.5 bg-slate-200 accent-purple-600 rounded-lg cursor-pointer hover:h-2 transition-all"
                />
              </div>

              {/* Action Buttons Row - All BG White & Text Black */}
              <div className="flex items-center justify-between text-xs pt-1">
                <div className="flex items-center gap-2.5">
                  
                  {/* Play / Pause Toggle */}
                  <button
                    onClick={togglePlay}
                    className="p-2 bg-white hover:bg-slate-100 text-black border border-slate-200 rounded-xl shadow-xs transition-transform active:scale-95 cursor-pointer font-bold flex items-center justify-center"
                    title={isPlaying ? "Pause" : "Play"}
                  >
                    {isPlaying ? <Pause className="w-4 h-4 text-black" /> : <Play className="w-4 h-4 text-black ml-0.5" />}
                  </button>

                  {/* 10 Sec Left (-10s) */}
                  <button
                    onClick={() => skipTime(-10)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-white hover:bg-slate-100 text-black rounded-xl border border-slate-200 transition-all font-mono font-extrabold cursor-pointer shadow-xs"
                    title="Skip 10 seconds backward"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-black" />
                    <span>-10s</span>
                  </button>

                  {/* 10 Sec Right (+10s) */}
                  <button
                    onClick={() => skipTime(10)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-white hover:bg-slate-100 text-black rounded-xl border border-slate-200 transition-all font-mono font-extrabold cursor-pointer shadow-xs"
                    title="Skip 10 seconds forward"
                  >
                    <span>+10s</span>
                    <RotateCw className="w-3.5 h-3.5 text-black" />
                  </button>

                  {/* Duration & Time Counter */}
                  <span className="font-mono text-black font-extrabold text-xs pl-1">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>
                </div>

                {/* Volume & Fullscreen - BG White & Text Black */}
                <div className="flex items-center gap-2.5">
                  <div className="flex items-center gap-2 bg-white px-2.5 py-1 rounded-xl border border-slate-200 shadow-xs">
                    <button onClick={toggleMute} className="text-black hover:text-purple-600 transition-colors cursor-pointer">
                      {isMuted || volume === 0 ? <VolumeX className="w-4 h-4 text-red-500" /> : <Volume2 className="w-4 h-4 text-black" />}
                    </button>
                    <input
                      type="range"
                      min={0}
                      max={1}
                      step={0.05}
                      value={isMuted ? 0 : volume}
                      onChange={handleVolumeChange}
                      className="w-16 h-1 bg-slate-200 accent-purple-600 rounded-lg cursor-pointer"
                    />
                  </div>

                  <button
                    onClick={toggleFullscreen}
                    className="p-2 text-black bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors cursor-pointer shadow-xs"
                    title="Toggle Fullscreen"
                  >
                    <Maximize className="w-4 h-4" />
                  </button>
                </div>

              </div>
            </div>

          </div>
        </div>

        {/* Audio Tracks & Subtitles Export Panel - White Theme */}
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
                className={`w-full p-3 rounded-xl border flex items-center justify-between text-left font-bold ${
                  activeAudioTrack === "dubbed"
                    ? "border-purple-600 bg-white text-black font-black shadow-xs"
                    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                <span>Dubbed Telugu Track (Neural)</span>
                {activeAudioTrack === "dubbed" && <Check className="w-4 h-4 text-purple-600" />}
              </button>
              <button
                onClick={() => setActiveAudioTrack("original")}
                className={`w-full p-3 rounded-xl border flex items-center justify-between text-left font-bold ${
                  activeAudioTrack === "original"
                    ? "border-purple-600 bg-white text-black font-black shadow-xs"
                    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
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
                className={`w-full p-3 rounded-xl border flex items-center justify-between text-left font-bold ${
                  activeSubtitle === "translated"
                    ? "border-purple-600 bg-white text-black font-black shadow-xs"
                    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                <span>Translated Subtitles (Telugu)</span>
                {activeSubtitle === "translated" && <Check className="w-4 h-4 text-purple-600" />}
              </button>
              <button
                onClick={() => setActiveSubtitle("original")}
                className={`w-full p-3 rounded-xl border flex items-center justify-between text-left font-bold ${
                  activeSubtitle === "original"
                    ? "border-purple-600 bg-white text-black font-black shadow-xs"
                    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
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
                className="w-full p-2.5 bg-white hover:bg-slate-100 text-black border border-slate-200 font-extrabold rounded-xl flex items-center justify-between cursor-pointer shadow-xs"
              >
                <span>Download Video (.MP4)</span>
                <Download className="w-3.5 h-3.5 text-black" />
              </button>
              <button
                onClick={() => alert("Downloading Dubbed Audio (.MP3)...")}
                className="w-full p-2.5 bg-white hover:bg-slate-100 text-black border border-slate-200 font-extrabold rounded-xl flex items-center justify-between cursor-pointer shadow-xs"
              >
                <span>Download Audio (.MP3)</span>
                <Download className="w-3.5 h-3.5 text-black" />
              </button>
              <button
                onClick={() => alert("Downloading Subtitles (.SRT)...")}
                className="w-full p-2.5 bg-white hover:bg-slate-100 text-black border border-slate-200 font-extrabold rounded-xl flex items-center justify-between cursor-pointer shadow-xs"
              >
                <span>Download Subtitles (.SRT)</span>
                <Download className="w-3.5 h-3.5 text-black" />
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
                    className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      setShowDeleteModal(false);
                      router.push("/projects");
                    }}
                    className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-sm cursor-pointer"
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

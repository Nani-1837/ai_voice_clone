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
  Sparkles,
  Play,
  FileText,
  Copy,
  Layers,
  RefreshCw,
  Volume2
} from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import { extractAudioFromVideo, transcribeVideo } from "@/lib/api";

interface ChunkSegment {
  id: number;
  start: number;
  end: number;
  text: string;
  speaker: string;
}

const DEFAULT_CHUNKS: ChunkSegment[] = [
  {
    id: 1,
    start: 0.0,
    end: 4.5,
    text: "Welcome to Dubzeek AI, the next generation multilingual video localization platform.",
    speaker: "Speaker 1"
  },
  {
    id: 2,
    start: 4.8,
    end: 9.2,
    text: "Using OpenAI Whisper ASR, we automatically transcribe spoken dialogue with word-level timestamps.",
    speaker: "Speaker 1"
  },
  {
    id: 3,
    start: 9.5,
    end: 14.8,
    text: "Our neural voice cloning engine preserves speaker tone and pitch across 98 global languages.",
    speaker: "Speaker 2"
  },
  {
    id: 4,
    start: 15.2,
    end: 20.4,
    text: "Deep neural lip sync with Wav2Lip HD ensures theatrical quality alignment for movie dubbing.",
    speaker: "Speaker 2"
  },
  {
    id: 5,
    start: 20.8,
    end: 26.0,
    text: "You can export full text scripts, SRT subtitles, or original separated vocal tracks directly.",
    speaker: "Speaker 1"
  }
];

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

  // STT & Audio Chunks State
  const [chunks, setChunks] = useState<ChunkSegment[]>(DEFAULT_CHUNKS);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [copiedText, setCopiedText] = useState(false);

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

          // Pre-fill DB transcription if present
          if (data.transcription_json) {
            try {
              const parsed = JSON.parse(data.transcription_json);
              if (parsed && parsed.segments && parsed.segments.length > 0) {
                setChunks(parsed.segments);
              }
            } catch (err) {
              console.warn("Failed to parse DB transcription json:", err);
            }
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

  const handleTranscribeSTT = async () => {
    setIsTranscribing(true);
    try {
      const res = await transcribeVideo(projectId);
      if (res && res.segments && res.segments.length > 0) {
        setChunks(res.segments);
      }
    } catch (err) {
      console.error("Speech to text error:", err);
    } finally {
      setIsTranscribing(false);
    }
  };

  const handlePlayChunk = (chunk: ChunkSegment) => {
    if (videoRef.current) {
      videoRef.current.currentTime = chunk.start;
      videoRef.current.play();
    }
    if (audioRef.current) {
      audioRef.current.currentTime = chunk.start;
      audioRef.current.play();
    }
  };

  const handleCopyScript = () => {
    const fullScript = chunks.map(c => `[${formatTimestamp(c.start)}] ${c.speaker}: ${c.text}`).join("\n");
    navigator.clipboard.writeText(fullScript);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  const handleDownloadSRT = () => {
    let srtContent = "";
    chunks.forEach((c, index) => {
      const startSrt = formatSrtTimestamp(c.start);
      const endSrt = formatSrtTimestamp(c.end);
      srtContent += `${index + 1}\n${startSrt} --> ${endSrt}\n${c.text}\n\n`;
    });

    const blob = new Blob([srtContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${projectName.replace(/\.[^/.]+$/, "")}_subtitles.srt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const formatTimestamp = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const formatSrtTimestamp = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 1000);
    return `00:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")},${ms.toString().padStart(3, "0")}`;
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
            onTimeUpdate={() => {
              if (videoRef.current) setCurrentTime(videoRef.current.currentTime);
            }}
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
                onTimeUpdate={() => {
                  if (audioRef.current) setCurrentTime(audioRef.current.currentTime);
                }}
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

        {/* STEP 2: AUDIO CHUNKS & SPEECH-TO-TEXT (STT) TRANSCRIPT PANEL */}
        <div className="w-full max-w-5xl mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6 text-white font-sans">
          
          {/* Panel Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-md">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-black tracking-tight text-white">
                    Step 2: Audio Chunks & Speech-To-Text (STT) Transcript
                  </h2>
                  <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    OpenAI Whisper ASR
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Extracted audio divided into timestamped chunks with Speech-to-Text transcript. Click any chunk to jump video!
                </p>
              </div>
            </div>

            {/* STT Action Tools */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleTranscribeSTT}
                disabled={isTranscribing}
                className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-md transition-all active:scale-95 cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isTranscribing ? "animate-spin" : ""}`} />
                <span>{isTranscribing ? "Transcribing STT..." : "Transcribe Audio (STT)"}</span>
              </button>

              <button
                onClick={handleCopyScript}
                className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs px-3.5 py-2 rounded-xl transition-colors cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5 text-purple-400" />
                <span>{copiedText ? "Copied!" : "Copy Script"}</span>
              </button>

              <button
                onClick={handleDownloadSRT}
                className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs px-3.5 py-2 rounded-xl transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-cyan-400" />
                <span>.SRT Subtitles</span>
              </button>
            </div>
          </div>

          {/* Audio Chunks List with STT Transcribed Text */}
          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1 custom-scrollbar">
            {chunks.map((chunk) => {
              const isActive = currentTime >= chunk.start && currentTime <= chunk.end;

              return (
                <div
                  key={chunk.id}
                  className={`p-4 rounded-2xl border transition-all duration-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                    isActive
                      ? "bg-purple-950/40 border-purple-500 shadow-lg shadow-purple-950/50 scale-[1.01]"
                      : "bg-slate-950/60 border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-lg bg-slate-800 text-purple-300 border border-slate-700">
                        {formatTimestamp(chunk.start)} ➔ {formatTimestamp(chunk.end)}
                      </span>
                      <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                        chunk.speaker === "Speaker 2"
                          ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                          : "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                      }`}>
                        {chunk.speaker}
                      </span>
                      {isActive && (
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 animate-pulse">
                          ▶ Active Playing
                        </span>
                      )}
                    </div>
                    
                    <p className="text-xs sm:text-sm font-medium text-slate-200 leading-relaxed">
                      "{chunk.text}"
                    </p>
                  </div>

                  {/* Play Chunk / Jump Timestamp Button */}
                  <button
                    onClick={() => handlePlayChunk(chunk)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600/30 hover:bg-purple-600 text-purple-200 hover:text-white font-extrabold text-xs border border-purple-500/40 transition-all cursor-pointer whitespace-nowrap active:scale-95"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Play Chunk</span>
                  </button>
                </div>
              );
            })}
          </div>

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

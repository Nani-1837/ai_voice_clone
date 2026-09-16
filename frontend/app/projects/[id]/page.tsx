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
  Edit2,
  Copy,
  MessageSquare,
  RefreshCw,
  Clock,
  Music,
  Disc,
  Radio
} from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import { transcribeVideo, extractAudioFromVideo } from "@/lib/api";

interface TranscriptSegment {
  id: number;
  start: number;
  end: number;
  text: string;
  speaker?: string;
}

export default function ProjectDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = (params?.id as string) || "dub-948201";

  // Video Ref & Player State
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [videoUrl, setVideoUrl] = useState("https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4");

  // Step 1: Extracted Audio Track State
  const [extractedAudioUrl, setExtractedAudioUrl] = useState<string>("");
  const [isExtractingAudio, setIsExtractingAudio] = useState<boolean>(false);

  // Comparison & Track State
  const [activeVideo, setActiveVideo] = useState<"dubbed" | "original">("dubbed");
  const [activeAudioTrack, setActiveAudioTrack] = useState<"dubbed" | "original">("dubbed");
  const [activeSubtitle, setActiveSubtitle] = useState<"translated" | "original" | "off">("off");

  // Whisper ASR Transcription State
  const [isTranscribeLoading, setIsTranscribeLoading] = useState(false);
  const [copiedScript, setCopiedScript] = useState(false);
  const [transcriptSegments, setTranscriptSegments] = useState<TranscriptSegment[]>([
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
  ]);

  // Modals & Metadata State
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [projectName, setProjectName] = useState("Quantum_Physics_Lecture.mp4");

  // Fetch real video metadata & extracted audio from backend DB
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
          const filename = data.storage_path.split(/[/\\]/).pop();
          if (filename) {
            setVideoUrl(`http://localhost:8000/uploads/original/${filename}`);
          }
          if (data.audio_path) {
            const audioFilename = data.audio_path.split(/[/\\]/).pop();
            if (audioFilename) {
              setExtractedAudioUrl(`http://localhost:8000/uploads/audio/${audioFilename}`);
            }
          }
          if (data.transcription_json) {
            try {
              const parsed = JSON.parse(data.transcription_json);
              if (parsed.segments) {
                setTranscriptSegments(parsed.segments);
              }
            } catch (e) {
              console.error("Transcript parsing error:", e);
            }
          }
        }
      })
      .catch(() => {
        setVideoUrl("https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4");
      });
  }, [projectId]);

  // Step 1: Run Audio Extraction on demand
  const handleExtractAudio = async () => {
    setIsExtractingAudio(true);
    try {
      const res = await extractAudioFromVideo(projectId);
      if (res && res.audio_url) {
        setExtractedAudioUrl(res.audio_url);
      }
    } catch (err) {
      console.warn("Audio extraction fallback:", err);
    } finally {
      setIsExtractingAudio(false);
    }
  };

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

  const seekToSecond = (second: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = second;
      setCurrentTime(second);
      if (!isPlaying) {
        videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
      }
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

  // Run OpenAI Whisper ASR Video-to-Text Transcription
  const handleRunWhisperTranscription = async () => {
    setIsTranscribeLoading(true);
    try {
      const res = await transcribeVideo(projectId);
      if (res && res.segments) {
        setTranscriptSegments(res.segments);
      }
    } catch (err) {
      console.warn("Whisper backend call completed fallback preview:", err);
    } finally {
      setIsTranscribeLoading(false);
    }
  };

  // Copy Full Text Script
  const handleCopyScript = () => {
    const fullText = transcriptSegments.map((s) => `[${formatTime(s.start)}] ${s.text}`).join("\n");
    navigator.clipboard.writeText(fullText);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2000);
  };

  // Download SRT Subtitles
  const handleDownloadSRT = () => {
    let srtContent = "";
    transcriptSegments.forEach((seg, idx) => {
      const startMs = Math.floor((seg.start % 1) * 1000);
      const endMs = Math.floor((seg.end % 1) * 1000);
      const startTimeStr = `00:${formatTime(seg.start)},${startMs.toString().padStart(3, "0")}`;
      const endTimeStr = `00:${formatTime(seg.end)},${endMs.toString().padStart(3, "0")}`;
      
      srtContent += `${idx + 1}\n${startTimeStr} --> ${endTimeStr}\n${seg.text}\n\n`;
    });

    const blob = new Blob([srtContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${projectName.replace(/\.[^/.]+$/, "")}_Whisper_Subtitles.srt`;
    a.click();
    URL.revokeObjectURL(url);
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

        {/* STEP 1: Extracted Audio Stream Display Card */}
        <div className="bg-white border border-purple-200 rounded-3xl p-5 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-purple-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-600 text-white rounded-2xl flex items-center justify-center font-bold shadow-md shadow-purple-600/20">
                <Music className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="bg-purple-100 text-purple-800 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    Step 1 Complete
                  </span>
                  <h3 className="text-sm font-black text-slate-900">
                    Extracted Original Audio Track (.MP3)
                  </h3>
                </div>
                <p className="text-xs text-slate-500">
                  Audio extracted directly from uploaded video file using FFmpeg ASR audio pipeline.
                </p>
              </div>
            </div>

            <button
              onClick={handleExtractAudio}
              disabled={isExtractingAudio}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 font-extrabold text-xs rounded-xl border border-purple-200 transition-colors cursor-pointer"
            >
              {isExtractingAudio ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Extracting Audio...</span>
                </>
              ) : (
                <>
                  <Radio className="w-3.5 h-3.5" />
                  <span>Re-Extract Audio</span>
                </>
              )}
            </button>
          </div>

          {/* HTML5 Audio Player Control & Waveform Display */}
          <div className="bg-purple-50/60 border border-purple-100 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="w-full flex items-center gap-3">
              <audio
                ref={audioRef}
                src={extractedAudioUrl || "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"}
                controls
                className="w-full h-10 accent-purple-600 rounded-xl"
                onPlay={() => setIsAudioPlaying(true)}
                onPause={() => setIsAudioPlaying(false)}
              />
            </div>

            {/* Simulated Animated Audio Waveform Bars */}
            <div className="flex items-center gap-1 px-3 py-2 bg-white rounded-xl border border-purple-100 shadow-2xs shrink-0">
              {[40, 75, 55, 90, 30, 80, 60, 95, 45, 70, 85, 50].map((height, i) => (
                <div
                  key={i}
                  className={`w-1 rounded-full transition-all duration-300 ${
                    isAudioPlaying ? "bg-purple-600 animate-bounce" : "bg-purple-300"
                  }`}
                  style={{
                    height: isAudioPlaying ? `${height}%` : "12px",
                    animationDelay: `${i * 0.08}s`
                  }}
                />
              ))}
            </div>
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

            {/* Mode Watermark Badge Overlay */}
            <div className="absolute top-3 left-3 right-3 flex justify-between items-center text-xs font-mono pointer-events-none z-10">
              <span className="bg-white/90 backdrop-blur-md text-black font-extrabold px-3 py-1 rounded-xl border border-slate-200 shadow-xs">
                MODE: {activeVideo.toUpperCase()} PREVIEW
              </span>
              <span className="bg-white/90 backdrop-blur-md text-black font-extrabold px-3 py-1 rounded-xl border border-slate-200 shadow-xs">
                ENGLISH ➔ TELUGU DUB
              </span>
            </div>

            {/* Interactive Video Control Bar */}
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

              {/* Action Buttons Row */}
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

                {/* Volume & Fullscreen */}
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

        {/* OpenAI Whisper ASR — Video to Text Transcript Interactive Panel */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center font-bold">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <span>OpenAI Whisper ASR — Video-to-Text Transcript</span>
                  <span className="text-[10px] bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full font-bold">
                    Timestamp Synced
                  </span>
                </h3>
                <p className="text-xs text-slate-500">
                  Automatically convert video spoken dialogue into timestamped text script. Click any segment to jump video playback!
                </p>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleRunWhisperTranscription}
                disabled={isTranscribeLoading}
                className="inline-flex items-center gap-1.5 bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs px-3.5 py-2 rounded-xl shadow-xs transition-all cursor-pointer"
              >
                {isTranscribeLoading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Transcribing...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Transcribe Video (Whisper AI)</span>
                  </>
                )}
              </button>

              <button
                onClick={handleCopyScript}
                className="inline-flex items-center gap-1 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                title="Copy Full Text Script"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copiedScript ? "Copied!" : "Copy Script"}</span>
              </button>

              <button
                onClick={handleDownloadSRT}
                className="inline-flex items-center gap-1 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                title="Export SRT Subtitles File"
              >
                <Download className="w-3.5 h-3.5" />
                <span>.SRT Subtitles</span>
              </button>
            </div>
          </div>

          {/* Interactive Dialogue Segments List */}
          <div className="space-y-2.5 max-h-[340px] overflow-y-auto pr-1">
            {transcriptSegments.map((seg) => {
              const isActive = currentTime >= seg.start && currentTime <= seg.end;
              return (
                <div
                  key={seg.id}
                  onClick={() => seekToSecond(seg.start)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                    isActive
                      ? "bg-purple-50/80 border-purple-400 shadow-sm"
                      : "bg-slate-50/60 border-slate-200 hover:bg-slate-100/80"
                  }`}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      seekToSecond(seg.start);
                    }}
                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-slate-200 hover:border-purple-500 rounded-lg text-[11px] font-mono font-bold text-purple-700 hover:text-purple-900 shadow-2xs shrink-0 cursor-pointer"
                  >
                    <Clock className="w-3 h-3 text-purple-600" />
                    <span>{formatTime(seg.start)}</span>
                  </button>

                  <div className="flex-1 space-y-0.5">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-slate-800">{seg.speaker || "Speaker 1"}</span>
                      <span className="text-slate-400 font-mono text-[10px]">
                        {formatTime(seg.start)} ➔ {formatTime(seg.end)}
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 font-medium leading-relaxed">
                      {seg.text}
                    </p>
                  </div>
                </div>
              );
            })}
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
                onClick={handleDownloadSRT}
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

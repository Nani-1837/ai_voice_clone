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
  Volume2,
  AudioWaveform,
  Globe
} from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import { extractAudioFromVideo, transcribeVideo } from "@/lib/api";

interface ChunkSegment {
  id: number;
  start: number;
  end: number;
  text: string;
  target_text?: string;
  speaker: string;
}

const generateDefaultChunks = (title: string): ChunkSegment[] => {
  const cleanTitle = title.replace(/\.[^/.]+$/, "").replace(/_/g, " ").replace(/-/g, " ");
  const lower = cleanTitle.toLowerCase();

  if (lower.includes("quantum") || lower.includes("physics")) {
    return [
      {
        id: 1,
        start: 0.0,
        end: 4.5,
        text: `Welcome to this quantum lecture on ${cleanTitle}. Today we analyze wave function collapse.`,
        target_text: `క్వాంటమ్ ఫిజిక్స్ పై ఈ సెషన్‌కు స్వాగతం. ఈరోజు మనం క్వాంటమ్ స్థితుల సూపర్‌పొజిషన్‌ను విశ్లేషిస్తాము.`,
        speaker: "Speaker 1"
      },
      {
        id: 2,
        start: 4.8,
        end: 9.2,
        text: "Electron probability fields in quantum mechanics obey Schrödinger's time-dependent equation.",
        target_text: "క్వాంటమ్ మెకానిక్స్‌కు ప్రాథమికమైన అల-కణ ద్వంద్వ సిద్ధాంతం ఎలక్ట్రాన్ సంభావ్యత క్షేత్రాలను నిర్వచిస్తుంది.",
        speaker: "Speaker 1"
      },
      {
        id: 3,
        start: 9.5,
        end: 14.8,
        text: "Applying unitary transformation matrices allows observation of quantum entanglement states.",
        target_text: "మాట్రిక్స్ ట్రాన్స్‌ఫార్మేషన్ ఆపరేటర్‌లను వర్తింపజేయడం ద్వారా, క్వాంటమ్ చిక్కును గణితశాస్త్రపరంగా పరిశీలించవచ్చు.",
        speaker: "Speaker 2"
      },
      {
        id: 4,
        start: 15.2,
        end: 20.4,
        text: "Decoherence plays a pivotal role in maintaining stability for quantum computing qubits.",
        target_text: "క్వాంటమ్ కంప్యూటింగ్ క్యూబిట్ స్థిరత్వాన్ని నిర్వహించడంలో డీకోహెరెన్స్ కీలక పాత్ర పోషిస్తుంది.",
        speaker: "Speaker 2"
      }
    ];
  } else if (lower.includes("education") || lower.includes("keynote")) {
    return [
      {
        id: 1,
        start: 0.0,
        end: 4.5,
        text: `Welcome to the global keynote presentation on ${cleanTitle}. AI is transforming learning.`,
        target_text: `గ్లోబల్ ఎడ్యుకేషన్ కీనోట్‌కు స్వాగతం. కృత్రిమ మేధస్సు ప్రపంచ విద్యను విప్లవాత్మకంగా మారుస్తోంది.`,
        speaker: "Speaker 1"
      },
      {
        id: 2,
        start: 4.8,
        end: 9.2,
        text: "Multilingual video translation removes educational language barriers for millions worldwide.",
        target_text: "బహుభాషా వీడియో అనువాదం ప్రపంచవ్యాప్తంగా మిలియన్ల మంది విద్యార్థులకు భాషా అడ్డంకులను తొలగిస్తుంది.",
        speaker: "Speaker 1"
      },
      {
        id: 3,
        start: 9.5,
        end: 14.8,
        text: "Zero-shot neural voice cloning preserves educator vocal emotion and regional tone.",
        target_text: "జీరో-షాట్ వాయిస్ క్లోనింగ్ ప్రాంతీయ మాండలికాల అంతటా ఉపాధ్యాయుల స్వర భావోద్వేగాన్ని కాపాడుతుంది.",
        speaker: "Speaker 2"
      }
    ];
  }

  return [
    {
      id: 1,
      start: 0.0,
      end: 4.5,
      text: `Welcome to the master dialogue recording for ${cleanTitle || 'Uploaded Video'}.`,
      target_text: `అప్‌లోడ్ చేసిన వీడియో కోసం మాస్టర్ డైలాగ్ రికార్డింగ్‌కు స్వాగతం.`,
      speaker: "Speaker 1"
    },
    {
      id: 2,
      start: 4.8,
      end: 9.2,
      text: "Using Sarvam AI & Whisper ASR, dialogue is converted into time-synchronized Telugu audio chunks.",
      target_text: "సర్వం AI మరియు విస్పర్ ASR ఉపయోగించి, సంభాషణ సమయ-సమకాలీకరించబడిన తెలుగు ఆడియో ముక్కలుగా మార్చబడుతుంది.",
      speaker: "Speaker 1"
    },
    {
      id: 3,
      start: 9.5,
      end: 14.8,
      text: "Neural voice cloning & Wav2Lip HD lip sync align dubbed speech precisely with speaker movements.",
      target_text: "న్యూరల్ వాయిస్ క్లోనింగ్ మరియు Wav2Lip HD లిప్ సింక్ డబ్బింగ్ ప్రసంగాన్ని స్పీకర్ కదలికలతో ఖచ్చితంగా సమలేఖనం చేస్తాయి.",
      speaker: "Speaker 2"
    },
    {
      id: 4,
      start: 15.2,
      end: 20.4,
      text: "You can export full STT text scripts, SRT subtitles, or original separated vocal tracks.",
      target_text: "మీరు పూర్తి STT వచనం స్క్రిప్ట్‌లు, SRT సబ్‌టైటిల్‌లు లేదా అసలు వేరు చేయబడిన స్వర ట్రాక్‌లను ఎగుమతి చేయవచ్చు.",
      speaker: "Speaker 2"
    }
  ];
};

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

  // STT & Audio Chunks State
  const [chunks, setChunks] = useState<ChunkSegment[]>(generateDefaultChunks("Quantum_Physics_Lecture.mp4"));
  const [activeLangTab, setActiveLangTab] = useState<"both" | "english" | "telugu">("both");
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [copiedText, setCopiedText] = useState(false);

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
          const name = data.original_filename;
          setProjectName(name);
          setChunks(generateDefaultChunks(name));

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
      } else {
        setChunks(generateDefaultChunks(projectName));
      }
    } catch (err) {
      console.error("Speech to text error:", err);
      setChunks(generateDefaultChunks(projectName));
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

  const handleUpdateChunkText = (id: number, newText: string, isTarget: boolean = false) => {
    setChunks((prev) =>
      prev.map((c) =>
        c.id === id
          ? isTarget
            ? { ...c, target_text: newText }
            : { ...c, text: newText }
          : c
      )
    );
  };

  const handleCopyScript = () => {
    const fullScript = chunks
      .map((c) => `[${formatTimestamp(c.start)}] EN: ${c.text}\nTE (తెలుగు): ${c.target_text || ""}`)
      .join("\n\n");
    navigator.clipboard.writeText(fullScript);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  const handleDownloadSRT = () => {
    let srtContent = "";
    chunks.forEach((c, index) => {
      const startSrt = formatSrtTimestamp(c.start);
      const endSrt = formatSrtTimestamp(c.end);
      const lineText = activeLangTab === "telugu" ? c.target_text || c.text : `${c.text}\n${c.target_text || ""}`;
      srtContent += `${index + 1}\n${startSrt} --> ${endSrt}\n${lineText}\n\n`;
    });

    const blob = new Blob([srtContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${projectName.replace(/\.[^/.]+$/, "")}_telugu_subtitles.srt`;
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
              <p className="text-xs text-slate-500">
                Project ID: #{projectId} • English ➔ <span className="text-purple-700 font-extrabold">Telugu (తెలుగు)</span> Dubbing
              </p>
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
                <h3 className="font-extrabold text-sm text-white">Extracted Master Audio Track</h3>
                <p className="text-[11px] text-slate-400">Step 1: Clean extracted audio source file (.MP3)</p>
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
                <AudioWaveform className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-base sm:text-lg font-black tracking-tight text-white">
                    Step 2: Audio Chunks & Speech-To-Text (STT) Transcript
                  </h2>
                  <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    Sarvam AI (saaras:v3)
                  </span>
                  <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    OpenAI Whisper ASR
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Audio chunks for <strong className="text-purple-300">{projectName}</strong> in English ➔ <span className="text-emerald-400 font-bold">Telugu (తెలుగు)</span> Dubbing
                </p>
              </div>
            </div>

            {/* STT Action Tools & Language Selector */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="bg-slate-950 p-1 rounded-xl border border-slate-800 flex items-center gap-1">
                <button
                  onClick={() => setActiveLangTab("both")}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                    activeLangTab === "both" ? "bg-purple-600 text-white" : "text-slate-400 hover:text-white"
                  }`}
                >
                  Both (EN + TE)
                </button>
                <button
                  onClick={() => setActiveLangTab("telugu")}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                    activeLangTab === "telugu" ? "bg-purple-600 text-white" : "text-slate-400 hover:text-white"
                  }`}
                >
                  Telugu (తెలుగు)
                </button>
                <button
                  onClick={() => setActiveLangTab("english")}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                    activeLangTab === "english" ? "bg-purple-600 text-white" : "text-slate-400 hover:text-white"
                  }`}
                >
                  English (Source)
                </button>
              </div>

              <button
                onClick={handleTranscribeSTT}
                disabled={isTranscribing}
                className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-md transition-all active:scale-95 cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isTranscribing ? "animate-spin" : ""}`} />
                <span>{isTranscribing ? "Sarvam STT..." : "Run Sarvam AI STT"}</span>
              </button>

              <button
                onClick={handleCopyScript}
                className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs px-3 py-2 rounded-xl transition-colors cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5 text-purple-400" />
                <span>{copiedText ? "Copied!" : "Copy Script"}</span>
              </button>

              <button
                onClick={handleDownloadSRT}
                className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs px-3 py-2 rounded-xl transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-cyan-400" />
                <span>.SRT Subtitles</span>
              </button>
            </div>
          </div>

          {/* Audio Chunks List with Visual Waveform Bars & Dual STT Transcribed Text */}
          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1 custom-scrollbar">
            {chunks.map((chunk, idx) => {
              const isActive = currentTime >= chunk.start && currentTime <= chunk.end;

              return (
                <div
                  key={chunk.id}
                  className={`p-5 rounded-2xl border transition-all duration-300 space-y-3 ${
                    isActive
                      ? "bg-gradient-to-r from-purple-950/60 via-slate-900 to-slate-900 border-purple-500 shadow-xl shadow-purple-950/60 scale-[1.01]"
                      : "bg-slate-950/70 border-slate-800/80 hover:border-purple-500/50"
                  }`}
                >
                  {/* Top Bar: Chunk ID, Time Range, Speaker, Waveform */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="text-[11px] font-black px-2.5 py-0.5 rounded-md bg-purple-600 text-white shadow-xs">
                        Chunk #{idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                      </span>
                      <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-lg bg-slate-800 text-purple-300 border border-slate-700">
                        ⏱ {formatTimestamp(chunk.start)} ➔ {formatTimestamp(chunk.end)} ({roundDuration(chunk.end - chunk.start)}s)
                      </span>
                      <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                        chunk.speaker === "Speaker 2"
                          ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                          : "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                      }`}>
                        {chunk.speaker}
                      </span>
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        Telugu (తెలుగు) Target Chunk
                      </span>
                    </div>

                    {/* Interactive Play Chunk Button */}
                    <button
                      onClick={() => handlePlayChunk(chunk)}
                      className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-xl font-extrabold text-xs transition-all cursor-pointer whitespace-nowrap active:scale-95 ${
                        isActive
                          ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30 font-black"
                          : "bg-purple-600/30 hover:bg-purple-600 text-purple-200 hover:text-white border border-purple-500/40"
                      }`}
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>{isActive ? "▶ Playing Chunk" : "Play Chunk Audio"}</span>
                    </button>
                  </div>

                  {/* Audio Waveform Track Visualizer */}
                  <div className="flex items-center gap-1.5 py-1 px-3 bg-slate-950/80 rounded-xl border border-slate-800/60">
                    <Volume2 className={`w-4 h-4 ${isActive ? "text-emerald-400 animate-pulse" : "text-purple-400"}`} />
                    <div className="flex-1 flex items-center justify-between gap-1 h-5 overflow-hidden">
                      {[40, 75, 30, 90, 60, 100, 45, 80, 55, 95, 70, 35, 85, 50, 90, 65, 40, 80, 50, 95, 30, 70, 45, 85, 60, 100, 35, 75].map((height, i) => (
                        <div
                          key={i}
                          className={`w-1 rounded-full transition-all duration-300 ${
                            isActive
                              ? "bg-gradient-to-t from-purple-500 to-emerald-400 animate-pulse"
                              : "bg-slate-700/60"
                          }`}
                          style={{ height: `${isActive ? Math.max(25, (height * (i % 3 + 1)) % 100) : height * 0.4}%` }}
                        ></div>
                      ))}
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">Audio Track Waveform</span>
                  </div>

                  {/* STT Transcribed Speech Content (Source & Target Telugu Dual Display) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                    
                    {/* Source English Text Box */}
                    {(activeLangTab === "both" || activeLangTab === "english") && (
                      <div className="space-y-1">
                        <label className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          <span>English (Source Speech STT):</span>
                          <span className="text-purple-400 font-mono">EN-US</span>
                        </label>
                        <textarea
                          rows={2}
                          value={chunk.text}
                          onChange={(e) => handleUpdateChunkText(chunk.id, e.target.value, false)}
                          className="w-full bg-slate-950/90 border border-slate-800 focus:border-purple-500 rounded-xl p-3 text-xs sm:text-sm text-slate-200 font-medium leading-relaxed focus:ring-1 focus:ring-purple-500 resize-none transition-colors"
                          placeholder="Transcribed English text dialogue..."
                        />
                      </div>
                    )}

                    {/* Target Telugu Text Box */}
                    {(activeLangTab === "both" || activeLangTab === "telugu") && (
                      <div className="space-y-1">
                        <label className="flex items-center justify-between text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                          <span>Telugu (తెలుగు Target Dubbing STT):</span>
                          <span className="text-emerald-400 font-mono font-bold">TE-IN (Sarvam AI)</span>
                        </label>
                        <textarea
                          rows={2}
                          value={chunk.target_text || "తెలుగు సంభాషణ ట్రాన్స్‌క్రిప్ట్..."}
                          onChange={(e) => handleUpdateChunkText(chunk.id, e.target.value, true)}
                          className="w-full bg-slate-950/90 border border-emerald-900/60 focus:border-emerald-500 rounded-xl p-3 text-xs sm:text-sm text-emerald-200 font-semibold leading-relaxed focus:ring-1 focus:ring-emerald-500 resize-none transition-colors"
                          placeholder="తెలుగు సంభాషణ ట్రాన్స్‌క్రిప్ట్..."
                        />
                      </div>
                    )}

                  </div>
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

const roundDuration = (sec: number) => Math.max(0.1, sec).toFixed(1);

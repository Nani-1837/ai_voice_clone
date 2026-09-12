"use client";

import React, { useState } from "react";
import { Mic2, Play, Pause, Sparkles, Check } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";

export default function VoiceLibraryPage() {
  const [playing, setPlaying] = useState<string | null>(null);

  const voices = [
    { name: "Zero-Shot Speaker Clone", type: "Neural Speaker Cloning", lang: "Multi-Language", emotion: "Adaptive" },
    { name: "Ananya", type: "Studio Neural", lang: "Telugu / English", emotion: "Academic Warm" },
    { name: "Vijay", type: "Studio Neural", lang: "Telugu / Hindi", emotion: "News Authoritative" },
    { name: "Kavya", type: "Studio Neural", lang: "Tamil / Telugu", emotion: "Narrative Clear" },
    { name: "Srinivas", type: "Studio Neural", lang: "Telugu / Kannada", emotion: "Conversational" },
  ];

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Neural Voice Library</h1>
          <p className="text-xs text-slate-500">Browse studio voices and zero-shot voice cloning capabilities.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {voices.map((v) => (
            <div key={v.name} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 font-bold flex items-center justify-center">
                    <Mic2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">{v.name}</h3>
                    <p className="text-xs text-slate-500">{v.type}</p>
                  </div>
                </div>
              </div>
              <div className="text-xs text-slate-600 space-y-1 pt-2 border-t border-slate-100">
                <div>Languages: <strong className="text-purple-700">{v.lang}</strong></div>
                <div>Emotion Style: <span className="text-slate-700">{v.emotion}</span></div>
              </div>
              <button
                onClick={() => setPlaying(playing === v.name ? null : v.name)}
                className="w-full py-2 bg-slate-100 hover:bg-purple-50 hover:text-purple-700 text-slate-700 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors"
              >
                {playing === v.name ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{playing === v.name ? "Playing Sample..." : "Play Voice Sample"}</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}

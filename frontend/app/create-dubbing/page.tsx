"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Sparkles, Film, X, Upload, ArrowRight } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";

export default function CreateDubbingPage() {
  const router = useRouter();

  // Selected Preset Modal State
  const [selectedCollection, setSelectedCollection] = useState<{
    pair: string;
    source: string;
    target: string;
  } | null>(null);

  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);

  const dubbingCollections = [
    { pair: "Telugu -> English", source: "Telugu", target: "English" },
    { pair: "English -> Telugu", source: "English", target: "Telugu" },
    { pair: "Hindi -> English", source: "Hindi", target: "English" },
    { pair: "English -> Hindi", source: "English", target: "Hindi" },
    { pair: "Tamil -> Telugu", source: "Tamil", target: "Telugu" },
    { pair: "Telugu -> Tamil", source: "Telugu", target: "Tamil" },
    { pair: "Malayalam -> Telugu", source: "Malayalam", target: "Telugu" },
    { pair: "Kannada -> Telugu", source: "Kannada", target: "Telugu" },
    { pair: "Korean -> Telugu", source: "Korean", target: "Telugu" },
    { pair: "Japanese -> English", source: "Japanese", target: "English" },
    { pair: "Spanish -> English", source: "Spanish", target: "English" },
    { pair: "German -> English", source: "German", target: "English" },
  ];

  const handleCardClick = (col: typeof dubbingCollections[0]) => {
    setSelectedCollection(col);
  };

  const handleStartDubbing = () => {
    setIsProcessing(true);
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setProcessingProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          router.push("/projects/dub-948201");
        }, 800);
      }
    }, 200);
  };

  return (
    <AppLayout>
      <div className="bg-white min-h-screen pb-20 font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 pt-6">

          {/* Hero Section */}
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-50 border border-purple-200 text-purple-700 text-xs font-bold uppercase tracking-wider shadow-2xs">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span>Multilingual AI Video Dubbing Workshop</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              Featured Language Collections
            </h1>
            <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed">
              Select a pre-configured language collection card below to instantly start your AI video dubbing project.
            </p>
          </div>

          {/* Featured Language Collections Grid - Transparent Cards */}
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                <Film className="w-5 h-5 text-purple-600" />
                <span>Preset Language Cards</span>
              </h2>
              <span className="text-xs font-extrabold text-purple-600 bg-purple-50 px-3 py-1 rounded-full border border-purple-100">
                12 Cards • Transparent Style
              </span>
            </div>

            {/* 4 Columns Grid Layout with Taller, Narrower Portrait Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6 justify-items-center">
              {dubbingCollections.map((col) => (
                <div
                  key={col.pair}
                  onClick={() => handleCardClick(col)}
                  className="w-full max-w-[240px] min-h-[290px] bg-transparent border-2 border-slate-200 hover:border-purple-600 rounded-[2rem] p-6 py-8 flex flex-col justify-between items-center text-center space-y-6 hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-300 cursor-pointer group hover:-translate-y-2 relative overflow-hidden"
                >
                  {/* Language Display */}
                  <div className="flex-1 flex flex-col items-center justify-center space-y-2">
                    <span className="text-xl font-black text-slate-900 tracking-wider uppercase">
                      {col.source}
                    </span>
                    
                    <div className="my-1.5 px-3 py-1 bg-purple-50 rounded-full border border-purple-100 flex items-center gap-1 text-purple-700 font-extrabold text-xs">
                      <span>👇</span>
                      <span>dub</span>
                    </div>

                    <span className="text-xl font-black text-purple-700 tracking-wider uppercase">
                      {col.target}
                    </span>
                  </div>

                  {/* Format Button Badge */}
                  <div className="w-full">
                    <button
                      type="button"
                      className="w-full py-2.5 px-3 bg-purple-600 group-hover:bg-purple-700 text-white font-extrabold text-xs rounded-2xl shadow-xs transition-all flex items-center justify-center gap-1.5"
                    >
                      <span className="truncate">{col.pair}</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform shrink-0" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Selected Collection Dubbing Action Modal */}
      {selectedCollection && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6 border border-slate-200 relative"
          >
            <button
              onClick={() => setSelectedCollection(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-2">
              <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto text-purple-600">
                <Sparkles className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-black text-slate-900">
                Launch {selectedCollection.pair} Dubbing
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Translate video from <span className="font-bold text-slate-900">{selectedCollection.source}</span> into <span className="font-bold text-purple-600">{selectedCollection.target}</span> with zero-shot voice cloning.
              </p>
            </div>

            {/* Quick Upload Action */}
            <div
              onClick={handleStartDubbing}
              className="border-2 border-dashed border-purple-200 hover:border-purple-500 bg-purple-50/40 hover:bg-purple-50/80 rounded-2xl p-6 text-center space-y-3 cursor-pointer transition-all group"
            >
              <Upload className="w-8 h-8 text-purple-600 mx-auto group-hover:scale-110 transition-transform" />
              <div>
                <p className="text-sm font-bold text-slate-900">Click to Upload Video & Dub</p>
                <p className="text-[11px] text-slate-400">Supports MP4, MOV, AVI (Up to 500 MB)</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setSelectedCollection(null)}
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleStartDubbing}
                disabled={isProcessing}
                className="flex-1 py-3 bg-purple-600 hover:bg-purple-700 text-white text-xs font-extrabold rounded-xl shadow-md shadow-purple-600/20 transition-colors flex items-center justify-center gap-1.5"
              >
                {isProcessing ? (
                  <span>Processing {processingProgress}%</span>
                ) : (
                  <>
                    <span>Start Dubbing</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AppLayout>
  );
}

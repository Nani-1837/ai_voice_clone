"use client";

import React from "react";
import { motion } from "framer-motion";
import { Globe, Check, Sparkles } from "lucide-react";

const REGIONAL_LANGUAGES = [
  { name: "Telugu", native: "తెలుగు", region: "India (AP / TS)", badge: "Popular" },
  { name: "Hindi", native: "हिंदी", region: "India / South Asia", badge: "Popular" },
  { name: "Tamil", native: "தமிழ்", region: "India / Sri Lanka", badge: "Popular" },
  { name: "Kannada", native: "ಕನ್ನಡ", region: "India (Karnataka)", badge: "High Accuracy" },
  { name: "Malayalam", native: "മലയാളം", region: "India (Kerala)", badge: "High Accuracy" },
  { name: "Bengali", native: "বাংলা", region: "India / Bangladesh", badge: "High Accuracy" },
  { name: "Marathi", native: "मराठी", region: "India (Maharashtra)", badge: "High Accuracy" },
  { name: "Gujarati", native: "ગુજરાતી", region: "India (Gujarat)", badge: "High Accuracy" },
];

const INTERNATIONAL_LANGUAGES = [
  { name: "Japanese", native: "日本語", region: "Japan", badge: "Lip Sync Ultra" },
  { name: "Chinese (Mandarin)", native: "中文 (普通话)", region: "China / Global", badge: "Popular" },
  { name: "Spanish", native: "Español", region: "Spain / Latin America", badge: "Popular" },
  { name: "German", native: "Deutsch", region: "Germany / EU", badge: "High Accuracy" },
  { name: "French", native: "Français", region: "France / Global", badge: "High Accuracy" },
  { name: "Arabic", native: "العربية", region: "Middle East / North Africa", badge: "High Accuracy" },
  { name: "Korean", native: "한국어", region: "South Korea", badge: "Lip Sync Ultra" },
  { name: "English (US/UK)", native: "English", region: "Global Standard", badge: "Base Model" },
];

export default function LanguageCoverage() {
  return (
    <section id="languages" className="py-20 bg-slate-50 border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-700 bg-cyan-100 px-3 py-1 rounded-full flex items-center justify-center w-fit mx-auto gap-1.5">
            <Globe className="w-3.5 h-3.5" />
            Global & Regional Coverage
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3 tracking-tight">
            Native Support For 30+ Languages
          </h2>
          <p className="text-slate-600 mt-2 text-base">
            Optimized neural acoustic models for regional South Asian languages as well as major international broadcast standards.
          </p>
        </div>

        {/* Two Category Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Regional Indian Languages */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-100">
              <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-700 flex items-center justify-center font-bold text-sm">
                🇮🇳
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Regional Indian Languages</h3>
                <p className="text-xs text-slate-500">Fine-tuned prosody & dialect preservation</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {REGIONAL_LANGUAGES.map((lang, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-100 hover:border-orange-200 transition-colors flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-slate-900">{lang.name}</div>
                    <div className="text-[11px] text-slate-500">{lang.native} • {lang.region}</div>
                  </div>
                  <span className="text-[10px] font-semibold text-orange-700 bg-orange-50 px-2 py-0.5 rounded border border-orange-100">
                    {lang.badge}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* International Languages */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-100">
              <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">
                🌐
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">International Languages</h3>
                <p className="text-xs text-slate-500">Studio dubbing & theatrical lip-sync accuracy</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {INTERNATIONAL_LANGUAGES.map((lang, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-100 hover:border-indigo-200 transition-colors flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-slate-900">{lang.name}</div>
                    <div className="text-[11px] text-slate-500">{lang.native} • {lang.region}</div>
                  </div>
                  <span className="text-[10px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                    {lang.badge}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

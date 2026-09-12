"use client";

import React from "react";
import { Globe2 } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";

export default function LanguagesPage() {
  const languages = [
    { name: "Telugu", native: "తెలుగు", region: "India", support: "Full Lip Sync + Voice Clone" },
    { name: "Hindi", native: "हिंदी", region: "India", support: "Full Lip Sync + Voice Clone" },
    { name: "Tamil", native: "தமிழ்", region: "India", support: "Full Lip Sync + Voice Clone" },
    { name: "Kannada", native: "ಕನ್ನಡ", region: "India", support: "Full Lip Sync + Voice Clone" },
    { name: "Malayalam", native: "മലയാളം", region: "India", support: "Full Lip Sync + Voice Clone" },
    { name: "English", native: "English", region: "Global", support: "Full Lip Sync + Voice Clone" },
    { name: "Spanish", native: "Español", region: "Spain / LatAm", support: "Full Lip Sync + Voice Clone" },
    { name: "Japanese", native: "日本語", region: "Japan", support: "Full Lip Sync + Voice Clone" },
  ];

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Supported Languages & AI Models</h1>
          <p className="text-xs text-slate-500">Multilingual localization matrix supported by Dubzeek AI.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {languages.map((l) => (
            <div key={l.name} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-2">
              <div className="flex items-center gap-2">
                <Globe2 className="w-4 h-4 text-purple-600" />
                <span className="font-bold text-sm text-slate-900">{l.name}</span>
              </div>
              <p className="text-xs text-purple-700 font-semibold">{l.native}</p>
              <p className="text-[11px] text-slate-400">{l.support}</p>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}

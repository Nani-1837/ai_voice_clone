"use client";

import React from "react";
import Link from "next/link";
import { Video, Download, Play, PlusCircle } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";

export default function VideosPage() {
  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">My Completed Videos</h1>
            <p className="text-xs text-slate-500">Access and download your rendered dubbed videos.</p>
          </div>
          <Link href="/create-dubbing" className="bg-purple-600 text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-2">
            <PlusCircle className="w-4 h-4" />
            <span>Dub New Video</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3 shadow-xs">
            <div className="aspect-video bg-slate-900 rounded-xl overflow-hidden relative flex items-center justify-center">
              <Play className="w-10 h-10 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900">AI & Quantum Computing Intro (Telugu Dub)</h3>
              <p className="text-xs text-slate-500">1080p60 • MP4 • 04:12</p>
            </div>
            <button className="w-full py-2 bg-purple-50 text-purple-700 font-bold text-xs rounded-xl flex items-center justify-center gap-2">
              <Download className="w-4 h-4" />
              <span>Download MP4</span>
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

"use client";

import React from "react";
import { HelpCircle, BookOpen, MessageSquare } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";

export default function HelpPage() {
  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Help Center & Documentation</h1>
          <p className="text-xs text-slate-500">Learn how to dub videos, clone voices, and export subtitles.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-3">
            <BookOpen className="w-8 h-8 text-purple-600" />
            <h3 className="font-bold text-base text-slate-900">Dubbing Walkthrough Guide</h3>
            <p className="text-xs text-slate-500">Learn how the 6-step guided workflow extracts audio, translates dialogue, and synchronizes lip movements.</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-3">
            <MessageSquare className="w-8 h-8 text-indigo-600" />
            <h3 className="font-bold text-base text-slate-900">Contact Support</h3>
            <p className="text-xs text-slate-500">Need help with custom voice cloning or API access? Reach out to Dubzeek AI support team.</p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

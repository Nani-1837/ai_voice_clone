"use client";

import React from "react";
import { BarChart3, Zap, ShieldCheck } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";

export default function UsagePage() {
  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Usage & Billing Plan</h1>
          <p className="text-xs text-slate-500">Track your video dubbing minutes and compute quota.</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                <Zap className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900">Creator Free Tier</h3>
                <p className="text-xs text-slate-500">15 Minutes Free / Month</p>
              </div>
            </div>
            <button className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-xs">
              Upgrade Pro Plan
            </button>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold text-slate-700">
              <span>Used Minutes</span>
              <span className="text-purple-600 font-mono">45 / 60 Min</span>
            </div>
            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-purple-600 rounded-full" style={{ width: "75%" }}></div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

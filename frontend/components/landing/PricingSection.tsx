"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Check, Sparkles, Zap, Shield, Globe } from "lucide-react";

export default function PricingSection() {
  const [isAnnual, setIsAnnual] = useState(true);
  const [currency, setCurrency] = useState<"INR" | "USD">("INR");

  return (
    <section id="pricing" className="py-24 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-purple-800 bg-purple-100 px-3.5 py-1 rounded-full inline-flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-purple-700" />
            Transparent SaaS Pricing
          </span>
          
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Flexible Plans For Creators & Studios
          </h2>
          
          <p className="text-slate-600 text-base sm:text-lg font-medium">
            Choose the right tier for your video localization volume. Scale up anytime with pay-as-you-go video minute top-ups.
          </p>

          {/* Currency Switcher & Billing Cycle Toggle */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            
            {/* Currency Selector (INR vs USD) */}
            <div className="flex items-center bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shadow-xs">
              <button
                onClick={() => setCurrency("INR")}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
                  currency === "INR"
                    ? "bg-white text-slate-900 shadow-xs border border-slate-300"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <span>🇮🇳 ₹ INR (India)</span>
              </button>
              <button
                onClick={() => setCurrency("USD")}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
                  currency === "USD"
                    ? "bg-white text-slate-900 shadow-xs border border-slate-300"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <span>🌐 $ USD (Global)</span>
              </button>
            </div>

            {/* Monthly / Annual Toggle */}
            <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-200">
              <span className={`text-xs font-extrabold ${!isAnnual ? "text-slate-900" : "text-slate-500"}`}>
                Monthly Billing
              </span>
              <button
                onClick={() => setIsAnnual(!isAnnual)}
                className="w-12 h-6 bg-slate-900 rounded-full p-0.5 transition-colors relative focus:outline-none"
              >
                <div
                  className={`w-5 h-5 rounded-full bg-gradient-to-tr from-purple-300 to-cyan-300 transition-transform ${
                    isAnnual ? "translate-x-6" : "translate-x-0"
                  }`}
                />
              </button>
              <span className={`text-xs font-extrabold ${isAnnual ? "text-slate-900" : "text-slate-500"}`}>
                Annual Billing <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full ml-1">Save 20%</span>
              </span>
            </div>

          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          
          {/* Plan 1: Starter */}
          <div className="bg-white rounded-3xl p-8 border-2 border-slate-200 shadow-sm flex flex-col justify-between hover:border-slate-300 transition-all">
            <div>
              <div className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Starter Creator</div>
              <h3 className="text-2xl font-black text-slate-900 mt-1">Free Studio</h3>
              <p className="text-slate-600 text-xs mt-2 font-medium">Perfect for trying AI voice cloning and regional dubbing.</p>

              <div className="mt-6 flex items-baseline">
                <span className="text-4xl font-black text-slate-900">
                  {currency === "INR" ? "₹0" : "$0"}
                </span>
                <span className="text-slate-500 text-xs font-bold ml-1">/ forever</span>
              </div>

              <ul className="mt-8 space-y-3.5 text-xs text-slate-700 font-semibold">
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span><strong>15 Minutes</strong> video dubbing / month</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>5 Languages (Telugu, Hindi, Tamil, English, Spanish)</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>2 Speaker Diarization support</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>720p HD Render resolution</span>
                </li>
              </ul>
            </div>

            <Link
              href="/auth/sign-up"
              className="mt-8 w-full block text-center py-3.5 rounded-2xl font-extrabold text-xs text-black bg-slate-100 hover:bg-slate-200 border border-slate-300 transition-colors"
            >
              Get Started Free
            </Link>
          </div>

          {/* Plan 2: Pro Studio (Featured) */}
          <div className="bg-white rounded-3xl p-8 border-2 border-purple-600 shadow-2xl relative flex flex-col justify-between">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-purple-700 text-white text-[11px] font-black px-4 py-1 rounded-full uppercase tracking-wider shadow-md border border-purple-400">
              Most Popular
            </div>

            <div>
              <div className="text-xs font-extrabold text-purple-700 uppercase tracking-wider">Pro Localization</div>
              <h3 className="text-2xl font-black text-slate-900 mt-1">Studio Pro</h3>
              <p className="text-slate-600 text-xs mt-2 font-medium">Designed for YouTubers, educators, and course creators.</p>

              <div className="mt-6 flex items-baseline">
                <span className="text-4xl font-black text-slate-900">
                  {currency === "INR"
                    ? (isAnnual ? "₹1,199" : "₹1,499")
                    : (isAnnual ? "$49" : "$59")}
                </span>
                <span className="text-slate-500 text-xs font-bold ml-1">/ month</span>
              </div>

              <ul className="mt-8 space-y-3.5 text-xs text-slate-700 font-semibold">
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-purple-600 shrink-0" />
                  <span><strong>180 Minutes</strong> video dubbing / month</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-purple-600 shrink-0" />
                  <span><strong>30+ Languages</strong> (All Indian & International)</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-purple-600 shrink-0" />
                  <span>Unlimited Speaker Diarization & Voice Cloning</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-purple-600 shrink-0" />
                  <span><strong>Wav2Lip Lip Sync Engine</strong> (1080p Full HD)</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-purple-600 shrink-0" />
                  <span>Background Score (BGM) & SFX Isolation</span>
                </li>
              </ul>
            </div>

            <Link
              href="/studio"
              className="mt-8 w-full block text-center py-3.5 rounded-2xl font-extrabold text-xs text-black bg-gradient-to-r from-purple-300 via-indigo-200 to-cyan-300 hover:from-purple-400 hover:to-cyan-400 shadow-md shadow-purple-500/20 border border-purple-400 transition-all"
            >
              Start 14-Day Free Trial
            </Link>
          </div>

          {/* Plan 3: Enterprise */}
          <div className="bg-white rounded-3xl p-8 border-2 border-slate-200 shadow-sm flex flex-col justify-between hover:border-slate-300 transition-all">
            <div>
              <div className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Enterprise Global</div>
              <h3 className="text-2xl font-black text-slate-900 mt-1">Custom Scale</h3>
              <p className="text-slate-600 text-xs mt-2 font-medium">For movie studios, broadcasting networks, and OTT platforms.</p>

              <div className="mt-6 flex items-baseline">
                <span className="text-4xl font-black text-slate-900">Custom</span>
              </div>

              <ul className="mt-8 space-y-3.5 text-xs text-slate-700 font-semibold">
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-cyan-600 shrink-0" />
                  <span><strong>Unlimited</strong> dubbing hours & API access</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-cyan-600 shrink-0" />
                  <span>4K Ultra HD Lip Sync Video Compositing</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-cyan-600 shrink-0" />
                  <span>Custom fine-tuned voice models for celebrity actors</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-cyan-600 shrink-0" />
                  <span>Dedicated GPU Pipeline & SLA Guarantee</span>
                </li>
              </ul>
            </div>

            <Link
              href="/auth/sign-up"
              className="mt-8 w-full block text-center py-3.5 rounded-2xl font-extrabold text-xs text-black border-2 border-slate-900 hover:bg-slate-100 transition-colors"
            >
              Contact Sales Team
            </Link>
          </div>

        </div>

      </div>
    </section>
  );
}

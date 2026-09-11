"use client";

import React, { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

const FAQS = [
  {
    q: "How does Dubzeek AI preserve the original speaker's voice in target languages?",
    a: "Dubzeek AI uses zero-shot voice cloning neural architecture. It extracts a 10-second acoustic fingerprint from the original audio and generates target synthetic speech (e.g. in Telugu or Hindi) matching the speaker's vocal timbre, pitch range, and accent characteristics."
  },
  {
    q: "Can Dubzeek AI handle videos with multiple speakers?",
    a: "Yes! Our platform features automatic speaker diarization. It segments dialogues by actor and builds distinct voice clone profiles for each speaker in the scene, ensuring multi-speaker conversations retain separate voices."
  },
  {
    q: "What happens to the background music (BGM) and sound effects?",
    a: "Dubzeek AI automatically demuxes input audio into isolated vocal tracks vs background score (BGM/SFX). The translated AI voice dub is synchronized and remixed back over the untouched original background music."
  },
  {
    q: "How does visual lip synchronization work?",
    a: "Our optional Lip Sync module applies deep visual generative models (Wav2Lip / LatentSync) to modify actor mouth movements in the video frames so they align naturally with translated target syllables."
  },
  {
    q: "Which languages are supported out of the box?",
    a: "We support Telugu, Hindi, Tamil, Kannada, Malayalam, Bengali, Marathi, Gujarati, Chinese (Mandarin), Japanese, Spanish, German, French, Arabic, English, and over 15 additional global languages."
  }
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-purple-600 bg-purple-100 px-3 py-1 rounded-full">
            Frequently Asked Questions
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3 tracking-tight">
            Everything You Need To Know
          </h2>
          <p className="text-slate-600 mt-2 text-base">
            Have questions about accuracy, rendering time, or regional language support?
          </p>
        </div>

        {/* Accordions */}
        <div className="space-y-4">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="border border-slate-200 rounded-xl overflow-hidden bg-white transition-colors"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full text-left p-5 flex items-center justify-between font-semibold text-slate-900 hover:text-purple-700 gap-4"
                >
                  <span className="text-base">{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 shrink-0 transition-transform ${
                      isOpen ? "rotate-180 text-purple-600" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

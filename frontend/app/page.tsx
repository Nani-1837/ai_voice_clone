"use client";

import React from "react";
import dynamic from "next/dynamic";
import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";

// Skeleton Loading Fallback Component
const SectionLoadingSkeleton = () => (
  <div className="py-16 bg-white border-b border-slate-100 flex flex-col items-center justify-center min-h-[300px] animate-pulse">
    <div className="w-10 h-10 rounded-xl bg-purple-100 mb-3 flex items-center justify-center">
      <div className="w-5 h-5 rounded-full bg-purple-300" />
    </div>
    <div className="h-4 w-48 bg-slate-200 rounded-lg mb-2" />
    <div className="h-3 w-32 bg-slate-100 rounded-lg" />
  </div>
);

// Dynamic Lazy Loading for Below-the-Fold Components
const DubbingDemoSimulator = dynamic(
  () => import("@/components/landing/DubbingDemoSimulator"),
  {
    loading: () => <SectionLoadingSkeleton />,
    ssr: false,
  }
);


const FeaturesSection = dynamic(
  () => import("@/components/landing/FeaturesSection"),
  {
    loading: () => <SectionLoadingSkeleton />,
  }
);

const LanguageCoverage = dynamic(
  () => import("@/components/landing/LanguageCoverage"),
  {
    loading: () => <SectionLoadingSkeleton />,
  }
);

const PricingSection = dynamic(
  () => import("@/components/landing/PricingSection"),
  {
    loading: () => <SectionLoadingSkeleton />,
  }
);

const FAQSection = dynamic(
  () => import("@/components/landing/FAQSection"),
  {
    loading: () => <SectionLoadingSkeleton />,
  }
);

const Footer = dynamic(
  () => import("@/components/landing/Footer"),
  {
    loading: () => <SectionLoadingSkeleton />,
  }
);

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-purple-100 selection:text-purple-700">
      <Navbar />
      <main>
        <HeroSection />
        <DubbingDemoSimulator />
        <FeaturesSection />
        <LanguageCoverage />
        <PricingSection />
        <FAQSection />
      </main>
      <Footer />
    </div>
  );
}

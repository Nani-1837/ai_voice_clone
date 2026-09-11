"use client";

import React from "react";
import Navbar from "@/components/landing/Navbar";
import FeaturesSection from "@/components/landing/FeaturesSection";
import LanguageCoverage from "@/components/landing/LanguageCoverage";
import Footer from "@/components/landing/Footer";

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="pt-8">
        <FeaturesSection />
        <LanguageCoverage />
      </div>
      <Footer />
    </div>
  );
}

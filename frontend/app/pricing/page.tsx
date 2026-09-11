"use client";

import React from "react";
import Navbar from "@/components/landing/Navbar";
import PricingSection from "@/components/landing/PricingSection";
import FAQSection from "@/components/landing/FAQSection";
import Footer from "@/components/landing/Footer";

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="pt-8">
        <PricingSection />
        <FAQSection />
      </div>
      <Footer />
    </div>
  );
}

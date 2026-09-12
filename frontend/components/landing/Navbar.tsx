"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Globe, ChevronRight, Menu, X, User as UserIcon, LogOut, ChevronDown } from "lucide-react";

interface UserProfile {
  id: number;
  full_name: string;
  email: string;
}

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  useEffect(() => {
    // Check if user is logged in via localStorage
    const storedUser = localStorage.getItem("dubzeek_user");
    const storedToken = localStorage.getItem("dubzeek_access_token");

    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error("Failed to parse stored user data", err);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("dubzeek_access_token");
    localStorage.removeItem("dubzeek_user");
    setUser(null);
    setProfileDropdownOpen(false);
  };

  const getInitials = (name: string) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100 transition-all font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <img
              src="/cropped_circle_image.png"
              alt="Dubzeek AI Logo"
              className="w-10 h-10 rounded-full object-cover shadow-xs group-hover:scale-105 transition-transform border border-slate-200"
            />
            <div className="flex flex-col">
              <span className="font-extrabold text-lg text-slate-900 tracking-tight flex items-center gap-1.5">
                Dubzeek <span className="bg-purple-100 text-purple-700 text-xs px-2 py-0.5 rounded-full font-bold">AI</span>
              </span>
              <span className="text-[10px] text-slate-500 font-semibold tracking-wide">MULTILINGUAL DUBBING PLATFORM</span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <Link href="/#simulator" className="hover:text-purple-600 transition-colors">
              Live Demo
            </Link>
            <Link href="/#features" className="hover:text-purple-600 transition-colors">
              Features
            </Link>
            <Link href="/#languages" className="hover:text-purple-600 transition-colors flex items-center gap-1">
              <Globe className="w-3.5 h-3.5 text-cyan-600" />
              Languages
            </Link>
            <Link href="/dashboard" className="hover:text-purple-600 transition-colors">
              Studio Workspace
            </Link>
            <Link href="/pricing" className="hover:text-purple-600 transition-colors">
              Pricing
            </Link>
          </nav>

          {/* CTA Action Buttons / Profile Section */}
          <div className="hidden sm:flex items-center gap-3 relative">
            {user ? (
              /* User Profile Menu */
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-all"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                    {getInitials(user.full_name)}
                  </div>
                  <span className="text-xs font-semibold text-slate-800 max-w-[120px] truncate">
                    {user.full_name}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                </button>

                {/* Profile Dropdown Menu */}
                <AnimatePresence>
                  {profileDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-2xl shadow-xl p-2 z-50 space-y-1"
                    >
                      <div className="px-3 py-2 border-b border-slate-100">
                        <p className="text-xs font-bold text-slate-900 truncate">{user.full_name}</p>
                        <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                      </div>

                      <Link
                        href="/dashboard"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-purple-50 hover:text-purple-700 rounded-xl transition-all"
                      >
                        <Sparkles className="w-4 h-4 text-purple-600" />
                        <span>Studio Workspace</span>
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 rounded-xl transition-all"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              /* Guest Actions */
              <>
                <Link
                  href="/auth/login"
                  className="text-sm font-semibold text-slate-800 hover:text-purple-700 px-4 py-2 rounded-xl hover:bg-slate-100 transition-all border border-slate-200"
                >
                  Sign In
                </Link>
                <Link
                  href="/dashboard"
                  className="relative inline-flex items-center gap-2 text-sm font-bold text-slate-900 bg-gradient-to-r from-purple-300 via-indigo-200 to-cyan-300 hover:from-purple-400 hover:to-cyan-400 px-4 py-2.5 rounded-xl shadow-xs border border-purple-300/60 transition-all group overflow-hidden"
                >
                  <Sparkles className="w-4 h-4 text-slate-900 group-hover:rotate-12 transition-transform" />
                  <span className="text-slate-900 font-bold">Studio Workspace</span>
                  <ChevronRight className="w-4 h-4 text-slate-900 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-3"
        >
          <Link
            href="/#simulator"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-50"
          >
            Live Demo
          </Link>
          <Link
            href="/#features"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-50"
          >
            Features
          </Link>
          <Link
            href="/#languages"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-50"
          >
            Supported Languages
          </Link>
          <Link
            href="/dashboard"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-50"
          >
            Studio Workspace
          </Link>
          <Link
            href="/pricing"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-50"
          >
            Pricing Plans
          </Link>

          <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
            {user ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-xl">
                  <div className="w-8 h-8 rounded-full bg-purple-600 text-white font-bold text-xs flex items-center justify-center">
                    {getInitials(user.full_name)}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">{user.full_name}</p>
                    <p className="text-[11px] text-slate-500">{user.email}</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full text-center px-4 py-2.5 text-sm font-semibold text-red-600 border border-red-200 rounded-xl hover:bg-red-50"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center px-4 py-2.5 text-sm font-semibold text-slate-700 border border-slate-200 rounded-xl hover:bg-slate-50"
                >
                  Sign In
                </Link>
                <Link
                  href="/studio"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center px-4 py-2.5 text-sm font-semibold text-white bg-slate-900 rounded-xl hover:bg-purple-700"
                >
                  Launch Studio
                </Link>
              </>
            )}
          </div>
        </motion.div>
      )}
    </header>
  );
}

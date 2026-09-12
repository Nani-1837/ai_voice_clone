"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  FolderKanban,
  PlusCircle,
  Video,
  Mic2,
  Globe2,
  BarChart3,
  Settings,
  HelpCircle,
  Search,
  Bell,
  User,
  LogOut,
  ChevronDown,
  Menu,
  X,
  Sparkles,
  ShieldCheck,
  CheckCircle2
} from "lucide-react";
import { logoutUser } from "@/lib/api";

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();

  const [user, setUser] = useState<{ full_name?: string; email?: string } | null>(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // Load stored user details
    const storedUser = localStorage.getItem("dubzeek_user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse user", e);
      }
    }
  }, []);

  const navItems = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Projects", href: "/projects", icon: FolderKanban },
    { label: "Create Dubbing", href: "/create-dubbing", icon: PlusCircle, highlight: true },
    { label: "My Videos", href: "/videos", icon: Video },
    { label: "Voice Library", href: "/voice-library", icon: Mic2 },
    { label: "Languages", href: "/languages", icon: Globe2 },
    { label: "Usage", href: "/usage", icon: BarChart3 },
    { label: "Settings", href: "/settings", icon: Settings },
    { label: "Help Center", href: "/help", icon: HelpCircle },
  ];

  const handleLogout = async () => {
    await logoutUser();
  };

  const getInitials = (name?: string) => {
    if (!name) return "DZ";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col antialiased">
      {/* Top Header Bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 px-4 sm:px-6 py-3 flex items-center justify-between shadow-xs">
        {/* Left Logo & Mobile Toggle */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
          >
            {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <Link href="/dashboard" className="flex items-center gap-2.5 group">
            <img
              src="/cropped_circle_image.png"
              alt="Dubzeek Logo"
              className="w-9 h-9 rounded-full object-cover border border-slate-200 group-hover:scale-105 transition-transform"
            />
            <div className="flex flex-col">
              <span className="font-extrabold text-lg text-slate-900 tracking-tight leading-none flex items-center gap-1.5">
                Dubzeek <span className="text-[10px] uppercase font-bold bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded-full">AI Studio</span>
              </span>
              <span className="text-[10px] text-slate-400 font-medium">Multilingual Video Localization</span>
            </div>
          </Link>
        </div>

        {/* Center Search Input */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search dubbing projects, voices, languages..."
              className="w-full pl-10 pr-4 py-2 bg-slate-100/80 border border-slate-200/80 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all text-slate-900"
            />
          </div>
        </div>

        {/* Right Header Menu (Notifications & Profile) */}
        <div className="flex items-center gap-3">
          {/* Create CTA Button (Desktop) */}
          <Link
            href="/create-dubbing"
            className="hidden sm:inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold text-xs px-4 py-2 rounded-xl shadow-xs shadow-purple-600/20 transition-all hover:shadow-md"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Create Dubbing</span>
          </Link>

          {/* Notifications Dropdown Toggle */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 text-slate-600 hover:bg-slate-100 rounded-xl relative transition-colors"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-purple-600 rounded-full ring-2 ring-white"></span>
            </button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl p-4 z-50 text-xs"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 font-bold text-slate-900">
                    <span>Notifications</span>
                    <span className="text-[10px] text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full font-semibold">2 New</span>
                  </div>
                  <div className="space-y-3 mt-3">
                    <div className="p-2.5 bg-purple-50/60 rounded-xl border border-purple-100 flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-semibold text-slate-900">Project Dubbing Complete</div>
                        <div className="text-[11px] text-slate-500">"Telugu Product Demo.mp4" has finished rendering.</div>
                        <div className="text-[9px] text-slate-400 mt-1">2 minutes ago</div>
                      </div>
                    </div>
                    <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-2.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-semibold text-slate-900">Account Security Status</div>
                        <div className="text-[11px] text-slate-500">Rate Limiting & OWASP 64-bit Auth active.</div>
                        <div className="text-[9px] text-slate-400 mt-1">1 hour ago</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="h-5 w-px bg-slate-200"></div>

          {/* User Profile Dropdown Menu */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2.5 p-1 hover:bg-slate-100 rounded-xl transition-colors text-left"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                {getInitials(user?.full_name)}
              </div>
              <div className="hidden sm:flex flex-col">
                <span className="text-xs font-bold text-slate-900 leading-tight">
                  {user?.full_name || "Dubzeek Creator"}
                </span>
                <span className="text-[10px] text-slate-400 font-normal">
                  {user?.email || "creator@dubzeek.ai"}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
            </button>

            <AnimatePresence>
              {showProfileMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-50 text-xs"
                >
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="font-bold text-slate-900">{user?.full_name || "Dubzeek Creator"}</p>
                    <p className="text-[11px] text-slate-400 truncate">{user?.email || "creator@dubzeek.ai"}</p>
                  </div>

                  <div className="py-1">
                    <Link
                      href="/dashboard"
                      onClick={() => setShowProfileMenu(false)}
                      className="flex items-center gap-2 px-4 py-2 text-slate-700 hover:bg-purple-50 hover:text-purple-700 transition-colors font-semibold"
                    >
                      <Sparkles className="w-4 h-4 text-purple-600" />
                      <span>Studio Workspace</span>
                    </Link>
                    <Link
                      href="/settings"
                      onClick={() => setShowProfileMenu(false)}
                      className="flex items-center gap-2 px-4 py-2 text-slate-700 hover:bg-purple-50 hover:text-purple-700 transition-colors"
                    >
                      <User className="w-4 h-4 text-slate-400" />
                      <span>My Profile & Settings</span>
                    </Link>
                    <Link
                      href="/help"
                      onClick={() => setShowProfileMenu(false)}
                      className="flex items-center gap-2 px-4 py-2 text-slate-700 hover:bg-purple-50 hover:text-purple-700 transition-colors"
                    >
                      <HelpCircle className="w-4 h-4 text-slate-400" />
                      <span>Help & Documentation</span>
                    </Link>
                  </div>

                  <div className="border-t border-slate-100 pt-1">
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition-colors font-medium"
                    >
                      <LogOut className="w-4 h-4 text-red-500" />
                      <span>Log Out Session</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      {/* Main Sidebar + Content Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar Navigation */}
        <aside className="hidden lg:flex w-64 flex-col bg-white border-r border-slate-200 p-4 space-y-6 shrink-0">
          <nav className="space-y-1 flex-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
              const Icon = item.icon;

              if (item.highlight) {
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-3 px-3.5 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xs shadow-md shadow-purple-600/20 hover:shadow-lg transition-all mb-4 mt-2"
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-purple-50 text-purple-700 font-bold border border-purple-100/80 shadow-2xs"
                      : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-purple-600" : "text-slate-400"}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Minimal Usage Widget in Sidebar */}
          <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-2">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-700">
              <span>Monthly Minutes</span>
              <span className="text-purple-600 font-mono">45 / 60m</span>
            </div>
            <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full bg-purple-600 rounded-full" style={{ width: "75%" }}></div>
            </div>
            <p className="text-[10px] text-slate-400">15 free minutes remaining</p>
          </div>
        </aside>

        {/* Mobile Overlay Sidebar Drawer */}
        <AnimatePresence>
          {mobileSidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 lg:hidden"
              onClick={() => setMobileSidebarOpen(false)}
            >
              <motion.aside
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                className="w-64 bg-white h-full p-4 space-y-6 shadow-2xl flex flex-col"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <span className="font-extrabold text-slate-900 text-sm">Dubzeek Navigation</span>
                  <button onClick={() => setMobileSidebarOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <nav className="space-y-1 flex-1">
                  {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileSidebarOpen(false)}
                        className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold ${
                          isActive
                            ? "bg-purple-50 text-purple-700 font-bold"
                            : "text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        <Icon className={`w-4 h-4 ${isActive ? "text-purple-600" : "text-slate-400"}`} />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </nav>
              </motion.aside>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content Workspace View */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

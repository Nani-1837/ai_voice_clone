"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Mail, Lock, CheckCircle2, Eye, EyeOff, ShieldCheck, AlertCircle, Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    try {
      const response = await fetch(`${apiBaseUrl}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Invalid email or password");
      }

      // Store JWT token and user in localStorage
      localStorage.setItem("dubzeek_access_token", data.access_token);
      localStorage.setItem("dubzeek_user", JSON.stringify(data.user));

      setSubmitted(true);
      setTimeout(() => {
        router.push("/create-dubbing");
      }, 1500);
    } catch (err: any) {
      setErrorMsg(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between relative overflow-hidden font-sans">
      {/* Header */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-purple-600 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dubzeek AI</span>
        </Link>
      </div>

      {/* Login Card */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-white border border-slate-200 p-8 rounded-3xl shadow-xl shadow-slate-100 relative"
        >
          {/* Logo & Header */}
          <div className="text-center mb-6">
            <img
              src="/cropped_circle_image.png"
              alt="Dubzeek AI Logo"
              className="w-14 h-14 rounded-full object-cover mx-auto shadow-sm mb-3 border border-slate-200"
            />
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Sign In to Dubzeek AI</h1>
            <p className="text-xs text-slate-500 mt-1">Access your AI video dubbing studio workspace</p>
          </div>

          {errorMsg && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-red-700 text-xs font-medium"
            >
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
              <span>{errorMsg}</span>
            </motion.div>
          )}

          {submitted ? (
            <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h3 className="text-base font-bold text-emerald-900">Signed In Successfully!</h3>
              <p className="text-xs font-normal text-emerald-700">Launching your workspace...</p>
              <Link
                href="/create-dubbing"
                className="inline-block mt-2 px-6 py-2.5 bg-emerald-600 text-white font-medium text-xs rounded-xl hover:bg-emerald-700 shadow-sm transition-all"
              >
                Go to Workspace Now
              </Link>
            </div>
          ) : (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Work Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="creator@studio.com"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all text-slate-900 font-normal"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-700">Password</label>
                  <a href="#" className="text-[11px] font-semibold text-purple-600 hover:underline">Forgot password?</a>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all text-slate-900 font-normal"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 p-1"
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Security Privacy Notice */}
              <div className="flex items-center gap-2 p-2.5 bg-slate-50 border border-slate-100 rounded-xl text-[11px] text-slate-500 font-normal">
                <ShieldCheck className="w-4 h-4 text-purple-600 shrink-0" />
                <span>Protected by end-to-end cloud security.</span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-gradient-to-r from-purple-300 via-indigo-200 to-cyan-300 hover:from-purple-400 hover:to-cyan-400 text-slate-900 font-bold rounded-2xl shadow-md shadow-purple-500/10 text-sm border border-purple-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-slate-900" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <span>Sign In to Studio</span>
                )}
              </button>
            </form>
          )}

          <div className="mt-6 pt-6 border-t border-slate-100 text-center text-xs text-slate-500 font-normal">
            Don't have a studio account yet?{" "}
            <Link href="/auth/sign-up" className="font-semibold text-purple-600 hover:underline">
              Create free account
            </Link>
          </div>
        </motion.div>
      </div>

      <div className="py-4 text-center text-xs text-slate-400 font-normal">
        © Dubzeek AI Platform • All rights reserved
      </div>
    </div>
  );
}

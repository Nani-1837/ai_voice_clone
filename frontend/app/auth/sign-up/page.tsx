"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  ArrowLeft, Mail, Lock, User, Globe, CheckCircle2, 
  Eye, EyeOff, ShieldCheck, AlertCircle, Loader2, KeyRound 
} from "lucide-react";

export default function SignUpPage() {
  const router = useRouter();

  // Form State
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [primaryLanguage, setPrimaryLanguage] = useState("Telugu");
  const [showPassword, setShowPassword] = useState(false);

  // OTP State
  const [step, setStep] = useState<"form" | "otp">("form");
  const [otpCode, setOtpCode] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isCompleted, setIsCompleted] = useState(false);

  // Password Validation Metrics
  const passwordCriteria = useMemo(() => {
    return {
      length: password.length >= 8,
      hasUpper: /[A-Z]/.test(password),
      hasLower: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecial: /[^A-Za-z0-9]/.test(password),
    };
  }, [password]);

  const passwordScore = useMemo(() => {
    let score = 0;
    if (passwordCriteria.length) score++;
    if (passwordCriteria.hasUpper) score++;
    if (passwordCriteria.hasLower) score++;
    if (passwordCriteria.hasNumber) score++;
    if (passwordCriteria.hasSpecial) score++;
    return score;
  }, [passwordCriteria]);

  const getStrengthLabel = () => {
    if (passwordScore <= 1) return { text: "Weak", color: "bg-red-500", textCol: "text-red-600" };
    if (passwordScore <= 3) return { text: "Fair", color: "bg-amber-500", textCol: "text-amber-600" };
    if (passwordScore === 4) return { text: "Good", color: "bg-blue-500", textCol: "text-blue-600" };
    return { text: "Strong Password", color: "bg-emerald-500", textCol: "text-emerald-600" };
  };

  // Step 1: Send OTP
  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (passwordScore < 3) {
      setErrorMsg("Please choose a stronger password before proceeding.");
      return;
    }

    setLoading(true);
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    try {
      const response = await fetch(`${apiBaseUrl}/api/auth/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Failed to send verification email");
      }

      setStep("otp");
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to send verification code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // OTP Input Changes & Paste
  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      const digits = value.replace(/\D/g, "").slice(0, 6).split("");
      if (digits.length > 0) {
        const newOtp = [...otpCode];
        digits.forEach((d, i) => {
          if (i < 6) newOtp[i] = d;
        });
        setOtpCode(newOtp);
        const focusIndex = Math.min(digits.length - 1, 5);
        document.getElementById(`otp-input-${focusIndex}`)?.focus();
        return;
      }
      value = value[value.length - 1];
    }
    const newOtp = [...otpCode];
    newOtp[index] = value;
    setOtpCode(newOtp);

    // Auto focus next field
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasteText = e.clipboardData.getData("text").trim();
    const digits = pasteText.replace(/\D/g, "").slice(0, 6).split("");
    if (digits.length > 0) {
      const newOtp = [...otpCode];
      digits.forEach((d, i) => {
        if (i < 6) newOtp[i] = d;
      });
      setOtpCode(newOtp);
      const focusIndex = Math.min(digits.length - 1, 5);
      document.getElementById(`otp-input-${focusIndex}`)?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otpCode[index] && index > 0) {
      const prevInput = document.getElementById(`otp-input-${index - 1}`);
      prevInput?.focus();
    }
  };

  // Step 2: Verify OTP & Register User
  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    const fullOtp = otpCode.join("");
    if (fullOtp.length < 6) {
      setErrorMsg("Please enter the full 6-digit verification code.");
      return;
    }

    setLoading(true);
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    try {
      const response = await fetch(`${apiBaseUrl}/api/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email,
          otp_code: fullOtp,
          full_name: fullName,
          password,
          primary_language: primaryLanguage,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Verification failed. Invalid or expired code.");
      }

      // Store Auth Session Token
      localStorage.setItem("dubzeek_access_token", data.access_token);
      localStorage.setItem("dubzeek_user", JSON.stringify(data.user));

      setIsCompleted(true);
      setTimeout(() => {
        router.push("/create-dubbing");
      }, 1500);
    } catch (err: any) {
      setErrorMsg(err.message || "Invalid verification code.");
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

      {/* Main Sign Up Card */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-lg bg-white border border-slate-200 p-8 rounded-3xl shadow-xl shadow-slate-100 relative"
        >
          {/* Logo & Header */}
          <div className="text-center mb-6">
            <img
              src="/cropped_circle_image.png"
              alt="Dubzeek AI Logo"
              className="w-14 h-14 rounded-full object-cover mx-auto shadow-sm mb-3 border border-slate-200"
            />
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Create Dubzeek Studio Account</h1>
            <p className="text-xs text-slate-500 mt-1">Get 15 free video dubbing minutes with voice cloning</p>
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

          {isCompleted ? (
            <div className="p-6 bg-purple-50 border border-purple-200 rounded-2xl text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-purple-600 mx-auto" />
              <h3 className="text-base font-bold text-purple-900">Account Verified & Created!</h3>
              <p className="text-xs font-normal text-purple-700">Launching your workspace...</p>
              <Link
                href="/create-dubbing"
                className="inline-block mt-2 px-6 py-2.5 bg-purple-600 text-white font-medium text-xs rounded-xl hover:bg-purple-700 shadow-sm transition-all"
              >
                Go to Workspace Now
              </Link>
            </div>
          ) : step === "form" ? (
            <form onSubmit={handleSendOTP} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Srinivas Rao"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all text-slate-900 font-normal"
                  />
                </div>
              </div>

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
                <label className="block text-xs font-semibold text-slate-700 mb-1">Create Password</label>
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

                {/* Password Strength Meter & Instructions */}
                {password.length > 0 && (
                  <div className="mt-3 p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-2">
                    <div className="flex items-center justify-between text-xs font-medium">
                      <span className="text-slate-600">Password Strength:</span>
                      <span className={getStrengthLabel().textCol}>{getStrengthLabel().text}</span>
                    </div>
                    {/* Bar */}
                    <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden flex gap-1">
                      <div className={`h-full flex-1 transition-all ${passwordScore >= 1 ? getStrengthLabel().color : "bg-transparent"}`}></div>
                      <div className={`h-full flex-1 transition-all ${passwordScore >= 2 ? getStrengthLabel().color : "bg-transparent"}`}></div>
                      <div className={`h-full flex-1 transition-all ${passwordScore >= 3 ? getStrengthLabel().color : "bg-transparent"}`}></div>
                      <div className={`h-full flex-1 transition-all ${passwordScore >= 4 ? getStrengthLabel().color : "bg-transparent"}`}></div>
                      <div className={`h-full flex-1 transition-all ${passwordScore >= 5 ? getStrengthLabel().color : "bg-transparent"}`}></div>
                    </div>
                    {/* Checklist */}
                    <div className="grid grid-cols-2 gap-1 pt-1 text-[11px] text-slate-600">
                      <div className={`flex items-center gap-1 ${passwordCriteria.length ? "text-emerald-600 font-medium" : "text-slate-400"}`}>
                        <span>{passwordCriteria.length ? "✓" : "○"} 8+ Characters</span>
                      </div>
                      <div className={`flex items-center gap-1 ${passwordCriteria.hasUpper ? "text-emerald-600 font-medium" : "text-slate-400"}`}>
                        <span>{passwordCriteria.hasUpper ? "✓" : "○"} Uppercase (A-Z)</span>
                      </div>
                      <div className={`flex items-center gap-1 ${passwordCriteria.hasNumber ? "text-emerald-600 font-medium" : "text-slate-400"}`}>
                        <span>{passwordCriteria.hasNumber ? "✓" : "○"} Number (0-9)</span>
                      </div>
                      <div className={`flex items-center gap-1 ${passwordCriteria.hasSpecial ? "text-emerald-600 font-medium" : "text-slate-400"}`}>
                        <span>{passwordCriteria.hasSpecial ? "✓" : "○"} Symbol (@#$%!)</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-gradient-to-r from-purple-300 via-indigo-200 to-cyan-300 hover:from-purple-400 hover:to-cyan-400 text-slate-900 font-bold rounded-2xl shadow-md shadow-purple-500/10 text-sm border border-purple-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-4"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-slate-900" />
                    <span>Sending Code...</span>
                  </>
                ) : (
                  <>
                    <KeyRound className="w-4 h-4" />
                    <span>Send Verification Code</span>
                  </>
                )}
              </button>
            </form>
          ) : (
            /* OTP Entry Form Step */
            <form onSubmit={handleVerifyOTP} className="space-y-5">
              <div className="p-4 bg-purple-50 border border-purple-100 rounded-2xl text-center space-y-1">
                <p className="text-xs font-semibold text-purple-900">Verification Code Dispatched</p>
                <p className="text-xs text-purple-700">We sent a 6-digit verification code to <strong>{email}</strong>.</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-3 text-center">Enter 6-Digit Verification Code</label>
                <div className="flex justify-center gap-2">
                  {otpCode.map((digit, idx) => (
                    <input
                      key={idx}
                      id={`otp-input-${idx}`}
                      type="text"
                      maxLength={6}
                      value={digit}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      onPaste={handleOtpPaste}
                      onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                      className="w-11 h-12 text-center text-lg font-bold bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white text-purple-900"
                    />
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center text-xs px-1">
                <button
                  type="button"
                  onClick={() => setStep("form")}
                  className="font-medium text-slate-500 hover:text-slate-800"
                >
                  ← Edit Details
                </button>
                <button
                  type="button"
                  onClick={handleSendOTP}
                  className="font-semibold text-purple-600 hover:underline"
                >
                  Resend Code
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-gradient-to-r from-purple-300 via-indigo-200 to-cyan-300 hover:from-purple-400 hover:to-cyan-400 text-slate-900 font-bold rounded-2xl shadow-md shadow-purple-500/10 text-sm border border-purple-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-slate-900" />
                    <span>Verifying Code...</span>
                  </>
                ) : (
                  <span>Verify & Create Account</span>
                )}
              </button>
            </form>
          )}

          <div className="mt-6 pt-6 border-t border-slate-100 text-center text-xs text-slate-500 font-normal">
            Already have an account?{" "}
            <Link href="/auth/login" className="font-semibold text-purple-600 hover:underline">
              Sign In
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

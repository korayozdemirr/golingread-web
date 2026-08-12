"use client";

import React, { useState } from "react";
import { useAppStore } from "@/store/useAppStore";

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    closeAuthModal,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
  } = useAppStore();

  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  if (!isAuthModalOpen) return null;

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    const { error } = await signInWithGoogle();
    if (error) {
      setErrorMessage(error.message);
      setIsLoading(false);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      setErrorMessage("Please enter both email and password.");
      setIsLoading(false);
      return;
    }

    if (mode === "signin") {
      const { error } = await signInWithEmail(trimmedEmail, trimmedPassword);
      if (error) {
        if (error.message.toLowerCase().includes("too many") || error.status === 429) {
          setErrorMessage("Too many sign-in attempts. Please wait a moment or sign in with Google.");
        } else if (error.message.toLowerCase().includes("invalid login credentials")) {
          setErrorMessage("Invalid email or password. If you haven't created an account yet, please switch to 'Create Account'.");
        } else {
          setErrorMessage(error.message);
        }
      }
    } else {
      const { error, user } = await signUpWithEmail(trimmedEmail, trimmedPassword, name.trim());
      if (error) {
        if (error.message.toLowerCase().includes("too many") || error.message.toLowerCase().includes("rate limit") || error.status === 429) {
          setErrorMessage("Email rate limit reached. Please wait a few minutes before trying again, or use Google Sign-In.");
        } else if (error.message.toLowerCase().includes("user already registered")) {
          setErrorMessage("An account with this email already exists. Please switch to the 'Sign In' tab.");
        } else if (error.message.toLowerCase().includes("invalid") && error.message.toLowerCase().includes("email")) {
          setErrorMessage("Supabase reported this email address as invalid. Please check for typos, or disable 'Confirm email' in Supabase Dashboard -> Auth -> Providers -> Email.");
        } else {
          setErrorMessage(error.message);
        }
      } else if (user && !user.confirmed_at) {
        setSuccessMessage(
          "Account created! Please check your email inbox to confirm your account."
        );
      }
    }
    setIsLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-3xl bg-[#FDFBF7] dark:bg-[#16171B] border border-[#E5E7EB] dark:border-[#2E2E2E] shadow-2xl overflow-hidden p-6 sm:p-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#E5E7EB] dark:border-[#2E2E2E]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-800 dark:from-indigo-500 dark:to-indigo-700 flex items-center justify-center text-white shadow-xs">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-base font-bold text-[#1F2937] dark:text-[#E5E7EB]">
                {mode === "signin" ? "Welcome Back" : "Join GoLingread"}
              </h3>
              <p className="text-[11px] text-[#6B7280] dark:text-[#9CA3AF]">
                Sync your vocabulary deck and reading streak
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={closeAuthModal}
            className="w-8 h-8 rounded-full bg-[#F3F4F6] dark:bg-[#252528] text-[#6B7280] hover:text-[#1F2937] dark:hover:text-[#E5E7EB] flex items-center justify-center text-xs font-bold transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex rounded-xl bg-[#F3F4F6] dark:bg-[#252528] p-1 mb-6">
          <button
            type="button"
            onClick={() => {
              setMode("signin");
              setErrorMessage(null);
              setSuccessMessage(null);
            }}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              mode === "signin"
                ? "bg-white dark:bg-[#1E1E1E] text-[#1F2937] dark:text-[#E5E7EB] shadow-2xs"
                : "text-[#6B7280] dark:text-[#9CA3AF]"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("signup");
              setErrorMessage(null);
              setSuccessMessage(null);
            }}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              mode === "signup"
                ? "bg-white dark:bg-[#1E1E1E] text-[#1F2937] dark:text-[#E5E7EB] shadow-2xs"
                : "text-[#6B7280] dark:text-[#9CA3AF]"
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Error / Success Notifications */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/60 text-rose-800 dark:text-rose-300 text-xs font-medium leading-relaxed">
            {errorMessage}
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900/60 text-emerald-800 dark:text-emerald-300 text-xs font-medium leading-relaxed">
            {successMessage}
          </div>
        )}

        {/* Google OAuth Button */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          className="w-full py-2.5 px-4 rounded-xl bg-white dark:bg-[#1E1E1E] border border-[#E5E7EB] dark:border-[#2E2E2E] hover:bg-[#F9FAFB] dark:hover:bg-[#252528] text-xs sm:text-sm font-semibold text-[#1F2937] dark:text-[#E5E7EB] transition-all flex items-center justify-center gap-3 cursor-pointer shadow-xs mb-4"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Continue with Google</span>
        </button>

        {/* Divider */}
        <div className="relative flex items-center justify-center my-4">
          <div className="w-full border-t border-[#E5E7EB] dark:border-[#2E2E2E]" />
          <span className="absolute bg-[#FDFBF7] dark:bg-[#16171B] px-3 text-[11px] font-semibold text-[#6B7280] dark:text-[#9CA3AF] uppercase">
            or with email
          </span>
        </div>

        {/* Email / Password Form */}
        <form onSubmit={handleEmailSubmit} className="space-y-3">
          {mode === "signup" && (
            <div>
              <label className="block text-xs font-semibold text-[#6B7280] dark:text-[#9CA3AF] mb-1">
                Your Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Leo Smith"
                className="w-full px-3 py-2 rounded-xl text-xs sm:text-sm bg-white dark:bg-[#1E1E1E] border border-[#E5E7EB] dark:border-[#2E2E2E] text-[#1F2937] dark:text-[#E5E7EB] focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-[#6B7280] dark:text-[#9CA3AF] mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-3 py-2 rounded-xl text-xs sm:text-sm bg-white dark:bg-[#1E1E1E] border border-[#E5E7EB] dark:border-[#2E2E2E] text-[#1F2937] dark:text-[#E5E7EB] focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#6B7280] dark:text-[#9CA3AF] mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2 rounded-xl text-xs sm:text-sm bg-white dark:bg-[#1E1E1E] border border-[#E5E7EB] dark:border-[#2E2E2E] text-[#1F2937] dark:text-[#E5E7EB] focus:outline-hidden focus:ring-2 focus:ring-indigo-500 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-xs text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#1F2937] cursor-pointer"
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 text-white font-bold text-xs sm:text-sm transition-all shadow-md mt-2 cursor-pointer disabled:opacity-50"
          >
            {isLoading
              ? "Connecting..."
              : mode === "signin"
              ? "Sign In to GoLingread"
              : "Create Free Account"}
          </button>
        </form>
      </div>
    </div>
  );
};

"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { MapPin, Github, Chrome, Loader2 } from "lucide-react";

export default function SignInPage() {
  const [isGitHubLoading, setIsGitHubLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleSignIn = async (provider: "github" | "google") => {
    if (provider === "github") {
      setIsGitHubLoading(true);
    } else {
      setIsGoogleLoading(true);
    }

    try {
      await signIn(provider, { callbackUrl: "/" });
    } catch (error) {
      console.error("登录失败:", error);
      if (provider === "github") {
        setIsGitHubLoading(false);
      } else {
        setIsGoogleLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mb-4 shadow-lg">
            <MapPin className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            欢迎来到 Skyloft
          </h1>
          <p className="text-slate-600 text-sm">
            记录你的旅行足迹，探索世界的每个角落
          </p>
        </div>

        {/* Sign In Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
          <div className="space-y-4">
            {/* GitHub Sign In */}
            <button
              onClick={() => handleSignIn("github")}
              disabled={isGitHubLoading || isGoogleLoading}
              className="w-full flex items-center justify-center gap-3 px-4 py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
            >
              {isGitHubLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Github className="w-5 h-5" />
              )}
              <span>使用 GitHub 登录</span>
            </button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-slate-500">或</span>
              </div>
            </div>

            {/* Google Sign In */}
            <button
              onClick={() => handleSignIn("google")}
              disabled={isGitHubLoading || isGoogleLoading}
              className="w-full flex items-center justify-center gap-3 px-4 py-3.5 bg-white hover:bg-slate-50 text-slate-900 rounded-xl font-medium transition-all duration-200 border border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
            >
              {isGoogleLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Chrome className="w-5 h-5" />
              )}
              <span>使用 Google 登录</span>
            </button>
          </div>

          {/* Terms */}
          <p className="mt-6 text-xs text-center text-slate-500">
            登录即表示你同意我们的服务条款和隐私政策
          </p>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-slate-600">
          <p>探索世界，从这里开始 🌍</p>
        </div>
      </div>
    </div>
  );
}

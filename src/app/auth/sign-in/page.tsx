"use client";

import { AuthChrome } from "@/components/auth-chrome";
import { SiteNav } from "@/components/site-nav";
import { Globe, Share2, Sparkles } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="bg-[#050505] min-h-screen">
      <SiteNav />
      <AuthChrome
        title="Đánh thức thanh âm di sản."
        subtitle="Bước qua cánh cổng thời gian. Đăng nhập để lưu giữ những rung cảm văn hóa, cá nhân hóa hành trình và mở khóa trọn vẹn không gian nghệ thuật tương tác."
      >
        <div className="relative group">
          {/* Subtle Glow Behind Card */}
          <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-[#C8A96B]/20 to-transparent opacity-0 blur-xl transition duration-1000 group-hover:opacity-100"></div>
          
          <form
            className="relative flex flex-col space-y-7 rounded-2xl bg-white/[0.02] p-10 border border-white/[0.05] shadow-[0_8px_32px_rgba(0,0,0,0.4)] backdrop-blur-3xl overflow-hidden"
            onSubmit={(event) => event.preventDefault()}
          >
            {/* Inner Shimmer Effect */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.05] to-transparent mix-blend-overlay"></div>
            
            <div className="relative z-10 space-y-6">
              <div className="group/input relative">
                <label className="mb-3 block text-[10px] uppercase tracking-[0.4em] text-white/40 font-medium" htmlFor="email">
                  Định danh (Email)
                </label>
                <div className="relative">
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-black/40 px-5 py-4 text-sm text-white/90 outline-none transition-all focus:border-[#C8A96B]/50 focus:bg-black/60 focus:ring-1 focus:ring-[#C8A96B]/50 placeholder:text-white/20"
                    placeholder="nguoiluutru@echoes.vn"
                  />
                  <div className="absolute inset-0 -z-10 rounded-lg bg-gradient-to-r from-[#C8A96B]/0 via-[#C8A96B]/10 to-[#C8A96B]/0 opacity-0 blur transition-opacity duration-500 group-focus-within/input:opacity-100"></div>
                </div>
              </div>

              <div className="group/input relative">
                <label className="mb-3 block text-[10px] uppercase tracking-[0.4em] text-white/40 font-medium" htmlFor="password">
                  Mật ngữ (Password)
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-black/40 px-5 py-4 text-sm text-white/90 outline-none transition-all focus:border-[#C8A96B]/50 focus:bg-black/60 focus:ring-1 focus:ring-[#C8A96B]/50 placeholder:text-white/20"
                    placeholder="••••••••"
                  />
                  <div className="absolute inset-0 -z-10 rounded-lg bg-gradient-to-r from-[#C8A96B]/0 via-[#C8A96B]/10 to-[#C8A96B]/0 opacity-0 blur transition-opacity duration-500 group-focus-within/input:opacity-100"></div>
                </div>
              </div>

              <button 
                type="submit" 
                className="group/btn relative w-full overflow-hidden rounded-lg bg-gradient-to-b from-[#C8A96B] to-[#9A7B4F] px-5 py-4 text-xs font-semibold uppercase tracking-[0.3em] text-black transition-all hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_20px_rgba(200,169,107,0.3)] hover:shadow-[0_0_30px_rgba(200,169,107,0.5)] mt-4"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full transition-transform duration-300 ease-out group-hover/btn:translate-y-0"></div>
                <span className="relative flex items-center justify-center gap-2">
                  <Sparkles size={14} className="opacity-70" />
                  Tiến vào không gian
                </span>
              </button>
            </div>

            <div className="relative z-10 my-2 flex items-center gap-4">
              <div className="h-[1px] flex-1 bg-white/5"></div>
              <span className="text-[10px] uppercase tracking-[0.2em] text-white/20">hoặc kết nối qua</span>
              <div className="h-[1px] flex-1 bg-white/5"></div>
            </div>

            <div className="relative z-10 flex flex-col gap-3">
              <button
                type="button"
                className="group/social flex w-full items-center justify-center gap-3 rounded-lg border border-white/10 bg-white/[0.03] px-5 py-3.5 text-xs tracking-wider text-white/60 transition-all hover:bg-white/[0.08] hover:text-white/90"
              >
                <Share2 size={15} className="transition-transform group-hover/social:scale-110" />
                Kết nối với GitHub
              </button>
              <button
                type="button"
                className="group/social flex w-full items-center justify-center gap-3 rounded-lg border border-white/10 bg-white/[0.03] px-5 py-3.5 text-xs tracking-wider text-white/60 transition-all hover:bg-white/[0.08] hover:text-white/90"
              >
                <Globe size={15} className="transition-transform group-hover/social:scale-110" />
                Kết nối với Google
              </button>
            </div>

            <div className="relative z-10 pt-4 flex flex-col gap-4 text-center">
              <p className="text-xs text-white/40 tracking-wide">
                Chưa có danh tính?{" "}
                <Link className="text-[#C8A96B] font-medium underline-offset-4 hover:underline transition-all hover:text-[#D4B982]" href="/auth/sign-up">
                  Tạo hồ sơ người lưu trữ
                </Link>
              </p>
              <Link
                className="text-[10px] uppercase tracking-[0.3em] text-white/30 transition-colors hover:text-white/70"
                href="/auth/guest"
              >
                Dạo bước như lữ khách
              </Link>
            </div>
          </form>
        </div>
      </AuthChrome>
    </div>
  );
}

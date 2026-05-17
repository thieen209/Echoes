"use client";

import { AuthChrome } from "@/components/auth-chrome";
import { SiteNav } from "@/components/site-nav";
import { Globe, Share2, Sparkles } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function SignUpPage() {
  const [given, setGiven] = useState("");
  const [family, setFamily] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="bg-[#050505] min-h-screen">
      <SiteNav />
      <AuthChrome
        title="Khởi tạo nhịp đập mới."
        subtitle="Mỗi người lưu trữ là một ngọn đèn soi sáng những thanh âm bị lãng quên. Tạo danh tính của bạn để bắt đầu giao cảm."
      >
        <div className="relative group">
          <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-[#C8A96B]/20 to-transparent opacity-0 blur-xl transition duration-1000 group-hover:opacity-100"></div>
          
          <form
            className="relative flex flex-col space-y-7 rounded-2xl bg-white/[0.02] p-10 border border-white/[0.05] shadow-[0_8px_32px_rgba(0,0,0,0.4)] backdrop-blur-3xl overflow-hidden"
            onSubmit={(event) => event.preventDefault()}
          >
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.05] to-transparent mix-blend-overlay"></div>
            
            <div className="relative z-10 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="group/input relative">
                  <label className="mb-2.5 block text-[10px] uppercase tracking-[0.3em] text-white/40 font-medium" htmlFor="given">
                    Danh xưng (Tên)
                  </label>
                  <input 
                    id="given" 
                    value={given}
                    onChange={(e) => setGiven(e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-3.5 text-sm text-white/90 outline-none transition-all focus:border-[#C8A96B]/50 focus:bg-black/60 focus:ring-1 focus:ring-[#C8A96B]/50" 
                  />
                </div>
                <div className="group/input relative">
                  <label className="mb-2.5 block text-[10px] uppercase tracking-[0.3em] text-white/40 font-medium" htmlFor="family">
                    Gia tộc (Họ)
                  </label>
                  <input 
                    id="family" 
                    value={family}
                    onChange={(e) => setFamily(e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-3.5 text-sm text-white/90 outline-none transition-all focus:border-[#C8A96B]/50 focus:bg-black/60 focus:ring-1 focus:ring-[#C8A96B]/50" 
                  />
                </div>
              </div>

              <div className="group/input relative">
                <label className="mb-2.5 block text-[10px] uppercase tracking-[0.3em] text-white/40 font-medium" htmlFor="signup-email">
                  Định danh (Email)
                </label>
                <input 
                  id="signup-email" 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-black/40 px-5 py-3.5 text-sm text-white/90 outline-none transition-all focus:border-[#C8A96B]/50 focus:bg-black/60 focus:ring-1 focus:ring-[#C8A96B]/50 placeholder:text-white/20" 
                  placeholder="nguoiluutru@echoes.vn" 
                />
              </div>

              <div className="group/input relative">
                <label className="mb-2.5 block text-[10px] uppercase tracking-[0.3em] text-white/40 font-medium" htmlFor="signup-password">
                  Mật ngữ (Password)
                </label>
                <input 
                  id="signup-password" 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-black/40 px-5 py-3.5 text-sm text-white/90 outline-none transition-all focus:border-[#C8A96B]/50 focus:bg-black/60 focus:ring-1 focus:ring-[#C8A96B]/50" 
                />
              </div>

              <button 
                type="submit" 
                className="group/btn relative w-full overflow-hidden rounded-lg bg-gradient-to-b from-[#C8A96B] to-[#9A7B4F] px-5 py-4 text-xs font-semibold uppercase tracking-[0.3em] text-black transition-all hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_20px_rgba(200,169,107,0.3)] hover:shadow-[0_0_30px_rgba(200,169,107,0.5)] mt-2"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full transition-transform duration-300 ease-out group-hover/btn:translate-y-0"></div>
                <span className="relative flex items-center justify-center gap-2">
                  <Sparkles size={14} className="opacity-70" />
                  Khai mở hồ sơ
                </span>
              </button>
            </div>

            <div className="relative z-10 my-1 flex items-center gap-4">
              <div className="h-[1px] flex-1 bg-white/5"></div>
              <span className="text-[10px] uppercase tracking-[0.2em] text-white/20">hoặc</span>
              <div className="h-[1px] flex-1 bg-white/5"></div>
            </div>

            <div className="relative z-10 flex gap-3">
              <button
                type="button"
                className="group/social flex flex-1 items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] p-3.5 text-xs text-white/60 transition-all hover:bg-white/[0.08] hover:text-white/90"
              >
                <Share2 size={16} className="transition-transform group-hover/social:scale-110" />
              </button>
              <button
                type="button"
                className="group/social flex flex-1 items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] p-3.5 text-xs text-white/60 transition-all hover:bg-white/[0.08] hover:text-white/90"
              >
                <Globe size={16} className="transition-transform group-hover/social:scale-110" />
              </button>
            </div>

            <div className="relative z-10 pt-2 text-center">
              <p className="text-xs text-white/40 tracking-wide">
                Đã giữ một ngọn đèn?{" "}
                <Link className="text-[#C8A96B] font-medium underline-offset-4 hover:underline transition-all hover:text-[#D4B982]" href="/auth/sign-in">
                  Trở lại kho lưu trữ
                </Link>
              </p>
            </div>
          </form>
        </div>
      </AuthChrome>
    </div>
  );
}

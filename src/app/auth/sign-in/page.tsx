"use client";

import { AuthChrome } from "@/components/auth-chrome";
import { useAuth } from "@/lib/auth-context";
import { SiteNav } from "@/components/site-nav";
import { Check, Globe, Sparkles } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const { user, signInWithGoogle, signInWithEmail } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) router.replace("/");
  }, [user, router]);

  const handleEmailLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!email.trim() || !password.trim() || !agreed) return;
    setLoading(true);
    setErrorMsg("");
    const { error } = await signInWithEmail(email, password);
    if (error) {
      setErrorMsg(error.message);
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (!agreed) return;
    setLoading(true);
    setErrorMsg("");
    await signInWithGoogle();
  };

  return (
    <div className="bg-[#050505] min-h-screen">
      <SiteNav />
      <AuthChrome
        title="Đánh thức thanh âm di sản."
        subtitle="Bước qua cánh cổng thời gian. Đăng nhập để lưu giữ những rung cảm văn hóa, cá nhân hóa hành trình và mở khóa trọn vẹn không gian nghệ thuật tương tác."
      >
        <div className="relative group">
          <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-[#C8A96B]/20 to-transparent opacity-0 blur-xl transition duration-1000 group-hover:opacity-100"></div>
          
          <form
            className="relative flex flex-col space-y-6 rounded-2xl bg-white/[0.02] p-8 sm:p-10 border border-white/[0.05] shadow-[0_8px_32px_rgba(0,0,0,0.4)] backdrop-blur-3xl overflow-hidden"
            onSubmit={handleEmailLogin}
          >
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.05] to-transparent mix-blend-overlay"></div>
            
            <div className="relative z-10 space-y-5">
              <div className="group/input relative">
                <label className="mb-2.5 block text-[10px] uppercase tracking-[0.35em] text-white/40 font-medium" htmlFor="email">
                  Định danh (Email)
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-black/40 px-5 py-3.5 text-sm text-white/90 outline-none transition-all focus:border-[#C8A96B]/50 focus:bg-black/60 focus:ring-1 focus:ring-[#C8A96B]/30 placeholder:text-white/20"
                  placeholder="nguoiluutru@echoes.vn"
                />
              </div>

              <div className="group/input relative">
                <label className="mb-2.5 block text-[10px] uppercase tracking-[0.35em] text-white/40 font-medium" htmlFor="password">
                  Mật ngữ (Password)
                </label>
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-black/40 px-5 py-3.5 text-sm text-white/90 outline-none transition-all focus:border-[#C8A96B]/50 focus:bg-black/60 focus:ring-1 focus:ring-[#C8A96B]/30 placeholder:text-white/20"
                  placeholder="••••••••"
                />
              </div>

              {/* Terms checkbox */}
              <label className="flex cursor-pointer items-start gap-3">
                <button
                  type="button"
                  role="checkbox"
                  aria-checked={agreed}
                  onClick={() => setAgreed((v) => !v)}
                  className={`mt-0.5 grid size-[1.05rem] shrink-0 place-items-center rounded border transition-all ${
                    agreed
                      ? "border-[#C8A96B]/60 bg-[#C8A96B]/20 text-[#C8A96B]"
                      : "border-white/20 bg-white/[0.04] text-transparent"
                  }`}
                >
                  <Check size={10} strokeWidth={3} />
                </button>
                <span className="text-[0.7rem] leading-[1.6] text-white/40">
                  Bằng việc tiếp tục, bạn đồng ý với{" "}
                  <Link href="/terms" className="text-[#C8A96B]/80 underline underline-offset-2 hover:text-[#C8A96B]">
                    Điều Khoản Dịch Vụ
                  </Link>{" "}
                  và{" "}
                  <Link href="/privacy" className="text-[#C8A96B]/80 underline underline-offset-2 hover:text-[#C8A96B]">
                    Chính Sách Quyền Riêng Tư
                  </Link>{" "}
                  của Echoes.
                </span>
              </label>

              {errorMsg && (
                <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-center text-xs text-red-400">
                  {errorMsg}
                </div>
              )}

              <button 
                type="submit"
                disabled={!agreed || loading}
                className={`group/btn relative w-full overflow-hidden rounded-lg px-5 py-3.5 text-xs font-semibold uppercase tracking-[0.25em] transition-all mt-2 ${
                  agreed
                    ? "bg-gradient-to-b from-[#C8A96B] to-[#9A7B4F] text-black shadow-[0_0_20px_rgba(200,169,107,0.3)] hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(200,169,107,0.5)] active:scale-[0.98]"
                    : "bg-white/[0.06] text-white/30 cursor-not-allowed"
                }`}
              >
                {agreed && <div className="absolute inset-0 bg-white/20 translate-y-full transition-transform duration-300 ease-out group-hover/btn:translate-y-0"></div>}
                <span className="relative flex items-center justify-center gap-2">
                  <Sparkles size={14} className="opacity-70" />
                  {loading ? "Đang kết nối..." : "Tiến vào không gian"}
                </span>
              </button>
            </div>

            <div className="relative z-10 my-1 flex items-center gap-4">
              <div className="h-[1px] flex-1 bg-white/5"></div>
              <span className="text-[10px] uppercase tracking-[0.15em] text-white/20">hoặc kết nối qua</span>
              <div className="h-[1px] flex-1 bg-white/5"></div>
            </div>

            <div className="relative z-10">
              <button
                type="button"
                disabled={!agreed || loading}
                className={`flex w-full items-center justify-center gap-3 rounded-lg border px-5 py-3.5 text-xs tracking-wider transition-all ${
                  agreed
                    ? "border-white/10 bg-white/[0.03] text-white/60 hover:bg-white/[0.08] hover:text-white/90"
                    : "border-white/5 bg-white/[0.02] text-white/20 cursor-not-allowed"
                }`}
                onClick={handleGoogleLogin}
              >
                <Globe size={15} />
                Kết nối với Google
              </button>
            </div>

            <div className="relative z-10 pt-3 flex flex-col gap-3 text-center">
              <p className="text-xs text-white/40 tracking-wide">
                Chưa có danh tính?{" "}
                <Link className="text-[#C8A96B] font-medium underline-offset-4 hover:underline transition-all hover:text-[#D4B982]" href="/auth/sign-up">
                  Tạo hồ sơ người lưu trữ
                </Link>
              </p>
              <Link
                className="text-[10px] uppercase tracking-[0.25em] text-white/30 transition-colors hover:text-white/70"
                href="/"
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

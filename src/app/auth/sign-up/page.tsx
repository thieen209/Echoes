"use client";

import { AuthChrome } from "@/components/auth-chrome";
import { useAuth } from "@/lib/auth-context";
import { SiteNav } from "@/components/site-nav";
import { Check, Globe, Sparkles } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function SignUpPage() {
  const [given, setGiven] = useState("");
  const [family, setFamily] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const { user, signInWithGoogle, signUpWithEmail } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) router.replace("/");
  }, [user, router]);

  const handleSignUp = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!email.trim() || !password.trim() || !agreed) return;
    setLoading(true);
    setErrorMsg("");
    const fullName = `${family.trim()} ${given.trim()}`.trim() || "Người lưu trữ";
    const { error } = await signUpWithEmail(email, password, fullName);
    if (error) {
      setErrorMsg(error.message);
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    if (!agreed) return;
    setLoading(true);
    setErrorMsg("");
    await signInWithGoogle();
  };

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
            className="relative flex flex-col space-y-6 rounded-2xl bg-white/[0.02] p-8 sm:p-10 border border-white/[0.05] shadow-[0_8px_32px_rgba(0,0,0,0.4)] backdrop-blur-3xl overflow-hidden"
            onSubmit={handleSignUp}
          >
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.05] to-transparent mix-blend-overlay"></div>
            
            <div className="relative z-10 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2.5 block text-[10px] uppercase tracking-[0.3em] text-white/40 font-medium" htmlFor="given">
                    Danh xưng (Tên)
                  </label>
                  <input
                    id="given"
                    value={given}
                    onChange={(e) => setGiven(e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-3.5 text-sm text-white/90 outline-none transition-all focus:border-[#C8A96B]/50 focus:ring-1 focus:ring-[#C8A96B]/30"
                  />
                </div>
                <div>
                  <label className="mb-2.5 block text-[10px] uppercase tracking-[0.3em] text-white/40 font-medium" htmlFor="family">
                    Gia tộc (Họ)
                  </label>
                  <input
                    id="family"
                    value={family}
                    onChange={(e) => setFamily(e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-3.5 text-sm text-white/90 outline-none transition-all focus:border-[#C8A96B]/50 focus:ring-1 focus:ring-[#C8A96B]/30"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2.5 block text-[10px] uppercase tracking-[0.3em] text-white/40 font-medium" htmlFor="signup-email">
                  Định danh (Email)
                </label>
                <input
                  id="signup-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-black/40 px-5 py-3.5 text-sm text-white/90 outline-none transition-all focus:border-[#C8A96B]/50 focus:ring-1 focus:ring-[#C8A96B]/30 placeholder:text-white/20"
                  placeholder="nguoiluutru@echoes.vn"
                />
              </div>

              <div>
                <label className="mb-2.5 block text-[10px] uppercase tracking-[0.3em] text-white/40 font-medium" htmlFor="signup-password">
                  Mật ngữ (Password)
                </label>
                <input
                  id="signup-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-black/40 px-5 py-3.5 text-sm text-white/90 outline-none transition-all focus:border-[#C8A96B]/50 focus:ring-1 focus:ring-[#C8A96B]/30"
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
                className={`group/btn relative w-full overflow-hidden rounded-lg px-5 py-3.5 text-xs font-semibold uppercase tracking-[0.25em] transition-all mt-1 ${
                  agreed
                    ? "bg-gradient-to-b from-[#C8A96B] to-[#9A7B4F] text-black shadow-[0_0_20px_rgba(200,169,107,0.3)] hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(200,169,107,0.5)] active:scale-[0.98]"
                    : "bg-white/[0.06] text-white/30 cursor-not-allowed"
                }`}
              >
                {agreed && <div className="absolute inset-0 bg-white/20 translate-y-full transition-transform duration-300 ease-out group-hover/btn:translate-y-0"></div>}
                <span className="relative flex items-center justify-center gap-2">
                  <Sparkles size={14} className="opacity-70" />
                  {loading ? "Đang khai mở..." : "Khai mở hồ sơ"}
                </span>
              </button>
            </div>

            <div className="relative z-10 my-1 flex items-center gap-4">
              <div className="h-[1px] flex-1 bg-white/5"></div>
              <span className="text-[10px] uppercase tracking-[0.15em] text-white/20">hoặc</span>
              <div className="h-[1px] flex-1 bg-white/5"></div>
            </div>

            <div className="relative z-10">
              <button
                type="button"
                disabled={!agreed || loading}
                className={`flex w-full items-center justify-center gap-2 rounded-lg border p-3.5 text-xs transition-all ${
                  agreed
                    ? "border-white/10 bg-white/[0.03] text-white/60 hover:bg-white/[0.08] hover:text-white/90"
                    : "border-white/5 bg-white/[0.02] text-white/20 cursor-not-allowed"
                }`}
                onClick={handleGoogleSignUp}
              >
                <Globe size={16} />
                Đăng ký với Google
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

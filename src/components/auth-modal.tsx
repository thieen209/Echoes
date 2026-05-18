"use client";

import { EchoesLogoMark } from "@/components/echoes-logo";
import { useAuth } from "@/hooks/useAuth";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Lock, Scan, Music, Bookmark, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export function AuthModal() {
  const { showAuthModal, dismissAuthModal } = useAuth();
  const [agreed, setAgreed] = useState(false);

  return (
    <AnimatePresence>
      {showAuthModal ? (
        <motion.div
          className="fixed inset-0 z-[90] flex items-center justify-center px-4 py-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="presentation"
        >
          {/* Cinematic backdrop */}
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="absolute inset-0 bg-black/80 backdrop-blur-2xl" />
            {/* Ambient glow */}
            <motion.div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse at 50% 30%, rgba(200,169,107,0.08), transparent 60%)",
              }}
              animate={{ opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            />
            {/* Soft grain overlay */}
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.04]"
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E\")",
              }}
            />
          </motion.div>

          {/* Close button */}
          <motion.button
            type="button"
            className="absolute right-5 top-5 z-[92] grid size-10 place-items-center rounded-full text-white/30 transition-all hover:rotate-90 hover:text-white/60"
            onClick={dismissAuthModal}
            aria-label="Đóng"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.1 }}
          >
            <X size={18} strokeWidth={1.5} />
          </motion.button>

          {/* Portal card */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="auth-portal-title"
            className="relative z-[91] w-full max-w-[26rem] overflow-hidden rounded-2xl border border-white/[0.07] bg-[rgba(10,10,12,0.92)] shadow-[0_48px_140px_rgba(0,0,0,0.7)] backdrop-blur-3xl"
            initial={{ opacity: 0, y: 40, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{
              type: "spring",
              stiffness: 220,
              damping: 24,
              mass: 0.8,
            }}
          >
            {/* Top gradient accent */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
            <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-gold/[0.04] to-transparent" />

            <div className="relative px-7 pb-7 pt-9 sm:px-9 sm:pb-9 sm:pt-11">
              {/* Logo */}
              <motion.div
                className="flex justify-center"
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  delay: 0.1,
                  type: "spring",
                  stiffness: 280,
                  damping: 22,
                }}
              >
                <div className="relative">
                  <EchoesLogoMark size={82} />
                  {/* Logo glow */}
                  <motion.div
                    className="pointer-events-none absolute -inset-6 rounded-full bg-gold/10 blur-2xl"
                    animate={{ opacity: [0.3, 0.6, 0.3] }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                </div>
              </motion.div>

              {/* Title */}
              <motion.h2
                id="auth-portal-title"
                className="font-epic mt-6 text-center text-[1.4rem] leading-snug text-foreground sm:text-[1.55rem]"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.18 }}
              >
                Đăng nhập để bắt đầu trải nghiệm
              </motion.h2>

              {/* Subtitle */}
              <motion.p
                className="mx-auto mt-3 max-w-[22rem] text-center text-[0.8rem] leading-6 text-muted/80"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.24 }}
              >
                Khám phá và chơi nhạc cụ bằng AI trong không gian tương tác văn
                hóa nhập vai.
              </motion.p>

              {/* Unlock features */}
              <motion.div
                className="mt-6 rounded-xl border border-gold/10 bg-gold/[0.03] px-5 py-4"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.28 }}
              >
                <p className="text-[0.65rem] font-medium uppercase tracking-[0.25em] text-gold/70">
                  Đăng nhập để mở khóa
                </p>
                <div className="mt-3 space-y-2.5">
                  {[
                    { icon: Scan, text: "Quét nhạc cụ bằng AI" },
                    { icon: Music, text: "Tương tác và chơi nhạc cụ" },
                    { icon: Bookmark, text: "Lưu trải nghiệm cá nhân" },
                  ].map((item) => (
                    <div
                      key={item.text}
                      className="flex items-center gap-2.5 text-[0.78rem] text-foreground/80"
                    >
                      <item.icon
                        size={14}
                        className="shrink-0 text-gold/60"
                      />
                      <span>{item.text}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Terms checkbox */}
              <motion.label
                className="mt-5 flex cursor-pointer items-start gap-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.32 }}
              >
                <button
                  type="button"
                  role="checkbox"
                  aria-checked={agreed}
                  onClick={() => setAgreed((v) => !v)}
                  className={`mt-0.5 grid size-[1.1rem] shrink-0 place-items-center rounded border transition-all ${
                    agreed
                      ? "border-gold/60 bg-gold/20 text-gold"
                      : "border-white/20 bg-white/[0.04] text-transparent"
                  }`}
                >
                  <Check size={11} strokeWidth={3} />
                </button>
                <span className="text-[0.72rem] leading-[1.6] text-muted/70">
                  Bằng việc tiếp tục, bạn đồng ý với{" "}
                  <Link
                    href="/terms"
                    className="text-gold/80 underline underline-offset-2 transition hover:text-gold"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Điều Khoản Dịch Vụ
                  </Link>{" "}
                  và{" "}
                  <Link
                    href="/privacy"
                    className="text-gold/80 underline underline-offset-2 transition hover:text-gold"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Chính Sách Quyền Riêng Tư
                  </Link>{" "}
                  của Echoes.
                </span>
              </motion.label>

              {/* CTA buttons */}
              <motion.div
                className="mt-5 space-y-2.5"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.36 }}
              >
                {/* Google — Primary */}
                <Link
                  href="/login"
                  onClick={dismissAuthModal}
                  className={`group relative flex w-full items-center justify-center gap-2.5 overflow-hidden rounded-xl py-3.5 text-[0.78rem] font-medium tracking-wide transition-all ${
                    agreed
                      ? "border border-gold/40 bg-gradient-to-b from-gold/20 to-gold/10 text-foreground shadow-[0_0_24px_rgba(200,169,107,0.12)] hover:from-gold/25 hover:to-gold/15 hover:shadow-[0_0_32px_rgba(200,169,107,0.2)]"
                      : "pointer-events-none border border-white/8 bg-white/[0.03] text-muted/40"
                  }`}
                >
                  <svg
                    className="size-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 001 12c0 1.77.42 3.45 1.18 4.93l3.66-2.84z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  Tiếp tục với Google
                  {/* Sweep effect */}
                  {agreed && (
                    <motion.div
                      className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.06] to-transparent"
                      animate={{ x: ["-100%", "200%"] }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />
                  )}
                </Link>

                {/* Email */}
                <Link
                  href="/login"
                  onClick={dismissAuthModal}
                  className={`flex w-full items-center justify-center gap-2.5 rounded-xl py-3 text-[0.78rem] tracking-wide transition-all ${
                    agreed
                      ? "border border-white/10 bg-white/[0.04] text-muted hover:border-white/20 hover:text-foreground"
                      : "pointer-events-none border border-white/5 bg-white/[0.02] text-muted/30"
                  }`}
                >
                  Tiếp tục với Email
                </Link>
              </motion.div>

              {/* Divider */}
              <div className="my-5 flex items-center gap-3">
                <div className="h-px flex-1 bg-white/[0.06]" />
                <span className="text-[0.6rem] uppercase tracking-[0.2em] text-muted/30">
                  hoặc
                </span>
                <div className="h-px flex-1 bg-white/[0.06]" />
              </div>

              {/* Guest mode */}
              <motion.div
                className="rounded-xl border border-white/[0.05] bg-white/[0.02] px-5 py-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <button
                  type="button"
                  className="w-full text-left"
                  onClick={dismissAuthModal}
                >
                  <p className="text-[0.72rem] font-medium text-foreground/70">
                    Tiếp tục với chế độ khách
                  </p>
                  <div className="mt-2 space-y-1.5">
                    <p className="text-[0.68rem] leading-5 text-muted/50">
                      Ở chế độ khách, bạn có thể:
                    </p>
                    <p className="text-[0.68rem] leading-5 text-muted/50">
                      • Xem không gian trải nghiệm
                    </p>
                    <p className="text-[0.68rem] leading-5 text-muted/50">
                      • Khám phá thông tin nhạc cụ
                    </p>
                  </div>
                </button>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

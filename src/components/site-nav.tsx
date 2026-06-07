"use client";

import { EchoesLogo } from "@/components/echoes-logo";
import { useAuth } from "@/hooks/useAuth";
import { useLocale } from "@/lib/i18n/locale-context";
import { AnimatePresence, motion } from "framer-motion";
import {
  Camera,
  ChevronRight,
  ClipboardList,
  HelpCircle,
  Info,
  LogOut,
  Menu,
  Users,
  X,
  ScanLine,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

const menuItems = [
  { id: "about", href: "/about", icon: Info, label: "Thông tin dự án" },
  { id: "team", href: "/about#team", icon: Users, label: "Người thực hiện" },
  { id: "faq", href: "/about#faq", icon: HelpCircle, label: "Câu hỏi thường gặp" },
  { id: "survey", href: "#survey", icon: ClipboardList, label: "Khảo sát" },
];

export function SiteNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [showSurvey, setShowSurvey] = useState(false);
  const { t } = useLocale();
  const { user, signOut, requireAuth } = useAuth();

  const links = [
    { href: "/", label: t.nav.hall },
    { href: "/archive", label: t.nav.archive },
    { href: "/about", label: t.nav.mission },
    { href: "/#scan", label: t.nav.identify },
  ];

  // Lock body scroll when menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const handleMenuAction = useCallback(
    (item: (typeof menuItems)[number]) => {
      if (item.id === "survey") {
        setShowSurvey(true);
        return;
      }
      setOpen(false);
    },
    [],
  );

  return (
    <>
      <header className="fixed left-0 right-0 top-0 z-50">
        <div className="border-b border-white/10 bg-[rgba(15,16,18,0.62)] backdrop-blur-2xl">
          <nav className="mx-auto flex h-[4.5rem] w-full max-w-7xl items-center justify-between px-5 sm:h-20 sm:px-8">
            <EchoesLogo priority href="/" variant="horizontal" size={58} />
            <motion.div
              className="hidden items-center gap-10 md:flex"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              {links.map((item) => {
                const active =
                  item.href === "/"
                    ? pathname === "/"
                    : item.href === "/#scan"
                      ? false
                      : pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    className={`relative text-sm uppercase tracking-[0.22em] transition ${
                      active ? "text-foreground" : "text-muted hover:text-foreground"
                    }`}
                    href={item.href}
                  >
                    {item.label}
                    {active ? (
                      <motion.span
                        layoutId="nav-glow"
                        className="absolute -inset-x-3 -bottom-2 h-px bg-gradient-to-r from-transparent via-gold to-transparent"
                        transition={{ type: "spring", stiffness: 380, damping: 34 }}
                      />
                    ) : null}
                  </Link>
                );
              })}
            </motion.div>
            <div className="hidden items-center gap-3 sm:flex">
              {user ? (
                <div className="flex items-center gap-4">
                  <Link
                    href="/profile"
                    className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 py-1.5 pl-2 pr-4 text-xs transition hover:bg-white/10"
                  >
                    <div className="grid size-6 place-items-center overflow-hidden rounded-full bg-gold/20 text-gold">
                      {user.user_metadata?.avatar_url || user.user_metadata?.picture ? (
                        <img src={user.user_metadata?.avatar_url || user.user_metadata?.picture} alt="" className="size-full object-cover" />
                      ) : (
                        <span className="font-epic text-[10px] uppercase">{(user.user_metadata?.full_name || user.user_metadata?.name || "U").charAt(0)}</span>
                      )}
                    </div>
                    <span className="max-w-[100px] truncate text-muted group-hover:text-foreground">{user.user_metadata?.full_name || user.user_metadata?.name || "Người lưu trữ"}</span>
                  </Link>
                </div>
              ) : (
                <button
                  type="button"
                  className="group relative flex items-center gap-2 overflow-hidden rounded-full border border-gold/40 bg-gradient-to-b from-gold/10 to-transparent px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.25em] text-gold transition-all hover:scale-105 hover:border-gold hover:text-white hover:shadow-[0_0_25px_rgba(200,169,107,0.4)] active:scale-95"
                  onClick={() =>
                    requireAuth(() => {
                      window.location.href = "/#scan";
                    })
                  }
                >
                  <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 ease-in-out group-hover:translate-x-full" />
                  <ScanLine size={16} aria-hidden="true" className="group-hover:animate-pulse" />
                  <span>Quét ngay</span>
                </button>
              )}
            </div>
            <button
              type="button"
              className="museum-button border-white/15 bg-white/[0.04] px-3 py-2"
              aria-expanded={open}
              aria-controls="side-menu"
              onClick={() => setOpen((value) => !value)}
            >
              {open ? <X size={18} /> : <Menu size={18} />}
              <span className="sr-only">Menu</span>
            </button>
          </nav>
        </div>
        <div className="hairline opacity-40" />
      </header>

      {/* Cinematic Side Menu */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
            <motion.aside
              id="side-menu"
              className="fixed right-0 top-0 z-[85] flex h-full w-full max-w-sm flex-col border-l border-white/10 bg-[rgba(12,13,15,0.96)] backdrop-blur-2xl"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 34 }}
            >
              {/* Menu Header */}
              <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
                <p className="text-xs font-semibold uppercase tracking-[0.4em] text-gold/80">
                  Echoes
                </p>
                <button
                  type="button"
                  className="grid size-10 place-items-center rounded-full border border-white/10 text-muted transition hover:border-gold/40 hover:text-foreground"
                  onClick={() => setOpen(false)}
                  aria-label="Đóng menu"
                >
                  <X size={18} />
                </button>
              </div>

              {/* User Info */}
              {user && (
                <div className="border-b border-white/10 px-6 py-4">
                  <p className="text-sm text-foreground">{user.user_metadata?.full_name || user.user_metadata?.name || "Người lưu trữ"}</p>
                  <p className="mt-0.5 text-xs text-muted">{user.email}</p>
                </div>
              )}

              {/* Navigation Links */}
              <div className="flex-1 overflow-y-auto px-6 py-6">
                <p className="text-[0.6rem] uppercase tracking-[0.35em] text-muted/60">
                  Điều hướng
                </p>
                <nav className="mt-4 space-y-1">
                  {links.map((item) => (
                    <Link
                      key={item.href}
                      className="flex items-center justify-between rounded-lg px-3 py-3 text-sm text-foreground/80 transition hover:bg-white/[0.04] hover:text-foreground"
                      href={item.href}
                      onClick={() => setOpen(false)}
                    >
                      {item.label}
                      <ChevronRight size={14} className="text-muted/40" />
                    </Link>
                  ))}
                </nav>

                <div className="my-6 h-px bg-white/8" />

                <p className="text-[0.6rem] uppercase tracking-[0.35em] text-muted/60">
                  Thêm
                </p>
                <nav className="mt-4 space-y-1">
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    if (item.id === "survey") {
                      return (
                        <button
                          key={item.id}
                          type="button"
                          className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm text-foreground/80 transition hover:bg-white/[0.04] hover:text-foreground"
                          onClick={() => handleMenuAction(item)}
                        >
                          <Icon size={16} className="text-gold/60" />
                          {item.label}
                        </button>
                      );
                    }
                    return (
                      <Link
                        key={item.id}
                        className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm text-foreground/80 transition hover:bg-white/[0.04] hover:text-foreground"
                        href={item.href}
                        onClick={() => setOpen(false)}
                      >
                        <Icon size={16} className="text-gold/60" />
                        {item.label}
                      </Link>
                    );
                  })}
                </nav>
              </div>

              {/* Bottom Actions */}
              <div className="border-t border-white/10 px-6 py-5 space-y-3">
                {user ? (
                  <button
                    type="button"
                    className="flex w-full items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-muted transition hover:border-red-500/30 hover:text-red-400"
                    onClick={() => {
                      signOut();
                      setOpen(false);
                    }}
                  >
                    <LogOut size={15} />
                    {t.nav.signOut}
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled
                    className="museum-button w-full justify-center py-2.5 text-sm opacity-50 cursor-not-allowed"
                  >
                    Đăng nhập (Bảo trì)
                  </button>
                )}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Survey Modal */}
      <AnimatePresence>
        {showSurvey && (
          <SurveyModal onClose={() => setShowSurvey(false)} />
        )}
      </AnimatePresence>
    </>
  );
}

/* ── Survey Modal ── */
function SurveyModal({ onClose }: { onClose: () => void }) {
  const [submitted, setSubmitted] = useState(false);
  const [answers, setAnswers] = useState({
    experience: "",
    favorite: "",
    quality: "",
    interest: "",
    suggestion: "",
  });

  const questions = [
    { key: "experience", label: "Trải nghiệm của bạn với Echoes?", options: ["Rất tốt", "Tốt", "Bình thường", "Cần cải thiện"] },
    { key: "favorite", label: "Nhạc cụ yêu thích?", options: ["Đàn Bầu", "Đàn Tranh", "T'rưng", "Shamisen", "Sitar"] },
    { key: "quality", label: "Chất lượng tương tác?", options: ["Xuất sắc", "Tốt", "Trung bình", "Kém"] },
    { key: "interest", label: "Bạn quan tâm nhất về?", options: ["Lịch sử", "Âm thanh", "Trải nghiệm trực quan", "Tất cả"] },
  ];

  function handleSubmit() {
    try {
      const existing = JSON.parse(localStorage.getItem("echoes_surveys") || "[]");
      existing.push({ ...answers, timestamp: new Date().toISOString() });
      localStorage.setItem("echoes_surveys", JSON.stringify(existing));
    } catch {
      // ignore
    }
    setSubmitted(true);
    setTimeout(onClose, 2000);
  }

  return (
    <motion.div
      className="fixed inset-0 z-[95] flex items-center justify-center px-4 py-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="absolute inset-0 bg-black/70 backdrop-blur-xl"
        onClick={onClose}
      />
      <motion.div
        className="relative w-full max-w-lg overflow-hidden rounded-xl border border-white/12 bg-[rgba(14,15,18,0.95)] p-6 shadow-[0_40px_120px_rgba(0,0,0,0.65)] backdrop-blur-2xl sm:p-8"
        initial={{ opacity: 0, y: 28, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.97 }}
        transition={{ type: "spring", stiffness: 280, damping: 28 }}
      >
        <button
          type="button"
          className="absolute right-4 top-4 rounded-full border border-white/10 p-2 text-muted transition hover:text-foreground"
          onClick={onClose}
          aria-label="Đóng"
        >
          <X size={18} />
        </button>

        {submitted ? (
          <div className="flex flex-col items-center py-12 text-center">
            <motion.div
              className="grid size-16 place-items-center rounded-full border border-gold/40 bg-gold/15 text-gold"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <ClipboardList size={28} />
            </motion.div>
            <p className="mt-6 font-display text-2xl text-foreground">Cảm ơn bạn!</p>
            <p className="mt-2 text-sm text-muted">Phản hồi của bạn rất quý giá.</p>
          </div>
        ) : (
          <>
            <p className="text-xs uppercase tracking-[0.4em] text-gold">Khảo sát</p>
            <h2 className="font-display mt-3 text-2xl text-foreground">
              Chia sẻ trải nghiệm
            </h2>
            <div className="mt-6 max-h-[60vh] space-y-5 overflow-y-auto pr-2">
              {questions.map((q) => (
                <div key={q.key}>
                  <p className="text-sm text-foreground/90">{q.label}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {q.options.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        className={`rounded-full border px-3 py-1.5 text-xs transition ${
                          answers[q.key as keyof typeof answers] === opt
                            ? "border-gold/60 bg-gold/20 text-foreground"
                            : "border-white/10 bg-white/[0.03] text-muted hover:border-white/20"
                        }`}
                        onClick={() =>
                          setAnswers((prev) => ({ ...prev, [q.key]: opt }))
                        }
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              <div>
                <p className="text-sm text-foreground/90">Góp ý thêm?</p>
                <textarea
                  className="mt-2 w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-foreground outline-none transition focus:border-gold/40"
                  rows={2}
                  placeholder="Nhập góp ý..."
                  value={answers.suggestion}
                  onChange={(e) =>
                    setAnswers((prev) => ({ ...prev, suggestion: e.target.value }))
                  }
                />
              </div>
            </div>
            <motion.button
              type="button"
              className="museum-button mt-6 w-full justify-center py-3 text-sm uppercase tracking-[0.2em]"
              onClick={handleSubmit}
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.98 }}
            >
              Gửi khảo sát
            </motion.button>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}

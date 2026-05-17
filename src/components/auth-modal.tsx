"use client";

import { EchoesLogoMark } from "@/components/echoes-logo";
import { useAuth } from "@/lib/auth-context";
import { useLocale } from "@/lib/i18n/locale-context";
import { AnimatePresence, motion } from "framer-motion";
import { Fingerprint, X } from "lucide-react";

export function AuthModal() {
  const { showAuthModal, dismissAuthModal, signInWithGoogle } =
    useAuth();
  const { t } = useLocale();

  return (
    <AnimatePresence>
      {showAuthModal ? (
        <motion.div
          className="fixed inset-0 z-[90] flex items-center justify-center px-4 py-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="presentation"
        >
          <motion.button
            type="button"
            className="absolute inset-0 bg-black/70 backdrop-blur-xl"
            aria-label={t.auth.close}
            onClick={dismissAuthModal}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="auth-modal-title"
            className="relative w-full max-w-md overflow-hidden rounded-xl border border-white/12 bg-[rgba(12,13,15,0.95)] shadow-[0_40px_120px_rgba(0,0,0,0.7)] backdrop-blur-2xl"
            initial={{ opacity: 0, y: 32, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
          >
            {/* Decorative gradient */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-gold/8 to-transparent" />

            <button
              type="button"
              className="absolute right-4 top-4 z-10 grid size-9 place-items-center rounded-full border border-white/10 text-muted transition hover:border-white/20 hover:text-foreground"
              onClick={dismissAuthModal}
              aria-label={t.auth.close}
            >
              <X size={16} />
            </button>

            <div className="relative px-8 pb-8 pt-10">
              <div className="flex flex-col items-center text-center">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1, type: "spring", stiffness: 300 }}
                >
                  <EchoesLogoMark size={72} />
                </motion.div>
                <motion.p
                  className="mt-6 text-[0.65rem] uppercase tracking-[0.45em] text-gold/70"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.15 }}
                >
                  Echoes
                </motion.p>
                <motion.h2
                  id="auth-modal-title"
                  className="font-epic mt-3 text-2xl leading-tight text-foreground sm:text-3xl"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  {t.auth.headline}
                </motion.h2>
                <motion.p
                  className="mt-3 text-sm leading-7 text-muted"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.25 }}
                >
                  {t.auth.subline}
                </motion.p>
              </div>

              <motion.div
                className="mt-8 space-y-3"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <motion.button
                  type="button"
                  className="museum-button w-full justify-center py-3.5 text-sm uppercase tracking-[0.22em]"
                  onClick={signInWithGoogle}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Fingerprint size={18} aria-hidden="true" />
                  Bắt đầu trải nghiệm
                </motion.button>
              </motion.div>

              <motion.button
                type="button"
                className="mt-6 w-full text-center text-xs uppercase tracking-[0.3em] text-muted transition hover:text-foreground"
                onClick={dismissAuthModal}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {t.auth.guest}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

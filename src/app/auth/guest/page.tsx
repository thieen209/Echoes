"use client";

import { AuthChrome } from "@/components/auth-chrome";
import { SiteNav } from "@/components/site-nav";
import { useLocale } from "@/lib/i18n/locale-context";
import { motion } from "framer-motion";
import { ArrowRight, UserRound } from "lucide-react";
import Link from "next/link";

export default function GuestPage() {
  const { locale } = useLocale();
  const vi = true;

  return (
    <div className="museum-shell">
      <SiteNav />
      <AuthChrome
        title={vi ? "Dạo qua hành lang với tư cách khách." : "Drift as a guest in the corridor."}
        subtitle={
          vi
            ? "Chế độ khách mở toàn bộ triển lãm công khai mà không cần hồ sơ. Dấu trang, tải ảnh và quyền cao cấp chỉ là mô phỏng trong bản demo."
            : "Guest mode keeps the full exhibition open without a profile. Bookmarks, uploads, and premium passes are simulated for this demo."
        }
      >
        <motion.div
          className="museum-card space-y-8 p-8"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex items-center gap-4">
            <span className="grid size-14 place-items-center rounded-full border border-gold/35 bg-gold/10 text-gold">
              <UserRound size={26} aria-hidden="true" />
            </span>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-muted">
                {vi ? "Ngọn đèn ẩn danh" : "Anonymous lantern"}
              </p>
              <p className="mt-2 text-sm leading-7 text-muted">
                {vi
                  ? "Bạn có thể xem mọi triển lãm công khai, chạy sân khấu quét và chạm vào các nhạc cụ tổng hợp."
                  : "You may browse every public exhibit, run the scan theater, and touch the synthesized instruments."}
              </p>
            </div>
          </div>
          <Link className="museum-button flex w-full items-center justify-center gap-2 py-3 text-sm uppercase tracking-[0.25em]" href="/">
            {vi ? "Vào sảnh" : "Enter the hall"}
            <ArrowRight size={17} aria-hidden="true" />
          </Link>
          <Link className="block text-center text-xs uppercase tracking-[0.3em] text-muted hover:text-foreground" href="/auth/sign-in">
            {vi ? "Tôi có thông tin đăng nhập" : "I actually have credentials"}
          </Link>
        </motion.div>
      </AuthChrome>
    </div>
  );
}


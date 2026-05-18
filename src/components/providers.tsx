"use client";

import { AuthModal } from "@/components/auth-modal";
import { CulturalGuideChat } from "@/components/cultural-guide-chat";
import { AuthProvider } from "@/context/AuthProvider";
import { LocaleProvider } from "@/lib/i18n/locale-context";
import type { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <LocaleProvider>
      <AuthProvider>
        {children}
        <AuthModal />
        <CulturalGuideChat />
      </AuthProvider>
    </LocaleProvider>
  );
}

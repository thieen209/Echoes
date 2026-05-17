"use client";

import {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
  useEffect,
} from "react";
import { dictionaries, type Dictionary, type Locale } from "./dictionaries";

type LocaleContextValue = {
  locale: Locale;
  t: Dictionary;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const locale: Locale = "vi";

  useEffect(() => {
    document.documentElement.lang = "vi";
  }, []);

  const value = useMemo<LocaleContextValue>(
    () => ({
      locale,
      t: dictionaries[locale],
    }),
    [],
  );

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within LocaleProvider");
  return ctx;
}

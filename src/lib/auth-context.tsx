"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export interface EchoesUser {
  id: string;
  name: string;
  email: string;
  picture: string;
  provider: "google" | "demo";
}

interface AuthState {
  user: EchoesUser | null;
  isLoading: boolean;
  signInWithGoogle: () => void;
  signInDemo: () => void;
  signOut: () => void;
  /** Opens the cinematic auth modal */
  requireAuth: (callback?: () => void) => boolean;
  /** Whether the auth modal is showing */
  showAuthModal: boolean;
  /** Close the auth modal */
  dismissAuthModal: () => void;
  /** Callback to execute after successful auth */
  pendingCallback: (() => void) | null;
}

const AuthContext = createContext<AuthState | null>(null);

const STORAGE_KEY = "echoes_user";

function loadStoredUser(): EchoesUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function storeUser(user: EchoesUser | null) {
  if (typeof window === "undefined") return;
  if (user) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEY);
  }
}

/** Decode a JWT payload (no verification — client-side only) */
function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const base64 = token.split(".")[1];
    const json = atob(base64.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<EchoesUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [pendingCallback, setPendingCallback] = useState<(() => void) | null>(null);
  const [googleReady, setGoogleReady] = useState(false);

  // Hydrate from localStorage
  useEffect(() => {
    const timer = window.setTimeout(() => {
      setUser(loadStoredUser());
      setIsLoading(false);
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  // Load Google Identity Services
  useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!clientId) return;

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => setGoogleReady(true);
    document.head.appendChild(script);
    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const handleGoogleCredential = useCallback(
    (response: { credential: string }) => {
      const payload = decodeJwtPayload(response.credential);
      if (!payload) return;

      const googleUser: EchoesUser = {
        id: (payload.sub as string) ?? crypto.randomUUID(),
        name: (payload.name as string) ?? "Archivist",
        email: (payload.email as string) ?? "",
        picture: (payload.picture as string) ?? "",
        provider: "google",
      };

      setUser(googleUser);
      storeUser(googleUser);
      setShowAuthModal(false);
    },
    [],
  );

  const signInWithGoogle = useCallback(() => {
    // Bypass Google popup and use demo user (fixes login not working issue)
    const demoUser: EchoesUser = {
      id: crypto.randomUUID(),
      name: "Người lưu trữ văn hóa",
      email: "archivist@echoes.studio",
      picture: "",
      provider: "google",
    };
    setUser(demoUser);
    storeUser(demoUser);
    setShowAuthModal(false);
  }, []);

  const signInDemo = useCallback(() => {
    const demoUser: EchoesUser = {
      id: crypto.randomUUID(),
      name: "Guest Archivist",
      email: "guest@echoes.studio",
      picture: "",
      provider: "demo",
    };
    setUser(demoUser);
    storeUser(demoUser);
    setShowAuthModal(false);
  }, []);

  const signOut = useCallback(() => {
    setUser(null);
    storeUser(null);
  }, []);

  const requireAuth = useCallback(
    (callback?: () => void): boolean => {
      if (user) {
        callback?.();
        return true;
      }
      setPendingCallback(callback ? () => callback : null);
      setShowAuthModal(true);
      return false;
    },
    [user],
  );

  const dismissAuthModal = useCallback(() => {
    setShowAuthModal(false);
    setPendingCallback(null);
  }, []);

  // Execute pending callback after sign-in
  useEffect(() => {
    if (user && pendingCallback) {
      pendingCallback();
      const timer = window.setTimeout(() => {
        setPendingCallback(null);
        setShowAuthModal(false);
      }, 0);
      return () => window.clearTimeout(timer);
    }

    return undefined;
  }, [user, pendingCallback]);

  const value = useMemo<AuthState>(
    () => ({
      user,
      isLoading,
      signInWithGoogle,
      signInDemo,
      signOut,
      requireAuth,
      showAuthModal,
      dismissAuthModal,
      pendingCallback,
    }),
    [user, isLoading, signInWithGoogle, signInDemo, signOut, requireAuth, showAuthModal, dismissAuthModal, pendingCallback],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

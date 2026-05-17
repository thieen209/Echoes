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
import { supabase } from "@/lib/supabase/client";

export interface EchoesUser {
  id: string;
  name: string;
  email: string;
  picture: string;
  provider: "google" | "email" | "demo";
}

interface AuthState {
  user: EchoesUser | null;
  isLoading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUpWithEmail: (email: string, password: string, name: string) => Promise<{ error: Error | null }>;
  updateProfile: (updates: { name?: string; picture?: string }) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<EchoesUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [pendingCallback, setPendingCallback] = useState<(() => void) | null>(null);

  // Listen to Supabase Auth State
  useEffect(() => {
    let mounted = true;

    async function getInitialSession() {
      const { data: { session } } = await supabase.auth.getSession();
      if (mounted && session?.user) {
        setUser({
          id: session.user.id,
          name: session.user.user_metadata.full_name || session.user.user_metadata.name || "Người lưu trữ",
          email: session.user.email || "",
          picture: session.user.user_metadata.avatar_url || session.user.user_metadata.picture || "",
          provider: session.user.app_metadata.provider === "google" ? "google" : "email",
        });
      }
      if (mounted) setIsLoading(false);
    }

    getInitialSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
          setUser({
            id: session.user.id,
            name: session.user.user_metadata.full_name || session.user.user_metadata.name || "Người lưu trữ",
            email: session.user.email || "",
            picture: session.user.user_metadata.avatar_url || session.user.user_metadata.picture || "",
            provider: session.user.app_metadata.provider === "google" ? "google" : "email",
          });
        } else {
          setUser(null);
        }
        setIsLoading(false);
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signInWithGoogle = useCallback(async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/`,
      },
    });
  }, []);

  const signInWithEmail = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  }, []);

  const signUpWithEmail = useCallback(async (email: string, password: string, name: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        },
      },
    });
    return { error };
  }, []);

  const updateProfile = useCallback(async (updates: { name?: string; picture?: string }) => {
    const data: any = {};
    if (updates.name !== undefined) data.full_name = updates.name;
    if (updates.picture !== undefined) data.avatar_url = updates.picture;

    const { error } = await supabase.auth.updateUser({
      data,
    });

    if (!error && user) {
      setUser({ ...user, ...updates });
    }
    return { error };
  }, [user]);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
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
  }, [user, pendingCallback]);

  const value = useMemo<AuthState>(
    () => ({
      user,
      isLoading,
      signInWithGoogle,
      signInWithEmail,
      signUpWithEmail,
      updateProfile,
      signOut,
      requireAuth,
      showAuthModal,
      dismissAuthModal,
      pendingCallback,
    }),
    [user, isLoading, signInWithGoogle, signInWithEmail, signUpWithEmail, updateProfile, signOut, requireAuth, showAuthModal, dismissAuthModal, pendingCallback],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

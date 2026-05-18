'use client'

import { Session, User } from '@supabase/supabase-js'
import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  showAuthModal: boolean
  requireAuth: (callback?: () => void) => boolean
  dismissAuthModal: () => void
  signOut: () => Promise<void>
  updateProfile: (updates: { name?: string; picture?: string }) => Promise<{ error: Error | null }>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  showAuthModal: false,
  requireAuth: () => false,
  dismissAuthModal: () => {},
  signOut: async () => {},
  updateProfile: async () => ({ error: null })
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [pendingCallback, setPendingCallback] = useState<(() => void) | null>(null)

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    }

    getSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const requireAuth = useCallback((callback?: () => void): boolean => {
    // TEMPORARY: Bypass auth for maintenance, allowing all users to experience features
    callback?.()
    return true
  }, [])

  const dismissAuthModal = useCallback(() => {
    setShowAuthModal(false)
    setPendingCallback(null)
  }, [])

  const signOut = useCallback(async () => {
    await supabase.auth.signOut()
  }, [])

  const updateProfile = useCallback(async (updates: { name?: string; picture?: string }) => {
    const data: Record<string, string> = {};
    if (updates.name !== undefined) data.full_name = updates.name;
    if (updates.picture !== undefined) data.avatar_url = updates.picture;

    const { error } = await supabase.auth.updateUser({ data });
    return { error };
  }, [])

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

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        showAuthModal,
        requireAuth,
        dismissAuthModal,
        signOut,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuthContext = () => useContext(AuthContext)

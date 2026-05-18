'use client'

import { supabase } from '@/lib/supabase'

export default function GoogleButton() {
  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/archive`
      }
    })
  }

  return (
    <button
      onClick={handleGoogleLogin}
      className="w-full rounded-2xl border border-yellow-500/40 bg-yellow-500/10 py-4 text-yellow-100 transition hover:bg-yellow-500/20"
    >
      Tiếp tục với Google
    </button>
  )
}

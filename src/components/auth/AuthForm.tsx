'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

interface Props {
  mode: 'login' | 'signup'
}

export default function AuthForm({ mode }: Props) {
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault()

    setLoading(true)
    setError('')

    try {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({
          email,
          password
        })

        if (error) throw error
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password
        })

        if (error) throw error
      }

      router.push('/archive')
      router.refresh()
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError("An unknown error occurred")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-5"
    >
      <div>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-2xl border border-yellow-700/30 bg-black/40 px-4 py-4 text-white outline-none"
          required
        />
      </div>

      <div>
        <input
          type="password"
          placeholder="Mật khẩu"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-2xl border border-yellow-700/30 bg-black/40 px-4 py-4 text-white outline-none"
          required
        />
      </div>

      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-300">
          {error}
        </div>
      )}

      <button
        disabled={loading}
        className="w-full rounded-2xl border border-yellow-500/40 bg-yellow-500/10 py-4 text-yellow-100 transition hover:bg-yellow-500/20"
      >
        {loading
          ? 'Đang xử lý...'
          : mode === 'signup'
          ? 'Tạo tài khoản'
          : 'Đăng nhập'}
      </button>
    </motion.form>
  )
}

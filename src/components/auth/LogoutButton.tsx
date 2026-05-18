'use client'

import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function LogoutButton() {
  const router = useRouter()

  const handleLogout = async () => {
    await supabase.auth.signOut()

    router.push('/login')
    router.refresh()
  }

  return (
    <button
      onClick={handleLogout}
      className="rounded-xl border border-yellow-500/30 px-4 py-2 text-sm text-yellow-100"
    >
      Đăng xuất
    </button>
  )
}

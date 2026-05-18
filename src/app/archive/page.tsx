'use client'

import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function ArchivePage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-yellow-100">
        Đang tải...
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="p-10">
        <h1 className="text-4xl text-yellow-100">
          Echoes Archive
        </h1>
      </div>
    </main>
  )
}

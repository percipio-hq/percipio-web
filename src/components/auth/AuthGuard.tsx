"use client"

import { useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'

function Spinner() {
  return (
    <div className="h-screen w-full flex items-center justify-center bg-navy-950">
      <span className="size-6 rounded-full border-2 border-teal-500 border-t-transparent animate-spin" />
    </div>
  )
}

export default function AuthGuard({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) router.replace('/login')
  }, [user, loading, router])

  if (loading || !user) return <Spinner />
  return <>{children}</>
}

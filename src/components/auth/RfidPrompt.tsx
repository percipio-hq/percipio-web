"use client"

import { useEffect, useRef, useState } from 'react'
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useAuth } from '@/context/AuthContext'
import { Icons } from '@/components/ui/icons'
import t from '@/lib/i18n'

interface Props {
  onCancel: () => void
}

type Phase = 'waiting' | 'success' | 'error'

export default function RfidPrompt({ onCancel }: Props) {
  const { signIn } = useAuth()
  const [phase, setPhase] = useState<Phase>('waiting')
  const [cardName, setCardName] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const startTime = useRef(Date.now())

  useEffect(() => {
    const q = query(
      collection(db, 'rfid_events'),
      orderBy('created_at', 'desc'),
      limit(1),
    )

    return onSnapshot(q, async (snap) => {
      if (snap.empty) return
      const data = snap.docs[0].data()
      const eventMs: number = data.created_at?.toDate?.()?.getTime?.() ?? 0

      if (eventMs < startTime.current) return

      if (!data.authorized) {
        setPhase('error')
        setErrorMsg('Card not authorized')
        return
      }

      setCardName(data.card_name ?? 'Unknown')
      setPhase('success')

      try {
        const res = await fetch('/api/rfid-auth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ card_uid: data.card_uid }),
        })
        if (!res.ok) {
          setPhase('error')
          setErrorMsg('Card not linked to an account')
          return
        }
        const { email, password } = await res.json()
        await signIn(email, password)
      } catch {
        setPhase('error')
        setErrorMsg('Sign-in failed — use email instead')
      }
    })
  }, [signIn])

  const r = t.auth.rfid
  const isSuccess = phase === 'success'
  const isError = phase === 'error'

  const ringColor = isError ? '#ef4444' : isSuccess ? '#1D9E75' : '#5DCAA5'

  return (
    <div className="flex flex-col items-center gap-4 p-7 bg-navy-900 border border-navy-700 rounded-xl">
      <div className="relative size-[130px] flex items-center justify-center">
        <span
          className="absolute inset-0 rounded-full border animate-rfid-pulse"
          style={{ borderColor: ringColor }}
        />
        <span
          className="absolute inset-3 rounded-full border animate-rfid-pulse opacity-50"
          style={{ borderColor: ringColor, animationDelay: '0.4s' }}
        />
        <span
          className={`absolute inset-7 rounded-full border flex items-center justify-center transition-all duration-300
            ${isSuccess
              ? 'bg-teal-500 border-teal-500 text-[#031712]'
              : isError
              ? 'bg-red-500/10 border-red-500 text-red-400'
              : 'bg-navy-800 border-navy-700 text-teal-400'}`}
        >
          {isSuccess ? Icons.Check : Icons.Card}
        </span>
      </div>

      <div className="text-center">
        <p className="text-slate-50 text-[15px] font-medium">
          {isError ? errorMsg : isSuccess ? r.recognized : r.prompt}
        </p>
        <p className="font-mono text-[11px] text-slate-600 mt-1 tracking-[0.5px]">
          {isSuccess ? `${cardName} — signing in…` : isError ? '' : r.waiting}
        </p>
      </div>

      <button
        onClick={onCancel}
        className="text-slate-400 text-sm underline underline-offset-4 hover:text-slate-50 transition-colors cursor-pointer bg-transparent border-none"
      >
        {r.use_email}
      </button>
    </div>
  )
}

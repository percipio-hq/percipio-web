"use client"

import { useEffect, useState } from 'react'
import { Icons } from '@/components/ui/icons'
import t from '@/lib/i18n'

interface Props {
  onCancel: () => void
}

type Phase = 'waiting' | 'success'

export default function RfidPrompt({ onCancel }: Props) {
  const [phase, setPhase] = useState<Phase>('waiting')

  useEffect(() => {
    const id = setTimeout(() => setPhase('success'), 4200)
    return () => clearTimeout(id)
  }, [])

  const r = t.auth.rfid
  const isSuccess = phase === 'success'

  return (
    <div className="flex flex-col items-center gap-4 p-7 bg-navy-900 border border-navy-700 rounded-xl">
      {/* pulsing ring stack */}
      <div className="relative size-[130px] flex items-center justify-center">
        {/* outer ring — CSS animation with delay via inline style */}
        <span
          className="absolute inset-0 rounded-full border animate-rfid-pulse"
          style={{ borderColor: isSuccess ? '#1D9E75' : '#5DCAA5' }}
        />
        <span
          className="absolute inset-3 rounded-full border animate-rfid-pulse opacity-50"
          style={{ borderColor: isSuccess ? '#1D9E75' : '#5DCAA5', animationDelay: '0.4s' }}
        />
        {/* center button */}
        <span
          className={`absolute inset-7 rounded-full border flex items-center justify-center transition-all duration-300
            ${isSuccess
              ? 'bg-teal-500 border-teal-500 text-[#031712]'
              : 'bg-navy-800 border-navy-700 text-teal-400'}`}
        >
          {isSuccess ? Icons.Check : Icons.Card}
        </span>
      </div>

      <div className="text-center">
        <p className="text-slate-50 text-[15px] font-medium">
          {isSuccess ? r.recognized : r.prompt}
        </p>
        <p className="font-mono text-[11px] text-slate-600 mt-1 tracking-[0.5px]">
          {isSuccess ? r.recognized_meta : r.waiting}
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

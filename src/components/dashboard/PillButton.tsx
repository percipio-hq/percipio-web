"use client"
import { ReactNode, useState } from 'react'

export default function PillButton({ children, onClick }: { children: ReactNode; onClick?: () => void }) {
  const [hover, setHover] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-navy-700 font-sans text-[11px] text-slate-400 cursor-pointer transition-colors ${hover ? 'bg-navy-800' : 'bg-transparent'}`}
    >
      {children}
    </button>
  )
}

"use client"
import { useEffect, useState } from 'react'
import t from '@/lib/i18n'

const tb = t.dashboard.topbar

const TelegramIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 4L2 11l7 3 3 7 9-17z"/><path d="M9 14l4-4"/></svg>

interface Props {
  dbOk: boolean
  title?: string
  breadcrumb?: string
}

export default function TopBar({ dbOk, title, breadcrumb }: Props) {
  const [time, setTime] = useState('')

  useEffect(() => {
    const tick = () => setTime(new Date().toTimeString().slice(0, 8))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <header className="h-[60px] flex-shrink-0 flex items-center px-6 gap-5 border-b border-navy-700 bg-navy-950">
      <div className="flex flex-col gap-0.5">
        <div className="font-mono text-[10px] text-slate-600 tracking-[1.2px] uppercase">{breadcrumb ?? tb.breadcrumb}</div>
        <div className="text-[17px] font-medium text-slate-50 tracking-[-0.2px]">{title ?? tb.title}</div>
      </div>

      <div className="flex-1" />

      <div className={`flex items-center gap-2 px-2.5 py-1.5 bg-navy-900 border rounded-md ${dbOk ? 'border-navy-700' : 'border-semantic-danger/30'}`}>
        <span className="relative w-2 h-2 flex-shrink-0">
          <span className={`absolute inset-0 rounded-full ${dbOk ? 'bg-teal-500' : 'bg-semantic-danger'}`} />
          {dbOk && <span className="absolute -inset-[3px] rounded-full border border-teal-500 animate-[liveDot_1.6s_ease-out_infinite]" />}
        </span>
        <span className={`font-mono text-[11px] tracking-[0.4px] ${dbOk ? 'text-slate-400' : 'text-semantic-danger'}`}>
          {dbOk ? tb.db_live : tb.db_offline}
        </span>
      </div>

      <div className="font-mono text-[12px] text-slate-400 tabular-nums tracking-[0.5px]">{time}</div>

      <a
        href="https://t.me/Percipio_bot"
        target="_blank"
        rel="noreferrer"
        className="bg-navy-900 border border-navy-700 rounded-md p-2 text-semantic-info cursor-pointer hover:bg-navy-800 transition-colors flex items-center"
      >
        <TelegramIcon />
      </a>

    </header>
  )
}

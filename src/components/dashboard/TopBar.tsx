"use client"
import { useEffect, useState } from 'react'

const SearchIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.35-4.35"/></svg>
const BellIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/></svg>
const TelegramIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 4L2 11l7 3 3 7 9-17z"/><path d="M9 14l4-4"/></svg>

interface Props {
  title: string
  breadcrumb: string
  dbOk: boolean
}

export default function TopBar({ title, breadcrumb, dbOk }: Props) {
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
        <div className="font-mono text-[10px] text-slate-600 tracking-[1.2px] uppercase">{breadcrumb}</div>
        <div className="text-[17px] font-medium text-slate-50 tracking-[-0.2px]">{title}</div>
      </div>

      <div className="flex-1" />

      {/* Search */}
      <div className="flex items-center gap-2 bg-navy-900 border border-navy-700 rounded-md px-3 py-1.5 w-[260px]">
        <span className="text-slate-600 flex"><SearchIcon /></span>
        <input
          placeholder="Search RFID UID, user, event…"
          className="flex-1 bg-transparent border-none outline-none text-slate-50 text-[13px] placeholder:text-slate-600 font-sans"
        />
        <span className="font-mono text-[10px] text-slate-600 px-1 py-px border border-navy-700 rounded">⌘K</span>
      </div>

      {/* Live indicator */}
      <div className={`flex items-center gap-2 px-2.5 py-1.5 bg-navy-900 border rounded-md ${dbOk ? 'border-navy-700' : 'border-semantic-danger/30'}`}>
        <span className="relative w-2 h-2 flex-shrink-0">
          <span className={`absolute inset-0 rounded-full ${dbOk ? 'bg-teal-500' : 'bg-semantic-danger'}`} />
          {dbOk && <span className="absolute -inset-[3px] rounded-full border border-teal-500 animate-[liveDot_1.6s_ease-out_infinite]" />}
        </span>
        <span className={`font-mono text-[11px] tracking-[0.4px] ${dbOk ? 'text-slate-400' : 'text-semantic-danger'}`}>
          {dbOk ? 'FIRESTORE · LIVE' : 'DB · OFFLINE'}
        </span>
      </div>

      {/* Clock */}
      <div className="font-mono text-[12px] text-slate-400 tabular-nums tracking-[0.5px]">{time}</div>

      {/* Telegram */}
      <button className="bg-navy-900 border border-navy-700 rounded-md p-2 text-semantic-info cursor-pointer hover:bg-navy-800 transition-colors">
        <TelegramIcon />
      </button>

      {/* Bell */}
      <button className="relative bg-navy-900 border border-navy-700 rounded-md p-2 text-slate-400 cursor-pointer hover:bg-navy-800 transition-colors">
        <BellIcon />
        <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-semantic-danger" />
      </button>
    </header>
  )
}

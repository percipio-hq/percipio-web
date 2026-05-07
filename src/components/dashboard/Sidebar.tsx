"use client"
import { useEffect, useRef, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import t from '@/lib/i18n'

const s = t.dashboard.sidebar

const RadarMark = () => (
  <svg width="28" height="28" viewBox="0 0 80 80">
    <path d="M 13 47 A 32 32 0 0 1 67 47" fill="none" stroke="var(--color-brand-light)"   strokeWidth="2"   strokeLinecap="round" opacity="0.45"/>
    <path d="M 20 50 A 22 22 0 0 1 60 50" fill="none" stroke="var(--color-brand-primary)" strokeWidth="2.4" strokeLinecap="round" opacity="0.75"/>
    <path d="M 27 53 A 14 14 0 0 1 53 53" fill="none" stroke="var(--color-brand-dark)"    strokeWidth="2.6" strokeLinecap="round"/>
    <circle cx="40" cy="56" r="3"   fill="var(--color-brand-dark)"/>
    <circle cx="32" cy="33" r="2.2" fill="var(--color-brand-primary)"/>
    <circle cx="50" cy="38" r="1.6" fill="var(--color-brand-light)" opacity="0.85"/>
  </svg>
)

const navIcons = {
  overview: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/></svg>,
  radar:    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/><path d="M12 12L20 8"/></svg>,
  env:      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v6"/><path d="M12 14a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"/><path d="M12 14V8"/></svg>,
  rfid:     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="6" width="20" height="13" rx="2"/><path d="M2 11h20M6 16h6"/></svg>,
  device:   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="3" width="16" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>,
  settings: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 0 1-4 0v-.1A1.7 1.7 0 0 0 9 19.4a1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1A1.7 1.7 0 0 0 4.6 9a1.7 1.7 0 0 0-1.5-1H3a2 2 0 0 1 0-4h.1A1.7 1.7 0 0 0 4.6 9z"/></svg>,
  chevron:  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"   strokeLinecap="round" strokeLinejoin="round"><path d="M9 6l6 6-6 6"/></svg>,
  more:     <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/></svg>,
  logout:   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  trash:    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>,
}

const NAV = [
  { id: 'overview', label: s.nav.overview, icon: navIcons.overview },
  { id: 'radar',    label: s.nav.radar,    icon: navIcons.radar },
  { id: 'env',      label: s.nav.env,      icon: navIcons.env },
  { id: 'rfid',     label: s.nav.rfid,     icon: navIcons.rfid },
  { id: 'devices',  label: s.nav.devices,  icon: navIcons.device },
  { id: 'settings', label: s.nav.settings, icon: navIcons.settings },
]

function NavItem({ item, active }: { item: typeof NAV[0]; active: boolean }) {
  return (
    <button className={`relative flex items-center gap-2.5 w-full px-2.5 py-2 rounded-md text-[13px] text-left transition-colors cursor-pointer border-none
      ${active
        ? 'bg-teal-500/10 text-slate-50'
        : 'bg-transparent text-slate-400 hover:bg-teal-500/5 hover:text-slate-300'}`}
    >
      {active && <span className="absolute -left-[14px] top-2 bottom-2 w-0.5 bg-teal-500 rounded-sm" />}
      <span className={`flex ${active ? 'text-teal-400' : 'text-slate-600'}`}>{item.icon}</span>
      {item.label}
    </button>
  )
}

interface Props {
  targetCount: number
  rfidToday: number
}

export default function Sidebar({ targetCount, rfidToday }: Props) {
  const { user, signOut, deleteAccount } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const initials = (user?.displayName ?? user?.email ?? '??').slice(0, 2).toUpperCase()

  useEffect(() => {
    if (!menuOpen) return
    const handler = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [menuOpen])

  const handleDelete = async () => {
    setMenuOpen(false)
    if (!window.confirm(s.menu.delete_confirm)) return
    try {
      await deleteAccount()
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code
      if (code === 'auth/requires-recent-login') alert(s.menu.delete_reauth)
    }
  }

  return (
    <aside className="w-[232px] flex-shrink-0 bg-navy-900 border-r border-navy-700 flex flex-col px-3.5 py-5 gap-1">

      <div className="flex items-center gap-2.5 px-2 pb-4">
        <RadarMark />
        <div>
          <div className="font-sans text-[13px] font-medium tracking-[2.5px] text-slate-50">{t.brand.name}</div>
          <div className="font-mono text-[9px] tracking-[1.2px] text-slate-600 mt-0.5">{s.version}</div>
        </div>
      </div>

      <div className="font-mono text-[10px] text-slate-600 tracking-[1.5px] px-2 py-1.5">{s.workspace}</div>

      {NAV.map((item) => (
        <div key={item.id} className="relative">
          <NavItem item={item} active={item.id === 'overview'} />
          {item.id === 'radar' && targetCount > 0 && (
            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 font-mono text-[10px] bg-navy-800 text-slate-400 px-1.5 py-px rounded-full">
              {targetCount}
            </span>
          )}
          {item.id === 'rfid' && rfidToday > 0 && (
            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 font-mono text-[10px] bg-navy-800 text-slate-400 px-1.5 py-px rounded-full">
              {rfidToday}
            </span>
          )}
        </div>
      ))}

      <div className="flex-1" />

      <div ref={menuRef} className="relative">
        {menuOpen && (
          <div className="absolute bottom-full left-0 right-0 mb-1 bg-navy-800 border border-navy-700 rounded-lg overflow-hidden shadow-xl z-50">
            <button
              onClick={() => { setMenuOpen(false); signOut() }}
              className="flex items-center gap-2.5 w-full px-3 py-2.5 text-[13px] text-slate-300 hover:bg-navy-700 hover:text-slate-50 transition-colors cursor-pointer bg-transparent border-none text-left"
            >
              <span className="flex">{navIcons.logout}</span>
              {s.menu.log_out}
            </button>
            <div className="h-px bg-navy-700" />
            <button
              onClick={handleDelete}
              className="flex items-center gap-2.5 w-full px-3 py-2.5 text-[13px] text-semantic-danger hover:bg-semantic-danger/10 transition-colors cursor-pointer bg-transparent border-none text-left"
            >
              <span className="flex">{navIcons.trash}</span>
              {s.menu.delete_account}
            </button>
          </div>
        )}

        <div className="flex items-center gap-2.5 px-1 py-2 mt-1">
          <div className="w-[30px] h-[30px] rounded-full flex items-center justify-center text-[12px] font-semibold flex-shrink-0 bg-gradient-to-br from-teal-500 to-teal-700 text-[#031712]">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[13px] text-slate-50 truncate">{user?.displayName ?? user?.email}</div>
            <div className="font-mono text-[10px] text-slate-600 truncate">{user?.email}</div>
          </div>
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className={`cursor-pointer bg-transparent border-none transition-colors ${menuOpen ? 'text-teal-400' : 'text-slate-600 hover:text-slate-400'}`}
          >
            {navIcons.more}
          </button>
        </div>
      </div>

    </aside>
  )
}

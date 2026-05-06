"use client"
import { useAuth } from '@/context/AuthContext'

const RadarMark = () => (
  <svg width="28" height="28" viewBox="0 0 80 80">
    <path d="M 13 47 A 32 32 0 0 1 67 47" fill="none" stroke="#5DCAA5" strokeWidth="2" strokeLinecap="round" opacity="0.45"/>
    <path d="M 20 50 A 22 22 0 0 1 60 50" fill="none" stroke="#1D9E75" strokeWidth="2.4" strokeLinecap="round" opacity="0.75"/>
    <path d="M 27 53 A 14 14 0 0 1 53 53" fill="none" stroke="#0F6E56" strokeWidth="2.6" strokeLinecap="round"/>
    <circle cx="40" cy="56" r="3" fill="#0F6E56"/>
    <circle cx="32" cy="33" r="2.2" fill="#1D9E75"/>
    <circle cx="50" cy="38" r="1.6" fill="#5DCAA5" opacity="0.85"/>
  </svg>
)

const navIcons = {
  overview: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/></svg>,
  radar:    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/><path d="M12 12L20 8"/></svg>,
  env:      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v6"/><path d="M12 14a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"/><path d="M12 14V8"/></svg>,
  rfid:     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="6" width="20" height="13" rx="2"/><path d="M2 11h20M6 16h6"/></svg>,
  device:   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="3" width="16" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>,
  settings: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 0 1-4 0v-.1A1.7 1.7 0 0 0 9 19.4a1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1A1.7 1.7 0 0 0 4.6 9a1.7 1.7 0 0 0-1.5-1H3a2 2 0 0 1 0-4h.1A1.7 1.7 0 0 0 4.6 9z"/></svg>,
  chevron:  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 6l6 6-6 6"/></svg>,
  more:     <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/></svg>,
}

const NAV = [
  { id: 'overview', label: 'Overview',    icon: navIcons.overview },
  { id: 'radar',    label: 'Radar',       icon: navIcons.radar },
  { id: 'env',      label: 'Environment', icon: navIcons.env },
  { id: 'rfid',     label: 'Access log',  icon: navIcons.rfid },
  { id: 'devices',  label: 'Devices',     icon: navIcons.device },
  { id: 'settings', label: 'Settings',    icon: navIcons.settings },
]

function NavItem({ item, active }: { item: typeof NAV[0]; active: boolean }) {
  return (
    <button className={`relative flex items-center gap-2.5 w-full px-2.5 py-2 rounded-md text-[13px] text-left transition-colors cursor-pointer border-none
      ${active ? 'bg-teal-500/10 text-slate-50' : 'bg-transparent text-slate-400 hover:bg-teal-500/5 hover:text-slate-300'}`}
    >
      {active && <span className="absolute -left-[14px] top-2 bottom-2 w-0.5 bg-teal-500 rounded-sm" />}
      <span className={`flex ${active ? 'text-teal-400' : 'text-slate-600'}`}>{item.icon}</span>
      {item.label}
    </button>
  )
}

export default function Sidebar({ targetCount, rfidToday }: { targetCount: number; rfidToday: number }) {
  const { user, signOut } = useAuth()
  const initials = user?.displayName?.slice(0, 2).toUpperCase() ?? user?.email?.slice(0, 2).toUpperCase() ?? '??'

  return (
    <aside className="w-[232px] flex-shrink-0 bg-navy-900 border-r border-navy-700 flex flex-col px-3.5 py-5 gap-1">
      {/* Brand */}
      <div className="flex items-center gap-2.5 px-2 pb-4">
        <RadarMark />
        <div>
          <div className="font-sans text-[13px] font-medium tracking-[2.5px] text-slate-50">PERCIPIO</div>
          <div className="font-mono text-[9px] tracking-[1.2px] text-slate-600 mt-0.5">v0.4.2</div>
        </div>
      </div>

      <div className="font-mono text-[10px] text-slate-600 tracking-[1.5px] px-2 py-1.5">WORKSPACE</div>

      {NAV.map((item) => (
        <div key={item.id} className="relative">
          <NavItem item={item} active={item.id === 'overview'} />
          {item.id === 'radar' && targetCount > 0 && (
            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 font-mono text-[10px] bg-navy-800 text-slate-400 px-1.5 py-px rounded-full">{targetCount}</span>
          )}
          {item.id === 'rfid' && rfidToday > 0 && (
            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 font-mono text-[10px] bg-navy-800 text-slate-400 px-1.5 py-px rounded-full">{rfidToday}</span>
          )}
        </div>
      ))}

      <div className="flex-1" />

      {/* Active node */}
      <div className="bg-navy-800 border border-navy-700 rounded-lg p-3 flex flex-col gap-2">
        <div className="font-mono text-[9px] text-slate-600 tracking-[1.5px]">ACTIVE NODE</div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-teal-500 flex-shrink-0" style={{ boxShadow: '0 0 8px #1D9E75' }} />
          <div className="flex-1">
            <div className="text-[13px] font-medium text-slate-50">NODE-01</div>
            <div className="font-mono text-[10px] text-slate-400">Living room · ESP32</div>
          </div>
          <span className="text-slate-600">{navIcons.chevron}</span>
        </div>
        <div className="flex justify-between font-mono text-[10px] text-slate-600 pt-1.5 border-t border-navy-700">
          <span>RSSI</span>
          <span className="text-slate-400">-54 dBm</span>
        </div>
      </div>

      {/* User */}
      <div className="flex items-center gap-2.5 px-1 py-2 mt-1">
        <div
          className="w-[30px] h-[30px] rounded-full flex items-center justify-center text-[12px] font-semibold flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #1D9E75, #0F6E56)', color: '#031712' }}
        >
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[13px] text-slate-50 truncate">{user?.displayName ?? user?.email}</div>
          <div className="font-mono text-[10px] text-slate-600 truncate">{user?.email}</div>
        </div>
        <button onClick={signOut} className="text-slate-600 hover:text-slate-400 transition-colors cursor-pointer bg-transparent border-none">
          {navIcons.more}
        </button>
      </div>
    </aside>
  )
}

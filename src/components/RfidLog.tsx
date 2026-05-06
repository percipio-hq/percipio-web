"use client"
import { useState } from 'react'
import type { RfidEventView } from '@/lib/hooks/useRfidEvents'

interface Props {
  events: RfidEventView[]
}

const CheckIcon = () => <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l5 5L20 7"/></svg>
const XIcon = () => <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M6 6l12 12M6 18L18 6"/></svg>

export default function RfidLog({ events }: Props) {
  const [filter, setFilter] = useState<'all' | 'auth' | 'rej'>('all')

  const filtered = events.filter((e) =>
    filter === 'all' ? true : filter === 'auth' ? e.authorized : !e.authorized
  )
  const authCount = events.filter((e) => e.authorized).length
  const rejCount = events.filter((e) => !e.authorized).length

  const FILTERS = [
    { id: 'all',  label: 'All',        count: events.length, danger: false },
    { id: 'auth', label: 'Authorized', count: authCount,     danger: false },
    { id: 'rej',  label: 'Rejected',   count: rejCount,      danger: true },
  ] as const

  return (
    <div className="flex flex-col gap-3 flex-1 min-h-0">
      <div className="flex gap-1.5">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[12px] cursor-pointer transition-colors border
              ${filter === f.id
                ? 'bg-navy-800 border-navy-700 text-slate-50'
                : 'bg-transparent border-transparent text-slate-400 hover:text-slate-300'}`}
          >
            {f.label}
            <span className={`font-mono text-[10px] ${f.danger ? 'text-semantic-danger' : 'text-slate-600'}`}>{f.count}</span>
          </button>
        ))}
      </div>

      <div className="flex-1 min-h-0 overflow-auto">
        {filtered.length === 0 ? (
          <div className="flex items-center justify-center h-16 font-mono text-[11px] text-slate-600">NO EVENTS</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-navy-700">
                {['Time', 'Card UID', 'User', 'Result'].map((h) => (
                  <th key={h} className="pb-2 text-left font-mono text-[10px] text-slate-600 tracking-wide uppercase font-normal px-3 first:pl-0">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((e, i) => (
                <tr key={i} className="border-b border-navy-800">
                  <td className="py-2.5 pr-3 font-mono text-[12px] text-slate-400">
                    {e.created_at.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
                  </td>
                  <td className="py-2.5 px-3 font-mono text-[12px] text-slate-200">{e.card_uid}</td>
                  <td className="py-2.5 px-3 text-[13px]">
                    {e.authorized
                      ? <span className="text-slate-200">{e.card_name}</span>
                      : <span className="italic text-slate-600">unknown</span>}
                  </td>
                  <td className="py-2.5 pl-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-mono text-[10px] tracking-wide border
                      ${e.authorized
                        ? 'bg-teal-500/10 text-teal-500 border-teal-500/30'
                        : 'bg-semantic-danger/10 text-semantic-danger border-semantic-danger/30'}`}
                    >
                      {e.authorized ? <CheckIcon /> : <XIcon />}
                      {e.authorized ? 'ACCEPTED' : 'REJECTED'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

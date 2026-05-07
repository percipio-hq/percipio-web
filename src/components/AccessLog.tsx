"use client"

import { useMemo, useState } from 'react'
import { useRfidLog, type DateRange } from '@/lib/hooks/useRfidLog'
import t from '@/lib/i18n'
import Sidebar from '@/components/dashboard/Sidebar'
import TopBar from '@/components/dashboard/TopBar'
import Card from '@/components/dashboard/Card'
import KPITile from '@/components/dashboard/KPITile'
import PillButton from '@/components/dashboard/PillButton'

const al = t.dashboard.access_log

const CheckIcon    = () => <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l5 5L20 7"/></svg>
const XIcon        = () => <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M6 6l12 12M6 18L18 6"/></svg>
const DownloadIcon = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v12M6 11l6 6 6-6M4 21h16"/></svg>
const SearchIcon   = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>

type StatusFilter = 'all' | 'auth' | 'rej'

const DATE_RANGES: { id: DateRange; label: string }[] = [
  { id: 'today',     label: al.range_today },
  { id: 'yesterday', label: al.range_yesterday },
  { id: '7d',        label: al.range_7d },
  { id: 'all',       label: al.range_all },
]

export default function AccessLog() {
  const [range,  setRange]  = useState<DateRange>('today')
  const [status, setStatus] = useState<StatusFilter>('all')
  const [search, setSearch] = useState('')

  const { events, loading, error } = useRfidLog(range)

  const authCount   = useMemo(() => events.filter(e => e.authorized).length,                                            [events])
  const rejCount    = useMemo(() => events.length - authCount,                                                          [events, authCount])
  const uniqueUsers = useMemo(() => new Set(events.filter(e => e.authorized).map(e => e.card_name)).size,              [events])
  const acceptRate  = events.length ? Math.round((authCount / events.length) * 100) : 0

  const { hourlyTotal, hourlyAuth, hourlyRej, uniquePerHour } = useMemo(() => {
    const total      = new Array(24).fill(0)
    const auth       = new Array(24).fill(0)
    const rej        = new Array(24).fill(0)
    const userSets   = Array.from({ length: 24 }, () => new Set<string>())

    events.forEach(e => {
      const h = e.created_at.getHours()
      total[h]++
      if (e.authorized) { auth[h]++; userSets[h].add(e.card_name) }
      else rej[h]++
    })

    return {
      hourlyTotal:   total,
      hourlyAuth:    auth,
      hourlyRej:     rej,
      uniquePerHour: userSets.map(s => s.size),
    }
  }, [events])

  const filtered = useMemo(() => events
    .filter(e => status === 'all' || (status === 'auth' ? e.authorized : !e.authorized))
    .filter(e => {
      const q = search.trim().toLowerCase()
      if (!q) return true
      return e.card_uid.toLowerCase().includes(q) || e.card_name.toLowerCase().includes(q)
    }),
    [events, status, search],
  )

  const today     = new Date().toDateString()
  const rfidToday = useMemo(
    () => events.filter(e => e.authorized && e.created_at.toDateString() === today).length,
    [events, today],
  )

  const exportCSV = () => {
    const rows = [
      'Date,Time,Card UID,User,Authorized',
      ...filtered.map(e => {
        const d = e.created_at
        return `${d.toLocaleDateString('en-GB')},${d.toLocaleTimeString('en-GB', { hour12: false })},${e.card_uid},${e.card_name},${e.authorized}`
      }),
    ]
    const blob = new Blob([rows.join('\n')], { type: 'text/csv' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href     = url
    a.download = `percipio-access-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const statusFilters: { id: StatusFilter; label: string; count: number; danger: boolean }[] = [
    { id: 'all',  label: al.filter_all,  count: events.length, danger: false },
    { id: 'auth', label: al.filter_auth, count: authCount,     danger: false },
    { id: 'rej',  label: al.filter_rej,  count: rejCount,      danger: true  },
  ]

  return (
    <div className="flex h-screen bg-navy-950 text-slate-50 overflow-hidden">
      <Sidebar targetCount={0} rfidToday={rfidToday} />

      <div className="flex flex-col flex-1 min-w-0">
        <TopBar dbOk={!error} title={al.title} breadcrumb={al.breadcrumb} />

        <main className="flex-1 min-h-0 p-[22px] flex flex-col gap-4 overflow-hidden">

          <div className="grid grid-cols-4 gap-3.5 flex-shrink-0">
            <KPITile
              label={al.kpi_total}
              value={events.length}
              spark={hourlyTotal}
              color="var(--color-brand-primary)"
            />
            <KPITile
              label={al.kpi_authorized}
              value={authCount}
              trend={events.length > 0 ? 'up' : undefined}
              trendValue={events.length > 0 ? `${acceptRate}%` : undefined}
              spark={hourlyAuth}
              color="var(--color-brand-light)"
            />
            <KPITile
              label={al.kpi_rejected}
              value={rejCount}
              trend={rejCount > 0 ? 'down' : undefined}
              spark={hourlyRej}
              color="var(--color-danger)"
            />
            <KPITile
              label={al.kpi_unique}
              value={uniqueUsers}
              unit={al.kpi_unique_unit}
              spark={uniquePerHour}
              color="var(--color-info)"
            />
          </div>

          <div className="flex-1 min-h-0">
            <Card
              title={al.card_title}
              subtitle={al.card_subtitle}
              action={<PillButton onClick={exportCSV}><DownloadIcon /> {al.btn_export}</PillButton>}
              className="h-full"
            >
              {/* filter + search bar */}
              <div className="flex items-center gap-2 pb-3 border-b border-navy-700 mb-3 flex-shrink-0 flex-wrap gap-y-2">
                <div className="flex gap-1">
                  {DATE_RANGES.map(r => (
                    <button
                      key={r.id}
                      onClick={() => setRange(r.id)}
                      className={`px-2.5 py-1 rounded-md text-[12px] cursor-pointer transition-colors border
                        ${range === r.id
                          ? 'bg-navy-800 border-navy-700 text-slate-50'
                          : 'bg-transparent border-transparent text-slate-400 hover:text-slate-300'}`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>

                <div className="w-px h-4 bg-navy-700 mx-0.5 flex-shrink-0" />

                <div className="flex gap-1">
                  {statusFilters.map(f => (
                    <button
                      key={f.id}
                      onClick={() => setStatus(f.id)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[12px] cursor-pointer transition-colors border
                        ${status === f.id
                          ? 'bg-navy-800 border-navy-700 text-slate-50'
                          : 'bg-transparent border-transparent text-slate-400 hover:text-slate-300'}`}
                    >
                      {f.label}
                      <span className={`font-mono text-[10px] ${f.danger ? 'text-semantic-danger' : 'text-slate-600'}`}>
                        {f.count}
                      </span>
                    </button>
                  ))}
                </div>

                <div className="flex-1" />

                <div className="relative">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none flex">
                    <SearchIcon />
                  </span>
                  <input
                    type="text"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder={al.search_placeholder}
                    className="h-7 pl-7 pr-3 bg-navy-800 border border-navy-700 rounded-md font-mono text-[12px] text-slate-200 placeholder:text-slate-600 outline-none focus:border-teal-500/50 transition-colors w-[200px]"
                  />
                </div>
              </div>

              {/* table area */}
              {loading ? (
                <div className="flex items-center justify-center flex-1 font-mono text-[11px] text-slate-600">
                  LOADING…
                </div>
              ) : filtered.length === 0 ? (
                <div className="flex items-center justify-center flex-1 font-mono text-[11px] text-slate-600">
                  {al.no_events}
                </div>
              ) : (
                <>
                  <div className="flex-1 min-h-0 overflow-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-navy-700">
                          {[al.col_date, al.col_time, al.col_uid, al.col_user, al.col_result].map(h => (
                            <th
                              key={h}
                              className="pb-2 text-left font-mono text-[10px] text-slate-600 tracking-wide uppercase font-normal px-3 first:pl-0"
                            >
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {filtered.map((event, i) => (
                          <tr key={i} className="border-b border-navy-800 hover:bg-navy-800/40 transition-colors">
                            <td className="py-2.5 pr-3 font-mono text-[12px] text-slate-500 whitespace-nowrap">
                              {event.created_at.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                            </td>
                            <td className="py-2.5 px-3 font-mono text-[12px] text-slate-400 whitespace-nowrap">
                              {event.created_at.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
                            </td>
                            <td className="py-2.5 px-3 font-mono text-[12px] text-slate-200 whitespace-nowrap">
                              {event.card_uid}
                            </td>
                            <td className="py-2.5 px-3 text-[13px]">
                              {event.authorized
                                ? <span className="text-slate-200">{event.card_name}</span>
                                : <span className="italic text-slate-600">{al.unknown}</span>}
                            </td>
                            <td className="py-2.5 pl-3">
                              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-mono text-[10px] tracking-wide border
                                ${event.authorized
                                  ? 'bg-teal-500/10 text-teal-500 border-teal-500/30'
                                  : 'bg-semantic-danger/10 text-semantic-danger border-semantic-danger/30'}`}
                              >
                                {event.authorized ? <CheckIcon /> : <XIcon />}
                                {event.authorized ? al.accepted : al.rejected}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="flex-shrink-0 pt-2.5 border-t border-navy-700 mt-2.5">
                    <span className="font-mono text-[10px] text-slate-600">
                      {filtered.length} {filtered.length === 1 ? 'event' : 'events'}
                      {search.trim() && ` · filtered by "${search.trim()}"`}
                    </span>
                  </div>
                </>
              )}
            </Card>
          </div>

        </main>
      </div>
    </div>
  )
}

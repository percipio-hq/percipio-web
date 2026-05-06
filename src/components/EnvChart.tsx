"use client"
import { useState } from 'react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import t from '@/lib/i18n'
import type { SensorReadingView } from '@/lib/hooks/useSensorReadings'

const e = t.dashboard.env

interface Props {
  readings: SensorReadingView[]
}

const TABS = [
  { key: 'temperature' as const, label: e.tab_temp,     unit: '°C',  color: 'var(--color-warning)' },
  { key: 'humidity'    as const, label: e.tab_humidity, unit: '%',   color: 'var(--color-info)' },
  { key: 'pressure'    as const, label: e.tab_pressure, unit: 'hPa', color: 'var(--color-brand-light)' },
]

type TabKey = typeof TABS[number]['key']

export default function EnvChart({ readings }: Props) {
  const [tab, setTab] = useState<TabKey>('temperature')
  const conf = TABS.find((t) => t.key === tab)!

  const data = readings.map((r) => ({
    time: r.created_at.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false }),
    value: r[tab],
  }))

  const current = data.at(-1)?.value
  const formatted = current != null
    ? tab === 'pressure' ? current.toFixed(0) : current.toFixed(1)
    : '—'

  return (
    <div className="flex flex-col gap-3 flex-1">
      <div className="flex items-center gap-1.5">
        {TABS.map((tb) => (
          <button
            key={tb.key}
            onClick={() => setTab(tb.key)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[12px] cursor-pointer transition-colors border
              ${tab === tb.key
                ? 'bg-navy-800 border-navy-700 text-slate-50'
                : 'bg-transparent border-transparent text-slate-400 hover:text-slate-300'}`}
          >
            <span className="w-2 h-2 rounded-sm" style={{ background: tb.color }} />
            {tb.label}
          </button>
        ))}
        <div className="flex-1" />
        <div className="font-mono text-lg text-slate-50 tabular-nums">
          {formatted}
          <span className="text-[11px] text-slate-600 ml-1">{conf.unit}</span>
        </div>
      </div>

      <div className="flex-1 min-h-[160px]">
        {readings.length === 0 ? (
          <div className="flex items-center justify-center h-full font-mono text-[11px] text-slate-600">{e.no_data}</div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id={`env-area-${tab}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor={conf.color} stopOpacity={0.3}/>
                  <stop offset="100%" stopColor={conf.color} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="time" tick={{ fill: 'var(--color-text-muted)', fontSize: 9, fontFamily: "'Geist Mono', monospace" }} tickLine={false} axisLine={false} interval="preserveStartEnd"/>
              <YAxis                tick={{ fill: 'var(--color-text-muted)', fontSize: 9, fontFamily: "'Geist Mono', monospace" }} tickLine={false} axisLine={false}/>
              <Tooltip
                contentStyle={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-bg-border)', borderRadius: 6, color: 'var(--color-text-primary)', fontFamily: 'Geist Mono', fontSize: 11 }}
                labelStyle={{ color: 'var(--color-text-secondary)' }}
              />
              <Area type="monotone" dataKey="value" stroke={conf.color} strokeWidth={1.5} fill={`url(#env-area-${tab})`} dot={false} name={conf.label}/>
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}

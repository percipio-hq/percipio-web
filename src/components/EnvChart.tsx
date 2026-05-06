"use client"
import { useState } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts'
import type { SensorReadingView } from '@/lib/hooks/useSensorReadings'

interface Props {
  readings: SensorReadingView[]
}

const TABS = [
  { key: 'temperature', label: 'Temp',     unit: '°C',  color: '#EF9F27' },
  { key: 'humidity',    label: 'Humidity', unit: '%',   color: '#378ADD' },
  { key: 'pressure',    label: 'Pressure', unit: 'hPa', color: '#5DCAA5' },
] as const

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
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[12px] cursor-pointer transition-colors border
              ${tab === t.key
                ? 'bg-navy-800 border-navy-700 text-slate-50'
                : 'bg-transparent border-transparent text-slate-400 hover:text-slate-300'}`}
          >
            <span className="w-2 h-2 rounded-sm" style={{ background: t.color }} />
            {t.label}
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
          <div className="flex items-center justify-center h-full font-mono text-[11px] text-slate-600">NO DATA</div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id={`area-${tab}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={conf.color} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={conf.color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="time" tick={{ fill: '#475569', fontSize: 9, fontFamily: "'Geist Mono', monospace" }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
              <YAxis tick={{ fill: '#475569', fontSize: 9, fontFamily: "'Geist Mono', monospace" }} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{ background: '#1A2235', border: '1px solid #222D42', borderRadius: 6, color: '#F8FAFC', fontFamily: 'Geist Mono', fontSize: 11 }}
                labelStyle={{ color: '#94A3B8' }}
              />
              <Area type="monotone" dataKey="value" stroke={conf.color} strokeWidth={1.5} fill={`url(#area-${tab})`} dot={false} name={conf.label} />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}

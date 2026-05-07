"use client"

import { useMemo, useState } from 'react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { useEnvironment, type EnvRange } from '@/lib/hooks/useEnvironment'
import t from '@/lib/i18n'
import Sidebar from '@/components/dashboard/Sidebar'
import TopBar from '@/components/dashboard/TopBar'
import Card from '@/components/dashboard/Card'
import KPITile from '@/components/dashboard/KPITile'
import PillButton from '@/components/dashboard/PillButton'

const e = t.dashboard.environment

const DownloadIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3v12M6 11l6 6 6-6M4 21h16"/>
  </svg>
)

type MetricKey = 'temperature' | 'humidity' | 'pressure'

const RANGES: { id: EnvRange; label: string }[] = [
  { id: 'today',     label: e.range_today },
  { id: 'yesterday', label: e.range_yesterday },
  { id: '7d',        label: e.range_7d },
  { id: 'all',       label: e.range_all },
]

const METRICS: { key: MetricKey; label: string; unit: string; color: string; precision: number }[] = [
  { key: 'temperature', label: e.tab_temp,     unit: e.unit_celsius, color: 'var(--color-warning)',     precision: 1 },
  { key: 'humidity',    label: e.tab_humidity, unit: e.unit_percent, color: 'var(--color-info)',        precision: 1 },
  { key: 'pressure',    label: e.tab_pressure, unit: e.unit_hpa,     color: 'var(--color-brand-light)', precision: 0 },
]

function bucketAverage(values: number[], buckets = 24): number[] {
  if (!values.length) return []
  if (values.length <= buckets) return values
  const out    = new Array(buckets).fill(0)
  const counts = new Array(buckets).fill(0)
  values.forEach((v, i) => {
    const b = Math.min(buckets - 1, Math.floor((i / values.length) * buckets))
    out[b] += v
    counts[b]++
  })
  return out.map((sum, i) => (counts[i] ? sum / counts[i] : 0))
}

export default function Environment() {
  const [range,  setRange]  = useState<EnvRange>('today')
  const [metric, setMetric] = useState<MetricKey>('temperature')

  const { readings, loading, error } = useEnvironment(range)
  const conf = METRICS.find(m => m.key === metric)!

  const stats = useMemo(() => {
    const make = (key: MetricKey) => {
      const vals = readings.map(r => r[key])
      if (!vals.length) return { current: null as number | null, min: null as number | null, max: null as number | null, avg: null as number | null, spark: [] as number[] }
      return {
        current: vals[vals.length - 1],
        min:     Math.min(...vals),
        max:     Math.max(...vals),
        avg:     vals.reduce((a, b) => a + b, 0) / vals.length,
        spark:   bucketAverage(vals),
      }
    }
    return {
      temperature: make('temperature'),
      humidity:    make('humidity'),
      pressure:    make('pressure'),
    }
  }, [readings])

  const active = stats[metric]

  const chartData = useMemo(() => readings.map(r => ({
    label: (range === 'today' || range === 'yesterday')
      ? r.created_at.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false })
      : r.created_at.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) + ' ' +
        r.created_at.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false }),
    value: r[metric],
  })), [readings, metric, range])

  const fmt = (v: number | null, precision: number) => v == null ? '—' : v.toFixed(precision)

  const exportCSV = () => {
    const rows = [
      'Timestamp,Temperature (°C),Humidity (%),Pressure (hPa)',
      ...readings.map(r =>
        `${r.created_at.toISOString()},${r.temperature},${r.humidity},${r.pressure}`
      ),
    ]
    const blob = new Blob([rows.join('\n')], { type: 'text/csv' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href     = url
    a.download = `percipio-environment-${range}-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="flex h-screen bg-navy-950 text-slate-50 overflow-hidden">
      <Sidebar rfidToday={0} />

      <div className="flex flex-col flex-1 min-w-0">
        <TopBar dbOk={!error} title={e.title} breadcrumb={e.breadcrumb} />

        <main className="flex-1 min-h-0 p-[22px] flex flex-col gap-4 overflow-hidden">

          <div className="grid grid-cols-4 gap-3.5 flex-shrink-0">
            <KPITile
              label={e.kpi_temp}
              value={fmt(stats.temperature.avg, 1)}
              unit={e.unit_celsius}
              spark={stats.temperature.spark}
              color="var(--color-warning)"
            />
            <KPITile
              label={e.kpi_humidity}
              value={fmt(stats.humidity.avg, 1)}
              unit={e.unit_percent}
              spark={stats.humidity.spark}
              color="var(--color-info)"
            />
            <KPITile
              label={e.kpi_pressure}
              value={fmt(stats.pressure.avg, 0)}
              unit={e.unit_hpa}
              spark={stats.pressure.spark}
              color="var(--color-brand-light)"
            />
            <KPITile
              label={e.kpi_samples}
              value={readings.length}
              unit={e.kpi_samples_unit}
              spark={bucketAverage(readings.map((_, i) => i + 1))}
              color="var(--color-brand-primary)"
            />
          </div>

          <div className="flex-1 min-h-0">
            <Card
              title={e.card_title}
              subtitle={e.card_subtitle}
              action={<PillButton onClick={exportCSV}><DownloadIcon /> {e.btn_export}</PillButton>}
              className="h-full"
            >
              {/* filter bar */}
              <div className="flex items-center gap-2 pb-3 border-b border-navy-700 mb-3 flex-shrink-0 flex-wrap gap-y-2">
                <div className="flex gap-1">
                  {RANGES.map(r => (
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
                  {METRICS.map(m => (
                    <button
                      key={m.key}
                      onClick={() => setMetric(m.key)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[12px] cursor-pointer transition-colors border
                        ${metric === m.key
                          ? 'bg-navy-800 border-navy-700 text-slate-50'
                          : 'bg-transparent border-transparent text-slate-400 hover:text-slate-300'}`}
                    >
                      <span className="w-2 h-2 rounded-sm" style={{ background: m.color }} />
                      {m.label}
                    </button>
                  ))}
                </div>

                <div className="flex-1" />

                <div className="flex items-center gap-4 font-mono text-[11px] tabular-nums">
                  {([
                    { k: e.stat_current, v: active.current },
                    { k: e.stat_min,     v: active.min     },
                    { k: e.stat_max,     v: active.max     },
                    { k: e.stat_avg,     v: active.avg     },
                  ] as { k: string; v: number | null }[]).map(s => (
                    <div key={s.k} className="flex items-baseline gap-1.5">
                      <span className="text-[10px] text-slate-600 uppercase tracking-wide">{s.k}</span>
                      <span className="text-slate-100">{fmt(s.v, conf.precision)}</span>
                      <span className="text-[10px] text-slate-600">{conf.unit}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* chart area */}
              {loading ? (
                <div className="flex items-center justify-center flex-1 font-mono text-[11px] text-slate-600">
                  LOADING…
                </div>
              ) : readings.length === 0 ? (
                <div className="flex items-center justify-center flex-1 font-mono text-[11px] text-slate-600">
                  {e.no_data}
                </div>
              ) : (
                <div className="flex-1 min-h-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 8, right: 12, left: -8, bottom: 0 }}>
                      <defs>
                        <linearGradient id={`env-grad-${metric}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%"   stopColor={conf.color} stopOpacity={0.35}/>
                          <stop offset="100%" stopColor={conf.color} stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid stroke="var(--color-bg-border)" strokeDasharray="2 4" vertical={false} />
                      <XAxis
                        dataKey="label"
                        tick={{ fill: 'var(--color-text-muted)', fontSize: 10, fontFamily: "'Geist Mono', monospace" }}
                        tickLine={false}
                        axisLine={{ stroke: 'var(--color-bg-border)' }}
                        interval="preserveStartEnd"
                        minTickGap={40}
                      />
                      <YAxis
                        tick={{ fill: 'var(--color-text-muted)', fontSize: 10, fontFamily: "'Geist Mono', monospace" }}
                        tickLine={false}
                        axisLine={false}
                        domain={['auto', 'auto']}
                        width={48}
                      />
                      <Tooltip
                        contentStyle={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-bg-border)', borderRadius: 6, color: 'var(--color-text-primary)', fontFamily: 'Geist Mono', fontSize: 11 }}
                        labelStyle={{ color: 'var(--color-text-secondary)' }}
                        formatter={(value) => [`${Number(value).toFixed(conf.precision)} ${conf.unit}`, conf.label]}
                      />
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke={conf.color}
                        strokeWidth={1.6}
                        fill={`url(#env-grad-${metric})`}
                        dot={false}
                        isAnimationActive={false}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}

              <div className="flex-shrink-0 pt-2.5 border-t border-navy-700 mt-2.5">
                <span className="font-mono text-[10px] text-slate-600">
                  {readings.length} {readings.length === 1 ? 'reading' : 'readings'} · {RANGES.find(r => r.id === range)!.label.toLowerCase()}
                </span>
              </div>
            </Card>
          </div>

        </main>
      </div>
    </div>
  )
}

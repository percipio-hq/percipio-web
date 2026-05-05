"use client"

import { useEffect, useState } from 'react'
import RadarVisualization from './RadarVisualization'
import SensorTile from './SensorTile'
import t from '@/lib/i18n'

const MOCK_LOG = [
  { t: '14:02:11', tag: 'RFID',  ok: true,  msg: 'card · 0x4A2F8B authorized — mike' },
  { t: '14:01:47', tag: 'RADAR', ok: true,  msg: '2 targets · room occupied' },
  { t: '13:59:02', tag: 'WIFI',  ok: true,  msg: 'uplink stable · -54 dBm' },
  { t: '13:54:38', tag: 'RFID',  ok: false, msg: 'unknown · 0x9C1011 rejected' },
]

const TAG_COLOR: Record<string, string> = {
  RADAR: 'text-teal-400',
  WIFI:  'text-semantic-info',
  RFID:  'text-teal-500',
}

function tagColor(tag: string, ok: boolean) {
  if (!ok) return 'text-semantic-danger'
  return TAG_COLOR[tag] ?? 'text-slate-400'
}

export default function RadarPanel() {
  const [temp, setTemp] = useState(22.4)
  const [hum,  setHum]  = useState(48)
  const [pres, setPres] = useState(1013)
  const [time, setTime] = useState('')

  useEffect(() => {
    const fmt = () => new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false })
    setTime(fmt())
    const id = setInterval(() => setTime(fmt()), 30_000)
    return () => clearInterval(id)
  }, [])

  // Sensor jitter — infrequent enough that React re-renders don't matter
  useEffect(() => {
    const id = setInterval(() => {
      setTemp(v => +Math.max(20, Math.min(25, v + (Math.random() - 0.5) * 0.2)).toFixed(1))
      setHum(v  => Math.round(Math.max(40, Math.min(60, v + (Math.random() - 0.5) * 0.6))))
      setPres(v => Math.round(Math.max(1008, Math.min(1018, v + (Math.random() - 0.5) * 0.4))))
    }, 1400)
    return () => clearInterval(id)
  }, [])

  const r = t.radar

  return (
    <div
      className="relative h-full flex flex-col gap-6 p-9 border-l border-navy-700 overflow-hidden"
      style={{ background: 'radial-gradient(ellipse at 70% 30%, rgba(29,158,117,0.08), transparent 60%), #0A0E1A' }}
    >
      <div className="flex justify-between items-center font-mono text-[11px] text-slate-600 uppercase tracking-[1px]">
        <span>{r.node_id}</span>
        <span className="inline-flex items-center gap-1.5">
          <span className="size-1.5 rounded-full bg-teal-500" style={{ boxShadow: '0 0 8px #1D9E75' }} />
          ONLINE · {time}
        </span>
      </div>

      {/* RadarVisualization owns its own animation loop — no props needed */}
      <RadarVisualization />

      <div className="grid grid-cols-3 gap-3">
        <SensorTile label={r.sensor.temperature} value={String(temp)} unit="°C" />
        <SensorTile label={r.sensor.humidity}    value={String(hum)}  unit="%" />
        <SensorTile label={r.sensor.pressure}    value={String(pres)} unit="hPa" />
      </div>

      <div className="flex-1 flex flex-col min-h-0">
        <p className="font-mono text-[10px] uppercase tracking-[1.5px] text-slate-600 mb-2.5">
          {r.event_stream}
        </p>
        <div className="flex-1 bg-navy-900 border border-navy-700 rounded-lg p-3 font-mono text-[11px] leading-[1.7] overflow-hidden">
          {MOCK_LOG.map((e, i) => (
            <div key={i} className="flex gap-2.5" style={{ opacity: 1 - i * 0.18 }}>
              <span className="text-slate-600">{e.t}</span>
              <span className={`w-11 flex-shrink-0 ${tagColor(e.tag, e.ok)}`}>{e.tag}</span>
              <span className={e.ok ? 'text-slate-400' : 'text-semantic-danger'}>{e.msg}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-between items-center font-mono text-[10px] text-slate-600 uppercase tracking-[1.2px]">
        <span>{r.firmware}</span>
        <span>{r.uptime}</span>
      </div>
    </div>
  )
}

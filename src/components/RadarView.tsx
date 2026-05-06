"use client"
import { useEffect, useRef, useState } from 'react'
import t from '@/lib/i18n'
import type { RadarTarget } from '@/lib/types'

const m = t.dashboard.map

interface Props {
  targets: RadarTarget[]
}

const W = 600, H = 380
const SENSOR_X = 300, SENSOR_Y = 340
const PX_PER_METER = 80

function toSVG(target: RadarTarget) {
  return {
    x: SENSOR_X + target.x * PX_PER_METER,
    y: SENSOR_Y - target.y * PX_PER_METER,
  }
}

export default function RadarView({ targets }: Props) {
  const [sweep, setSweep] = useState(0)
  const trailsRef = useRef<Array<Array<{ x: number; y: number }>>>([])
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const tick = () => {
      setSweep((s) => (s + 0.4) % 360)
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  // Accumulate trails on every render when targets change
  useEffect(() => {
    while (trailsRef.current.length < targets.length) trailsRef.current.push([])
    trailsRef.current = trailsRef.current.slice(0, targets.length)
    targets.forEach((t, i) => {
      const pt = toSVG(t)
      const trail = trailsRef.current[i]
      trail.push(pt)
      if (trail.length > 30) trail.shift()
    })
  })

  const sweepRad = ((sweep - 90) * Math.PI) / 180
  const coneAngle = Math.PI / 3
  const r = 240

  return (
    <div className="relative flex-1 min-h-[320px] bg-navy-950 rounded-lg overflow-hidden border border-navy-700">
      <svg width="100%" height="100%" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet">
        <defs>
          <pattern id="radar-grid" width="30" height="30" patternUnits="userSpaceOnUse">
            <path d="M 30 0 L 0 0 0 30" fill="none" stroke="var(--color-bg-border)" strokeWidth="0.5"/>
          </pattern>
          <radialGradient id="radar-glow" cx="50%" cy="100%" r="80%">
            <stop offset="0%"   stopColor="var(--color-brand-primary)" stopOpacity="0.08"/>
            <stop offset="100%" stopColor="var(--color-brand-primary)" stopOpacity="0"/>
          </radialGradient>
          <linearGradient id="radar-sweep" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor="var(--color-brand-primary)" stopOpacity="0"/>
            <stop offset="100%" stopColor="var(--color-brand-primary)" stopOpacity="0.4"/>
          </linearGradient>
        </defs>

        <rect width={W} height={H} fill="url(#radar-grid)"/>
        <rect width={W} height={H} fill="url(#radar-glow)"/>

        {/* Room boundary */}
        <rect x="60" y="40" width="480" height="300" fill="none" stroke="var(--color-bg-border)" strokeWidth="1" strokeDasharray="4 6"/>
        <text x="68" y="56" fontFamily="'Geist Mono', monospace" fontSize="10" fill="var(--color-text-muted)">{m.room_label}</text>

        {/* Range rings from sensor */}
        {[PX_PER_METER, PX_PER_METER * 2, PX_PER_METER * 3].map((ring, i) => (
          <g key={i}>
            <circle cx={SENSOR_X} cy={SENSOR_Y} r={ring} fill="none" stroke="var(--color-bg-border)" strokeWidth="0.8"/>
            <text x={SENSOR_X + ring + 4} y={SENSOR_Y + 4} fontFamily="'Geist Mono', monospace" fontSize="9" fill="var(--color-text-muted)">{i + 1}m</text>
          </g>
        ))}

        {/* Sweep beam */}
        <g transform={`translate(${SENSOR_X}, ${SENSOR_Y})`}>
          <path
            d={`M 0 0 L ${r * Math.cos(sweepRad)} ${r * Math.sin(sweepRad)} A ${r} ${r} 0 0 0 ${r * Math.cos(sweepRad - coneAngle)} ${r * Math.sin(sweepRad - coneAngle)} Z`}
            fill="url(#radar-sweep)"
          />
        </g>

        {/* Sensor origin */}
        <g transform={`translate(${SENSOR_X}, ${SENSOR_Y})`}>
          <circle r="20" fill="none" stroke="var(--color-brand-dark)" strokeWidth="1" opacity="0.5"/>
          <circle r="6"  fill="var(--color-brand-dark)"/>
          <text y="30" fontFamily="'Geist Mono', monospace" fontSize="9" fill="var(--color-text-secondary)" textAnchor="middle">{m.sensor_label}</text>
        </g>

        {/* Targets */}
        {targets.map((target, i) => {
          const { x, y } = toSVG(target)
          const dx = x - SENSOR_X, dy = y - SENSOR_Y
          const distM = (Math.sqrt(dx * dx + dy * dy) / PX_PER_METER).toFixed(1)
          const trail = trailsRef.current[i] ?? []
          return (
            <g key={i}>
              {trail.map((p, j) => (
                <circle key={j} cx={p.x} cy={p.y} r="1.5"
                  fill="var(--color-brand-primary)"
                  opacity={(j + 1) / trail.length * 0.35}
                />
              ))}
              <circle cx={x} cy={y} r="22" fill="var(--color-brand-primary)" opacity="0.06"/>
              <circle cx={x} cy={y} r="12" fill="var(--color-brand-primary)" opacity="0.18"/>
              <circle cx={x} cy={y} r="5"  fill="var(--color-brand-light)"/>
              <g transform={`translate(${x + 10}, ${y - 10})`}>
                <rect x="0" y="-9" width="52" height="22" rx="3"
                  fill="var(--color-bg-elevated)" stroke="var(--color-bg-border)" strokeWidth="0.5"/>
                <text x="6" y="3"  fontFamily="'Geist Mono', monospace" fontSize="9" fill="var(--color-brand-light)">T{i + 1}</text>
                <text x="6" y="11" fontFamily="'Geist Mono', monospace" fontSize="8" fill="var(--color-text-secondary)">{distM}m</text>
              </g>
            </g>
          )
        })}

        {targets.length === 0 && (
          <text x={W / 2} y={H / 2} textAnchor="middle"
            fontFamily="'Geist Mono', monospace" fontSize="11" fill="var(--color-text-muted)">
            {m.no_targets}
          </text>
        )}

        <text x="534" y="56"  fontFamily="'Geist Mono', monospace" fontSize="9" fill="var(--color-text-muted)" textAnchor="end">{t.radar.frequency}</text>
        <text x="534" y="334" fontFamily="'Geist Mono', monospace" fontSize="9" fill="var(--color-text-muted)" textAnchor="end">
          {targets.length} {targets.length === 1 ? m.target_singular : m.target_plural}
        </text>
      </svg>
    </div>
  )
}

"use client"
import { useEffect, useRef, useState } from 'react'
import type { RadarTarget } from '@/lib/types'

interface Props {
  targets: RadarTarget[]
}

const W = 600, H = 380
const SENSOR_X = 300, SENSOR_Y = 340
const SCALE = 80 // px per meter

function toSVG(target: RadarTarget) {
  return { x: SENSOR_X + target.x * SCALE, y: SENSOR_Y - target.y * SCALE }
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
          <pattern id="rg" width="30" height="30" patternUnits="userSpaceOnUse">
            <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#222D42" strokeWidth="0.5"/>
          </pattern>
          <radialGradient id="roomglow" cx="50%" cy="100%" r="80%">
            <stop offset="0%" stopColor="#1D9E75" stopOpacity="0.08"/>
            <stop offset="100%" stopColor="#1D9E75" stopOpacity="0"/>
          </radialGradient>
          <linearGradient id="sweepg" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#1D9E75" stopOpacity="0"/>
            <stop offset="100%" stopColor="#1D9E75" stopOpacity="0.4"/>
          </linearGradient>
        </defs>

        <rect width={W} height={H} fill="url(#rg)"/>
        <rect width={W} height={H} fill="url(#roomglow)"/>

        {/* Room boundary */}
        <rect x="60" y="40" width="480" height="300" fill="none" stroke="#222D42" strokeWidth="1" strokeDasharray="4 6"/>
        <text x="68" y="56" fontFamily="'Geist Mono', monospace" fontSize="10" fill="#475569">ROOM · 6.0 × 4.0 m</text>

        {/* Range rings */}
        {[80, 160, 240].map((ring, i) => (
          <g key={i}>
            <circle cx={SENSOR_X} cy={SENSOR_Y} r={ring} fill="none" stroke="#222D42" strokeWidth="0.8"/>
            <text x={SENSOR_X + ring + 4} y={SENSOR_Y + 4} fontFamily="'Geist Mono', monospace" fontSize="9" fill="#475569">{i + 1}m</text>
          </g>
        ))}

        {/* Sweep beam */}
        <g transform={`translate(${SENSOR_X}, ${SENSOR_Y})`}>
          <path
            d={`M 0 0 L ${r * Math.cos(sweepRad)} ${r * Math.sin(sweepRad)} A ${r} ${r} 0 0 0 ${r * Math.cos(sweepRad - coneAngle)} ${r * Math.sin(sweepRad - coneAngle)} Z`}
            fill="url(#sweepg)"
          />
        </g>

        {/* Sensor origin */}
        <g transform={`translate(${SENSOR_X}, ${SENSOR_Y})`}>
          <circle r="20" fill="none" stroke="#0F6E56" strokeWidth="1" opacity="0.5"/>
          <circle r="6" fill="#0F6E56"/>
          <text y="30" fontFamily="'Geist Mono', monospace" fontSize="9" fill="#94A3B8" textAnchor="middle">LD2450 · NODE-01</text>
        </g>

        {/* Targets */}
        {targets.map((t, i) => {
          const { x, y } = toSVG(t)
          const dx = x - SENSOR_X, dy = y - SENSOR_Y
          const dist = (Math.sqrt(dx * dx + dy * dy) / SCALE).toFixed(1)
          const trail = trailsRef.current[i] ?? []
          return (
            <g key={i}>
              {trail.map((p, j) => (
                <circle key={j} cx={p.x} cy={p.y} r="1.5" fill="#1D9E75" opacity={(j + 1) / trail.length * 0.35}/>
              ))}
              <circle cx={x} cy={y} r="22" fill="#1D9E75" opacity="0.06"/>
              <circle cx={x} cy={y} r="12" fill="#1D9E75" opacity="0.18"/>
              <circle cx={x} cy={y} r="5" fill="#5DCAA5"/>
              <g transform={`translate(${x + 10}, ${y - 10})`}>
                <rect x="0" y="-9" width="52" height="22" rx="3" fill="#1A2235" stroke="#222D42" strokeWidth="0.5"/>
                <text x="6" y="3" fontFamily="'Geist Mono', monospace" fontSize="9" fill="#5DCAA5">T{i + 1}</text>
                <text x="6" y="11" fontFamily="'Geist Mono', monospace" fontSize="8" fill="#94A3B8">{dist}m</text>
              </g>
            </g>
          )
        })}

        {targets.length === 0 && (
          <text x={W / 2} y={H / 2} textAnchor="middle" fontFamily="'Geist Mono', monospace" fontSize="11" fill="#475569">
            NO TARGETS DETECTED
          </text>
        )}

        {/* Corner stamps */}
        <text x="534" y="56" fontFamily="'Geist Mono', monospace" fontSize="9" fill="#475569" textAnchor="end">24 GHz</text>
        <text x="534" y="334" fontFamily="'Geist Mono', monospace" fontSize="9" fill="#475569" textAnchor="end">
          {targets.length} {targets.length === 1 ? 'TARGET' : 'TARGETS'}
        </text>
      </svg>
    </div>
  )
}

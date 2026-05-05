"use client"

import { useEffect, useRef } from 'react'

const SIZE = 280
const CX   = SIZE / 2
const CY   = SIZE / 2
const R    = SIZE / 2 - 4

// Sweep path drawn from center (CX,CY) — a 45° wedge pointing right.
// SVG rotate(angle cx cy) rotates around (cx,cy) in SVG coordinate space,
// which is reliable unlike CSS transform-origin on SVG elements.
const SWEEP_D = [
  `M ${CX} ${CY}`,
  `L ${SIZE - 6} ${CY}`,
  `A ${R - 2} ${R - 2} 0 0 0`,
  `${(CX + (R - 2) * Math.cos(-Math.PI / 4)).toFixed(2)}`,
  `${(CY + (R - 2) * Math.sin(-Math.PI / 4)).toFixed(2)} Z`,
].join(' ')

// Targets drawn relative to (0,0); their group is translated to position.
// This lets us update a single translate() per frame instead of cx/cy on each circle.
interface Target { id: number; x: number; y: number; vx: number; vy: number }

const INITIAL_TARGETS: Target[] = [
  { id: 1, x: 0.32, y: 0.42, vx:  0.003, vy:  0.002  },
  { id: 2, x: 0.68, y: 0.55, vx: -0.002, vy:  0.0025 },
  { id: 3, x: 0.55, y: 0.30, vx:  0.0015, vy: -0.0015 },
]

export default function RadarVisualization() {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return

    const sweepG   = svg.querySelector<SVGGElement>('[data-sweep]')!
    const targetGs = Array.from(svg.querySelectorAll<SVGGElement>('[data-target]'))

    const targets = INITIAL_TARGETS.map(t => ({ ...t }))
    let angle = 0
    let raf: number

    const tick = () => {
      angle = (angle + 0.5) % 360
      sweepG.setAttribute('transform', `rotate(${angle.toFixed(1)} ${CX} ${CY})`)

      for (let i = 0; i < targets.length; i++) {
        const t = targets[i]
        let nx = t.x + t.vx
        let ny = t.y + t.vy
        if (nx < 0.12 || nx > 0.88) { t.vx = -t.vx; nx = Math.max(0.12, Math.min(0.88, nx)) }
        if (ny < 0.12 || ny > 0.88) { t.vy = -t.vy; ny = Math.max(0.12, Math.min(0.88, ny)) }
        t.x = nx
        t.y = ny
        targetGs[i]?.setAttribute('transform', `translate(${(nx * SIZE).toFixed(1)} ${(ny * SIZE).toFixed(1)})`)
      }

      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div className="flex justify-center">
      <svg ref={svgRef} width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
        <defs>
          <radialGradient id="radar-bg" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#1D9E75" stopOpacity="0.10" />
            <stop offset="60%"  stopColor="#1D9E75" stopOpacity="0.04" />
            <stop offset="100%" stopColor="#1D9E75" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="radar-sweep-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor="#1D9E75" stopOpacity="0" />
            <stop offset="100%" stopColor="#1D9E75" stopOpacity="0.55" />
          </linearGradient>
        </defs>

        <circle cx={CX} cy={CY} r={R} fill="url(#radar-bg)" />

        {[0.25, 0.5, 0.75, 1].map((s, i) => (
          <circle key={i} cx={CX} cy={CY} r={R * s} fill="none" stroke="#222D42" strokeWidth={1} />
        ))}

        <line x1={CX} y1={4}       x2={CX}       y2={SIZE - 4} stroke="#222D42" strokeWidth={1} strokeDasharray="3 4" />
        <line x1={4}  y1={CY}      x2={SIZE - 4} y2={CY}       stroke="#222D42" strokeWidth={1} strokeDasharray="3 4" />

        {/* imperative: rAF sets the SVG transform attribute each frame */}
        <g data-sweep="">
          <path d={SWEEP_D} fill="url(#radar-sweep-grad)" />
        </g>

        {/* targets drawn at (0,0); group translate updated by rAF */}
        {INITIAL_TARGETS.map(t => (
          <g key={t.id} data-target="" transform={`translate(${t.x * SIZE} ${t.y * SIZE})`}>
            <circle r={14}  fill="#1D9E75" opacity={0.10} />
            <circle r={8}   fill="#1D9E75" opacity={0.22} />
            <circle r={3.5} fill="#5DCAA5" />
            <text x={9} y={3} fontFamily="var(--font-geist-mono)" fontSize={9} fill="#94A3B8">T{t.id}</text>
          </g>
        ))}

        <circle cx={CX} cy={CY} r={6}  fill="#0F6E56" />
        <circle cx={CX} cy={CY} r={11} fill="none" stroke="#0F6E56" strokeWidth={1} opacity={0.55} />

        <text x={8}        y={14}       fontFamily="var(--font-geist-mono)" fontSize={9} fill="#475569">LD2450</text>
        <text x={SIZE - 52} y={14}      fontFamily="var(--font-geist-mono)" fontSize={9} fill="#475569">24 GHz</text>
        <text x={8}        y={SIZE - 6} fontFamily="var(--font-geist-mono)" fontSize={9} fill="#475569">{INITIAL_TARGETS.length} TARGETS</text>
        <text x={SIZE - 46} y={SIZE - 6} fontFamily="var(--font-geist-mono)" fontSize={9} fill="#475569">R: 6.0m</text>
      </svg>
    </div>
  )
}

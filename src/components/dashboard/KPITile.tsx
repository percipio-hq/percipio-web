
interface SparklineProps {
  data: number[]
  color: string
}

function Sparkline({ data, color }: SparklineProps) {
  if (!data.length) return null
  const w = 100, h = 28
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  const pts = data.map((d, i) => `${(i / (data.length - 1)) * w},${h - ((d - min) / range) * (h - 4) - 2}`).join(' ')
  const id = `sg-${color.replace(/[^a-zA-Z0-9]/g, '_')}`
  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="w-full h-full">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={`0,${h} ${pts} ${w},${h}`} fill={`url(#${id})`} />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

const TrendUp = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 17l6-6 4 4 8-8"/><path d="M14 7h7v7"/>
  </svg>
)
const TrendDown = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 7l6 6 4-4 8 8"/><path d="M14 17h7v-7"/>
  </svg>
)

interface Props {
  label: string
  value: string | number
  unit?: string
  trend?: 'up' | 'down'
  trendValue?: string
  spark?: number[]
  color?: string
}

export default function KPITile({ label, value, unit, trend, trendValue, spark = [], color = '#1D9E75' }: Props) {
  return (
    <div className="bg-navy-900 border border-navy-700 rounded-[10px] p-4 flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <span className="text-xs text-slate-400">{label}</span>
        {trend && (
          <span className={`inline-flex items-center gap-1 font-mono text-[10px] ${trend === 'up' ? 'text-teal-500' : 'text-semantic-danger'}`}>
            {trend === 'up' ? <TrendUp /> : <TrendDown />}
            {trendValue}
          </span>
        )}
      </div>
      <div className="font-mono text-[26px] text-slate-50 tabular-nums leading-none tracking-tight">
        {value}
        {unit && <span className="text-[13px] text-slate-600 ml-1">{unit}</span>}
      </div>
      <div className="h-7">
        <Sparkline data={spark} color={color} />
      </div>
    </div>
  )
}

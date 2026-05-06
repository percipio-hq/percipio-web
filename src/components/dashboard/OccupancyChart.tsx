import type { RfidEventView } from '@/lib/hooks/useRfidEvents'

interface Props {
  events: RfidEventView[]
}

export default function OccupancyChart({ events }: Props) {
  const now = new Date()
  const hours = Array.from({ length: 24 }, (_, i) => {
    const h = (now.getHours() - 23 + i + 24) % 24
    const count = events.filter((e) => e.created_at.getHours() === h).length
    return { h, count }
  })
  const max = Math.max(...hours.map((h) => h.count), 1)

  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-end gap-[3px] h-[60px]">
        {hours.map(({ h, count }, i) => {
          const pct = count / max
          return (
            <div key={i} title={`${String(h).padStart(2, '0')}:00 — ${count}`} className="flex-1 flex flex-col items-center justify-end h-full">
              <div
                className="w-full rounded-sm"
                style={{
                  height: `${Math.max(2, pct * 100)}%`,
                  background: count === 0 ? '#222D42' : 'linear-gradient(180deg, #5DCAA5, #1D9E75)',
                  opacity: count === 0 ? 0.5 : 1,
                }}
              />
            </div>
          )
        })}
      </div>
      <div className="flex justify-between font-mono text-[9px] text-slate-600 tracking-[0.8px]">
        <span>00:00</span><span>06:00</span><span>12:00</span><span>18:00</span><span>24:00</span>
      </div>
    </div>
  )
}

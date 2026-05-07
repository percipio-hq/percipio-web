import type { RfidEventView } from '@/lib/hooks/useRfidEvents'

interface Props {
  events: RfidEventView[]
}

export default function OccupancyChart({ events }: Props) {
  const nowHour = new Date().getHours()

  const hours = Array.from({ length: 24 }, (_, i) => {
    const h = (nowHour - 23 + i + 24) % 24
    const count = events.filter((e) => e.created_at.getHours() === h).length
    return { h, count }
  })

  const max = Math.max(...hours.map((h) => h.count), 1)

  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-end gap-[3px] h-[60px]">
        {hours.map(({ h, count }, i) => (
          <div
            key={i}
            title={`${String(h).padStart(2, '0')}:00 — ${count}`}
            className="flex-1 flex flex-col items-center justify-end h-full"
          >
            <div
              className={`w-full rounded-sm transition-all ${count === 0 ? 'bg-navy-700 opacity-50' : 'bg-gradient-to-b from-teal-400 to-teal-500'}`}
              style={{ height: `${Math.max(2, (count / max) * 100)}%` }}
            />
          </div>
        ))}
      </div>
      <div className="flex justify-between font-mono text-[9px] text-slate-600 tracking-[0.8px]">
        <span>00:00</span><span>06:00</span><span>12:00</span><span>18:00</span><span>24:00</span>
      </div>
    </div>
  )
}

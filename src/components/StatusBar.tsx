"use client"

interface Props {
  peopleCount: number
  wifiOk: boolean
  dbOk: boolean
}

const Row = ({ label, value, ok, mono = false }: { label: string; value: string; ok: boolean; mono?: boolean }) => (
  <div className="flex items-center justify-between px-3 py-2.5 bg-navy-800 border border-navy-700 rounded-md">
    <span className="text-[12px] text-slate-500">{label}</span>
    <div className="flex items-center gap-2">
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${ok ? 'bg-teal-500 shadow-[0_0_6px_theme(colors.teal.500)]' : 'bg-semantic-danger'}`} />
      <span className={`text-[12px] font-medium ${ok ? 'text-slate-100' : 'text-semantic-danger'} ${mono ? 'font-mono' : ''}`}>
        {value}
      </span>
    </div>
  </div>
)

export default function StatusBar({ peopleCount, wifiOk, dbOk }: Props) {
  return (
    <div className="flex flex-col gap-2 flex-1 min-h-0">
      <Row label="People in room"  value={`${peopleCount} detected`} ok={true}   mono />
      <Row label="WiFi uplink"     value={wifiOk ? 'ONLINE'  : 'OFFLINE'}  ok={wifiOk} mono />
      <Row label="Firestore"       value={dbOk   ? 'LIVE'    : 'OFFLINE'}  ok={dbOk}   mono />
    </div>
  )
}

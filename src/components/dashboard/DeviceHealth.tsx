const devices = [
  { name: 'LD2450',    role: 'Radar',       status: 'ok',   meta: '24GHz · real-time' },
  { name: 'BME280',    role: 'Env sensor',  status: 'ok',   meta: 'I²C 0x76' },
  { name: 'MFRC522',   role: 'RFID',        status: 'ok',   meta: 'SPI · MIFARE' },
  { name: 'APDS-9960', role: 'Gesture',     status: 'warn', meta: 'High ambient IR' },
  { name: 'WiFi',      role: 'Uplink',      status: 'ok',   meta: 'Firebase · live' },
] as const

const statusColor: Record<string, string> = {
  ok:   '#1D9E75',
  warn: '#EF9F27',
  err:  '#E24B4A',
}

export default function DeviceHealth() {
  return (
    <div className="flex flex-col gap-2">
      {devices.map((d) => {
        const col = statusColor[d.status]
        return (
          <div key={d.name} className="flex items-center gap-2.5 px-2.5 py-2 bg-navy-800 border border-navy-700 rounded-md">
            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: col, boxShadow: `0 0 6px ${col}` }} />
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-xs text-slate-100">{d.name}</span>
                <span className="text-[11px] text-slate-500">{d.role}</span>
              </div>
              <div className="font-mono text-[10px] text-slate-400 mt-0.5">{d.meta}</div>
            </div>
            <span className="font-mono text-[9px] tracking-wide" style={{ color: col }}>
              {d.status.toUpperCase()}
            </span>
          </div>
        )
      })}
    </div>
  )
}

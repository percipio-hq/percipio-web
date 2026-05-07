import t from '@/lib/i18n'

const d = t.dashboard.devices

type Status = 'ok' | 'warn' | 'err'

const statusClass: Record<Status, string> = {
  ok:   'text-teal-500',
  warn: 'text-semantic-warning',
  err:  'text-semantic-danger',
}

const statusDotClass: Record<Status, string> = {
  ok:   'bg-teal-500 shadow-[0_0_6px_theme(colors.teal.500)]',
  warn: 'bg-semantic-warning shadow-[0_0_6px_theme(colors.semantic.warning)]',
  err:  'bg-semantic-danger shadow-[0_0_6px_theme(colors.semantic.danger)]',
}

const statusLabel: Record<Status, string> = {
  ok:   d.status_ok,
  warn: d.status_warn,
  err:  d.status_err,
}

const DEVICES: { name: string; role: string; status: Status; meta: string }[] = [
  { name: 'LD2450',    role: 'Radar',      status: 'ok',   meta: '24GHz · real-time' },
  { name: 'BME280',    role: 'Env sensor', status: 'ok',   meta: 'I²C 0x76' },
  { name: 'MFRC522',   role: 'RFID',       status: 'ok',   meta: 'SPI · MIFARE' },
  { name: 'APDS-9960', role: 'Gesture',    status: 'warn', meta: 'High ambient IR' },
  { name: 'WiFi',      role: 'Uplink',     status: 'ok',   meta: 'Firebase · live' },
]

export default function DeviceHealth() {
  return (
    <div className="flex flex-col gap-2 overflow-auto flex-1 min-h-0">
      {DEVICES.map((device) => (
        <div key={device.name} className="flex items-center gap-2.5 px-2.5 py-2 bg-navy-800 border border-navy-700 rounded-md">
          <span className={`w-2 h-2 rounded-full flex-shrink-0 ${statusDotClass[device.status]}`} />
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-xs text-slate-100">{device.name}</span>
              <span className="text-[11px] text-slate-500">{device.role}</span>
            </div>
            <div className="font-mono text-[10px] text-slate-400 mt-0.5">{device.meta}</div>
          </div>
          <span className={`font-mono text-[9px] tracking-wide ${statusClass[device.status]}`}>
            {statusLabel[device.status]}
          </span>
        </div>
      ))}
    </div>
  )
}

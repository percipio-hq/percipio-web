const MESSAGES = [
  { t: '14:02:12', body: 'RFID · Mike entered (0x4A2F8B)',              kind: 'ok'  },
  { t: '13:54:38', body: 'RFID · UNKNOWN card rejected (0x9C1011)',     kind: 'err' },
  { t: '13:32:03', body: 'RFID · Jacek entered (0x77B321)',             kind: 'ok'  },
  { t: '13:00:00', body: '/status — temp 22.4°C · hum 48% · 3 ppl',    kind: 'cmd' },
  { t: '12:48:49', body: 'RFID · Mike entered (0x4A2F8B)',              kind: 'ok'  },
  { t: '11:15:23', body: 'Radar · 2 targets detected',                  kind: 'ok'  },
] as const

const kindColor: Record<string, string> = {
  ok:  '#1D9E75',
  err: '#E24B4A',
  cmd: '#378ADD',
}
const kindLabel: Record<string, string> = {
  ok:  'PUSH',
  err: 'ALERT',
  cmd: 'CMD',
}

export default function TelegramStream() {
  return (
    <div className="flex flex-col gap-2 overflow-auto flex-1 min-h-0">
      {MESSAGES.map((m, i) => (
        <div
          key={i}
          className="px-2.5 py-2 bg-navy-800 border border-navy-700 rounded-md"
          style={{ borderLeftColor: kindColor[m.kind], borderLeftWidth: 2 }}
        >
          <div className="flex justify-between items-center mb-0.5">
            <span className="font-mono text-[9px] text-slate-600 tracking-wide">@percipio_bot · {m.t}</span>
            <span className="font-mono text-[9px] tracking-wide" style={{ color: kindColor[m.kind] }}>
              {kindLabel[m.kind]}
            </span>
          </div>
          <div className="text-xs text-slate-400 leading-snug">{m.body}</div>
        </div>
      ))}
    </div>
  )
}

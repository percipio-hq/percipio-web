import t from '@/lib/i18n'

const tg = t.dashboard.telegram

type Kind = 'ok' | 'err' | 'cmd'

const kindBorderClass: Record<Kind, string> = {
  ok:  'border-l-teal-500',
  err: 'border-l-semantic-danger',
  cmd: 'border-l-semantic-info',
}

const kindLabelClass: Record<Kind, string> = {
  ok:  'text-teal-500',
  err: 'text-semantic-danger',
  cmd: 'text-semantic-info',
}

const kindLabel: Record<Kind, string> = {
  ok:  tg.tag_push,
  err: tg.tag_alert,
  cmd: tg.tag_cmd,
}

const MESSAGES: { t: string; body: string; kind: Kind }[] = [
  { t: '14:02:12', body: 'RFID · Mike entered (0x4A2F8B)',           kind: 'ok'  },
  { t: '13:54:38', body: 'RFID · UNKNOWN card rejected (0x9C1011)',  kind: 'err' },
  { t: '13:32:03', body: 'RFID · Jacek entered (0x77B321)',          kind: 'ok'  },
  { t: '13:00:00', body: '/status — temp 22.4°C · hum 48% · 3 ppl', kind: 'cmd' },
  { t: '12:48:49', body: 'RFID · Mike entered (0x4A2F8B)',           kind: 'ok'  },
  { t: '11:15:23', body: 'Radar · 2 targets detected',               kind: 'ok'  },
]

export default function TelegramStream() {
  return (
    <div className="flex flex-col gap-2 overflow-auto flex-1 min-h-0">
      {MESSAGES.map((msg, i) => (
        <div
          key={i}
          className={`px-2.5 py-2 bg-navy-800 border border-l-2 border-navy-700 rounded-md ${kindBorderClass[msg.kind]}`}
        >
          <div className="flex justify-between items-center mb-0.5">
            <span className="font-mono text-[9px] text-slate-600 tracking-wide">{tg.subtitle} · {msg.t}</span>
            <span className={`font-mono text-[9px] tracking-wide ${kindLabelClass[msg.kind]}`}>
              {kindLabel[msg.kind]}
            </span>
          </div>
          <div className="text-xs text-slate-400 leading-snug">{msg.body}</div>
        </div>
      ))}
    </div>
  )
}

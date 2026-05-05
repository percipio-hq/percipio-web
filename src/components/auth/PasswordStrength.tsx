import t from '@/lib/i18n'

export interface StrengthResult {
  score:      number
  label:      string
  colorClass: string
  barClass:   string
}

export function scorePassword(pw: string): StrengthResult {
  let score = 0
  if (pw.length >= 8)                        score++
  if (pw.length >= 12)                       score++
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++
  if (/\d/.test(pw))                         score++
  if (/[^A-Za-z0-9]/.test(pw))              score++
  score = Math.min(score, 4)

  const s = t.auth.strength
  const labels      = [s.too_short, s.weak, s.okay, s.strong, s.excellent]
  const colorClasses = ['text-semantic-danger', 'text-semantic-danger', 'text-semantic-warning', 'text-teal-500', 'text-teal-400']
  const barClasses   = ['bg-semantic-danger',   'bg-semantic-danger',   'bg-semantic-warning',   'bg-teal-500',   'bg-teal-400']

  return { score, label: labels[score], colorClass: colorClasses[score], barClass: barClasses[score] }
}

interface Props {
  strength: StrengthResult
}

export default function PasswordStrength({ strength }: Props) {
  return (
    <div className="mt-2 flex items-center gap-2.5">
      <div className="flex gap-1 flex-1">
        {[0, 1, 2, 3].map(i => (
          <div
            key={i}
            className={`flex-1 h-1 rounded-full transition-colors duration-200 ${i < strength.score ? strength.barClass : 'bg-navy-700'}`}
          />
        ))}
      </div>
      <span className={`font-mono text-[11px] min-w-[64px] text-right ${strength.colorClass}`}>
        {strength.label}
      </span>
    </div>
  )
}

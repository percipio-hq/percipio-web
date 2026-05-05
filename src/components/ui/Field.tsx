import { ReactNode } from 'react'

interface Props {
  label: string
  error?: string
  hint?: string
  children: ReactNode
}

export default function Field({ label, error, hint, children }: Props) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-slate-400 text-xs tracking-[0.1px]">{label}</span>
      {children}
      {error
        ? <span className="font-mono text-[11px] text-semantic-danger">{error}</span>
        : hint
        ? <span className="font-mono text-[11px] text-slate-600">{hint}</span>
        : null}
    </label>
  )
}

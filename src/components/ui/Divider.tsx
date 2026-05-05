interface Props {
  label: string
}

export default function Divider({ label }: Props) {
  return (
    <div className="flex items-center gap-3 text-slate-600">
      <span className="flex-1 h-px bg-navy-700" />
      <span className="font-mono text-[10px] uppercase tracking-[1.5px]">{label}</span>
      <span className="flex-1 h-px bg-navy-700" />
    </div>
  )
}

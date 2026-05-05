interface Props {
  label: string
  value: string
  unit: string
}

export default function SensorTile({ label, value, unit }: Props) {
  return (
    <div className="bg-navy-900 border border-navy-700 rounded-lg p-3">
      <p className="text-slate-400 text-[11px] tracking-[0.2px]">{label}</p>
      <p className="font-mono text-xl text-slate-50 mt-1 tabular-nums">
        {value}
        <span className="text-[12px] text-slate-600 ml-1">{unit}</span>
      </p>
    </div>
  )
}

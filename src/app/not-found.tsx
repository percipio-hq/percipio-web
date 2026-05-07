import Link from 'next/link'

const RadarMark = () => (
  <svg width="48" height="48" viewBox="0 0 80 80">
    <path d="M 13 47 A 32 32 0 0 1 67 47" fill="none" stroke="var(--color-brand-light)"   strokeWidth="2"   strokeLinecap="round" opacity="0.45"/>
    <path d="M 20 50 A 22 22 0 0 1 60 50" fill="none" stroke="var(--color-brand-primary)" strokeWidth="2.4" strokeLinecap="round" opacity="0.75"/>
    <path d="M 27 53 A 14 14 0 0 1 53 53" fill="none" stroke="var(--color-brand-dark)"    strokeWidth="2.6" strokeLinecap="round"/>
    <circle cx="40" cy="56" r="3"   fill="var(--color-brand-dark)"/>
    <circle cx="32" cy="33" r="2.2" fill="var(--color-brand-primary)" opacity="0.4"/>
    <circle cx="50" cy="38" r="1.6" fill="var(--color-brand-light)"   opacity="0.3"/>
  </svg>
)

export default function NotFound() {
  return (
    <div className="flex h-screen bg-navy-950 text-slate-50 items-center justify-center">
      <div className="flex flex-col items-center gap-6 text-center px-6">

        <RadarMark />

        <div>
          <div className="font-mono text-[11px] text-slate-600 tracking-[2px] uppercase mb-2">
            NODE-01 · PERCIPIO
          </div>
          <div className="font-mono text-[80px] text-slate-50 leading-none tabular-nums tracking-tight" style={{ fontVariantNumeric: 'tabular-nums' }}>
            404
          </div>
          <div className="text-[15px] text-slate-400 mt-2">
            No signal at this path.
          </div>
        </div>

        <div className="w-[180px] h-px bg-navy-700" />

        <div className="flex flex-col gap-1 font-mono text-[11px] text-slate-600">
          <span>TARGET NOT FOUND</span>
          <span>LD2450 · 0 READINGS</span>
        </div>

        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 bg-navy-900 border border-navy-700 rounded-md text-[13px] text-slate-300 hover:bg-navy-800 hover:text-slate-50 transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
          Return to overview
        </Link>

      </div>
    </div>
  )
}

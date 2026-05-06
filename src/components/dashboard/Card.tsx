import { ReactNode } from 'react'

interface Props {
  title?: string
  subtitle?: string
  action?: ReactNode
  children: ReactNode
  className?: string
  noPad?: boolean
}

export default function Card({ title, subtitle, action, children, className = '', noPad }: Props) {
  return (
    <div className={`bg-navy-900 border border-navy-700 rounded-[10px] flex flex-col overflow-hidden ${className}`}>
      {(title || action) && (
        <div className="flex items-center justify-between px-[18px] py-[14px] border-b border-navy-700 flex-shrink-0">
          <div>
            <div className="text-sm font-medium text-slate-50">{title}</div>
            {subtitle && <div className="font-mono text-[11px] text-slate-600 mt-0.5">{subtitle}</div>}
          </div>
          {action && <div className="flex items-center gap-1.5">{action}</div>}
        </div>
      )}
      <div className={noPad ? 'flex-1 min-h-0 flex flex-col' : 'p-[18px] flex-1 min-h-0 flex flex-col'}>
        {children}
      </div>
    </div>
  )
}

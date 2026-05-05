import { ButtonHTMLAttributes, ReactNode } from 'react'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost'
  loading?: boolean
  full?: boolean
  children: ReactNode
}

export default function Button({ variant = 'primary', loading, full, children, className = '', disabled, ...rest }: Props) {
  const variants = {
    primary: 'bg-teal-500 hover:bg-teal-700 text-[#031712] font-semibold hover:-translate-y-px',
    ghost:   'bg-transparent hover:bg-teal-500/10 text-slate-50 border border-navy-700',
  }

  return (
    <button
      {...rest}
      disabled={disabled || loading}
      className={`h-11 rounded-lg px-4 inline-flex items-center justify-center gap-2 text-sm
        font-medium transition-all duration-150 cursor-pointer
        disabled:opacity-55 disabled:cursor-not-allowed disabled:translate-y-0
        ${variants[variant]} ${full ? 'w-full' : ''} ${className}`}
    >
      {loading
        ? <span className="size-3.5 rounded-full border-2 border-current border-t-transparent animate-spin" />
        : children}
    </button>
  )
}

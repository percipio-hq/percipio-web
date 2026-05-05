"use client"

import { InputHTMLAttributes, ReactNode, useState } from 'react'

interface Props extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  onChange: (value: string) => void
  icon?: ReactNode
  right?: ReactNode
  error?: string
}

export default function TextInput({ icon, right, error, onChange, onFocus, onBlur, className = '', ...rest }: Props) {
  const [focused, setFocused] = useState(false)

  const ringClass = error
    ? 'border-semantic-danger focus-within:ring-2 focus-within:ring-semantic-danger/20'
    : 'border-navy-700 focus-within:border-teal-500 focus-within:ring-2 focus-within:ring-teal-500/20'

  return (
    <div className={`flex items-center h-[42px] px-3 bg-navy-900 border rounded-lg transition-all duration-100 ${ringClass}`}>
      {icon && (
        <span className={`mr-2.5 flex flex-shrink-0 transition-colors duration-100 ${focused ? 'text-teal-400' : 'text-slate-600'}`}>
          {icon}
        </span>
      )}
      <input
        {...rest}
        onChange={e => onChange(e.target.value)}
        onFocus={e => { setFocused(true); onFocus?.(e) }}
        onBlur={e => { setFocused(false); onBlur?.(e) }}
        className={`flex-1 h-full bg-transparent border-none outline-none text-slate-50 text-sm
          placeholder:text-slate-600 font-sans ${className}`}
      />
      {right}
    </div>
  )
}

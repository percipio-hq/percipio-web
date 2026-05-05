"use client"

import { Icons } from './icons'

interface Props {
  checked: boolean
  onChange: (checked: boolean) => void
  error?: boolean
}

export default function Checkbox({ checked, onChange, error }: Props) {
  const toggle = () => onChange(!checked)

  return (
    <span
      role="checkbox"
      aria-checked={checked}
      tabIndex={0}
      onClick={toggle}
      onKeyDown={e => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); toggle() } }}
      className={`inline-flex items-center justify-center size-4 rounded flex-shrink-0 cursor-pointer
        border transition-all duration-100
        ${error    ? 'border-semantic-danger bg-navy-900 text-transparent'    :
          checked  ? 'border-teal-500 bg-teal-500 text-[#031712]'            :
                     'border-navy-700 bg-navy-900 text-transparent'}`}
    >
      {Icons.Check}
    </span>
  )
}

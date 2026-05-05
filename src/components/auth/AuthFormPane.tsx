import { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

export default function AuthFormPane({ children }: Props) {
  return (
    <div className="flex flex-col h-screen overflow-y-auto px-10 py-10 md:px-14">
      <div className="flex-1 flex flex-col justify-center w-full max-w-[420px] mx-auto gap-6 py-8">
        {children}
      </div>

      <div className="flex-shrink-0 pt-4 border-t border-navy-700 font-mono text-[10px] text-slate-600 tracking-[1px]">
        PERCIPIO · v0.4.2
      </div>
    </div>
  )
}

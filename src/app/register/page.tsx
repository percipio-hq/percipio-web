import { Metadata } from 'next'
import GuestGuard from '@/components/auth/GuestGuard'
import AuthFormPane from '@/components/auth/AuthFormPane'
import RegisterForm from '@/components/auth/RegisterForm'
import RadarPanel from '@/components/auth/RadarPanel'

export const metadata: Metadata = { title: 'Create account — Percipio' }

export default function RegisterPage() {
  return (
    <GuestGuard>
      <div className="h-screen w-full grid grid-cols-1 md:grid-cols-[1fr_1.05fr] bg-navy-950">
        <AuthFormPane>
          <RegisterForm />
        </AuthFormPane>
        <div className="hidden md:block">
          <RadarPanel />
        </div>
      </div>
    </GuestGuard>
  )
}

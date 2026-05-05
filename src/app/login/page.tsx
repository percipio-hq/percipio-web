import { Metadata } from 'next'
import AuthFormPane from '@/components/auth/AuthFormPane'
import LoginForm from '@/components/auth/LoginForm'
import RadarPanel from '@/components/auth/RadarPanel'

export const metadata: Metadata = { title: 'Sign in — Percipio' }

export default function LoginPage() {
  return (
    <div className="h-screen w-full grid grid-cols-1 md:grid-cols-[1fr_1.05fr] bg-navy-950">
      <AuthFormPane>
        <LoginForm />
      </AuthFormPane>
      <div className="hidden md:block">
        <RadarPanel />
      </div>
    </div>
  )
}

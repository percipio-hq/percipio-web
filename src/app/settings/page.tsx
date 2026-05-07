export const dynamic = 'force-dynamic'

import AuthGuard from '@/components/auth/AuthGuard'
import Settings from '@/components/Settings'

export default function SettingsPage() {
  return (
    <AuthGuard>
      <Settings />
    </AuthGuard>
  )
}

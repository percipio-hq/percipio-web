export const dynamic = 'force-dynamic'

import AuthGuard from '@/components/auth/AuthGuard'
import Environment from '@/components/Environment'

export default function EnvironmentPage() {
  return (
    <AuthGuard>
      <Environment />
    </AuthGuard>
  )
}

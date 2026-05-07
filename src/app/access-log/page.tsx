export const dynamic = 'force-dynamic'

import AuthGuard from '@/components/auth/AuthGuard'
import AccessLog from '@/components/AccessLog'

export default function AccessLogPage() {
  return (
    <AuthGuard>
      <AccessLog />
    </AuthGuard>
  )
}

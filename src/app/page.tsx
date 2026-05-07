export const dynamic = 'force-dynamic'

import AuthGuard from "@/components/auth/AuthGuard";
import Dashboard from "@/components/Dashboard";

export default function Home() {
  return (
    <AuthGuard>
      <Dashboard />
    </AuthGuard>
  );
}

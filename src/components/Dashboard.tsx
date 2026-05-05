"use client"

import StatusBar from "@/components/StatusBar";
import RadarView from "@/components/RadarView";
import EnvChart from "@/components/EnvChart";
import RfidLog from "@/components/RfidLog";
import { mockSensorReadings, mockRadarTargets, mockRfidEvents } from "@/lib/mockData";
import { useAuth } from "@/context/AuthContext";

export default function Dashboard() {
  const { user, signOut } = useAuth()
  const latest = mockRadarTargets[0];

  return (
    <main className="min-h-screen bg-gray-950 p-6 text-white">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-bold tracking-tight">Percipio</h1>
        <div className="flex items-center gap-4">
          <StatusBar peopleCount={latest.target_count} wifiOk={true} dbOk={true} />
          <div className="flex items-center gap-3 text-sm text-gray-400">
            <span>{user?.email}</span>
            <button
              onClick={signOut}
              className="text-gray-500 hover:text-white transition-colors cursor-pointer bg-transparent border-none"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <RadarView targets={latest.targets} />
        <EnvChart readings={mockSensorReadings} />
        <div className="lg:col-span-2">
          <RfidLog events={mockRfidEvents} />
        </div>
      </div>
    </main>
  );
}

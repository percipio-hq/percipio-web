"use client"

import StatusBar from "@/components/StatusBar";
import RadarView from "@/components/RadarView";
import EnvChart from "@/components/EnvChart";
import RfidLog from "@/components/RfidLog";
import { useAuth } from "@/context/AuthContext";
import { useSensorReadings } from "@/lib/hooks/useSensorReadings";
import { useRadarTargets } from "@/lib/hooks/useRadarTargets";
import { useRfidEvents } from "@/lib/hooks/useRfidEvents";

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const { readings, error: sensorError } = useSensorReadings();
  const { targets, targetCount, error: radarError } = useRadarTargets();
  const { events, error: rfidError } = useRfidEvents();

  const dbOk = !sensorError && !radarError && !rfidError;

  return (
    <main className="min-h-screen bg-gray-950 p-6 text-white">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-bold tracking-tight">Percipio</h1>
        <div className="flex items-center gap-4">
          <StatusBar peopleCount={targetCount} wifiOk={true} dbOk={dbOk} />
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
        <RadarView targets={targets} />
        <EnvChart readings={readings} />
        <div className="lg:col-span-2">
          <RfidLog events={events} />
        </div>
      </div>
    </main>
  );
}

import StatusBar from "@/components/StatusBar";
import RadarView from "@/components/RadarView";
import EnvChart from "@/components/EnvChart";
import RfidLog from "@/components/RfidLog";
import { mockSensorReadings, mockRadarTargets, mockRfidEvents } from "@/lib/mockData";

export default function Home() {
  const latest = mockRadarTargets[0];

  return (
    <main className="min-h-screen bg-gray-950 p-6 text-white">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-bold tracking-tight">Percipio</h1>
        <StatusBar peopleCount={latest.target_count} wifiOk={true} dbOk={true} />
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

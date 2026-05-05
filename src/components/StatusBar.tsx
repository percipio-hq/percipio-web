"use client";

interface Props {
  peopleCount: number;
  wifiOk: boolean;
  dbOk: boolean;
}

export default function StatusBar({ peopleCount, wifiOk, dbOk }: Props) {
  return (
    <div className="flex items-center gap-6 rounded-lg bg-gray-800 px-4 py-2 text-sm text-white">
      <span>People: <strong>{peopleCount}</strong></span>
      <span className={wifiOk ? "text-green-400" : "text-red-400"}>WiFi {wifiOk ? "OK" : "DOWN"}</span>
      <span className={dbOk ? "text-green-400" : "text-red-400"}>DB {dbOk ? "OK" : "DOWN"}</span>
    </div>
  );
}

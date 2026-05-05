"use client";

interface Event {
  created_at: Date;
  card_uid: string;
  card_name: string;
  authorized: boolean;
}

interface Props {
  events: Event[];
}

export default function RfidLog({ events }: Props) {
  return (
    <div className="rounded-lg bg-gray-900 p-4">
      <h2 className="mb-2 text-sm font-semibold text-gray-300">RFID Log</h2>
      <table className="w-full text-sm text-gray-300">
        <thead>
          <tr className="border-b border-gray-700 text-left text-xs text-gray-500">
            <th className="pb-1">Time</th>
            <th className="pb-1">Name</th>
            <th className="pb-1">UID</th>
            <th className="pb-1">Status</th>
          </tr>
        </thead>
        <tbody>
          {events.map((e, i) => (
            <tr key={i} className="border-b border-gray-800">
              <td className="py-1 text-xs">{e.created_at.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}</td>
              <td className="py-1">{e.card_name}</td>
              <td className="py-1 font-mono text-xs">{e.card_uid}</td>
              <td className={`py-1 font-semibold ${e.authorized ? "text-green-400" : "text-red-400"}`}>
                {e.authorized ? "OK" : "DENIED"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

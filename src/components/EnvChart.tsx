"use client";

import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface Reading {
  created_at: Date;
  temperature: number;
  humidity: number;
  pressure: number;
}

interface Props {
  readings: Reading[];
}

export default function EnvChart({ readings }: Props) {
  const data = readings.map((r) => ({
    time: r.created_at.toLocaleTimeString(),
    temp: r.temperature,
    humidity: r.humidity,
    pressure: r.pressure,
  }));

  return (
    <div className="rounded-lg bg-gray-900 p-4">
      <h2 className="mb-2 text-sm font-semibold text-gray-300">Environment</h2>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data}>
          <XAxis dataKey="time" tick={{ fill: "#9ca3af", fontSize: 11 }} />
          <YAxis yAxisId="left" tick={{ fill: "#9ca3af", fontSize: 11 }} />
          <YAxis yAxisId="right" orientation="right" tick={{ fill: "#9ca3af", fontSize: 11 }} />
          <Tooltip contentStyle={{ background: "#1f2937", border: "none", color: "#f3f4f6" }} />
          <Legend />
          <Line yAxisId="left" type="monotone" dataKey="temp" stroke="#f97316" dot={false} name="Temp °C" />
          <Line yAxisId="left" type="monotone" dataKey="humidity" stroke="#38bdf8" dot={false} name="Humidity %" />
          <Line yAxisId="right" type="monotone" dataKey="pressure" stroke="#a78bfa" dot={false} name="Pressure hPa" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

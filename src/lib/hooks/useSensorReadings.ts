import { useEffect, useState } from "react";
import { collection, query, orderBy, limitToLast, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface SensorReadingView {
  created_at: Date;
  temperature: number;
  humidity: number;
  pressure: number;
}

export function useSensorReadings(limit = 20) {
  const [readings, setReadings] = useState<SensorReadingView[]>([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    const q = query(
      collection(db, "sensor_readings"),
      orderBy("created_at", "asc"),
      limitToLast(limit),
    );
    return onSnapshot(
      q,
      (snap) => setReadings(snap.docs.map((d) => {
        const data = d.data();
        return {
          created_at: data.created_at.toDate(),
          temperature: data.temperature,
          humidity: data.humidity,
          pressure: data.pressure,
        };
      })),
      () => setError(true),
    );
  }, [limit]);

  return { readings, error };
}

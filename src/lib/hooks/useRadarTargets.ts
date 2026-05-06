import { useEffect, useState } from "react";
import { collection, query, orderBy, limit, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { RadarTarget } from "@/lib/types";

export function useRadarTargets() {
  const [targets, setTargets] = useState<RadarTarget[]>([]);
  const [targetCount, setTargetCount] = useState(0);
  const [error, setError] = useState(false);

  useEffect(() => {
    const q = query(
      collection(db, "radar_targets"),
      orderBy("created_at", "desc"),
      limit(1),
    );
    return onSnapshot(
      q,
      (snap) => {
        if (snap.empty) return;
        const data = snap.docs[0].data();
        const raw: { x: number; y: number; speed: number }[] = data.targets ?? [];
        setTargets(raw.map((t) => ({ x: t.x / 1000, y: t.y / 1000, speed: t.speed })));
        setTargetCount(data.target_count ?? 0);
      },
      () => setError(true),
    );
  }, []);

  return { targets, targetCount, error };
}

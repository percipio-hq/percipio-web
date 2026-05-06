import { useEffect, useState } from "react";
import { collection, query, orderBy, limit, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface RfidEventView {
  created_at: Date;
  card_uid: string;
  card_name: string;
  authorized: boolean;
}

export function useRfidEvents(count = 20) {
  const [events, setEvents] = useState<RfidEventView[]>([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    const q = query(
      collection(db, "rfid_events"),
      orderBy("created_at", "desc"),
      limit(count),
    );
    return onSnapshot(
      q,
      (snap) => setEvents(snap.docs.map((d) => {
        const data = d.data();
        return {
          created_at: data.created_at.toDate(),
          card_uid: data.card_uid,
          card_name: data.card_name,
          authorized: data.authorized,
        };
      })),
      () => setError(true),
    );
  }, [count]);

  return { events, error };
}

import { useEffect, useState } from "react"
import { collection, query, orderBy, limit, where, onSnapshot, Timestamp } from "firebase/firestore"
import { db } from "@/lib/firebase"
import type { RfidEventView } from "./useRfidEvents"

export type DateRange = 'today' | 'yesterday' | '7d' | 'all'

function getDateBounds(range: DateRange): { start?: Date; end?: Date } {
  const now = new Date()
  const sod = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate())
  const eod = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999)

  if (range === 'today')     return { start: sod(now) }
  if (range === 'yesterday') {
    const y = new Date(now)
    y.setDate(y.getDate() - 1)
    return { start: sod(y), end: eod(y) }
  }
  if (range === '7d') {
    const d = new Date(now)
    d.setDate(d.getDate() - 7)
    return { start: d }
  }
  return {}
}

export function useRfidLog(range: DateRange = 'today') {
  const [events, setEvents]   = useState<RfidEventView[]>([])
  const [error, setError]     = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    const { start, end } = getDateBounds(range)

    const q = query(
      collection(db, "rfid_events"),
      ...(start ? [where("created_at", ">=", Timestamp.fromDate(start))] : []),
      ...(end   ? [where("created_at", "<=", Timestamp.fromDate(end))]   : []),
      orderBy("created_at", "desc"),
      ...(range === 'all' ? [limit(500)] : []),
    )

    return onSnapshot(
      q,
      (snap) => {
        setEvents(snap.docs.map((d) => {
          const data = d.data()
          return {
            created_at: data.created_at.toDate(),
            card_uid:   data.card_uid,
            card_name:  data.card_name,
            authorized: data.authorized,
          }
        }))
        setLoading(false)
      },
      () => { setError(true); setLoading(false) },
    )
  }, [range])

  return { events, error, loading }
}

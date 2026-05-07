import { useEffect, useState } from "react"
import { collection, query, orderBy, limit, where, onSnapshot, Timestamp } from "firebase/firestore"
import { db } from "@/lib/firebase"
import type { SensorReadingView } from "./useSensorReadings"

export type EnvRange = 'today' | 'yesterday' | '7d' | 'all'

function getDateBounds(range: EnvRange): { start?: Date; end?: Date } {
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

export function useEnvironment(range: EnvRange = 'today') {
  const [readings, setReadings] = useState<SensorReadingView[]>([])
  const [error,    setError]    = useState(false)
  const [loading,  setLoading]  = useState(true)

  useEffect(() => {
    setLoading(true)
    const { start, end } = getDateBounds(range)

    const q = query(
      collection(db, "sensor_readings"),
      ...(start ? [where("created_at", ">=", Timestamp.fromDate(start))] : []),
      ...(end   ? [where("created_at", "<=", Timestamp.fromDate(end))]   : []),
      orderBy("created_at", "asc"),
      ...(range === 'all' ? [limit(2000)] : []),
    )

    return onSnapshot(
      q,
      (snap) => {
        setReadings(snap.docs.map((d) => {
          const data = d.data()
          return {
            created_at:  data.created_at.toDate(),
            temperature: data.temperature,
            humidity:    data.humidity,
            pressure:    data.pressure,
          }
        }))
        setLoading(false)
      },
      () => { setError(true); setLoading(false) },
    )
  }, [range])

  return { readings, error, loading }
}

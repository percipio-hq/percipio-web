import { useEffect, useRef } from 'react'
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export function useTelegramNotifier() {
  const notified  = useRef(new Set<string>())
  const startTime = useRef(Date.now())

  useEffect(() => {
    const q = query(
      collection(db, 'rfid_events'),
      orderBy('created_at', 'desc'),
      limit(1),
    )

    return onSnapshot(q, async (snap) => {
      if (snap.empty) return
      const doc  = snap.docs[0]
      const data = doc.data()
      const eventMs: number = data.created_at?.toDate?.()?.getTime?.() ?? 0

      if (eventMs < startTime.current || notified.current.has(doc.id)) return
      notified.current.add(doc.id)

      const time = new Date(eventMs).toLocaleTimeString('en-GB', {
        hour:   '2-digit',
        minute: '2-digit',
      })

      await fetch('/api/telegram/notify', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          card_name:  data.card_name,
          card_uid:   data.card_uid,
          authorized: data.authorized,
          time,
        }),
      }).catch(() => {})
    })
  }, [])
}

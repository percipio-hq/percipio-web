import { NextRequest, NextResponse } from 'next/server'
import { getAdminDb } from '@/lib/firebase-admin'

const ALLOWED = ['radar_targets', 'sensor_readings', 'rfid_events']

export async function POST(req: NextRequest) {
  const { collection } = await req.json()
  if (!ALLOWED.includes(collection)) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  }

  const db = getAdminDb()
  let total = 0

  let snap = await db.collection(collection).limit(400).get()
  while (!snap.empty) {
    const batch = db.batch()
    snap.docs.forEach((doc) => batch.delete(doc.ref))
    await batch.commit()
    total += snap.size
    snap = await db.collection(collection).limit(400).get()
  }

  return NextResponse.json({ deleted: total })
}

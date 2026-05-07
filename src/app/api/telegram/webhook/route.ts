import { NextRequest, NextResponse } from 'next/server'
import { getAdminDb } from '@/lib/firebase-admin'
import { sendMessage } from '@/lib/telegram'

async function latest(col: string) {
  const snap = await getAdminDb().collection(col).orderBy('created_at', 'desc').limit(1).get()
  return snap.empty ? null : snap.docs[0].data()
}

export async function POST(req: NextRequest) {
  const update = await req.json().catch(() => null)
  const text: string = update?.message?.text ?? ''
  const chatId: string = String(update?.message?.chat?.id ?? '')

  if (text.startsWith('/status')) {
    const [sensor, radar, rfid] = await Promise.all([
      latest('sensor_readings'),
      latest('radar_targets'),
      latest('rfid_events'),
    ])

    const temp   = sensor ? `${Number(sensor.temperature).toFixed(1)}°C` : 'N/A'
    const people = radar  ? `${radar.target_count} people`               : 'N/A'
    const last   = rfid   ? rfid.card_name                               : 'N/A'

    await sendMessage(`${temp}, ${people}, last card: ${last}`, chatId)
  }

  return NextResponse.json({ ok: true })
}

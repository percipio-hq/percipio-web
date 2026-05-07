import { NextRequest, NextResponse } from 'next/server'
import { sendMessage } from '@/lib/telegram'

export async function POST(req: NextRequest) {
  const { card_name, card_uid, authorized, time } = await req.json()

  const text = authorized
    ? `✅ <b>${card_name}</b> entered at ${time}`
    : `⚠️ Unknown card <code>${card_uid}</code> at ${time}`

  await sendMessage(text)
  return NextResponse.json({ ok: true })
}
